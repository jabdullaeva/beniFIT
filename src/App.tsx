import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Calendar,
  Receipt,
  MessageSquare,
  Globe,
  Shield,
  Briefcase,
  ExternalLink,
  Check,
  ArrowLeft,
  LogOut,
  Lock,
  Edit3,
  Bell,
  CreditCard,
  Stethoscope,
  Send,
  X,
  Copy,
  Mail,
  Phone,
  Sparkles,
  Wifi,
  CheckCircle,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { BeniMascot, BeniExpression } from './components/BeniMascot.tsx';
import { TRANSLATIONS, SupportedLang, Translations } from './lib/translations.ts';
import { DoctorFinder } from './components/DoctorFinder.tsx';
import { DigitalWallet } from './components/DigitalWallet.tsx';
import { getLocalizedPersona, FindingItem } from './lib/localizedPersonas.ts';

export type ScreenId = 'connect' | 'found' | 'planner' | 'bills' | 'doctors' | 'chat' | 'language';

export default function App() {
  // Authentication & Login Gate
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('maria@demo.benifit');
  const [loginPassword, setLoginPassword] = useState('beni2026');
  const [loginError, setLoginError] = useState('');

  // Verified Income & Household state (Beni NEVER assumes income!)
  const [hasVerifiedIncomeAndDocs, setHasVerifiedIncomeAndDocs] = useState(false);
  const [showIncomeEditModal, setShowIncomeEditModal] = useState(false);
  const [userMonthlyIncome, setUserMonthlyIncome] = useState<number>(4200);
  const [userHouseholdSize, setUserHouseholdSize] = useState<number>(1);
  const [userZip, setUserZip] = useState<string>('11201');

  // Screen & Language State
  const [activeScreen, setActiveScreen] = useState<ScreenId>('connect');
  const [lang, setLang] = useState<SupportedLang>('en');
  const t: Translations = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Active persona
  const [activePersonaKey, setActivePersonaKey] = useState<'maria' | 'ana' | 'joe'>('maria');
  const persona = getLocalizedPersona(activePersonaKey, lang);

  // Planner filter tab
  const [plannerFilter, setPlannerFilter] = useState<'all' | 'may_qualify' | 'confirmed'>('all');
  const [plannerText, setPlannerText] = useState('');
  const [userPlannerItems, setUserPlannerItems] = useState<Array<{ id: string; text: string; date: string }>>([]);

  // Detail Modal (for Bill Check View Details or Finding details)
  const [selectedBillFinding, setSelectedBillFinding] = useState<FindingItem | null>(null);
  const [showBillDisputeModal, setShowBillDisputeModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // My Account Profile Modal
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Proactive Alert System & Real SMS Delivery Simulation
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [proactiveAlertsEnabled, setProactiveAlertsEnabled] = useState(true);
  const [billDiscrepancyAlerts, setBillDiscrepancyAlerts] = useState(true);
  const [fsaExpirationAlerts, setFsaExpirationAlerts] = useState(true);
  const [annualRecertAlerts, setAnnualRecertAlerts] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [userPhoneNumber, setUserPhoneNumber] = useState('(718) 555-0198');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSentSuccessMsg, setSmsSentSuccessMsg] = useState('');

  // Simulated Push Notification Banner (like an iOS / Android lockscreen SMS banner)
  const [incomingSmsBanner, setIncomingSmsBanner] = useState<{
    header: string;
    sender: string;
    message: string;
    onTap: () => void;
  } | null>(null);

  // CMS Interoperability FHIR Sync state
  const [showApiConnectModal, setShowApiConnectModal] = useState(false);
  const [apiSyncState, setApiSyncState] = useState<'idle' | 'authorizing' | 'fetching' | 'synced'>('synced');
  const [lastApiSyncedAt, setLastApiSyncedAt] = useState('Just now');
  const [selectedInsurer, setSelectedInsurer] = useState('Fidelis Care / CMS Interoperability FHIR');

  // Bill Check Screen Tab ('discrepancies' | 'wallet')
  const [billsActiveTab, setBillsActiveTab] = useState<'discrepancies' | 'wallet'>('discrepancies');

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

  // Audio chime for text alert delivery
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio muted or unsupported
    }
  };

  // Reset chat welcome when persona or language changes
  useEffect(() => {
    setChatMessages([
      {
        role: 'beni',
        text:
          lang === 'es'
            ? `¡Hola ${persona.name}! Soy Beni, tu asistente de beneficios de salud. Revisé tus documentos subidos y tu ingreso verificado de $${userMonthlyIncome.toLocaleString()}. Encontré posibles ahorros y cobros duplicados. ¿En qué te puedo ayudar hoy?`
            : lang === 'fr'
            ? `Bonjour ${persona.name} ! Je suis Beni, votre assistant pour vos droits de santé. J'ai analysé vos documents et vos revenus de $${userMonthlyIncome.toLocaleString()}. Comment puis-je vous aider aujourd'hui ?`
            : lang === 'uk'
            ? `Привіт, ${persona.name}! Я Бені, ваш помічник із медичних пільг. Я перевірив ваші документи та дохід $${userMonthlyIncome.toLocaleString()}. Чим можу допомогти сьогодні?`
            : `Hi ${persona.name}! I'm Beni, your AI health-benefits assistant. I reviewed your uploaded documents and your verified monthly income of $${userMonthlyIncome.toLocaleString()}. What can I help you with today?`,
        expression: 'default',
      },
    ]);
  }, [persona.id, lang, userMonthlyIncome]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Handle Login Submission
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError(lang === 'es' ? 'Por favor ingresa tu correo.' : 'Please enter your email or phone number.');
      return;
    }

    if (loginPassword !== 'beni2026' && loginPassword.length < 4) {
      setLoginError(lang === 'es' ? 'Contraseña incorrecta. La contraseña de prueba es: beni2026' : 'Incorrect password. Demo password is: beni2026');
      return;
    }

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
    const p = getLocalizedPersona(pKey, lang);
    setUserMonthlyIncome(p.incomeMonthly);
    setUserHouseholdSize(p.householdSize);
    setUserZip(p.location.split(' ')[1] || '11201');
    setIsLoggedIn(true);
    setActiveScreen('connect');
    setHasVerifiedIncomeAndDocs(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasVerifiedIncomeAndDocs(false);
    setActiveScreen('connect');
  };

  // Trigger Real / Simulated SMS Alert via /api/sms/send-alert
  const handleSendRealSmsAlert = async () => {
    setIsSendingSms(true);
    setSmsSentSuccessMsg('');

    try {
      const res = await fetch('/api/sms/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhoneNumber,
          alertType: 'bill',
          amount: persona.mriBill.discrepancy,
          providerName: persona.mriBill.providerName,
          patientName: persona.name,
          message: `beniFIT Alert: Potential $${persona.mriBill.discrepancy.toFixed(0)} duplicate charge found from ${persona.mriBill.providerName}. Tap to review draft dispute.`,
        }),
      });
      await res.json();
      setSmsSentSuccessMsg(t.smsSuccessNotice);
      playAlertChime();

      setIncomingSmsBanner({
        header: t.smsMessagesNow,
        sender: t.smsIncomingHeader,
        message: `🚨 ${persona.mriBill.providerName}: $${persona.mriBill.discrepancy.toFixed(0)} duplicate billing detected. ${t.smsTapToReview}`,
        onTap: () => {
          setSelectedBillFinding(persona.findings.find((f) => f.type === 'confirmed') || null);
          setShowBillDisputeModal(true);
          setIncomingSmsBanner(null);
        },
      });
    } catch {
      setSmsSentSuccessMsg(t.smsSuccessNotice);
      playAlertChime();
      setIncomingSmsBanner({
        header: t.smsMessagesNow,
        sender: t.smsIncomingHeader,
        message: `🚨 ${persona.mriBill.providerName}: $${persona.mriBill.discrepancy.toFixed(0)} duplicate billing detected. ${t.smsTapToReview}`,
        onTap: () => {
          setSelectedBillFinding(persona.findings.find((f) => f.type === 'confirmed') || null);
          setShowBillDisputeModal(true);
          setIncomingSmsBanner(null);
        },
      });
    } finally {
      setIsSendingSms(false);
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
        setLastApiSyncedAt('Just now');
      }, 1200);
    }, 1000);
  };

  // Send Chat with Server-side Gemini API Integration
  const handleSendChat = async (presetText?: string) => {
    const text = presetText || chatInput;
    if (!text.trim() || chatLoading) return;

    setChatInput('');
    setChatLoading(true);

    const userMsg = { role: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ask-beni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lang,
          userContext: {
            userName: persona.name,
            coverageName: persona.coverageName,
            monthlyIncome: userMonthlyIncome,
            location: persona.location,
            householdSize: userHouseholdSize,
            memberId: persona.memberId,
            findings: persona.findings,
            mriBill: persona.mriBill,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'beni',
          text: data.reply || data.text,
          source: data.source,
          actionLabel: data.actionLabel,
          actionScreen: data.actionScreen,
          expression: (data.expression as BeniExpression) || 'default',
        },
      ]);
    } catch {
      // Local fallback in target language
      const fallbackText =
        lang === 'es'
          ? `Beni revisó tus documentos de ${persona.coverageName}. Encontré un ahorro potencial total de $${persona.totalSavings.toLocaleString()}, con $${persona.confirmedTotal.toLocaleString()} confirmados en tus facturas médicas.`
          : lang === 'fr'
          ? `Beni a consulté vos documents de ${persona.coverageName}. Total d'économies identifiées : $${persona.totalSavings.toLocaleString()}.`
          : lang === 'uk'
          ? `Бені перевірив ваші документи для ${persona.coverageName}. Загальна знайдена економія: $${persona.totalSavings.toLocaleString()}.`
          : `Beni checked your documents for ${persona.coverageName}. Total potential savings found: $${persona.totalSavings.toLocaleString()}.`;

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'beni',
          text: fallbackText,
          source: `${persona.coverageName} + NY Benefits Database`,
          expression: 'default',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
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
              {t.loginTagline}
            </p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {t.loginSub}
            </p>
          </div>

          {/* Language Selector on Login */}
          <div className="flex justify-center gap-1.5 pt-1">
            {[
              { code: 'en' as const, flag: '🌐', label: 'EN' },
              { code: 'es' as const, flag: '🇪🇸', label: 'ES' },
              { code: 'fr' as const, flag: '🇫🇷', label: 'FR' },
              { code: 'uk' as const, flag: '🇺🇦', label: 'UK' },
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition flex items-center gap-1 ${
                  lang === l.code
                    ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5]'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          {/* 1-Click Demo Logins */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              {t.loginDemoProfiles}
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
                <span className="text-xs font-bold text-[#4F46E5]">→</span>
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
                <span className="text-xs font-bold text-[#4F46E5]">→</span>
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
                <span className="text-xs font-bold text-[#4F46E5]">→</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold text-[10px]">
                {t.loginOrEmail}
              </span>
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
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                {t.loginEmailOrPhone}
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="maria@demo.benifit"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1">
                {t.loginPassword}
              </label>
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
              {t.loginSignInBtn}
            </button>
          </form>

          {/* Privacy & Zero Assumption Notice */}
          <div className="text-[11px] text-slate-400 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[#065F46] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>{t.loginZeroAssumptions}</span>
            </div>
            <div>
              {t.loginDemoPasswordNotice}{' '}
              <code className="font-mono text-[#0F172A] font-bold">beni2026</code>
            </div>
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
              {t.incomeHeaderLabel} <strong>${userMonthlyIncome.toLocaleString()}{t.monthSuffix}</strong>
            </span>
          </div>
          <button
            onClick={() => setShowIncomeEditModal(true)}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#FDE68A] text-[#92400E] hover:bg-amber-100 transition shrink-0 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            {t.editIncomeBtn}
          </button>
        </div>

        {/* TOP APP HEADER */}
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
            {/* Language Quick Toggle */}
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

            {/* My Account Profile Button */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition group text-left"
              title="My Account"
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

        {/* REALISTIC PUSH / SMS NOTIFICATION BANNER (Simulated Lockscreen Toast) */}
        {incomingSmsBanner && (
          <div className="bg-[#0F172A] text-white border-b-2 border-[#4F46E5] p-3 shadow-xl animate-in slide-in-from-top duration-300 z-30 cursor-pointer"
            onClick={incomingSmsBanner.onTap}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {incomingSmsBanner.header}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 truncate">
                      {incomingSmsBanner.sender}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-0.5 leading-snug">
                    {incomingSmsBanner.message}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIncomingSmsBanner(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
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
                        {t.step1IncomeTitle}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#065F46] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      {t.step1RequiredBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    {t.step1IncomePrompt}
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
                      <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">{t.monthSuffix}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">{t.householdSizeLabel}</label>
                        <select
                          value={userHouseholdSize}
                          onChange={(e) => setUserHouseholdSize(parseInt(e.target.value, 10))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 font-bold"
                        >
                          <option value={1}>1 {t.personSingle}</option>
                          <option value={2}>2 {t.peoplePlural}</option>
                          <option value={3}>3 {t.peoplePlural}</option>
                          <option value={4}>4 {t.peoplePlural}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">{t.nyZipLabel}</label>
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

                {/* 3 Upload / Connect Tiles */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {t.step2ConnectTitle}
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
                          <span>{t.cmsInteroperabilityTitle}</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-indigo-600 text-white rounded">
                            FHIR R4
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{t.cmsInteroperabilitySub} ({lastApiSyncedAt})</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-white text-[#4F46E5] border border-indigo-200 rounded-lg shadow-2xs">
                      {t.syncApiBtn}
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
                          ✓ {persona.coverageName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {persona.claimsCount} {t.claimsCountLabel}
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
                          ✓ Brightway_2027_Benefits_Guide.pdf
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
                          ✓ 1 bill audited ({persona.mriBill.providerName})
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-bold">
                      {t.auditedFlaggedLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setHasVerifiedIncomeAndDocs(true);
                    setActiveScreen('found');
                  }}
                  className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{t.verifyAndContinueBtn}</span>
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

              {/* TWO SEPARATED CATEGORY CARDS */}
              <div className="grid grid-cols-2 gap-3">
                {/* May Qualify Card */}
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

                {/* Confirmed Card */}
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

              {/* Bottom Safety Disclaimer */}
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

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPlannerFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    plannerFilter === 'all'
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.filterAll}
                </button>
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

              {/* Cards List */}
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
                    placeholder={t.plannerPlaceholder}
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

              {/* Sub-tab toggle */}
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
                  <span>{t.tabDiscrepancies}</span>
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
                  <span>{t.tabWallet}</span>
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
                  t={t}
                />
              ) : (
                <div className="space-y-4">
                  {/* Bill Check Card */}
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
                      <span>{t.nyBalanceLawTitle}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {t.nyBalanceLawDesc}
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
                t={t}
                onZipChange={(newZip) => setUserZip(newZip)}
              />
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* SCREEN 6: ASK BENI (Chat with Visible Source Citations & Gemini AI) */}
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

                      {msg.source && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="font-semibold text-slate-700">{t.sourcesLabel}</span> {msg.source}
                        </div>
                      )}

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
                    <span>{t.readingDocsText}</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  onClick={() => handleSendChat(t.chipMriBill)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs font-semibold"
                >
                  {t.chipMriBill}
                </button>
                <button
                  onClick={() => handleSendChat(t.chipWhatMissing)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs font-semibold"
                >
                  {t.chipWhatMissing}
                </button>
                <button
                  onClick={() => handleSendChat(t.chipFoodHelp)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap text-[#0F172A] shadow-2xs font-semibold"
                >
                  {t.chipFoodHelp}
                </button>
                <button
                  onClick={() => handleSendChat('Can I take my blood pressure pills with grapefruit?')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-red-200 text-red-700 rounded-full whitespace-nowrap shadow-2xs font-semibold"
                >
                  {t.chipSafetyTest}
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
                />
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
          {/* SCREEN 7: LANGUAGE TOGGLE */}
          {/* ----------------------------------------------------------------- */}
          {activeScreen === 'language' && (
            <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
              <div className="space-y-6 text-center">
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
        {/* BOTTOM NAVIGATION TABS */}
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
                  <h3 className="font-bold text-sm text-[#0F172A]">{t.updateIncomeTitle}</h3>
                </div>
                <button
                  onClick={() => setShowIncomeEditModal(false)}
                  className="text-slate-400 hover:text-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t.step1IncomePrompt}
              </p>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">
                    {t.monthlyIncomeBeforeTaxes}
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
                    <label className="font-bold text-[#0F172A] block mb-1">{t.householdSizeLabel}</label>
                    <select
                      value={userHouseholdSize}
                      onChange={(e) => setUserHouseholdSize(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    >
                      <option value={1}>1 {t.personSingle}</option>
                      <option value={2}>2 {t.peoplePlural}</option>
                      <option value={3}>3 {t.peoplePlural}</option>
                      <option value={4}>4 {t.peoplePlural}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">{t.nyZipLabel}</label>
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
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIncomeEditModal(false);
                    setActiveScreen('found');
                  }}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  {t.recalculateSavingsBtn}
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
                  <h3 className="font-bold text-sm text-[#0F172A]">{t.mriChargeTitle} {t.disputeModalHeader}</h3>
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
                    <span className="text-slate-500">{t.providerBilledLabel}</span>
                    <span className="font-bold text-[#0F172A]">${persona.mriBill.billed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.insuranceShareLabel}</span>
                    <span className="font-bold text-[#10B981]">${persona.mriBill.patientOwedPerPlan.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="font-bold text-[#EF4444]">{t.duplicateDiscrepancyLabel}</span>
                    <span className="font-black text-[#EF4444]">${persona.mriBill.discrepancy.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>{t.findingsLabel}</strong> {persona.mriBill.errorSummary}
                </div>

                <div className="text-[10px] text-slate-400">
                  <strong>{t.sourceDocumentsLabel}</strong> {persona.mriBill.source}
                </div>

                {/* Drafted Letter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      {t.draftedDisputeLetterLabel}
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
        {/* MODAL 3: MY ACCOUNT & COVERAGE PROFILE */}
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
                    <p className="text-[10px] text-slate-400">{t.accountCoverageProfile}</p>
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
                      {t.activeMemberBadge}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-100/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.memberIdLabel}:</span>
                      <span className="font-mono font-bold text-[#0F172A]">{persona.memberId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.groupNumLabel}:</span>
                      <span className="font-mono font-bold text-[#0F172A]">{persona.groupNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.nyZipLabel}:</span>
                      <span className="font-bold text-[#0F172A]">{userZip} (NYC)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t.householdSizeLabel}:</span>
                      <span className="font-bold text-[#0F172A]">{userHouseholdSize} {userHouseholdSize === 1 ? t.personSingle : t.peoplePlural}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Household Income */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                      <Shield className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{t.verifiedHouseholdIncomeTitle}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAccountModal(false);
                        setShowIncomeEditModal(true);
                      }}
                      className="text-[10px] font-bold text-[#92400E] hover:underline flex items-center gap-0.5"
                    >
                      <Edit3 className="w-3 h-3" />
                      {t.editIncomeBtn}
                    </button>
                  </div>
                  <div className="text-xl font-black text-[#0F172A]">
                    ${userMonthlyIncome.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> {t.monthSuffix}</span>
                  </div>
                  <p className="text-[10px] text-[#92400E]/90 leading-tight">
                    {t.incomeNoGuessNotice}
                  </p>
                </div>

                {/* CMS Interoperability Connection Status */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                      <Wifi className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>{t.cmsInteroperabilityTitle}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-600 text-white rounded">
                      {t.tokenActiveBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Insurer: <strong className="text-slate-700">{selectedInsurer.split('/')[0]}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t.lastAutoSyncLabel} {lastApiSyncedAt}
                  </div>
                  <button
                    onClick={() => {
                      setShowAccountModal(false);
                      setShowApiConnectModal(true);
                    }}
                    className="w-full py-1.5 bg-white border border-slate-200 hover:border-[#4F46E5] text-[#4F46E5] font-bold rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t.manageApiConnectionBtn}
                  </button>
                </div>

                {/* Proactive Alert Preferences Link */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#F59E0B]" />
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{t.alertPrefsLabel}</div>
                      <div className="text-[10px] text-slate-500">
                        {proactiveAlertsEnabled ? t.alertsActiveStatus : t.alertsPausedStatus}
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
                    {t.configureBtn}
                  </button>
                </div>

                {/* Quick Switch Demo Persona */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.switchJudgePersona}
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
                  {t.logOutBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  {t.doneBtn}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 4: PROACTIVE ALERT SYSTEM & REAL SMS DISPATCH */}
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
                    <h3 className="font-bold text-sm text-[#0F172A]">{t.alertsModalTitle}</h3>
                    <p className="text-[10px] text-slate-400">{t.alertsModalSub}</p>
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
                  {t.alertsIntroDesc}
                </p>

                {/* Master Switch */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#0F172A]">{t.enableAlertsMaster}</div>
                    <div className="text-[10px] text-slate-500">{t.enableAlertsMasterSub}</div>
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
                      <div className="font-bold text-xs text-[#0F172A]">{t.alertTypeDuplicate}</div>
                      <div className="text-[10px] text-slate-500">{t.alertTypeDuplicateSub}</div>
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
                      <div className="font-bold text-xs text-[#0F172A]">{t.alertTypeFsa}</div>
                      <div className="text-[10px] text-slate-500">{t.alertTypeFsaSub}</div>
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
                      <div className="font-bold text-xs text-[#0F172A]">{t.alertTypeRenewal}</div>
                      <div className="text-[10px] text-slate-500">{t.alertTypeRenewalSub}</div>
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
                      <div className="font-bold text-xs text-[#0F172A]">{t.alertTypeSms}</div>
                      <div className="text-[10px] text-slate-500">{t.alertTypeSmsSub}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlertsEnabled}
                      onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                      className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Real SMS Phone Number Input & Test Dispatch */}
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#4F46E5]">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.smsPhoneInputLabel}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {t.smsPhoneInputSub}
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="tel"
                      value={userPhoneNumber}
                      onChange={(e) => setUserPhoneNumber(e.target.value)}
                      placeholder="(718) 555-0198"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    />
                    <button
                      type="button"
                      disabled={isSendingSms}
                      onClick={handleSendRealSmsAlert}
                      className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      {isSendingSms ? t.smsSendingBtn : t.smsSendTestBtn}
                    </button>
                  </div>
                  {smsSentSuccessMsg && (
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-1.5 text-center animate-in fade-in">
                      {smsSentSuccessMsg}
                    </div>
                  )}
                </div>

                {/* Quiet Hours Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-[11px] text-slate-600 flex items-center gap-2">
                  <span className="text-sm">🌙</span>
                  <div>
                    <strong>{t.quietHoursTitle}</strong> {t.quietHoursSub}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAlertsModal(false)}
                  className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-xs transition"
                >
                  {t.savePreferencesBtn}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 5: CMS INTEROPERABILITY & FHIR API */}
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
                    <h3 className="font-bold text-sm text-[#0F172A]">{t.apiConnectHeader}</h3>
                    <p className="text-[10px] text-slate-400">{t.cmsProtocolSub}</p>
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
                    <span>{t.fhirProtocolTitle}</span>
                  </div>
                  <p>
                    {t.fhirProtocolDesc}
                  </p>
                </div>

                {/* Insurer Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#0F172A] block">
                    {t.selectHealthPlanPrompt}
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
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t.liveInteroperabilityStatus}</span>
                    {apiSyncState === 'synced' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {t.tokenActiveBadge}
                      </span>
                    )}
                  </div>

                  {apiSyncState === 'authorizing' && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      <span>{t.authSmartFhir}</span>
                    </div>
                  )}

                  {apiSyncState === 'fetching' && (
                    <div className="flex items-center gap-2 text-xs text-indigo-700 py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4F46E5]" />
                      <span>{t.queryingBundlesStatus}</span>
                    </div>
                  )}

                  {apiSyncState === 'synced' && (
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div>✓ <strong>FHIR Endpoint:</strong> https://fhir.nybenefits.gov/r4</div>
                      <div>✓ <strong>Resources Ingested:</strong> Patient, Coverage, 4 ExplanationOfBenefits</div>
                      <div>✓ <strong>Discrepancies Detected:</strong> 1 duplicate hospital charge (${persona.mriBill.discrepancy.toFixed(2)})</div>
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
                  {t.closeBtn}
                </button>
                <button
                  type="button"
                  disabled={apiSyncState === 'authorizing' || apiSyncState === 'fetching'}
                  onClick={() => handleSyncFhirApi(selectedInsurer)}
                  className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${apiSyncState !== 'synced' ? 'animate-spin' : ''}`} />
                  {t.resyncApiLiveBtn}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
