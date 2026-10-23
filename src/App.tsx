import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Calendar,
  Receipt,
  MessageSquare,
  Globe,
  Shield,
  Briefcase,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Mail,
  Phone,
  Sparkles,
  Send,
  X,
  Plus,
  RotateCcw,
  ExternalLink,
  Check,
  Menu,
  ArrowLeft,
  Info,
  LogOut,
  Lock,
  UploadCloud,
  Edit3,
  Bell,
  CreditCard,
  User,
  Stethoscope,
  MapPin,
  Search,
  Share2,
  CheckCircle,
  QrCode,
  Wifi,
  AlertCircle,
  Sliders,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import { BeniMascot, BeniExpression } from './components/BeniMascot.tsx';
import { TRANSLATIONS, SupportedLang } from './lib/translations.ts';
import { DoctorFinder } from './components/DoctorFinder.tsx';
import { DigitalWallet } from './components/DigitalWallet.tsx';

// =========================================================================
// DATA CONTRACTS (BeniFIT Brand Board System)
// =========================================================================
export type ScreenId = 'connect' | 'found' | 'planner' | 'bills' | 'doctors' | 'chat' | 'language';

interface FindingItem {
  id: string;
  type: 'may_qualify' | 'confirmed';
  category: 'hidden_benefit' | 'unclaimed_program' | 'bill_error' | 'fsa' | 'food';
  title: string;
  subtitle: string;
  amount: number;
  amountLabel: string;
  source: string;
  actionLabel: string;
  actionKind: 'call' | 'open_app' | 'claim' | 'view' | 'apply' | 'learn_more';
  deadline?: string;
  explanation: string;
}

interface DemoPersona {
  id: 'maria' | 'ana' | 'joe';
  name: string;
  age: number;
  location: string;
  coverageName: string;
  claimsCount: number;
  totalSavings: number;
  mayQualifyTotal: number;
  confirmedTotal: number;
  incomeMonthly: number;
  householdSize: number;
  memberId: string;
  groupNumber: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
  copays: {
    pcp: string;
    specialist: string;
    urgentCare?: string;
    genericRx: string;
    er: string;
  };
  deductible: {
    total: number;
    met: number;
  };
  outOfPocketMax: {
    total: number;
    met: number;
  };
  fsaBalance?: number;
  fsaCardNumber?: string;
  fsaExpires?: string;
  findings: FindingItem[];
  mriBill: {
    billed: number;
    patientOwedPerPlan: number;
    discrepancy: number;
    errorSummary: string;
    source: string;
    providerName: string;
    providerPhone: string;
    providerEmail: string;
    disputeDraft: string;
  };
}

