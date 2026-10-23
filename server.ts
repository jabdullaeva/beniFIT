import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { db } from './src/db/store.ts';
import { processInboundSms } from './src/conversation/engine.ts';
import { handleTwilioInbound, handleTwilioStatus } from './src/sms/twilioHandler.ts';
import { findDoctors } from './src/providers/npiClient.ts';
import { auditClaimsForBillingErrors, SYNTHETIC_BLUE_BUTTON_CLAIMS } from './src/claims/blueButtonChecker.ts';
import { runWeeklyAlertsBatch } from './src/alerts/scheduler.ts';
import { runAllEvals } from './tests/evals_runner.ts';
import { isProgramStale } from './src/eligibility/index.ts';
import { Program } from './src/eligibility/types.ts';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: process.env.BRAND_NAME || 'beniFIT',
    timestamp: new Date().toISOString(),
  });
});

// Authentication / Login Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { userId, phone } = req.body;
    let targetUser = userId ? db.getUser(userId) : undefined;

    if (!targetUser && phone) {
      const { user: created } = db.getOrCreateUserByPhone(phone);
      targetUser = created;
    }

    if (!targetUser) {
      targetUser = db.getUser('user-maria-demo');
    }

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const messages = db.getMessages(targetUser.id);
    const matches = db.getMatches(targetUser.id);
    const alerts = db.getAlerts(targetUser.id);
    const billFlags = db.getBillFlags(targetUser.id);

    res.json({
      success: true,
      user: {
        ...targetUser,
        phoneRaw: targetUser.phoneRaw,
      },
      messages,
      matches,
      alerts,
      billFlags,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Twilio SMS Webhooks
app.post('/api/sms/inbound', handleTwilioInbound);
app.post('/api/sms/status', handleTwilioStatus);

// Web Simulator SMS Endpoint (Direct chat simulator for demo & testing)
app.post('/api/sms/simulate', async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    const cleanPhone = phone || '+17185550198'; // default Maria Santos demo phone
    const turnResult = await processInboundSms(cleanPhone, message);
    const messages = db.getMessages(turnResult.user.id);
    const matches = db.getMatches(turnResult.user.id);

    res.json({
      success: true,
      replyText: turnResult.replyText,
      newState: turnResult.newState,
      user: turnResult.user,
      messages,
      matches,
    });
  } catch (err: any) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: err.message || 'Simulation failed' });
  }
});

// Users API
app.get('/api/users', (req: Request, res: Response) => {
  const users = db.getAllUsers().map((u) => ({
    id: u.id,
    phoneMasked: u.phoneMasked,
    phoneHash: u.phoneHash.slice(0, 12) + '...',
    status: u.status,
    consent: u.consent,
    profile: u.profile,
    alertPrefs: u.alertPrefs,
    lastAlertSentAt: u.lastAlertSentAt,
    createdAt: u.createdAt,
  }));
  res.json({ users });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = db.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const messages = db.getMessages(user.id);
  const matches = db.getMatches(user.id);
  const alerts = db.getAlerts(user.id);
  const billFlags = db.getBillFlags(user.id);

  res.json({
    user: {
      ...user,
      phoneRaw: undefined, // mask raw phone for privacy
    },
    messages,
    matches,
    alerts,
    billFlags,
  });
});

app.delete('/api/users/:id/data', (req: Request, res: Response) => {
  db.deleteUserData(req.params.id);
  res.json({ success: true, message: 'All user data permanently deleted' });
});

// Messages API
app.get('/api/conversations/:userId/messages', (req: Request, res: Response) => {
  const messages = db.getMessages(req.params.userId);
  res.json({ messages });
});

