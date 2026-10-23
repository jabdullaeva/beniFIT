import fs from 'fs';
import path from 'path';
import { db, User, Conversation, hashPhone } from '../db/store.ts';
import { Program, UserProfile } from '../eligibility/types.ts';
import { matchPrograms } from '../eligibility/index.ts';
import { lookupNyZip } from '../eligibility/zipUtils.ts';
import { parseFreeTextAnswer, formatResultsSms, answerQuestionWithRAG } from '../llm/geminiClient.ts';
import { findDoctors } from '../providers/npiClient.ts';
import { auditClaimsForBillingErrors } from '../claims/blueButtonChecker.ts';

const BRAND_NAME = process.env.BRAND_NAME || 'beniFIT';

function loadPrograms(): Program[] {
  try {
    const p = path.resolve(process.cwd(), 'data/programs.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('Failed to load programs.json:', err);
    return [];
  }
}

function loadFacts() {
  try {
    const p = path.resolve(process.cwd(), 'data/facts.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    return [];
  }
}

export interface ConversationTurnResult {
  replyText: string;
  newState: string;
  user: User;
  matchesCount?: number;
}

export async function processInboundSms(phone: string, rawText: string): Promise<ConversationTurnResult> {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // Get or create user and conversation
  const { user } = db.getOrCreateUserByPhone(phone);
  const conv = db.getOrCreateConversation(user.id);

  // Record inbound message
  db.recordMessage(user.id, 'in', text);

  // 1. GLOBAL COMMAND: STOP
  if (lower === 'stop' || lower === 'unsubscribe' || lower === 'cancel') {
    db.updateUser(user.id, {
      status: 'stopped',
      optedOutAt: new Date().toISOString(),
    });
    db.updateConversation(user.id, { state: 'STOPPED' });
    const reply = `You have unsubscribed from ${BRAND_NAME}. No further texts will be sent. Reply START at any time to resume.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'STOPPED', user: db.getUser(user.id)! };
  }

  // 2. GLOBAL COMMAND: START
  if (lower === 'start' || lower === 'unstop') {
    db.updateUser(user.id, {
      status: 'active',
      optedOutAt: undefined,
      consent: {
        optedInAt: new Date().toISOString(),
        text,
        source: 'sms',
      },
    });
    db.updateConversation(user.id, { state: 'SCREENER_FOR_WHOM' });
    const reply = `Welcome back to ${BRAND_NAME}! Let's find your benefits. Who are we checking for today?\n1. Myself\n2. Someone I help (e.g. parent or relative)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_FOR_WHOM', user: db.getUser(user.id)! };
  }

  // If user is currently stopped and texted something other than START:
  if (user.status === 'stopped') {
    const reply = `You are currently unsubscribed from ${BRAND_NAME}. Reply START to resume benefit alerts.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'STOPPED', user };
  }

  // 3. GLOBAL COMMAND: HELP
  if (lower === 'help' || lower === 'info') {
    const reply = `${BRAND_NAME}: Free text guardian for NY public benefits & medical bill alerts. Informational only, not legal/medical advice. Standard msg rates apply. Max 1 msg/wk.\n\nCommands:\n- MENU: Main menu\n- RESTART: New benefits check\n- DOCTOR: Find nearby doctor\n- BILL: Check medical bills\n- HUMAN: Official agency phone numbers\n- STOP: Unsubscribe`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user };
  }

  // 4. GLOBAL COMMAND: HUMAN / OFFICIAL HOTLINES
  if (lower === 'human' || lower === 'agent' || lower === 'representative') {
    const reply = `Official New York & Federal Phone Hotlines:\n• Medicare Helpline: 1-800-633-4227 (24/7)\n• NY State of Health: 1-855-355-5777\n• NY Medicaid: 1-800-541-2831\n• NY SNAP Food Assistance: 1-800-342-3009\n• NY Office for the Aging: 1-844-697-6321`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user };
  }

  // 5. GLOBAL COMMAND: RESTART
  if (lower === 'restart' || lower === 'reset') {
    db.updateUser(user.id, {
      profile: {
        forWhom: 'self',
        ageBand: '',
        zip: '',
        householdSize: 1,
        incomeBand: '',
        coverage: '',
      },
    });
    db.updateConversation(user.id, {
      state: 'SCREENER_FOR_WHOM',
      context: { screenerStep: 1 },
    });
    const reply = `Restarting your benefits check!\n\nWho are we looking up benefits for today?\n1. Myself\n2. Someone I help (e.g. parent or relative)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_FOR_WHOM', user: db.getUser(user.id)! };
  }

  // 6. GLOBAL COMMAND: MENU
  if (lower === 'menu') {
    const reply = `${BRAND_NAME} Main Menu:\n1. Check Benefits (reply RESTART)\n2. Find Doctor (text DOCTOR)\n3. Check Medical Bill (text BILL)\n4. More/Less texts (text FASTER or SLOWER)\n5. Ask any NY healthcare question!`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user };
  }

  // 7. FREQUENCY COMMANDS
  if (lower === 'slower') {
    db.updateUser(user.id, { alertPrefs: { ...user.alertPrefs, frequency: 'monthly' } });
    const reply = `Got it! We'll send alerts once a month instead of weekly. You can text FASTER anytime.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user: db.getUser(user.id)! };
  }
  if (lower === 'faster') {
    db.updateUser(user.id, { alertPrefs: { ...user.alertPrefs, frequency: 'weekly' } });
    const reply = `Set! You'll receive our weekly benefit tips and deadline alerts every Tuesday.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user: db.getUser(user.id)! };
  }

  // 8. OUTCOME COMMANDS: APPLIED, DONE, NOT FOR ME
  if (lower === 'applied' || lower === 'done') {
    const matches = db.getMatches(user.id);
    const activeMatch = matches[0];
    if (activeMatch) {
      db.updateMatchStatus(user.id, activeMatch.programId, 'applied');
      db.recordOutcome(user.id, activeMatch.programId, 'applied');
    }
    const reply = `Congratulations on taking action! We've noted that you applied. We won't nudge you about this one anymore, but we'll keep watching for other programs and bills for you.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user: db.getUser(user.id)! };
  }
  if (lower === 'not for me' || lower === 'dismiss') {
    const matches = db.getMatches(user.id);
    const activeMatch = matches[0];
    if (activeMatch) {
      db.updateMatchStatus(user.id, activeMatch.programId, 'dismissed');
      db.recordOutcome(user.id, activeMatch.programId, 'not_for_me');
    }
    const reply = `Understood! We've dismissed that program. We'll focus on other opportunities for you.`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user: db.getUser(user.id)! };
  }

  // 9. DOCTOR FINDER COMMAND TRIGGER
  if (lower.startsWith('find a doctor') || lower.startsWith('doctor') || lower.startsWith('find doctor') || lower.includes('cardiologist') || lower.includes('eye doctor')) {
    let specialty = 'primary care';
    if (lower.includes('cardio') || lower.includes('heart')) specialty = 'cardiologist';
    else if (lower.includes('eye') || lower.includes('vision') || lower.includes('ophthalm')) specialty = 'ophthalmologist';
    else if (lower.includes('foot') || lower.includes('podiatr')) specialty = 'podiatrist';
    else if (lower.includes('dent')) specialty = 'dentist';

    const zipMatch = text.match(/\b\d{5}\b/);
    const searchZip = zipMatch ? zipMatch[0] : user.profile.zip || '11201';

    const doctors = await findDoctors(specialty, searchZip);
    let reply = `Found ${doctors.length} Medicare-participating providers for ${specialty} near ${searchZip}:\n\n`;
    doctors.forEach((doc, idx) => {
      reply += `${idx + 1}. ${doc.name}\n   ${doc.address}, ${doc.city}, ${doc.state}\n   Phone: ${doc.phone}\n   Map: ${doc.mapsUrl}\n\n`;
    });
    reply += `Important: ${doctors[0]?.acceptsPlanNotice || 'Check with the doctor before booking.'}\nMedicare Directory: https://www.medicare.gov/care-compare/`;

    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user };
  }

  // 10. BILL CHECKER COMMAND TRIGGER
  if (lower.startsWith('check bill') || lower === 'bill' || lower.includes('medical bill')) {
    const flags = auditClaimsForBillingErrors(user.id);
    let reply = '';
    if (flags.length > 0) {
      const topFlag = flags[0];
      reply = `Haven NY Bill Alert (Demo):\n\n${topFlag.explanation}\n\nPotential overcharge: $${topFlag.potentialOvercharge.toFixed(2)}.\n\nBefore paying, call ${topFlag.providerName} at ${topFlag.providerPhone}.\n\nScript to read:\n"${topFlag.callScript}"\n\n(This may be a normal charge. Please verify with billing).`;
    } else {
      reply = `Great news! No recent billing discrepancies detected across your Medicare Explanation of Benefits claims.`;
    }
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: conv.state, user };
  }

  // ==========================================
  // STATE MACHINE: SCREENER FLOW
  // ==========================================

  // State: WELCOME_AWAITING_CONSENT
  if (conv.state === 'WELCOME_AWAITING_CONSENT' || !user.consent) {
    if (lower === 'yes' || lower === 'y' || lower === 'ok' || lower === 'sure' || lower === 'agree') {
      db.updateUser(user.id, {
        consent: {
          optedInAt: new Date().toISOString(),
          text,
          source: 'sms',
        },
        status: 'active',
      });
      db.updateConversation(user.id, {
        state: 'SCREENER_FOR_WHOM',
        context: { screenerStep: 1 },
      });
      const reply = `Welcome to ${BRAND_NAME}! Let's find programs you may be missing.\n\nQuestion 1 of 7: Who are we looking up benefits for today?\n1. Myself\n2. Someone I help (e.g. parent or relative)`;
      db.recordMessage(user.id, 'out', reply);
      return { replyText: reply, newState: 'SCREENER_FOR_WHOM', user: db.getUser(user.id)! };
    } else {
      const reply = `Hi! I'm Pip from ${BRAND_NAME}, your free text guardian for NY benefits, healthcare savings, and doctor searches.\n\nInformational only, not legal/financial advice. Msg & data rates may apply.\n\nReply YES to start your free 2-minute benefits check, or STOP to quit.`;
      db.recordMessage(user.id, 'out', reply);
      return { replyText: reply, newState: 'WELCOME_AWAITING_CONSENT', user };
    }
  }

  // State: SCREENER_FOR_WHOM
  if (conv.state === 'SCREENER_FOR_WHOM') {
    const parsed = await parseFreeTextAnswer('forWhom', 'Who are we looking up benefits for?', text);
    const forWhom = parsed.extractedValue === 'other' ? 'other' : 'self';
    db.updateUser(user.id, { profile: { ...user.profile, forWhom } });
    db.updateConversation(user.id, { state: 'SCREENER_AGE', context: { screenerStep: 2 } });
    const reply = `Got it. Question 2 of 7: What age band are they in?\n1. Under 18\n2. 18 to 49\n3. 50 to 64\n4. 65 or older\n(Or reply with their exact age)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_AGE', user: db.getUser(user.id)! };
  }

  // State: SCREENER_AGE
  if (conv.state === 'SCREENER_AGE') {
    const parsed = await parseFreeTextAnswer('ageBand', 'What age group are they in?', text);
    const ageBand = (parsed.extractedValue as string) || '65_plus';
    let exactAge: number | undefined;
    if (parsed.notes?.includes('exactAge:')) {
      exactAge = parseInt(parsed.notes.split('exactAge:')[1], 10);
    }
    db.updateUser(user.id, { profile: { ...user.profile, ageBand, exactAge } });
    db.updateConversation(user.id, { state: 'SCREENER_ZIP', context: { screenerStep: 3 } });
    const reply = `Question 3 of 7: What is your 5-digit New York ZIP code? (This checks county-specific programs and doctor networks).`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_ZIP', user: db.getUser(user.id)! };
  }

  // State: SCREENER_ZIP
  if (conv.state === 'SCREENER_ZIP') {
    const zipMatch = text.match(/\b\d{5}\b/);
    const cleanZip = zipMatch ? zipMatch[0] : text.replace(/\D/g, '').slice(0, 5);
    const zipInfo = lookupNyZip(cleanZip);

    if (!zipInfo.isValidNy && cleanZip.length !== 5) {
      const reply = `Please enter a valid 5-digit New York ZIP code (e.g., 11201 or 10001).`;
      db.recordMessage(user.id, 'out', reply);
      return { replyText: reply, newState: 'SCREENER_ZIP', user };
    }

    db.updateUser(user.id, {
      profile: {
        ...user.profile,
        zip: cleanZip,
        county: zipInfo.county,
      },
    });
    db.updateConversation(user.id, { state: 'SCREENER_HOUSEHOLD_SIZE', context: { screenerStep: 4 } });
    const reply = `Noted: ${zipInfo.city} (${zipInfo.county}).\n\nQuestion 4 of 7: How many people live in the household, including yourself? (e.g. 1, 2, 3...)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_HOUSEHOLD_SIZE', user: db.getUser(user.id)! };
  }

  // State: SCREENER_HOUSEHOLD_SIZE
  if (conv.state === 'SCREENER_HOUSEHOLD_SIZE') {
    const parsed = await parseFreeTextAnswer('householdSize', 'How many people in household?', text);
    const hhSize = typeof parsed.extractedValue === 'number' ? parsed.extractedValue : 1;
    db.updateUser(user.id, { profile: { ...user.profile, householdSize: hhSize } });
    db.updateConversation(user.id, { state: 'SCREENER_INCOME', context: { screenerStep: 5 } });
    const reply = `Question 5 of 7: Roughly what is your total monthly household income before taxes?\nA) Under $1,700/mo\nB) $1,700 - $2,500/mo\nC) $2,500 - $3,400/mo\nD) $3,400 - $4,500/mo\nE) Over $4,500/mo\n(Or reply with your estimated monthly income)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_INCOME', user: db.getUser(user.id)! };
  }

  // State: SCREENER_INCOME
  if (conv.state === 'SCREENER_INCOME') {
    const parsed = await parseFreeTextAnswer('incomeBand', 'What is your monthly household income?', text);
    const incomeBand = (parsed.extractedValue as string) || '1700_2500';
    db.updateUser(user.id, { profile: { ...user.profile, incomeBand } });
    db.updateConversation(user.id, { state: 'SCREENER_COVERAGE', context: { screenerStep: 6 } });
    const reply = `Question 6 of 7: What health insurance do you currently have?\n- Medicare (red, white & blue card)\n- Medicaid\n- Employer / Union\n- NY State of Health\n- None / Uninsured\n- Not sure`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_COVERAGE', user: db.getUser(user.id)! };
  }

  // State: SCREENER_COVERAGE
  if (conv.state === 'SCREENER_COVERAGE') {
    const parsed = await parseFreeTextAnswer('coverage', 'What health insurance do you have?', text);
    const coverage = (parsed.extractedValue as string) || 'medicare';
    db.updateUser(user.id, { profile: { ...user.profile, coverage } });
    db.updateConversation(user.id, { state: 'SCREENER_DISABILITY_LTC', context: { screenerStep: 7 } });
    const reply = `Last question (7 of 7): Does anyone in the household have a recognized disability, blindness, or need long-term care help? (Reply YES, NO, or SKIP)`;
    db.recordMessage(user.id, 'out', reply);
    return { replyText: reply, newState: 'SCREENER_DISABILITY_LTC', user: db.getUser(user.id)! };
  }

  // State: SCREENER_DISABILITY_LTC -> Compute Matches & Deliver Results
  if (conv.state === 'SCREENER_DISABILITY_LTC') {
    const parsed = await parseFreeTextAnswer('disabilityOrLTC', 'Disability or long term care?', text);
    const disability = parsed.extractedValue === true;
    const updatedUser = db.updateUser(user.id, {
      profile: { ...user.profile, disabilityOrLTC: disability },
      status: 'active',
    });

    // Run deterministic match
    const programs = loadPrograms();
    const evaluation = matchPrograms(updatedUser.profile, programs);

    // Save matches in DB
    db.setMatches(user.id, evaluation.matches);

    // Format friendly SMS results using Gemini Flash with post-check guardrails
    const resultsSms = await formatResultsSms(evaluation.matches, updatedUser.profile);

    db.updateConversation(user.id, {
      state: 'RESULTS_DELIVERED',
      context: {
        lastMatches: evaluation.matches,
      },
    });

    db.recordMessage(user.id, 'out', resultsSms);
    return {
      replyText: resultsSms,
      newState: 'RESULTS_DELIVERED',
      user: updatedUser,
      matchesCount: evaluation.matches.length,
    };
  }

  // State: RESULTS_DELIVERED & TWO-WAY ASSISTANT
  if (conv.state === 'RESULTS_DELIVERED') {
    const matches = db.getMatches(user.id);
    const programs = loadPrograms();

    // Check if user selected 1, 2, or 3 for application details
    if (text === '1' || text === '2' || text === '3') {
      const idx = parseInt(text, 10) - 1;
      const targetMatch = matches[idx];
      if (targetMatch) {
        const fullProg = programs.find((p) => p.id === targetMatch.programId);
        if (fullProg) {
          let reply = `How to get ${fullProg.name}:\n`;
          fullProg.howToApply.steps.forEach((step, sIdx) => {
            reply += `${sIdx + 1}. ${step}\n`;
          });
          reply += `\nPhone: ${fullProg.howToApply.phone}\nLink: ${fullProg.howToApply.url}\n(Last verified: ${fullProg.lastVerified})\n\nDid you apply? Reply APPLIED or LATER.`;
          db.recordMessage(user.id, 'out', reply);
          return { replyText: reply, newState: 'RESULTS_DELIVERED', user };
        }
      }
    }

    // Two-Way Q&A Assistant: Retrieve relevant program/fact context and answer with strict guardrails
    const facts = loadFacts();
    const programContext = programs
      .map(
        (p) =>
          `Program: ${p.name}\nAgency: ${p.agency}\nSummary: ${p.summary_plain}\nIncome Limit: ${JSON.stringify(p.eligibility.incomeRule.byHouseholdSize)}\nBenefit: ${p.benefit.description}\nPhone: ${p.howToApply.phone}\nURL: ${p.howToApply.url}\nLast Verified: ${p.lastVerified}`
      )
      .join('\n\n');

    const factContext = facts.map((f: any) => `Fact: ${f.fact} (Source: ${f.source})`).join('\n');
    const fullContext = `${programContext}\n\n${factContext}`;

    const answer = await answerQuestionWithRAG(text, fullContext, user.profile);
    db.recordMessage(user.id, 'out', answer);
    return { replyText: answer, newState: 'RESULTS_DELIVERED', user };
  }

  // Default fallback
  const reply = `I'm here to help you find New York benefits and check medical bills. Text MENU to see your options, or ask me any benefit question!`;
  db.recordMessage(user.id, 'out', reply);
  return { replyText: reply, newState: conv.state, user };
}
