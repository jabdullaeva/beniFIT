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