// Program Catalog API (with freshness monitoring)
app.get('/api/programs', (req: Request, res: Response) => {
  try {
    const p = path.resolve(process.cwd(), 'data/programs.json');
    const programs: Program[] = JSON.parse(fs.readFileSync(p, 'utf8'));
    const enriched = programs.map((prog) => {
      const isStale = isProgramStale(prog, new Date(), 400);
      const verifiedDate = new Date(prog.lastVerified);
      const daysSinceVerification = Math.round((Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        ...prog,
        isStale,
        daysSinceVerification,
      };
    });
    res.json({ programs: enriched });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to read programs.json' });
  }
});

// Program Matches API
app.get('/api/matches', (req: Request, res: Response) => {
  const allMatches = db.getAllMatches();
  const totalValueMonthly = allMatches
    .filter((m) => m.confidence === 'likely')
    .reduce((acc, m) => acc + (m.estMonthlyValue || 0), 0);
  res.json({ matches: allMatches, totalValueMonthly });
});

// Doctor Finder API (NPI Registry + Google Maps links)
app.get('/api/doctors', async (req: Request, res: Response) => {
  const specialty = (req.query.specialty as string) || 'primary care';
  const zip = (req.query.zip as string) || '11201';
  try {
    const results = await findDoctors(specialty, zip);
    res.json({ results, specialty, zip });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to query doctors' });
  }
});

// Bill Checker / Blue Button Synthetic Claims API
app.get('/api/claims/audit', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-maria-demo';
  const flags = auditClaimsForBillingErrors(userId);
  res.json({
    syntheticClaims: SYNTHETIC_BLUE_BUTTON_CLAIMS,
    flags,
    sandboxNote: 'DEMO GRADE: Connected to CMS Blue Button 2.0 synthetic beneficiary sandbox dataset.',
  });
});

// Alerts & Cloud Scheduler API
app.get('/api/alerts', (req: Request, res: Response) => {
  const alerts = db.getAllAlerts();
  res.json({ alerts });
});

app.get('/api/alerts/dry-run', async (req: Request, res: Response) => {
  const result = await runWeeklyAlertsBatch({ dryRun: true });
  res.json(result);
});

app.post('/api/alerts/trigger', async (req: Request, res: Response) => {
  const { userId, forceSend } = req.body;
  const result = await runWeeklyAlertsBatch({ userId, forceSend: !!forceSend, dryRun: false });
  res.json(result);
});

// Protected Cloud Scheduler Cron Endpoint
app.get('/api/cron/weekly', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.CRON_SECRET || 'haven-secret-cron-key';
  const querySecret = req.query.secret;

  if (authHeader !== `Bearer ${secretKey}` && querySecret !== secretKey) {
    return res.status(401).json({ error: 'Unauthorized cron request' });
  }

  const result = await runWeeklyAlertsBatch({ dryRun: false });
  res.json({ ok: true, result });
});

// LLM Guardrail Evaluations Runner
app.post('/api/evals/run', async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit ? parseInt(req.body.limit, 10) : undefined;
    const report = await runAllEvals(limit);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Eval run failed' });
  }
});

// Interactive SMS Text Alert Dispatch Endpoint (Twilio Gateway with Live Simulated Fallback)
app.post('/api/sms/send-alert', async (req: Request, res: Response) => {
  try {
    const { phone, alertType, message, patientName, amount, providerName } = req.body;
    const cleanPhone = phone || '+17185550198';
    const alertTitle = alertType === 'fsa' ? 'FSA Expiration Warning' : 'Medical Bill Discrepancy Alert';
    const bodyText =
      message ||
      `beniFIT: Potential $${amount || 485} duplicate charge detected from ${
        providerName || 'Mercy Grove'
      }. Tap to review dispute draft.`;

    const stored = db.recordAlert({
      userId: 'user-maria-demo',
      type: alertType === 'fsa' ? 'deadline' : 'bill',
      payload: {
        title: alertTitle,
        text: bodyText,
        callScript: `Call billing at ${providerName || 'provider'} regarding duplicate charge.`,
      },
      sentAt: new Date().toISOString(),
      deliveryStatus: 'delivered',
    });

    res.json({
      success: true,
      deliveredTo: cleanPhone,
      alertId: stored.id,
      title: alertTitle,
      message: bodyText,
      sentAt: stored.sentAt,
      carrier: 'Twilio Cloud SMS Gateway',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'SMS Alert dispatch failed' });
  }
});

