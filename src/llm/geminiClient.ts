import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { MatchResult, UserProfile } from '../eligibility/types.ts';
import { verifyOutputIntegrity } from './guardrails.ts';

const FAST_MODEL = process.env.GEMINI_MODEL_FAST || 'gemini-3.8-flash';
const BRAND_NAME = process.env.BRAND_NAME || 'beniFIT';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (aiInstance) return aiInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiInstance;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

export interface ParsedAnswer {
  extractedValue: string | number | boolean | null;
  confidence: number;
  clarificationNeeded: boolean;
  notes?: string;
}

/**
 * Parses free-text user response into structured field.
 */
export async function parseFreeTextAnswer(
  targetField: string,
  currentQuestion: string,
  userText: string
): Promise<ParsedAnswer> {
  const ai = getAI();
  const lower = userText.toLowerCase().trim();

  // Fast-path deterministic parsing for common shortcuts:
  if (targetField === 'forWhom') {
    if (lower === '1' || lower === 'myself' || lower === 'me' || lower === 'self') {
      return { extractedValue: 'self', confidence: 1.0, clarificationNeeded: false };
    }
    if (lower === '2' || lower.includes('mom') || lower.includes('dad') || lower.includes('parent') || lower.includes('help') || lower.includes('someone')) {
      return { extractedValue: 'other', confidence: 0.95, clarificationNeeded: false };
    }
  }

  if (targetField === 'ageBand') {
    if (lower === '4' || lower.includes('65') || lower.includes('senior') || lower.includes('retire')) {
      return { extractedValue: '65_plus', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower === '3' || lower.includes('50') || lower.includes('60')) {
      return { extractedValue: '50_64', confidence: 0.9, clarificationNeeded: false };
    }
    if (lower === '2' || lower.includes('18') || lower.includes('adult') || lower.includes('30') || lower.includes('40')) {
      return { extractedValue: '18_49', confidence: 0.9, clarificationNeeded: false };
    }
    if (lower === '1' || lower.includes('child') || lower.includes('kid') || lower.includes('under 18')) {
      return { extractedValue: 'under_18', confidence: 0.9, clarificationNeeded: false };
    }
    const ageNum = parseInt(lower.replace(/\D/g, ''), 10);
    if (!isNaN(ageNum) && ageNum > 0 && ageNum < 120) {
      const band = ageNum >= 65 ? '65_plus' : ageNum >= 50 ? '50_64' : ageNum >= 18 ? '18_49' : 'under_18';
      return { extractedValue: band, confidence: 0.95, clarificationNeeded: false, notes: `exactAge:${ageNum}` };
    }
  }

  if (targetField === 'zip') {
    const match = userText.match(/\b\d{5}\b/);
    if (match) {
      return { extractedValue: match[0], confidence: 1.0, clarificationNeeded: false };
    }
  }

  if (targetField === 'householdSize') {
    if (lower.includes('just me') || lower.includes('alone') || lower === '1') {
      return { extractedValue: 1, confidence: 1.0, clarificationNeeded: false };
    }
    if (lower.includes('couple') || lower.includes('husband') || lower.includes('wife') || lower === '2') {
      return { extractedValue: 2, confidence: 0.95, clarificationNeeded: false };
    }
    const num = parseInt(lower.match(/\d+/)?.[0] || '', 10);
    if (!isNaN(num) && num >= 1 && num <= 15) {
      return { extractedValue: num, confidence: 0.95, clarificationNeeded: false };
    }
  }

  if (targetField === 'incomeBand') {
    if (lower.startsWith('a') || lower.includes('under 1700') || lower.includes('1500') || lower.includes('1200')) {
      return { extractedValue: 'under_1700', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.startsWith('b') || lower.includes('2000') || lower.includes('2100') || lower.includes('2200')) {
      return { extractedValue: '1700_2500', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.startsWith('c') || lower.includes('3000') || lower.includes('3200')) {
      return { extractedValue: '2500_3400', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.startsWith('d') || lower.includes('4000')) {
      return { extractedValue: '3400_4500', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.startsWith('e') || lower.includes('over 4500') || lower.includes('5000')) {
      return { extractedValue: 'over_4500', confidence: 0.95, clarificationNeeded: false };
    }
  }

  if (targetField === 'coverage') {
    if (lower.includes('medicare') || lower.includes('red white') || lower.includes('part b') || lower.includes('advantage')) {
      return { extractedValue: 'medicare', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('medicaid') || lower.includes('benefit card')) {
      return { extractedValue: 'medicaid', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('job') || lower.includes('work') || lower.includes('employer') || lower.includes('union')) {
      return { extractedValue: 'employer', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('marketplace') || lower.includes('obamacare') || lower.includes('state of health')) {
      return { extractedValue: 'marketplace', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('none') || lower.includes('uninsured') || lower.includes('no insurance') || lower.includes('dont have')) {
      return { extractedValue: 'none', confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('not sure') || lower.includes('dunno') || lower.includes('idk')) {
      return { extractedValue: 'not_sure', confidence: 0.9, clarificationNeeded: false };
    }
  }

  if (targetField === 'disabilityOrLTC') {
    if (lower.includes('yes') || lower.includes('yeah') || lower.includes('disabled') || lower.includes('ssdi') || lower.includes('wheelchair')) {
      return { extractedValue: true, confidence: 0.95, clarificationNeeded: false };
    }
    if (lower.includes('no') || lower.includes('nope') || lower.includes('none') || lower.includes('skip')) {
      return { extractedValue: false, confidence: 0.95, clarificationNeeded: false };
    }
  }

  // If no direct regex match and Gemini is available, use structured Gemini call:
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: `Target Field: ${targetField}\nCurrent Question: ${currentQuestion}\nUser Response: "${userText}"\nParse this response into the requested structured JSON.`,
        config: {
          systemInstruction: `You are a strict data extractor for a benefits questionnaire. Convert the user's free text into a clean field value. Always output valid JSON.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedValue: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              clarificationNeeded: { type: Type.BOOLEAN },
              notes: { type: Type.STRING },
            },
            required: ['extractedValue', 'confidence', 'clarificationNeeded'],
          },
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return {
          extractedValue: parsed.extractedValue,
          confidence: parsed.confidence ?? 0.8,
          clarificationNeeded: parsed.clarificationNeeded ?? false,
          notes: parsed.notes,
        };
      }
    } catch (e) {
      console.warn('Gemini parsing fallback triggered:', e);
    }
  }

  // Fallback if unable to parse
  return {
    extractedValue: null,
    confidence: 0.2,
    clarificationNeeded: true,
    notes: 'Could not confidently parse answer',
  };
}

/**
 * Rewrites match results into warm, friendly SMS, protected by integrity post-check.
 */
export async function formatResultsSms(matches: MatchResult[], profile: UserProfile): Promise<string> {
  const topMatches = matches.slice(0, 3);
  const totalMonthly = topMatches.reduce((acc, m) => acc + (m.estMonthlyValue || 0), 0);

  // Fallback deterministic template
  const buildDeterministic = () => {
    let msg = `Pip from ${BRAND_NAME}: Based on your answers, you may qualify for up to $${totalMonthly.toLocaleString()}/mo in NY benefits:\n\n`;
    topMatches.forEach((m, idx) => {
      const valStr = m.estMonthlyValue > 0 ? ` (est. $${m.estMonthlyValue}/mo)` : '';
      msg += `${idx + 1}. ${m.programName}${valStr}\n`;
    });
    msg += `\nReply 1, 2, or 3 for simple steps to claim them, or ask me anything!`;
    return msg;
  };

  const deterministicText = buildDeterministic();

  const ai = getAI();
  if (!ai) {
    return deterministicText;
  }

  try {
    const allowedContext = JSON.stringify({
      topMatches: topMatches.map((m) => ({
        name: m.programName,
        value: m.estMonthlyValue,
        agency: m.agency,
      })),
      totalMonthly,
    });

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: `Matches Data: ${allowedContext}\nUser profile: Age band ${profile.ageBand}, ZIP ${profile.zip}, Coverage: ${profile.coverage}.`,
      config: {
        systemInstruction: `You are Pip, a friendly NY Bluebird mascot. Rewrite this list into an encouraging, concise SMS under 300 characters. You must preserve the dollar amounts and program names. Always say "you may qualify", never "you qualify". End with: Reply 1, 2, or 3 for steps, or ask me anything.`,
      },
    });

    const candidateText = response.text?.trim();
    if (candidateText) {
      // Run Post-check guardrail verification
      const check = verifyOutputIntegrity(candidateText, allowedContext);
      if (check.valid) {
        return candidateText;
      }
      console.warn('LLM output failed post-check integrity, falling back to deterministic template:', check.violations);
    }
  } catch (err) {
    console.warn('Gemini formatResults error, using deterministic template:', err);
  }

  return deterministicText;
}

/**
 * Answers user question strictly from retrieved program and facts context.
 * Refuses politely if not in verified context.
 */
export async function answerQuestionWithRAG(
  question: string,
  retrievedContext: string,
  userProfile?: UserProfile
): Promise<string> {
  const fallbackRefusal =
    `I want to make sure you get exact official guidance on that. I can only answer from verified New York benefit data.\n\nPlease call an official hotline:\n- 1-800-MEDICARE (1-800-633-4227)\n- NY State of Health: 1-855-355-5777\n- NY Medicaid Helpline: 1-800-541-2831`;

  const ai = getAI();
  if (!ai) {
    return fallbackRefusal;
  }

  try {
    const prompt = `VERIFIED PROGRAM CONTEXT:\n${retrievedContext}\n\nUSER QUESTION:\n${question}`;
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `You are Pip from Haven NY. Answer the user's question ONLY using the verified context provided. If the question asks for information not present in the verified context (e.g. medical advice, other states, stock advice, legal immigration advice), you MUST refuse and give the official phone numbers: 1-800-MEDICARE (1-800-633-4227) and NY State of Health (1-855-355-5777). Keep your reply plain, warm, and under 300 characters. Never guess.`,
      },
    });

    const answer = response.text?.trim();
    if (answer) {
      const check = verifyOutputIntegrity(answer, retrievedContext);
      if (check.valid) {
        return answer;
      }
      console.warn('RAG answer failed integrity check, falling back to safe refusal:', check.violations);
    }
  } catch (err) {
    console.warn('RAG answer error:', err);
  }

  return fallbackRefusal;
}
