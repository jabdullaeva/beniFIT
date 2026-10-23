import crypto from 'crypto';
import { UserProfile, MatchResult } from '../eligibility/types.ts';

export interface ConsentRecord {
  optedInAt: string;
  text: string;
  source: 'sms' | 'web';
}

export interface AlertPreferences {
  dayOfWeek: number; // 0=Sunday, 2=Tuesday, etc.
  hourLocal: number; // 10 = 10:00 AM
  frequency: 'weekly' | 'monthly' | 'slower';
}

export interface User {
  id: string;
  phoneRaw: string;
  phoneMasked: string;
  phoneHash: string; // Salted SHA-256
  phoneEnc: string;  // Simulated encrypted at rest
  consent: ConsentRecord | null;
  optedOutAt?: string;
  language: 'en' | 'es';
  profile: UserProfile;
  alertPrefs: AlertPreferences;
  status: 'onboarding' | 'active' | 'paused' | 'stopped';
  lastAlertSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  state: string; // state machine step
  lastMessageAt: string;
  context: {
    screenerStep?: number;
    pendingConfirmation?: any;
    lastMatches?: MatchResult[];
    selectedProgramId?: string;
    lastDoctorSearch?: { specialty: string; zip: string };
    lastBillFlagId?: string;
    caregiverName?: string;
  };
}

export interface StoredMessage {
  id: string;
  userId: string;
  direction: 'in' | 'out';
  bodyRedacted: string;
  rawBody: string;
  ts: string;
  twilioSid?: string;
}

export interface StoredMatch {
  id: string;
  userId: string;
  programId: string;
  confidence: 'likely' | 'possible';
  estMonthlyValue: number;
  status: 'new' | 'sent' | 'applied' | 'dismissed';
  sentAt?: string;
}

export interface StoredAlert {
  id: string;
  userId: string;
  type: 'weekly' | 'deadline' | 'bill';
  payload: {
    title: string;
    text: string;
    programId?: string;
    factId?: string;
    callScript?: string;
  };
  sentAt: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'simulated';
}

export interface BillFlag {
  id: string;
  userId: string;
  claimId: string;
  ruleId: string;
  title: string;
  explanation: string;
  billedAmount: number;
  medicareApprovedAmount: number;
  eobPatientOwedAmount: number;
  potentialOvercharge: number;
  callScript: string;
  providerName: string;
  providerPhone: string;
  serviceDate: string;
  sentAt: string;
}

export interface Outcome {
  id: string;
  userId: string;
  programId: string;
  event: 'applied' | 'approved' | 'not_for_me';
  ts: string;
}

const SALT = process.env.SALT || 'haven-ny-secure-salt-2026';

export function hashPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  return crypto.createHmac('sha256', SALT).update(digitsOnly).digest('hex');
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    const last4 = digits.slice(-4);
    return `(***) ***-${last4}`;
  }
  return '(***) ***-****';
}

export function redactSensitive(text: string): string {
  // Redact potential SSN, phone numbers, email, or exact DOB
  return text
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED-PHONE]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED-EMAIL]');
}