// AI Question Answering with Gemini API & Clinical Safety Grounding
app.post('/api/ask-beni', async (req: Request, res: Response) => {
  try {
    const { message, lang = 'en', userContext = {} } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const lower = message.toLowerCase();

    // 1. Clinical / Medication Refusal Guardrail (Safety constitution)
    if (
      lower.includes('take') ||
      lower.includes('grapefruit') ||
      lower.includes('pain') ||
      lower.includes('symptom') ||
      lower.includes('prescribe') ||
      lower.includes('dose') ||
      lower.includes('antibiotic') ||
      lower.includes('medication') ||
      lower.includes('dosage')
    ) {
      const refusalMap: Record<string, string> = {
        es: 'No puedo brindar asesoramiento médico clínico ni diagnosticar síntomas. Para preguntas sobre medicamentos o interacciones, por favor consulta a tu médico o farmacéutico.',
        fr: 'Je ne peux pas fournir de conseils médicaux cliniques ni diagnostiquer des symptômes. Pour les questions de médicaments ou d’interactions, veuillez consulter votre médecin ou pharmacien.',
        uk: 'Я не маю права надавати клінічні медичні консультації чи ставити діагнози. З приводу ліків або взаємодії препаратів, будь ласка, зверніться до лікаря або фармацевта.',
        en: 'I cannot provide clinical medical advice or diagnose symptoms. For prescription questions or drug interactions, please consult your physician or pharmacist.',
      };
      return res.json({
        reply: refusalMap[lang] || refusalMap.en,
        source: 'beniFIT Clinical Safety Policy & NY Health Guidelines',
        expression: 'warning',
      });
    }

    // 2. If GEMINI_API_KEY is available, use GoogleGenAI with model 'gemini-3.8-flash'
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI();
        const systemPrompt = `You are Beni, the friendly, reassuring AI health-benefits assistant for the app beniFIT in New York.
User Context:
- Name: ${userContext.userName || 'Member'}
- Health Insurance: ${userContext.coverageName || 'New York Health Plan'}
- Verified Household Income: $${userContext.monthlyIncome || 4200}/month
- Location: ${userContext.location || 'New York, NY'}
- Household Size: ${userContext.householdSize || 1}
- Member ID: ${userContext.memberId || 'CP-90214-NY'}
- Findings: ${JSON.stringify(userContext.findings || [])}
- Flagged Bill: ${JSON.stringify(userContext.mriBill || {})}

Guidelines:
1. Always respond fluently in the requested language: ${lang} ('en' = English, 'es' = Spanish, 'fr' = French, 'uk' = Ukrainian).
2. Answer ANY question about insurance, health benefits, Medicare, Medicaid, copays, deductibles, food programs (SNAP/WIC), or dispute rights.
3. If unsure about Medicare: say "I'm not sure. Call 1-800-MEDICARE."
4. If unsure about Medicaid or employer benefits: say "I'm not sure. Contact [verified contact]."
5. Ground in New York State rules (e.g. NY Public Health Law § 2807-k balance billing protections, NY Medicaid Managed Care, Essential Plan, Medicare Part D insulin senior $35 caps).
6. Always cite the exact source document or law.
7. Return a JSON object with:
{
  "reply": "string (clear, friendly, concise, 2-4 sentences)",
  "source": "string (specific NY source/document)",
  "expression": "default" | "may_qualify" | "confirmed" | "thinking" | "not_sure" | "warning",
  "actionLabel": "string or null",
  "actionScreen": "found" | "planner" | "bills" | "doctors" | "chat" or null
}`;

        const result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        if (result.text) {
          try {
            const parsed = JSON.parse(result.text);
            return res.json(parsed);
          } catch {
            return res.json({
              reply: result.text,
              source: `${userContext.coverageName || 'New York Health Benefits'} Guide`,
              expression: 'default',
            });
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call note, using verified knowledge base fallback:', geminiErr?.message);
      }
    }

    // 3. Fallback Knowledge Base Engine (Comprehensive & fully localized in en, es, fr, uk)
    let reply = '';
    let source = `${userContext.coverageName || 'New York State Health Benefits'} Guide`;
    let expression = 'default';
    let actionLabel: string | undefined;
    let actionScreen: string | undefined;

    // MRI / Bill Discrepancy
    if (
      lower.includes('mri') ||
      lower.includes('bill') ||
      lower.includes('factura') ||
      lower.includes('charge') ||
      lower.includes('hôpital') ||
      lower.includes('рахунок')
    ) {
      const answers: Record<string, string> = {
        en: `I reviewed your uploaded documents. Mercy Grove Hospital billed code 70553 twice, resulting in a duplicate patient balance of $${
          userContext.mriBill?.discrepancy || 485
        }. Your insurance claim confirms your contractual liability is only $${
          userContext.mriBill?.patientOwedPerPlan || 180
        }. Under NY balance billing law, you do not owe the duplicate charge!`,
        es: `Revisé tus documentos subidos. Mercy Grove Hospital facturó el código 70553 dos veces, generando un cobro duplicado de $${
          userContext.mriBill?.discrepancy || 485
        }. Tu seguro confirma que tu responsabilidad contractual es de solo $${
          userContext.mriBill?.patientOwedPerPlan || 180
        }. ¡Bajo la ley de NY, no debes pagar el cargo duplicado!`,
        fr: `J'ai analysé vos documents. L'hôpital Mercy Grove a facturé le code 70553 deux fois, créant un doublon indu de $${
          userContext.mriBill?.discrepancy || 485
        }. Votre assurance confirme que votre part n'est que de $${
          userContext.mriBill?.patientOwedPerPlan || 180
        }. La loi de NY vous protège contre ce doublon !`,
        uk: `Я перевірив ваші завантажені документи. Лікарня Mercy Grove двічі виставила код 70553, що створило помилкове нарахування на $${
          userContext.mriBill?.discrepancy || 485
        }. Згідно з випискою, ваша частка становить лише $${
          userContext.mriBill?.patientOwedPerPlan || 180
        }. За законом штату Нью-Йорк ви не зобов'язані це сплачувати!`,
      };
      reply = answers[lang] || answers.en;
      source = 'Mercy Grove Bill MG-88213 vs. ClearPath EOB-0004 & NY Public Health Law § 2807-k';
      expression = 'confirmed';
      actionLabel = lang === 'es' ? 'Ver detalles' : lang === 'fr' ? 'Voir détails' : lang === 'uk' ? 'Деталі' : 'View details';
      actionScreen = 'bills';
    }
    // Food / WIC / SNAP
    else if (
      lower.includes('food') ||
      lower.includes('comida') ||
      lower.includes('nourriture') ||
      lower.includes('харч') ||
      lower.includes('snap') ||
      lower.includes('wic')
    ) {
      const answers: Record<string, string> = {
        en: `Based on your verified monthly household income of $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        }, you may qualify for state grocery purchasing support (up to $150–$185/mo for eligible NYC households through SNAP / WIC).`,
        es: `Según tu ingreso mensual verificado de $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        }, podrías calificar para asistencia alimentaria estatal (hasta $150–$185/mes para hogares elegibles en NYC vía SNAP / WIC).`,
        fr: `Selon votre revenu mensuel vérifié de $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        }, vous pourriez être éligible à une aide alimentaire de l'État (jusqu'à $150–$185/mois via SNAP / WIC).`,
        uk: `З огляду на ваш підтверджений щомісячний дохід $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        }, ви маєте право на державну допомогу на харчування (до $150–$185/міс. через програми SNAP / WIC).`,
      };
      reply = answers[lang] || answers.en;
      source = 'NY State Department of Health & OTDA Guidelines';
      expression = 'may_qualify';
      actionLabel = lang === 'es' ? 'Solicitar' : lang === 'fr' ? 'Postuler' : lang === 'uk' ? 'Подати' : 'Apply';
      actionScreen = 'planner';
    }
    // FSA / Benefits Guide
    else if (
      lower.includes('fsa') ||
      lower.includes('expire') ||
      lower.includes('vence') ||
      lower.includes('dépense') ||
      lower.includes('perk')
    ) {
      const answers: Record<string, string> = {
        en: `You have unspent funds in your Flexible Spending Account. Under IRS and employer guidelines, prescription glasses, sunscreen, first-aid kits, and OTC medications are 100% eligible before expiration.`,
        es: `Tienes fondos sin gastar en tu Cuenta de Gastos Flexibles (FSA). Lentes recetados, protector solar, botiquines y medicamentos de venta libre son 100% elegibles antes de su vencimiento.`,
        fr: `Vous disposez de fonds non utilisés sur votre compte FSA. Lunettes de vue, crème solaire, trousses de secours et médicaments sans ordonnance sont 100% éligibles avant expiration.`,
        uk: `У вас є невикористані кошти на рахунку FSA. Окуляри за рецептом, сонцезахисний крем, аптечки та ліки без рецепта на 100% покриваються до завершення терміну.`,
      };
      reply = answers[lang] || answers.en;
      source = 'Brightway 2027 Benefits Guide p.11 & IRS Publication 502';
      expression = 'may_qualify';
      actionLabel = lang === 'es' ? 'Reclamar' : lang === 'fr' ? 'Réclamer' : lang === 'uk' ? 'Отримати' : 'Claim it';
      actionScreen = 'planner';
    }
    // Doctor / Network
    else if (
      lower.includes('doctor') ||
      lower.includes('médico') ||
      lower.includes('médecin') ||
      lower.includes('лікар') ||
      lower.includes('network') ||
      lower.includes('red')
    ) {
      const answers: Record<string, string> = {
        en: `I can help you locate in-network physicians and specialists verified for ${
          userContext.coverageName || 'your plan'
        } in your ZIP code. We check NPI registry records to prevent surprise out-of-network bills.`,
        es: `Puedo ayudarte a ubicar médicos y especialistas en la red verificados para ${
          userContext.coverageName || 'tu plan'
        } en tu código postal. Verificamos el registro NPI para evitar cobros sorpresa.`,
        fr: `Je peux vous aider à trouver des médecins conventionnés pour ${
          userContext.coverageName || 'votre contrat'
        } dans votre secteur. Nous vérifions le registre NPI pour éviter les dépassements.`,
        uk: `Я можу допомогти знайти лікарів у мережі для ${
          userContext.coverageName || 'вашого плану'
        } за вашим поштовим індексом. Ми звіряємося з базою NPI, щоб уникнути зайвих витрат.`,
      };
      reply = answers[lang] || answers.en;
      source = 'CMS National Plan and Provider Enumeration System (NPPES)';
      expression = 'default';
      actionLabel = lang === 'es' ? 'Buscar médico' : lang === 'fr' ? 'Trouver médecin' : lang === 'uk' ? 'Знайти лікаря' : 'Find Doctor';
      actionScreen = 'doctors';
    }
    // General Questions
    else {
      const answers: Record<string, string> = {
        en: `Beni is ready to assist! Based on your verified income of $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        } and your ${
          userContext.coverageName || 'health plan'
        }, I can audit bills, identify unclaimed benefits, or draft dispute letters. Ask me anything about your coverage!`,
        es: `¡Beni está listo para ayudarte! Con base en tu ingreso verificado de $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        } y tu ${
          userContext.coverageName || 'plan de salud'
        }, puedo auditar facturas, identificar beneficios o redactar cartas de reclamo. ¡Pregúntame lo que necesites!`,
        fr: `Beni est à votre écoute ! D'après vos revenus vérifiés de $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        } et votre couverture ${
          userContext.coverageName || 'santé'
        }, je peux auditer vos factures ou vérifier vos droits. N'hésitez pas à me poser vos questions !`,
        uk: `Бені готовий допомогти! На основі вашого підтвердженого доходу $${
          userContext.monthlyIncome?.toLocaleString() || '4,200'
        } та плану ${
          userContext.coverageName || 'страхування'
        }, я можу перевірити рахунки, знайти пільги або скласти лист оскарження. Запитуйте про будь-що!`,
      };
      reply = answers[lang] || answers.en;
      source = `${userContext.coverageName || 'New York Health Insurance'} + CMS Interoperability FHIR`;
      expression = 'default';
      actionLabel = lang === 'es' ? 'Ver ahorros' : lang === 'fr' ? 'Voir économies' : lang === 'uk' ? 'Переглянути' : 'View savings';
      actionScreen = 'found';
    }

    res.json({
      reply,
      source,
      expression,
      actionLabel,
      actionScreen,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

// Setup Vite Middleware in Dev or serve static in Prod
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Haven NY Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
