import fs from 'fs';
import path from 'path';
import { db, User, StoredAlert } from '../db/store.ts';

export interface FactItem {
  id: string;
  topic: string;
  fact: string;
  source: string;
  sourceUrl: string;
  programId: string;
}

function loadFacts(): FactItem[] {
  try {
    const p = path.resolve(process.cwd(), 'data/facts.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('Failed to load facts.json:', err);
    return [];
  }
}

export function isWithinQuietHours(now = new Date()): boolean {
  // New York time (EST / EDT, UTC-4 or UTC-5)
  // Get local hour in America/New_York
  const nyHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(now),
    10
  );

  // Quiet hours: Before 9:00 AM (0 - 8) or after 8:00 PM (20 - 23)
  return nyHour < 9 || nyHour >= 20;
}

export interface AlertDispatchResult {
  userId: string;
  phoneMasked: string;
  alertType: 'weekly' | 'deadline' | 'bill';
  messageText: string;
  skippedReason?: string;
  dispatched: boolean;
}

export async function runWeeklyAlertsBatch(options: { dryRun?: boolean; forceSend?: boolean; userId?: string } = {}): Promise<{
  summary: { totalEligible: number; sent: number; skipped: number; quietHoursActive: boolean };
  dispatches: AlertDispatchResult[];
}> {
  const now = new Date();
  const quietHours = isWithinQuietHours(now);
  const facts = loadFacts();
  const dispatches: AlertDispatchResult[] = [];

  const users = options.userId
    ? [db.getUser(options.userId)].filter(Boolean) as User[]
    : db.getAllUsers().filter((u) => u.status === 'active' && u.consent !== null);

  let sentCount = 0;
  let skippedCount = 0;

  for (const user of users) {
    // 1. Check quiet hours (unless forced for testing)
    if (quietHours && !options.forceSend) {
      skippedCount++;
      dispatches.push({
        userId: user.id,
        phoneMasked: user.phoneMasked,
        alertType: 'weekly',
        messageText: '',
        skippedReason: 'Quiet hours active (send between 9am-8pm NY time)',
        dispatched: false,
      });
      continue;
    }

    // 2. Check frequency throttle (max 1 weekly message unless 7 days have passed)
    if (user.lastAlertSentAt && !options.forceSend) {
      const lastSent = new Date(user.lastAlertSentAt).getTime();
      const diffDays = (now.getTime() - lastSent) / (1000 * 60 * 60 * 24);
      if (diffDays < 6) {
        skippedCount++;
        dispatches.push({
          userId: user.id,
          phoneMasked: user.phoneMasked,
          alertType: 'weekly',
          messageText: '',
          skippedReason: `Already received alert ${Math.round(diffDays)} days ago (max 1/wk limit)`,
          dispatched: false,
        });
        continue;
      }
    }

    // 3. Find pending unclaimed matches
    const matches = db.getMatches(user.id);
    const unactedMatch = matches.find((m) => m.status === 'new' && m.confidence === 'likely');

    let alertText = '';
    let factId = '';
    let programId = '';

    if (unactedMatch) {
      programId = unactedMatch.programId;
      const valStr = unactedMatch.estMonthlyValue ? `$${unactedMatch.estMonthlyValue}/mo` : 'monthly savings';
      alertText = `Pip from Haven NY: Quick check-in on money you may be missing! You had a strong match for ${unactedMatch.programId.toUpperCase()} (worth est. ${valStr}). Reply 1 if you want the application link, or APPLIED if done!`;
    } else {
      // Pick rotating fact
      const randomFact = facts[Math.floor(Math.random() * facts.length)] || facts[0];
      factId = randomFact?.id || '';
      alertText = `Pip from Haven NY with your weekly benefit tip!\n\n${randomFact?.fact}\n\n(Source: ${randomFact?.source})`;
    }

    if (!options.dryRun) {
      db.recordAlert({
        userId: user.id,
        type: 'weekly',
        payload: {
          title: 'Weekly Benefit Guardian Alert',
          text: alertText,
          programId,
          factId,
        },
        sentAt: now.toISOString(),
        deliveryStatus: 'delivered',
      });
      db.updateUser(user.id, { lastAlertSentAt: now.toISOString() });
    }

    sentCount++;
    dispatches.push({
      userId: user.id,
      phoneMasked: user.phoneMasked,
      alertType: 'weekly',
      messageText: alertText,
      dispatched: !options.dryRun,
    });
  }

  return {
    summary: {
      totalEligible: users.length,
      sent: sentCount,
      skipped: skippedCount,
      quietHoursActive: quietHours,
    },
    dispatches,
  };
}