const DEMO_PERSONAS: Record<'maria' | 'ana' | 'joe', DemoPersona> = {
  maria: {
    id: 'maria',
    name: 'Maria Alvarez',
    age: 38,
    location: 'Brooklyn, NY 11201',
    coverageName: 'ClearPath Comprehensive PPO',
    claimsCount: 4,
    totalSavings: 1265,
    mayQualifyTotal: 780, // $320 FSA + $150 food/wellness + $310 ride perk = $780
    confirmedTotal: 485, // $485 duplicate MRI hospital bill
    incomeMonthly: 4200,
    householdSize: 1,
    memberId: 'CP-90214-NY',
    groupNumber: 'NY-772',
    rxBin: '004336',
    rxPcn: 'ADV',
    rxGroup: 'RX772',
    copays: {
      pcp: '$20',
      specialist: '$40',
      urgentCare: '$35',
      genericRx: '$15',
      er: '$150',
    },
    deductible: {
      total: 1000,
      met: 450,
    },
    outOfPocketMax: {
      total: 4500,
      met: 1200,
    },
    fsaBalance: 320,
    fsaCardNumber: '4821',
    fsaExpires: 'Dec 31, 2027',
    findings: [
      {
        id: 'f-1',
        type: 'may_qualify',
        category: 'fsa',
        title: 'Unused FSA funds',
        subtitle: '$320 • Employer benefits',
        amount: 320,
        amountLabel: '$320',
        source: 'Brightway 2027 Benefits Guide p.11',
        actionLabel: 'Claim it',
        actionKind: 'claim',
        deadline: '⏰ Dec 31',
        explanation: 'You have $320 in your Flexible Spending Account. Prescription glasses, sunscreen, and first-aid items qualify.',
      },
      {
        id: 'f-2',
        type: 'may_qualify',
        category: 'food',
        title: 'Food assistance program',
        subtitle: '$150 • State program',
        amount: 150,
        amountLabel: '$150',
        source: 'NY State Food Relief Guidelines',
        actionLabel: 'Apply',
        actionKind: 'apply',
        explanation: 'Based on your household size in Brooklyn, you may qualify for $150/mo in grocery purchasing help.',
      },
      {
        id: 'f-3',
        type: 'may_qualify',
        category: 'hidden_benefit',
        title: 'Free ride assistance',
        subtitle: '$310 • Health exchange / plan',
        amount: 310,
        amountLabel: '$310',
        source: 'ClearPath RideCare Guide p.7',
        actionLabel: 'Learn more',
        actionKind: 'learn_more',
        explanation: 'Your ClearPath plan covers up to 12 free roundtrip rides per year to doctors and imaging centers via Uber Health.',
      },
      {
        id: 'f-4',
        type: 'confirmed',
        category: 'bill_error',
        title: 'Duplicate MRI charge',
        subtitle: '$485 • Hospital bill',
        amount: 485,
        amountLabel: '$485',
        source: 'Mercy Grove Bill MG-88213 vs. Claim EOB-0004',
        actionLabel: 'View details',
        actionKind: 'view',
        explanation: 'This charge appears to be a duplicate of a claim already paid by your insurance. Insurance paid $720, contractual liability is $180.',
      },
    ],
    mriBill: {
      billed: 485.0,
      patientOwedPerPlan: 180.0,
      discrepancy: 485.0,
      errorSummary:
        'This charge appears to be a duplicate of a claim already paid by your insurance. Mercy Grove Hospital billed line 70553 twice; ClearPath denied the second line as duplicate care, but the hospital moved it to patient balance.',
      source: 'Hospital bill MG-88213 + insurance claim EOB-0004',
      providerName: 'Mercy Grove Hospital (City Imaging)',
      providerPhone: '(212) 555-0180',
      providerEmail: 'billing@mercygrove.org',
      disputeDraft:
        'To Mercy Grove Billing Office:\nRe: Patient Maria Alvarez (DOB: 1988-06-14, Invoice #MG-88213)\n\nI am disputing the billed patient balance of $485.00 for MRI procedure 70553 performed on 2027-10-12. ClearPath EOB #EOB-0004 confirms the contractual allowed amount was paid ($720.00), leaving patient responsibility as $180.00.\n\nThe second charge on my invoice is an identical duplicate that was denied by ClearPath as non-payable duplicate care. Under New York balance billing protections, duplicate charges cannot be transferred to the patient.\n\nPlease zero out this duplicate balance of $485.00 and issue a corrected statement.\n\nThank you,\nMaria Alvarez',
    },
  },
  ana: {
    id: 'ana',
    name: 'Ana Torres',
    age: 26,
    location: 'Bronx, NY 10451',
    coverageName: 'HarborCare NY Medicaid Managed Care',
    claimsCount: 3,
    totalSavings: 3100,
    mayQualifyTotal: 1950,
    confirmedTotal: 1150,
    incomeMonthly: 1650,
    householdSize: 2,
    memberId: 'HB-33819-BX',
    groupNumber: 'NY-MED-04',
    rxBin: '012345',
    rxPcn: 'NYRX',
    rxGroup: 'NYMED',
    copays: {
      pcp: '$0',
      specialist: '$0',
      urgentCare: '$0',
      genericRx: '$1-$3',
      er: '$0',
    },
    deductible: {
      total: 0,
      met: 0,
    },
    outOfPocketMax: {
      total: 0,
      met: 0,
    },
    findings: [
      {
        id: 'f-ana-1',
        type: 'confirmed',
        category: 'bill_error',
        title: 'Emergency room balance bill',
        subtitle: '$1,150 • Hospital bill',
        amount: 1150,
        amountLabel: '$1,150',
        source: 'Bronx Central Bill #BC-99214 vs HarborCare Medicaid',
        actionLabel: 'View details',
        actionKind: 'view',
        explanation: 'New York Medicaid covers emergency department visits in full. Providers are strictly prohibited from balance billing Medicaid patients.',
      },
      {
        id: 'f-ana-2',
        type: 'may_qualify',
        category: 'food',
        title: 'WIC Nutrition benefit ($100/mo)',
        subtitle: '$1,200 • State program',
        amount: 1200,
        amountLabel: '$1,200/yr',
        source: 'NY DOH WIC Guidelines p.2',
        actionLabel: 'Apply',
        actionKind: 'apply',
        explanation: 'Because you are pregnant or have a young baby, you may qualify for $100/mo in fruit, milk, and healthy groceries.',
      },
      {
        id: 'f-ana-3',
        type: 'may_qualify',
        category: 'hidden_benefit',
        title: 'Covered doula care services',
        subtitle: '$750 • Medicaid perk',
        amount: 750,
        amountLabel: '100% Covered',
        source: 'HarborCare 2026 Medicaid Benefits',
        actionLabel: 'Learn more',
        actionKind: 'learn_more',
        explanation: 'NY Medicaid covers certified doula birth workers at $0 out-of-pocket for prenatal, labor, and postpartum support.',
      },
    ],
    mriBill: {
      billed: 1150.0,
      patientOwedPerPlan: 0.0,
      discrepancy: 1150.0,
      errorSummary:
        'Bronx Central Hospital billed $1,150.00 for emergency care. Under NY Public Health Law and federal Medicaid rules, participating providers cannot bill Medicaid members for covered emergency services.',
      source: 'Bronx Central Bill #BC-99214 + HarborCare Medicaid',
      providerName: 'Bronx Central Hospital',
      providerPhone: '(718) 555-0199',
      providerEmail: 'billing@bronxcentral.org',
      disputeDraft:
        'To Bronx Central Billing Department:\nRe: Patient Ana Torres (Medicaid ID: HC-992014, Invoice #BC-99214)\n\nI am disputing the billed balance of $1,150.00. I am an active beneficiary of HarborCare NY Medicaid. Under NY State regulations, emergency room care is covered at 100% with $0 copay.\n\nParticipating providers are legally prohibited from balance billing Medicaid members. Please cancel this balance immediately and confirm $0 balance in writing.\n\nSincerely,\nAna Torres',
    },
  },
  joe: {
    id: 'joe',
    name: 'Joe Kowalski',
    age: 72,
    location: 'Queens, NY 11355',
    coverageName: 'SilverPath Choice Medicare Advantage (HMO)',
    claimsCount: 3,
    totalSavings: 4200,
    mayQualifyTotal: 4115,
    confirmedTotal: 85,
    incomeMonthly: 1800,
    householdSize: 1,
    memberId: '1EG4-TE5-MK72',
    groupNumber: 'SP-MED-77',
    rxBin: '610014',
    rxPcn: 'MEDD',
    rxGroup: 'PARTD',
    copays: {
      pcp: '$0',
      specialist: '$15',
      urgentCare: '$20',
      genericRx: '$0 Tier 1',
      er: '$90',
    },
    deductible: {
      total: 240,
      met: 240,
    },
    outOfPocketMax: {
      total: 3400,
      met: 890,
    },
    fsaBalance: 85,
    fsaCardNumber: '9912',
    fsaExpires: 'Quarter End',
    findings: [
      {
        id: 'f-joe-1',
        type: 'confirmed',
        category: 'bill_error',
        title: 'Insulin copay overcharge',
        subtitle: '$85 • Pharmacy receipt',
        amount: 85,
        amountLabel: '$85 refund',
        source: 'Main St Pharmacy Receipt #RX-4412',
        actionLabel: 'View details',
        actionKind: 'view',
        explanation: 'Pharmacy charged $120. Under Medicare Part D senior caps, insulin copay is legally capped at $35.00/month.',
      },
      {
        id: 'f-joe-2',
        type: 'may_qualify',
        category: 'unclaimed_program',
        title: 'Medicare Savings Program (Part B)',
        subtitle: '$2,220 • State assistance',
        amount: 2220,
        amountLabel: '$185 / mo',
        source: 'NY DOH MSP Guidelines 2026',
        actionLabel: 'Apply',
        actionKind: 'apply',
        explanation: 'New York will pay your $185 monthly Part B premium directly into your Social Security check if you meet income limits.',
      },
      {
        id: 'f-joe-3',
        type: 'may_qualify',
        category: 'food',
        title: 'SNAP senior grocery support',
        subtitle: '$1,895 • State program',
        amount: 1895,
        amountLabel: '$158 / mo',
        source: 'OTDA NY SNAP Guidelines',
        actionLabel: 'Apply',
        actionKind: 'apply',
        explanation: 'You may be eligible for about $158 a month on an EBT card for grocery markets.',
      },
    ],
    mriBill: {
      billed: 120.0,
      patientOwedPerPlan: 35.0,
      discrepancy: 85.0,
      errorSummary:
        'Main St Pharmacy charged $120.00 cash price for a 30-day insulin supply. Under the federal Inflation Reduction Act and NY Senior protections, Medicare Part D insulin is legally capped at $35.00 per month.',
      source: 'Main St. Pharmacy Receipt #RX-4412 vs. Medicare Part D',
      providerName: 'Main St. Pharmacy',
      providerPhone: '(718) 555-0144',
      providerEmail: 'rx@mainstpharmacy.com',
      disputeDraft:
        'To Main St. Pharmacy Manager:\nRe: Patient Joe Kowalski (Rx #RX-4412, SilverPath Medicare ID: SP-77291)\n\nI was charged $120.00 for my Novolog insulin refill. Under federal Medicare Part D regulations, insulin copays are capped at $35.00 for a 30-day supply.\n\nPlease process an immediate refund of the $85.00 overcharge to my account.\n\nThank you,\nJoe Kowalski',
    },
  },
};