// In-Memory Data Store (simulating persistent Firestore with full indices)
class DataStore {
  private users: Map<string, User> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: StoredMessage[] = [];
  private matches: StoredMatch[] = [];
  private alerts: StoredAlert[] = [];
  private billFlags: BillFlag[] = [];
  private outcomes: Outcome[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed initial demo user "Maria Santos" (71 y/o senior in Brooklyn)
    const mariaId = 'user-maria-demo';
    const mariaPhone = '+17185550198';
    const mariaHash = hashPhone(mariaPhone);

    const user: User = {
      id: mariaId,
      phoneRaw: mariaPhone,
      phoneMasked: maskPhone(mariaPhone),
      phoneHash: mariaHash,
      phoneEnc: Buffer.from(mariaPhone).toString('base64'),
      consent: {
        optedInAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        text: 'YES',
        source: 'sms',
      },
      language: 'en',
      profile: {
        forWhom: 'self',
        ageBand: '65_plus',
        exactAge: 71,
        zip: '11201',
        county: 'Kings (Brooklyn)',
        householdSize: 1,
        incomeBand: '1700_2500',
        exactMonthlyIncome: 1950,
        coverage: 'medicare',
        disabilityOrLTC: false,
      },
      alertPrefs: {
        dayOfWeek: 2, // Tuesday
        hourLocal: 10,
        frequency: 'weekly',
      },
      status: 'active',
      lastAlertSentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(mariaId, user);

    this.conversations.set(mariaId, {
      id: 'conv-maria-demo',
      userId: mariaId,
      state: 'RESULTS_DELIVERED',
      lastMessageAt: new Date().toISOString(),
      context: {
        screenerStep: 7,
      },
    });

    // Seed matches for Maria
    this.matches.push(
      {
        id: 'match-1',
        userId: mariaId,
        programId: 'ny-msp',
        confidence: 'likely',
        estMonthlyValue: 185,
        status: 'new',
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'match-2',
        userId: mariaId,
        programId: 'ny-extra-help',
        confidence: 'likely',
        estMonthlyValue: 440,
        status: 'new',
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'match-3',
        userId: mariaId,
        programId: 'ny-snap',
        confidence: 'likely',
        estMonthlyValue: 210,
        status: 'new',
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    );

    // Seed a sample past alert
    this.alerts.push({
      id: 'alert-1',
      userId: mariaId,
      type: 'weekly',
      payload: {
        title: 'Tuesday Benefit Tip',
        text: 'Did you know New York completely eliminated the asset test for Medicare Savings Programs? Your savings don\'t block you from getting $185/mo back.',
        factId: 'fact-ny-msp-asset-test',
      },
      sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      deliveryStatus: 'delivered',
    });

    // Seed initial conversational messages for Maria
    this.messages.push(
      {
        id: 'msg-maria-1',
        userId: mariaId,
        direction: 'out',
        bodyRedacted: "Hey Maria! I've checked your Medicare coverage and New York State benefits. You have about $835/mo in unclaimed savings and perks this year. What are you planning next?",
        rawBody: "Hey Maria! I've checked your Medicare coverage and New York State benefits. You have about $835/mo in unclaimed savings and perks this year. What are you planning next?",
        ts: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'msg-maria-2',
        userId: mariaId,
        direction: 'in',
        bodyRedacted: 'hi, can you help me check if I can get help paying my Medicare bill?',
        rawBody: 'hi, can you help me check if I can get help paying my Medicare bill?',
        ts: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg-maria-3',
        userId: mariaId,
        direction: 'out',
        bodyRedacted: "Good news Maria! In New York, the Medicare Savings Program pays your full $185.00/mo Part B premium directly on your Social Security check, with no asset test. Plus, you may qualify for $440/mo in prescription Extra Help and $210/mo in SNAP groceries!\n\nWould you like the 1-page form steps, or should we find in-network doctors near Brooklyn 11201?",
        rawBody: "Good news Maria! In New York, the Medicare Savings Program pays your full $185.00/mo Part B premium directly on your Social Security check, with no asset test. Plus, you may qualify for $440/mo in prescription Extra Help and $210/mo in SNAP groceries!\n\nWould you like the 1-page form steps, or should we find in-network doctors near Brooklyn 11201?",
        ts: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    );

    // Seed second demo user "Marcus Rivera" (34 y/o in Bronx, NY)
    const marcusId = 'user-marcus-demo';
    const marcusPhone = '+17185550244';
    const marcusHash = hashPhone(marcusPhone);
    const marcusUser: User = {
      id: marcusId,
      phoneRaw: marcusPhone,
      phoneMasked: maskPhone(marcusPhone),
      phoneHash: marcusHash,
      phoneEnc: Buffer.from(marcusPhone).toString('base64'),
      consent: {
        optedInAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        text: 'YES',
        source: 'web',
      },
      language: 'en',
      profile: {
        forWhom: 'self',
        ageBand: '18_49',
        exactAge: 34,
        zip: '10451',
        county: 'Bronx',
        householdSize: 1,
        incomeBand: '1700_2500',
        exactMonthlyIncome: 2100,
        coverage: 'none',
        disabilityOrLTC: false,
      },
      alertPrefs: {
        dayOfWeek: 2,
        hourLocal: 10,
        frequency: 'weekly',
      },
      status: 'active',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(marcusId, marcusUser);
    this.conversations.set(marcusId, {
      id: 'conv-marcus-demo',
      userId: marcusId,
      state: 'RESULTS_DELIVERED',
      lastMessageAt: new Date().toISOString(),
      context: { screenerStep: 7 },
    });
    this.matches.push(
      {
        id: 'match-marcus-1',
        userId: marcusId,
        programId: 'ny-essential-plan',
        confidence: 'likely',
        estMonthlyValue: 450,
        status: 'new',
        sentAt: new Date().toISOString(),
      },
      {
        id: 'match-marcus-2',
        userId: marcusId,
        programId: 'ny-snap',
        confidence: 'likely',
        estMonthlyValue: 210,
        status: 'new',
        sentAt: new Date().toISOString(),
      }
    );
    this.messages.push({
      id: 'msg-marcus-1',
      userId: marcusId,
      direction: 'out',
      bodyRedacted: "Hey Marcus! I've checked NY health options for your income in the Bronx. You qualify for the NY Essential Plan with $0 monthly premium and comprehensive medical, dental, and vision!",
      rawBody: "Hey Marcus! I've checked NY health options for your income in the Bronx. You qualify for the NY Essential Plan with $0 monthly premium and comprehensive medical, dental, and vision!",
      ts: new Date().toISOString(),
    });

    this.billFlags.push({
      id: 'flag-demo-1',
      userId: mariaId,
      claimId: 'EOB-CLM-88391',
      ruleId: 'RULE_PREVENTIVE_ZERO_COST',
      title: 'Preventive Annual Wellness Visit Overcharge',
      explanation: 'Provider billed $250.00 for annual wellness checkup. Medicare Part B covers preventive annual exams with $0.00 patient responsibility.',
      billedAmount: 250,
      medicareApprovedAmount: 180,
      eobPatientOwedAmount: 0,
      potentialOvercharge: 250,
      callScript: 'Hi, I received a bill for $250.00 for my Annual Wellness Visit on 10/12. Under Medicare rules, annual wellness visits have $0 patient responsibility. My Medicare Explanation of Benefits shows $0 owed. Could you please correct the balance?',
      providerName: 'Brooklyn Heights Medical Center',
      providerPhone: '(718) 555-8390',
      serviceDate: '2026-10-12',
      sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    });
  }

  // User Operations
  getOrCreateUserByPhone(phone: string): { user: User; isNew: boolean } {
    const hash = hashPhone(phone);
    for (const u of this.users.values()) {
      if (u.phoneHash === hash) {
        return { user: u, isNew: false };
      }
    }

    const id = `user-${crypto.randomUUID()}`;
    const newUser: User = {
      id,
      phoneRaw: phone,
      phoneMasked: maskPhone(phone),
      phoneHash: hash,
      phoneEnc: Buffer.from(phone).toString('base64'),
      consent: null,
      language: 'en',
      profile: {
        forWhom: 'self',
        ageBand: '',
        zip: '',
        householdSize: 1,
        incomeBand: '',
        coverage: '',
      },
      alertPrefs: {
        dayOfWeek: 2,
        hourLocal: 10,
        frequency: 'weekly',
      },
      status: 'onboarding',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, newUser);
    return { user: newUser, isNew: true };
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): User {
    const existing = this.users.get(id);
    if (!existing) throw new Error(`User not found: ${id}`);
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  deleteUserData(userId: string) {
    this.users.delete(userId);
    this.conversations.delete(userId);
    this.messages = this.messages.filter((m) => m.userId !== userId);
    this.matches = this.matches.filter((m) => m.userId !== userId);
    this.alerts = this.alerts.filter((a) => a.userId !== userId);
    this.billFlags = this.billFlags.filter((b) => b.userId !== userId);
    this.outcomes = this.outcomes.filter((o) => o.userId !== userId);
  }

  // Conversation Operations
  getOrCreateConversation(userId: string): Conversation {
    const conv = this.conversations.get(userId);
    if (conv) return conv;

    const newConv: Conversation = {
      id: `conv-${crypto.randomUUID()}`,
      userId,
      state: 'WELCOME_AWAITING_CONSENT',
      lastMessageAt: new Date().toISOString(),
      context: {},
    };
    this.conversations.set(userId, newConv);
    return newConv;
  }

  updateConversation(userId: string, updates: Partial<Conversation>): Conversation {
    const conv = this.getOrCreateConversation(userId);
    const updated = {
      ...conv,
      ...updates,
      lastMessageAt: new Date().toISOString(),
    };
    this.conversations.set(userId, updated);
    return updated;
  }

  // Messages
  recordMessage(userId: string, direction: 'in' | 'out', body: string, twilioSid?: string): StoredMessage {
    const msg: StoredMessage = {
      id: `msg-${crypto.randomUUID()}`,
      userId,
      direction,
      bodyRedacted: redactSensitive(body),
      rawBody: body,
      ts: new Date().toISOString(),
      twilioSid,
    };
    this.messages.push(msg);
    return msg;
  }

  getMessages(userId: string): StoredMessage[] {
    return this.messages.filter((m) => m.userId === userId);
  }

  getAllMessages(): StoredMessage[] {
    return [...this.messages];
  }

  // Matches
  setMatches(userId: string, matches: MatchResult[]) {
    // replace active matches
    this.matches = this.matches.filter((m) => m.userId !== userId);
    for (const m of matches) {
      this.matches.push({
        id: `match-${crypto.randomUUID()}`,
        userId,
        programId: m.programId,
        confidence: m.confidence,
        estMonthlyValue: m.estMonthlyValue,
        status: 'new',
        sentAt: new Date().toISOString(),
      });
    }
  }

  getMatches(userId: string): StoredMatch[] {
    return this.matches.filter((m) => m.userId === userId);
  }

  getAllMatches(): StoredMatch[] {
    return [...this.matches];
  }

  updateMatchStatus(userId: string, programId: string, status: StoredMatch['status']) {
    for (const m of this.matches) {
      if (m.userId === userId && m.programId === programId) {
        m.status = status;
      }
    }
  }

  // Alerts
  recordAlert(alert: Omit<StoredAlert, 'id'>): StoredAlert {
    const newAlert: StoredAlert = {
      ...alert,
      id: `alert-${crypto.randomUUID()}`,
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  getAlerts(userId: string): StoredAlert[] {
    return this.alerts.filter((a) => a.userId === userId);
  }

  getAllAlerts(): StoredAlert[] {
    return [...this.alerts];
  }

  // Bill Flags
  recordBillFlag(flag: Omit<BillFlag, 'id'>): BillFlag {
    const newFlag: BillFlag = {
      ...flag,
      id: `flag-${crypto.randomUUID()}`,
    };
    this.billFlags.push(newFlag);
    return newFlag;
  }

  getBillFlags(userId: string): BillFlag[] {
    return this.billFlags.filter((b) => b.userId === userId);
  }

  getAllBillFlags(): BillFlag[] {
    return [...this.billFlags];
  }

  // Outcomes
  recordOutcome(userId: string, programId: string, event: Outcome['event']): Outcome {
    const outcome: Outcome = {
      id: `outcome-${crypto.randomUUID()}`,
      userId,
      programId,
      event,
      ts: new Date().toISOString(),
    };
    this.outcomes.push(outcome);
    return outcome;
  }

  getAllOutcomes(): Outcome[] {
    return [...this.outcomes];
  }
}

export const db = new DataStore();