export default function App() {
  // Authentication & Login Gate (User must log in before accessing inside of app!)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState('maria@demo.benifit');
  const [loginPassword, setLoginPassword] = useState('beni2026');
  const [loginError, setLoginError] = useState('');

  // Explicit Income & Document Upload Verification Gate (Beni NEVER assumes income!)
  const [hasVerifiedIncomeAndDocs, setHasVerifiedIncomeAndDocs] = useState(false);
  const [showIncomeEditModal, setShowIncomeEditModal] = useState(false);

  // Active user income & upload state
  const [userMonthlyIncome, setUserMonthlyIncome] = useState<number>(4200);
  const [userHouseholdSize, setUserHouseholdSize] = useState<number>(1);
  const [userZip, setUserZip] = useState<string>('11201');
  const [userInsuranceUploaded, setUserInsuranceUploaded] = useState(true);
  const [userBenefitsGuideUploaded, setUserBenefitsGuideUploaded] = useState(true);
  const [userBillsUploaded, setUserBillsUploaded] = useState(true);

  // Current screen matching the brand system board (1 of 6)
  const [activeScreen, setActiveScreen] = useState<ScreenId>('connect');

  // Language state (English, Spanish, French, Ukrainian)
  const [lang, setLang] = useState<SupportedLang>('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Active persona
  const [activePersonaKey, setActivePersonaKey] = useState<'maria' | 'ana' | 'joe'>('maria');
  const persona = DEMO_PERSONAS[activePersonaKey];

  // Planner filter tab: 'all' | 'may_qualify' | 'confirmed'
  const [plannerFilter, setPlannerFilter] = useState<'all' | 'may_qualify' | 'confirmed'>('all');

  // Planner new item text
  const [plannerText, setPlannerText] = useState('');
  const [userPlannerItems, setUserPlannerItems] = useState<Array<{ id: string; text: string; date: string }>>([]);

  // Detail Modal (for Bill Check View Details or Finding details)
  const [selectedBillFinding, setSelectedBillFinding] = useState<FindingItem | null>(null);
  const [showBillDisputeModal, setShowBillDisputeModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // New features requested by user:
  // 1. My Account Profile Modal (replacing top corner persona dropdown)
  const [showAccountModal, setShowAccountModal] = useState(false);

  // 2. Proactive Alert System (turn on/off, alert types, quiet hours, test alert)
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [proactiveAlertsEnabled, setProactiveAlertsEnabled] = useState(true);
  const [billDiscrepancyAlerts, setBillDiscrepancyAlerts] = useState(true);
  const [fsaExpirationAlerts, setFsaExpirationAlerts] = useState(true);
  const [annualRecertAlerts, setAnnualRecertAlerts] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [testAlertBanner, setTestAlertBanner] = useState<{
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
  } | null>(null);

  // 3. Simulated CMS Interoperability / SMART on FHIR API Sync
  const [showApiConnectModal, setShowApiConnectModal] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [apiSyncState, setApiSyncState] = useState<'idle' | 'authorizing' | 'fetching' | 'synced'>('synced');
  const [lastApiSyncedAt, setLastApiSyncedAt] = useState('Just now');
  const [selectedInsurer, setSelectedInsurer] = useState('Fidelis Care / CMS Interoperability FHIR');

  // 4. Bill Check Screen Tab ('discrepancies' | 'wallet')
  const [billsActiveTab, setBillsActiveTab] = useState<'discrepancies' | 'wallet'>('discrepancies');

  // Trigger simulated proactive alert
  const handleTriggerTestAlert = async () => {
    setTestAlertBanner({
      title: '🚨 Discrepancy Alert',
      message: `${persona.mriBill.providerName}: $${persona.mriBill.discrepancy.toFixed(0)} duplicate charge found. Dispute drafted.`,
      actionText: 'View Letter',
      onAction: () => {
        setSelectedBillFinding(persona.findings.find((f) => f.type === 'confirmed') || null);
        setShowBillDisputeModal(true);
        setTestAlertBanner(null);
      },
    });

    try {
      await fetch('/api/alerts/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-maria-demo', forceSend: true }),
      });
    } catch {
      // offline resilience
    }
  };

  // Trigger simulated CMS FHIR sync
  const handleSyncFhirApi = (insurerName?: string) => {
    if (insurerName) setSelectedInsurer(insurerName);
    setApiSyncState('authorizing');
    setTimeout(() => {
      setApiSyncState('fetching');
      setTimeout(() => {
        setApiSyncState('synced');
        setIsApiConnected(true);
        setLastApiSyncedAt('Just now');
      }, 1200);
    }, 1000);
  };

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'beni';
    text: string;
    source?: string;
    actionLabel?: string;
    actionScreen?: ScreenId;
    expression?: BeniExpression;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Reset chat welcome when persona or language changes
  useEffect(() => {
    setChatMessages([
      {
        role: 'beni',
        text:
          lang === 'es'
            ? `¡Hola ${persona.name}! Soy Beni, tu asistente de beneficios de salud. Revisé tus documentos subidos y tu ingreso mensual de $${userMonthlyIncome.toLocaleString()}. Encontré posibles ahorros y cargos duplicados. ¿En qué te puedo ayudar hoy?`
            : lang === 'fr'
            ? `Bonjour ${persona.name} ! Je suis Beni, votre assistant IA pour vos droits de santé. J’ai analysé vos documents et votre revenu mensuel de $${userMonthlyIncome.toLocaleString()}. Comment puis-je vous aider aujourd’hui ?`
            : lang === 'uk'
            ? `Привіт, ${persona.name}! Я Бені, ваш ШІ-помічник із медичних пільг. Я перевірив ваші завантажені документи та підтверджений дохід $${userMonthlyIncome.toLocaleString()}. Чим можу допомогти?`
            : `Hi ${persona.name}! I’m Beni, your AI health-benefits assistant. I reviewed your uploaded documents and your verified monthly income of $${userMonthlyIncome.toLocaleString()}. What can I help you with today?`,
        expression: 'default',
      },
    ]);
  }, [persona, lang, userMonthlyIncome]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Handle Login Submission
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email or phone number.');
      return;
    }

    if (loginPassword !== 'beni2026' && loginPassword.length < 4) {
      setLoginError('Incorrect password. Demo password is: beni2026');
      return;
    }

    // Set persona based on email or default to Maria
    if (loginEmail.toLowerCase().includes('ana')) {
      handleSelectDemoPersona('ana');
    } else if (loginEmail.toLowerCase().includes('joe')) {
      handleSelectDemoPersona('joe');
    } else {
      handleSelectDemoPersona('maria');
    }
  };

  // Quick 1-Click Demo Persona Login
  const handleSelectDemoPersona = (pKey: 'maria' | 'ana' | 'joe') => {
    setActivePersonaKey(pKey);
    const p = DEMO_PERSONAS[pKey];
    setUserMonthlyIncome(p.incomeMonthly);
    setUserHouseholdSize(p.householdSize);
    setUserZip(p.location.split(' ')[1] || '11201');
    setIsLoggedIn(true);

    // If logging in for the first time, take them to Connect & Income Verification
    setActiveScreen('connect');
    setHasVerifiedIncomeAndDocs(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasVerifiedIncomeAndDocs(false);
    setActiveScreen('connect');
  };

  // Handle Chat Submit with Context-Aware AI Grounding
  const handleSendChat = (presetText?: string) => {
    const text = presetText || chatInput;
    if (!text.trim() || chatLoading) return;

    setChatInput('');
    setChatLoading(true);

    const userMsg = { role: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMsg]);

    // Intelligent context-aware response based on active persona & documents
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = '';
      let botSource: string | undefined = undefined;
      let botActionLabel: string | undefined = undefined;
      let botActionScreen: ScreenId | undefined = undefined;
      let expr: BeniExpression = 'default';

      // 1. Clinical / Medication Refusal Guardrail
      if (
        lower.includes('take') ||
        lower.includes('grapefruit') ||
        lower.includes('pain') ||
        lower.includes('symptom') ||
        lower.includes('prescribe') ||
        lower.includes('dose') ||
        lower.includes('antibiotic')
      ) {
        botResponse =
          lang === 'es'
            ? 'No puedo dar consejos médicos ni diagnósticos clínicos. Para preguntas sobre medicamentos o interacciones, por favor consulta a tu médico o farmacéutico.'
            : 'I cannot provide clinical medical advice or diagnose symptoms. For prescription questions or drug interactions, please consult your physician or pharmacist.';
        botSource = 'beniFIT Clinical Safety Policy';
        expr = 'warning';
      }
      // 2. Medicare Uncertainty Rule
      else if (lower.includes('medicare part d gap') || lower.includes('medicare appeal deadline')) {
        botResponse = t.medicareNotSure;
        botSource = 'Official Medicare Resource';
        expr = 'not_sure';
      }
      // 3. Medicaid Uncertainty Rule
      else if (lower.includes('dental specialist coverage') && persona.id === 'ana') {
        botResponse = t.medicaidNotSure;
        botSource = 'HarborCare Member Services';
        expr = 'not_sure';
      }
      // 4. MRI Bill Check Question (Matches Screen 5 from Brand Board!)
      else if (lower.includes('mri') || lower.includes('bill') || lower.includes('factura') || lower.includes('right')) {
        botResponse =
          lang === 'es'
            ? `Revisé tus documentos. Parece que este cargo de resonancia magnética ($${persona.mriBill.discrepancy}) es un cobro duplicado. Tu seguro ya cubrió la atención contratada.`
            : lang === 'fr'
            ? `J'ai vérifié vos documents. Il semble que ce montant d'IRM ($${persona.mriBill.discrepancy}) soit une facturation en double. Votre assurance a déjà couvert ce soin.`
            : `I checked your documents. It looks like this MRI charge ($${persona.mriBill.discrepancy}) may be a duplicate. You've already paid your contractual share through your insurance claim.`;
        botSource = persona.mriBill.source;
        botActionLabel = t.viewDetails;
        botActionScreen = 'bills';
        expr = 'confirmed';
      }
      // 5. Food Assistance / WIC
      else if (lower.includes('food') || lower.includes('comida') || lower.includes('wic') || lower.includes('snap')) {
        botResponse =
          lang === 'es'
            ? `Según tu ingreso verificado de $${userMonthlyIncome.toLocaleString()} y tu hogar en ${persona.location}, podrías calificar para beneficios mensuales de alimentos (WIC / SNAP).`
            : `Based on your verified monthly income of $${userMonthlyIncome.toLocaleString()} and household size in ${persona.location}, you may qualify for monthly grocery benefits (WIC / SNAP).`;
        botSource = 'NY DOH Food Guidelines';
        botActionLabel = t.apply;
        botActionScreen = 'planner';
        expr = 'may_qualify';
      }
      // 6. FSA / Benefits Guide
      else if (lower.includes('fsa') || lower.includes('expire') || lower.includes('perk') || lower.includes('ride')) {
        botResponse =
          lang === 'es'
            ? `Tienes $320 sin gastar en tu cuenta FSA que vencen el 31 de diciembre. Los lentes recetados y botiquines califican.`
            : `You have $320 unspent in your Flexible Spending Account that expires Dec 31. Prescription glasses and first-aid kits count!`;
        botSource = 'Brightway 2027 Benefits Guide p.11';
        botActionLabel = t.claimIt;
        botActionScreen = 'planner';
        expr = 'may_qualify';
      }
      // 7. General Fallback
      else {
        botResponse =
          lang === 'es'
            ? `Beni calculó $${persona.totalSavings.toLocaleString()} en total a partir de tu ingreso verificado ($${persona.confirmedTotal.toLocaleString()} confirmados en documentos y $${persona.mayQualifyTotal.toLocaleString()} en posibles programas a los que podrías calificar).`
            : `Beni calculated $${persona.totalSavings.toLocaleString()} in total from your verified income: $${persona.confirmedTotal.toLocaleString()} confirmed from your documents, and $${persona.mayQualifyTotal.toLocaleString()} in potential benefits you may qualify for.`;
        botSource = `${persona.coverageName} + Uploaded Papers`;
        botActionLabel = t.whatsBeniFound;
        botActionScreen = 'found';
        expr = 'thinking';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'beni',
          text: botResponse,
          source: botSource,
          actionLabel: botActionLabel,
          actionScreen: botActionScreen,
          expression: expr,
        },
      ]);
      setChatLoading(false);
    }, 600);
  };

  // Copy dispute letter to clipboard
  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Add custom planner item
  const handleAddPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerText.trim()) return;
    setUserPlannerItems((prev) => [
      { id: `up-${Date.now()}`, text: plannerText.trim(), date: 'Upcoming' },
      ...prev,
    ]);
    setPlannerText('');
  };

  // =========================================================================
  // VIEW 1: LOGIN PAGE (Shown Before Entering the App)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#4F46E5] selection:text-white">
        <div className="w-full max-w-[440px] bg-white border border-[#E2E8F0] rounded-[36px] shadow-xl p-6 sm:p-8 space-y-6">
          {/* Logo & Welcome */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto shadow-inner mb-2">
              <BeniMascot size={52} expression="waving" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              beni<span className="text-[#4F46E5]">FIT</span>
            </h1>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              {t.tagline}
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Sign in to connect your insurance, audit your medical bills, and find benefit savings.
            </p>
          </div>

          {/* 1-Click Demo Logins */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              1-Click Demo Profiles (Hackathon):
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelectDemoPersona('maria')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-[#4F46E5] text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👵</span>
                  <div>
                    <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#4F46E5]">
                      Maria Alvarez (38)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Employer ClearPath PPO • Brooklyn 11201
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4F46E5] group-hover:translate-x-1 transition" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('ana')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-[#4F46E5] text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🤱</span>
                  <div>
                    <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#4F46E5]">
                      Ana Torres (26)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      HarborCare NY Medicaid • Bronx 10451
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4F46E5] group-hover:translate-x-1 transition" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('joe')}
                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-[#4F46E5] text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👴</span>
                  <div>
                    <div className="font-bold text-xs text-[#0F172A] group-hover:text-[#4F46E5]">
                      Joe Kowalski (72)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      SilverPath Medicare Advantage • Queens 11355
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#4F46E5] group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold text-[10px]">Or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            {loginError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {loginError}
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Email or Phone</label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="maria@demo.benifit"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Sign In to beniFIT
            </button>
          </form>

          {/* Privacy & No Assumption Notice */}
          <div className="text-[11px] text-slate-400 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[#065F46] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero assumptions. We never guess your income from your phone.</span>
            </div>
            <div>Password for all demo accounts: <code className="font-mono text-[#0F172A] font-bold">beni2026</code></div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN APP (Screens 1 through 6)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col items-center justify-start py-0 sm:py-6 sm:px-4 font-sans selection:bg-[#4F46E5] selection:text-white">
      {/* 480px Centered Mobile Device Frame (Rule 8 / Projector Optimized) */}
      <div className="w-full max-w-[480px] min-h-screen sm:min-h-[850px] sm:max-h-[920px] bg-[#F8FAFC] border-0 sm:border-8 sm:border-[#0F172A] sm:rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative">

        {/* TOP STATUS BAR: PROMINENT VERIFIED INCOME CHIP (NEVER ASSUMED) */}
        <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-4 py-1.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[#92400E] font-bold truncate">
            <Shield className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="truncate">
              Income: <strong>${userMonthlyIncome.toLocaleString()}/mo</strong> (User Provided)
            </span>
          </div>
          <button
            onClick={() => setShowIncomeEditModal(true)}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#FDE68A] text-[#92400E] hover:bg-amber-100 transition shrink-0 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            Edit Income
          </button>
        </div>

        {/* TOP APP HEADER (Matching Brand Board Screens) */}
        <header className="bg-white border-b border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {activeScreen !== 'found' && (
              <button
                onClick={() => setActiveScreen('found')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#0F172A] transition"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div
              onClick={() => setActiveScreen('found')}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <BeniMascot size={28} expression="default" />
              <span className="text-lg font-black tracking-tight text-[#0F172A]">
                beni<span className="text-[#4F46E5]">FIT</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Quick Dropdown */}
            <button
              onClick={() => setActiveScreen('language')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0F172A] transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="uppercase text-[11px]">{lang}</span>
            </button>

            {/* Alert System Bell */}
            <button
              onClick={() => setShowAlertsModal(true)}
              className="relative p-1.5 rounded-full hover:bg-slate-100 text-[#0F172A] transition"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4 text-[#0F172A]" />
              {proactiveAlertsEnabled && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* My Account Profile Button (Replaces raw 3-person dropdown) */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition group text-left"
              title="My Account & Coverage Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                {persona.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="text-xs font-bold text-[#0F172A] max-w-[85px] truncate">
                {persona.name.split(' ')[0]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </button>
          </div>
        </header>

        {/* PROACTIVE ALERT TOAST / BANNER */}
        {testAlertBanner && (
          <div className="bg-[#FEF3C7] border-b border-[#FDE68A] px-4 py-2.5 text-xs text-[#0F172A] flex items-center justify-between gap-2 shadow-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🚨</span>
              <div className="min-w-0">
                <span className="font-black text-[#92400E] block text-[10px] uppercase tracking-wider">
                  {testAlertBanner.title}
                </span>
                <span className="text-[11px] font-medium text-slate-700 truncate block">
                  {testAlertBanner.message}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {testAlertBanner.actionText && (
                <button
                  onClick={testAlertBanner.onAction}
                  className="px-2.5 py-1 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[10px] font-bold rounded-lg transition"
                >
                  {testAlertBanner.actionText}
                </button>
              )}
              <button
                onClick={() => setTestAlertBanner(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MAIN SCREEN ROUTER (Screens 1 through 6) */}
        {/* ===================================================================== */}
        <main className="flex-1 overflow-y-auto flex flex-col">

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 1: CONNECT & INCOME/DOCUMENTS UPLOAD (Explicit Verification) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'connect' && (
            <div className="flex-1 p-5 flex flex-col justify-between space-y-5">
              <div className="space-y-5">
                {/* Hero Beni on Sunbeam Hill */}
                <div className="text-center pt-1">
                  <div className="relative inline-block mb-2">
                    <div className="w-24 h-24 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto shadow-inner">
                      <BeniMascot size={72} expression="waving" />
                    </div>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    {t.connectTitle}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                    {t.connectSub}
                  </p>
                </div>

                {/* EXPLICIT INCOME PROMPT: WE NEVER ASSUME INCOME */}
                <div className="bg-white border-2 border-[#FDE68A] rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                      <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                        1. Tell Beni What You Earn (Never Assumed)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#065F46] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Required
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Beni never assumes your income based on your phone number or ZIP. Enter your household earnings so we calculate your exact New York benefits:
                  </p>

                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-black text-[#F59E0B] text-sm">$</span>
                      <input
                        type="number"
                        value={userMonthlyIncome}
                        onChange={(e) => setUserMonthlyIncome(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-sm font-black text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                        placeholder="4200"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">/ month</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Household Size</label>
                        <select
                          value={userHouseholdSize}
                          onChange={(e) => setUserHouseholdSize(parseInt(e.target.value, 10))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 font-bold"
                        >
                          <option value={1}>1 Person</option>
                          <option value={2}>2 People</option>
                          <option value={3}>3 People</option>
                          <option value={4}>4 People</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">New York ZIP</label>
                        <input
                          type="text"
                          value={userZip}
                          onChange={(e) => setUserZip(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Upload / Connect Tiles (from Brand Board Screen 1) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      2. Connect Insurance & Documents:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowApiConnectModal(true)}
                      className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                    >
                      <Wifi className="w-3 h-3" />
                      {t.connectApi}
                    </button>
                  </div>

                  {/* CMS SMART ON FHIR INTEROPERABILITY BADGE */}
                  <div
                    onClick={() => setShowApiConnectModal(true)}
                    className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 shadow-xs flex items-center justify-between cursor-pointer hover:bg-indigo-100/70 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                          <span>CMS Interoperability API</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-indigo-600 text-white rounded">
                            FHIR R4
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Synced via Patient Access API ({lastApiSyncedAt})</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-white text-[#4F46E5] border border-indigo-200 rounded-lg shadow-2xs">
                      Sync API
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4F46E5]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0F172A]">
                          {t.healthInsurance}
                        </div>
                        <div className="text-[10px] text-green-700 font-semibold">
                          ✓ Connected: {persona.coverageName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {persona.claimsCount} claims
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#F59E0B]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0F172A]">
                          {t.employerBenefits}
                        </div>
                        <div className="text-[10px] text-green-700 font-semibold">
                          ✓ Uploaded: Brightway_2027_Benefits_Guide.pdf
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      16 pgs
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#EF4444]">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#0F172A]">
                          {t.medicalBills}
                        </div>
                        <div className="text-[10px] text-red-600 font-semibold">
                          ✓ 1 bill audited (Mercy Grove #MG-88213)
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
                      Flagged
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA: Save and Calculate */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setHasVerifiedIncomeAndDocs(true);
                    setActiveScreen('found');
                  }}
                  className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Verify Income & View Savings →</span>
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 2: BENI FOUND (Big Total & Strict Separation) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'found' && (
            <div className="p-4 space-y-4">
              {/* Header Total Block */}
              <div className="text-center pt-2 space-y-1">
                <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                  beniFIT
                </h2>
                <div className="text-2xl font-bold text-[#0F172A]">
                  Beni found
                </div>
                <div className="text-4xl font-black text-[#0F172A] tracking-tight">
                  ${persona.totalSavings.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t.totalPotential}
                </p>
              </div>

              {/* TWO SEPARATED CATEGORY CARDS (Strict Money Rules from Brand Board) */}
              <div className="grid grid-cols-2 gap-3">
                {/* May Qualify Card (Amber) */}
                <div className="bg-white border border-[#FDE68A] rounded-2xl p-3.5 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#92400E]">
                      {t.mayQualify}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  </div>
                  <div className="text-2xl font-black text-[#0F172A]">
                    ${persona.mayQualifyTotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    ({t.notConfirmed})
                  </div>
                </div>

                {/* Confirmed Card (Emerald Green) */}
                <div className="bg-white border border-[#A7F3D0] rounded-2xl p-3.5 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#065F46]">
                      {t.confirmed}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  </div>
                  <div className="text-2xl font-black text-[#0F172A]">
                    ${persona.confirmedTotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    ({t.fromDocuments})
                  </div>
                </div>
              </div>

              {/* Section: Here's what Beni found */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <BeniMascot size={24} expression="may_qualify" />
                  <span className="text-xs font-bold text-[#0F172A]">
                    {t.whatsBeniFound}
                  </span>
                </div>

                {/* Card List */}
                <div className="space-y-2">
                  {persona.findings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-2xs flex items-center justify-between gap-3 hover:border-[#4F46E5] transition"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === 'confirmed'
                              ? 'bg-red-50 text-[#EF4444]'
                              : 'bg-indigo-50 text-[#4F46E5]'
                          }`}
                        >
                          {item.type === 'confirmed' ? (
                            <Receipt className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <button
                          onClick={() => {
                            if (item.type === 'confirmed') {
                              setSelectedBillFinding(item);
                              setShowBillDisputeModal(true);
                            } else {
                              setActiveScreen('planner');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                            item.type === 'confirmed'
                              ? 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                              : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'
                          }`}
                        >
                          {item.type === 'confirmed' ? t.viewDetails : item.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Safety Disclaimer (Brand Board) */}
              <div className="text-center pt-3 pb-1 text-[11px] text-slate-400">
                {t.demoDataLabel} • {t.infoNotAdvice}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 3: PLANNER (Benefit Opportunities, Deadlines & Actions) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'planner' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#0F172A]">
                  {t.plannerTitle}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t.plannerSub}
                </p>
              </div>

              {/* Filter Tabs (from Brand Board Screen 3) */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPlannerFilter('may_qualify')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    plannerFilter === 'may_qualify'
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.mayQualify} ({persona.findings.filter((f) => f.type === 'may_qualify').length})
                </button>
                <button
                  onClick={() => setPlannerFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    plannerFilter === 'confirmed'
                      ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.confirmed} ({persona.findings.filter((f) => f.type === 'confirmed').length})
                </button>
              </div>

              {/* Cards List with Exactly ONE Primary Action Button */}
              <div className="space-y-3">
                {persona.findings
                  .filter((f) => plannerFilter === 'all' || f.type === plannerFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                item.type === 'confirmed'
                                  ? 'bg-[#D1FAE5] text-[#065F46]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {item.type === 'confirmed' ? t.confirmed : t.mayQualify}
                            </span>
                            {item.deadline && (
                              <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-1.5 py-0.5 rounded">
                                {item.deadline}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                          <p className="text-xs text-slate-600">{item.explanation}</p>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {t.sourcesLabel} {item.source}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-[#0F172A]">
                            {item.amountLabel}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            if (item.type === 'confirmed') {
                              setSelectedBillFinding(item);
                              setShowBillDisputeModal(true);
                            } else {
                              setActiveScreen('chat');
                              handleSendChat(`How do I claim: ${item.title}?`);
                            }
                          }}
                          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-2xs transition"
                        >
                          {item.type === 'confirmed' ? t.viewDetails : item.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))}

                {userPlannerItems.map((u) => (
                  <div key={u.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 text-xs flex justify-between items-center">
                    <span className="font-semibold text-[#0F172A]">{u.text}</span>
                    <span className="text-[10px] text-slate-400">{u.date}</span>
                  </div>
                ))}
              </div>

              {/* Add Box */}
              <form onSubmit={handleAddPlanner} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 space-y-2">
                <label className="text-xs font-bold text-[#0F172A] block">
                  {t.whatsComingUp}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={plannerText}
                    onChange={(e) => setPlannerText(e.target.value)}
                    placeholder="E.g. MRI follow-up scan, check insulin..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold"
                  >
                    {t.add}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 4: BILL CHECK & DIGITAL BENEFITS WALLET */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'bills' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#0F172A]">
                  {billsActiveTab === 'wallet' ? t.digitalWalletTitle : t.billCheckTitle}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {billsActiveTab === 'wallet' ? t.digitalWalletSub : t.billCheckSub}
                </p>
              </div>

              {/* Sub-tab toggle: Discrepancy Audit vs Digital Wallet */}
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  type="button"
                  onClick={() => setBillsActiveTab('discrepancies')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    billsActiveTab === 'discrepancies'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-500 hover:text-[#0F172A]'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Discrepancy Audit (1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillsActiveTab('wallet')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    billsActiveTab === 'wallet'
                      ? 'bg-white text-[#4F46E5] shadow-xs'
                      : 'text-slate-500 hover:text-[#0F172A]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Digital Benefits Wallet</span>
                </button>
              </div>

              {billsActiveTab === 'wallet' ? (
                <DigitalWallet
                  userName={persona.name}
                  coverageName={persona.coverageName}
                  memberId={persona.memberId}
                  groupNumber={persona.groupNumber}
                  rxBin={persona.rxBin}
                  rxPcn={persona.rxPcn}
                  rxGroup={persona.rxGroup}
                  copays={persona.copays}
                  deductible={persona.deductible}
                  fsaBalance={persona.fsaBalance}
                  fsaExpires={persona.fsaExpires}
                />
              ) : (
                <div className="space-y-4">
                  {/* Bill Check Card (Matching Brand Board Screen 4 Exactly) */}
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
                          <Receipt className="w-4 h-4 text-[#4F46E5]" />
                          <span>{t.mriChargeTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-[#EF4444]">
                            ${persona.mriBill.discrepancy.toFixed(0)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
                            {t.confirmed}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {t.duplicateNotice}
                    </p>

                    <div className="text-[11px] text-slate-400 font-medium pt-1">
                      {t.billSourceLabel}
                    </div>

                    <button
                      onClick={() => setShowBillDisputeModal(true)}
                      className="w-full py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      {t.viewDetails}
                    </button>
                  </div>

                  {/* Verified Rules Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#4F46E5]">
                      <Shield className="w-4 h-4" />
                      <span>New York Balance Billing Protection</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Under NY Public Health Law § 2807-k, network hospitals and providers cannot bill patients for denied duplicate service lines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 5: FIND IN-NETWORK DOCTORS (Based on Profile ZIP) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'doctors' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#0F172A]">
                  {t.doctorFinderTitle}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t.doctorFinderSub}
                </p>
              </div>

              <DoctorFinder
                userZip={userZip}
                coverageName={persona.coverageName}
                onZipChange={(newZip) => setUserZip(newZip)}
              />
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 5: ASK BENI (Chat with Visible Source Citations) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'chat' && (
            <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
              {/* Chat Sub-header */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
                <BeniMascot size={32} expression="default" />
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A]">{t.askBeniTitle}</h3>
                  <p className="text-[10px] text-slate-500">{t.askBeniSub}</p>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-[#4F46E5] text-white rounded-tr-xs font-medium'
                          : 'bg-white text-[#0F172A] border border-[#E2E8F0] rounded-tl-xs'
                      }`}
                    >
                      {msg.role === 'beni' && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-[#F59E0B]">
                          <BeniMascot size={18} expression={msg.expression || 'default'} />
                          <span>Beni Assistant</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Visible Source Citation (Requirement from Brand Board) */}
                      {msg.source && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="font-semibold text-slate-700">{t.sourcesLabel}</span> {msg.source}
                        </div>
                      )}

                      {/* Action Button inside Chat Bubble */}
                      {msg.actionLabel && msg.actionScreen && (
                        <div className="mt-2.5 pt-1.5 border-t border-slate-100">
                          <button
                            onClick={() => setActiveScreen(msg.actionScreen!)}
                            className="px-3 py-1 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-bold rounded-lg transition"
                          >
                            {msg.actionLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-2xl text-xs text-slate-500 flex items-center gap-2 w-fit">
                    <BeniMascot size={20} expression="thinking" />
                    <span>Beni is reading your connected documents...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  onClick={() => handleSendChat('Is my MRI bill right?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs"
                >
                  Is my MRI bill right?
                </button>
                <button
                  onClick={() => handleSendChat('What am I missing?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs"
                >
                  What am I missing?
                </button>
                <button
                  onClick={() => handleSendChat('Can I get help with food?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs"
                >
                  Food assistance?
                </button>
                <button
                  onClick={() => handleSendChat('Can I take my blood pressure pills with grapefruit?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-red-200 text-red-700 rounded-full whitespace-nowrap shadow-2xs"
                >
                  🛡️ Medical refusal test
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 bg-white border border-[#E2E8F0] rounded-full px-4 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#4F46E5] shadow-2xs"
                >
                </input>
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 text-white transition shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 6: LANGUAGE TOGGLE (English, Español, Français, Ukrainian) */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'language' && (
            <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
              <div className="space-y-6 text-center">
                {/* Mascot with Welcome illustration */}
                <div className="relative inline-block mx-auto pt-2">
                  <div className="w-28 h-28 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto shadow-inner">
                    <BeniMascot size={76} expression="waving" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#0F172A]">
                    {t.langGreeting}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {t.langWelcome}
                  </p>
                </div>

                {/* Language Selection List */}
                <div className="space-y-2.5 text-left pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.selectLanguage}
                  </span>

                  {[
                    { code: 'en' as const, label: 'English', flag: '🌐' },
                    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
                    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
                    { code: 'uk' as const, label: 'Українська', flag: '🇺🇦' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`w-full p-3.5 rounded-2xl border transition flex items-center justify-between text-xs font-bold ${
                        lang === l.code
                          ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5] shadow-xs'
                          : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {lang === l.code && <Check className="w-4 h-4 text-[#4F46E5]" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveScreen('found')}
                className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold text-xs shadow-md transition"
              >
                {t.getStarted}
              </button>
            </div>
          )}
        </main>

        {/* ===================================================================== */}
        {/* BOTTOM NAVIGATION TABS (Brand Board: Home, Planner, Chat, More) */}
        {/* ===================================================================== */}
        <nav className="bg-white border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-around shrink-0 z-20">
          <button
            onClick={() => setActiveScreen('found')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'found' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.navHome}</span>
          </button>

          <button
            onClick={() => setActiveScreen('planner')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'planner' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.navPlanner}</span>
          </button>

          <button
            onClick={() => setActiveScreen('bills')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'bills' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t.navBills}</span>
          </button>

          <button
            onClick={() => setActiveScreen('doctors')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'doctors' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t.navDoctors}</span>
          </button>

          <button
            onClick={() => setActiveScreen('chat')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'chat' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.navChat}</span>
          </button>

          <button
            onClick={() => setActiveScreen('connect')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
              activeScreen === 'connect' ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-[#0F172A]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t.navConnect}</span>
          </button>
        </nav>

        {/* ===================================================================== */}
        {/* MODAL 1: EDIT VERIFIED INCOME (Never Assume Income!) */}
        {/* ===================================================================== */}
        {showIncomeEditModal && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <BeniMascot size={26} expression="thinking" />
                  <h3 className="font-bold text-sm text-[#0F172A]">Update Your Verified Income</h3>
                </div>
                <button
                  onClick={() => setShowIncomeEditModal(false)}
                  className="text-slate-400 hover:text-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Beni never assumes your income. Enter your exact monthly household income so we can re-evaluate New York eligibility rules:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">
                    Monthly Household Income (Before Taxes)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-bold text-[#F59E0B]">$</span>
                    <input
                      type="number"
                      value={userMonthlyIncome}
                      onChange={(e) => setUserMonthlyIncome(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Household Size</label>
                    <select
                      value={userHouseholdSize}
                      onChange={(e) => setUserHouseholdSize(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    >
                      <option value={1}>1 person</option>
                      <option value={2}>2 people</option>
                      <option value={3}>3 people</option>
                      <option value={4}>4 people</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">NY ZIP</label>
                    <input
                      type="text"
                      value={userZip}
                      onChange={(e) => setUserZip(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowIncomeEditModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIncomeEditModal(false);
                    setActiveScreen('found');
                  }}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Recalculate Savings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 2: BILL DISCREPANCY AUDIT DETAILS & DISPUTE LETTER */}
        {/* ===================================================================== */}
        {showBillDisputeModal && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-xs max-h-[85vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#EF4444]" />
                  <h3 className="font-bold text-sm text-[#0F172A]">{t.mriChargeTitle} Details</h3>
                </div>
                <button
                  onClick={() => setShowBillDisputeModal(false)}
                  className="text-slate-400 hover:text-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {/* Audit Numbers */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provider Billed:</span>
                    <span className="font-bold text-[#0F172A]">${persona.mriBill.billed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Insurance Contract Share:</span>
                    <span className="font-bold text-[#10B981]">${persona.mriBill.patientOwedPerPlan.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="font-bold text-[#EF4444]">Duplicate Discrepancy:</span>
                    <span className="font-black text-[#EF4444]">${persona.mriBill.discrepancy.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Findings:</strong> {persona.mriBill.errorSummary}
                </div>

                <div className="text-[10px] text-slate-400">
                  <strong>Source Documents:</strong> {persona.mriBill.source}
                </div>

                {/* Drafted Letter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      Drafted Dispute Letter:
                    </label>
                    <button
                      onClick={() => handleCopyDraft(persona.mriBill.disputeDraft)}
                      className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedSuccess ? t.copied : t.copyLetter}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={persona.mriBill.disputeDraft}
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] font-mono text-[#0F172A] leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href={`mailto:${persona.mriBill.providerEmail}?subject=Dispute%20Notice&body=${encodeURIComponent(
                      persona.mriBill.disputeDraft
                    )}`}
                    className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {t.emailBilling}
                  </a>
                  <a
                    href={`tel:${persona.mriBill.providerPhone}`}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {t.callBilling}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 3: MY ACCOUNT & COVERAGE PROFILE (Replaces raw 3-person dropdown) */}
        {/* ===================================================================== */}
        {showAccountModal && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-xs max-h-[88vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    {persona.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">{t.myAccount}</h3>
                    <p className="text-[10px] text-slate-400">Coverage & Eligibility Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-slate-400 hover:text-[#0F172A] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {/* User Card */}
                <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-100 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-black text-[#0F172A]">{persona.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{persona.coverageName}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active Member
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-100/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Member ID:</span>
                      <span className="font-mono font-bold text-[#0F172A]">{persona.memberId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Group Number:</span>
                      <span className="font-mono font-bold text-[#0F172A]">{persona.groupNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Profile ZIP:</span>
                      <span className="font-bold text-[#0F172A]">{userZip} (NYC)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Household:</span>
                      <span className="font-bold text-[#0F172A]">{userHouseholdSize} person(s)</span>
                    </div>
                  </div>
                </div>

                {/* Verified Household Income */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                      <Shield className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Verified Household Income</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAccountModal(false);
                        setShowIncomeEditModal(true);
                      }}
                      className="text-[10px] font-bold text-[#92400E] hover:underline flex items-center gap-0.5"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <div className="text-xl font-black text-[#0F172A]">
                    ${userMonthlyIncome.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  </div>
                  <p className="text-[10px] text-[#92400E]/90 leading-tight">
                    Explicitly verified by you. Beni never guesses your earnings from phone numbers.
                  </p>
                </div>

                {/* CMS Interoperability Connection Status */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                      <Wifi className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>CMS Interoperability API</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-600 text-white rounded">
                      FHIR R4 Connected
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Insurer: <strong className="text-slate-700">{selectedInsurer.split('/')[0]}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Last automatic claim sync: {lastApiSyncedAt}
                  </div>
                  <button
                    onClick={() => {
                      setShowAccountModal(false);
                      setShowApiConnectModal(true);
                    }}
                    className="w-full py-1.5 bg-white border border-slate-200 hover:border-[#4F46E5] text-[#4F46E5] font-bold rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Manage Insurance API Connection
                  </button>
                </div>

                {/* Proactive Alert Preferences Link */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#F59E0B]" />
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{t.alerts}</div>
                      <div className="text-[10px] text-slate-500">
                        {proactiveAlertsEnabled ? 'Active (Discrepancies & FSA)' : 'Paused'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAccountModal(false);
                      setShowAlertsModal(true);
                    }}
                    className="px-2.5 py-1 bg-[#0F172A] text-white hover:bg-slate-800 text-[10px] font-bold rounded-lg transition"
                  >
                    Configure
                  </button>
                </div>

                {/* Quick Switch Judge Demo Persona */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Switch Demo Persona (Judge Presentation):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'maria' as const, label: 'Maria (PPO)', icon: '👵' },
                      { key: 'ana' as const, label: 'Ana (Medicaid)', icon: '🤱' },
                      { key: 'joe' as const, label: 'Joe (Medicare)', icon: '👴' },
                    ].map((p) => (
                      <button
                        key={p.key}
                        onClick={() => {
                          handleSelectDemoPersona(p.key);
                          setShowAccountModal(false);
                        }}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                          activePersonaKey === p.key
                            ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5] font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-sm">{p.icon}</span>
                        <span className="text-[10px] truncate max-w-full">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 4: PROACTIVE ALERT SYSTEM SETTINGS */}
        {/* ===================================================================== */}
        {showAlertsModal && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-xs max-h-[88vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">Proactive Alert System</h3>
                    <p className="text-[10px] text-slate-400">Automatic Savings & Discrepancy Monitoring</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="text-slate-400 hover:text-[#0F172A] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Beni continuously audits incoming claims, hospital bills, and NY state benefit deadlines to protect your wallet before charges go to collections or deadlines expire.
                </p>

                {/* Master Switch */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#0F172A]">Enable Proactive Alerts</div>
                    <div className="text-[10px] text-slate-500">Master push & in-app notification switch</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProactiveAlertsEnabled(!proactiveAlertsEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      proactiveAlertsEnabled ? 'bg-[#4F46E5]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        proactiveAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sub-Alert Options */}
                <div className={`space-y-2 ${!proactiveAlertsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#0F172A] flex items-center gap-1.5">
                        <span>🚨 Duplicate & Coding Discrepancies</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Alerts when hospital bill exceeds contract rate</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={billDiscrepancyAlerts}
                      onChange={(e) => setBillDiscrepancyAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">⏳ Expiring FSA & Benefit Deadlines</div>
                      <div className="text-[10px] text-slate-500">Warns 30 days before "use-it-or-lose-it" forfeit</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={fsaExpirationAlerts}
                      onChange={(e) => setFsaExpirationAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">📋 Annual Recertification Reminders</div>
                      <div className="text-[10px] text-slate-500">Medicaid / Essential Plan annual renewal alerts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={annualRecertAlerts}
                      onChange={(e) => setAnnualRecertAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">💬 SMS Text Push Alerts</div>
                      <div className="text-[10px] text-slate-500">Send high-priority notifications to your mobile phone</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlertsEnabled}
                      onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                      className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Quiet Hours Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-[11px] text-slate-600 flex items-center gap-2">
                  <span className="text-sm">🌙</span>
                  <div>
                    <strong>NYC Quiet Hours Active:</strong> 10:00 PM – 8:00 AM.
                    <div className="text-[10px] text-slate-400">Non-emergency notifications are held until morning.</div>
                  </div>
                </div>

                {/* Interactive Demo Test Trigger */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#4F46E5]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Demonstration Trigger</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Test the proactive alert engine right now. It simulates an incoming discrepancy detection event.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleTriggerTestAlert();
                      setShowAlertsModal(false);
                    }}
                    className="w-full py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Simulate Live Alert Now
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAlertsModal(false)}
                  className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-xs transition"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 5: CMS INTEROPERABILITY & FHIR PATIENT ACCESS API */}
        {/* ===================================================================== */}
        {showApiConnectModal && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-xs max-h-[88vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-[#4F46E5] flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">Insurance API Connect</h3>
                    <p className="text-[10px] text-slate-400">CMS-9115-F Interoperability Protocol</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApiConnectModal(false)}
                  className="text-slate-400 hover:text-[#0F172A] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600 leading-relaxed space-y-1">
                  <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>HL7® FHIR® R4 Direct Patient Access</span>
                  </div>
                  <p>
                    Federal law mandates health insurers to provide automated FHIR API access to your claims, formulary, and Explanation of Benefits (EOB).
                  </p>
                </div>

                {/* Insurer Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#0F172A] block">
                    Select Your Health Plan / Gateway:
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Fidelis Care / CMS Interoperability FHIR', sub: 'Medicaid & Qualified Health Plans' },
                      { name: 'MetroPlusHealth Plan FHIR Gateway', sub: 'NYC Essential & Community Plans' },
                      { name: 'NY State of Health (NYSOH) Marketplace', sub: 'Official New York State Exchange' },
                      { name: 'Blue Cross Blue Shield of Western NY', sub: 'Commercial & Employer PPO/EPO' },
                      { name: 'CMS Medicare Blue Button 2.0 API', sub: 'Federal Medicare Parts A, B, & D' },
                    ].map((ins) => (
                      <button
                        key={ins.name}
                        type="button"
                        onClick={() => setSelectedInsurer(ins.name)}
                        className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          selectedInsurer.startsWith(ins.name.split(' ')[0])
                            ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                            : 'bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-xs truncate">{ins.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{ins.sub}</div>
                        </div>
                        {selectedInsurer.startsWith(ins.name.split(' ')[0]) && (
                          <Check className="w-4 h-4 text-[#4F46E5] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Sync Status Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Live Interoperability Status</span>
                    {apiSyncState === 'synced' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Token Active
                      </span>
                    )}
                  </div>

                  {apiSyncState === 'authorizing' && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      <span>Authenticating SMART-on-FHIR OAuth token...</span>
                    </div>
                  )}

                  {apiSyncState === 'fetching' && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      <span>Querying ExplanationOfBenefit & Coverage bundles...</span>
                    </div>
                  )}

                  {apiSyncState === 'synced' && (
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div>✓ <strong>FHIR Endpoint:</strong> https://fhir.nybenefits.gov/r4</div>
                      <div>✓ <strong>Resources Ingested:</strong> Patient, Coverage, 4 ExplanationOfBenefits</div>
                      <div>✓ <strong>Discrepancies Detected:</strong> 1 duplicate hospital charge ($475.00)</div>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Claims automatically re-audited whenever new hospital bills are uploaded.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowApiConnectModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={apiSyncState === 'authorizing' || apiSyncState === 'fetching'}
                  onClick={() => handleSyncFhirApi(selectedInsurer)}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${apiSyncState !== 'synced' ? 'animate-spin' : ''}`} />
                  {apiSyncState === 'authorizing' || apiSyncState === 'fetching'
                    ? 'Syncing FHIR API...'
                    : 'Re-sync API Live'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
