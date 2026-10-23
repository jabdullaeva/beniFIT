import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  QrCode,
  Copy,
} from 'lucide-react';
import { Translations } from '../lib/translations.ts';

interface DigitalWalletProps {
  userName: string;
  coverageName: string;
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
  fsaBalance?: number;
  fsaExpires?: string;
  t: Translations;
}

export const DigitalWallet: React.FC<DigitalWalletProps> = ({
  userName,
  coverageName,
  memberId,
  groupNumber,
  rxBin,
  rxPcn,
  rxGroup,
  copays,
  deductible,
  fsaBalance,
  fsaExpires,
  t,
}) => {
  const [showBarcode, setShowBarcode] = useState(false);
  const [showFsaDetails, setShowFsaDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (val: string, fieldName: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const deductiblePercent = Math.min(
    100,
    deductible.total > 0 ? Math.round((deductible.met / deductible.total) * 100) : 100
  );

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------- */}
      {/* 1. PRIMARY HEALTH INSURANCE MEMBER CARD (Sleek Deep Navy Card) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative rounded-3xl bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#312E81] text-white p-5 shadow-xl border border-slate-700 overflow-hidden space-y-4">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full bg-indigo-500/10 pointer-events-none" />

        {/* Card Top: Carrier & Chip */}
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.digitalIdBadge}</span>
            </div>
            <h3 className="text-base font-black text-white tracking-tight mt-0.5">
              {coverageName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Contactless waves SVG */}
            <svg
              className="w-5 h-5 text-indigo-300/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8.5 16.5a5 5 0 0 1 0-9" />
              <path d="M12 19a8.5 8.5 0 0 0 0-14" />
            </svg>
            <div className="w-8 h-6 rounded-md bg-linear-to-tr from-amber-300 to-amber-100 border border-amber-400/50 flex items-center justify-center shadow-inner">
              <div className="w-5 h-3.5 border border-amber-600/40 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Member Name & Member ID */}
        <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.memberNameLabel}
            </span>
            <span className="text-sm font-black text-white tracking-wide block truncate">
              {userName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.memberIdLabel}
            </span>
            <button
              onClick={() => handleCopy(memberId, 'memberId')}
              className="font-mono text-sm font-black text-amber-300 hover:text-amber-200 transition inline-flex items-center gap-1 ml-auto"
              title="Click to copy"
            >
              <span>{memberId}</span>
              {copiedField === 'memberId' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-indigo-300 opacity-60" />
              )}
            </button>
          </div>
        </div>

        {/* Pharmacy (Rx) Specs in Clean Badges */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-2.5 grid grid-cols-3 gap-2 text-center border border-white/10">
          <div>
            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider block">
              {t.rxBinLabel}
            </span>
            <span className="font-mono text-xs font-black text-white">{rxBin}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider block">
              {t.rxPcnLabel}
            </span>
            <span className="font-mono text-xs font-black text-white">{rxPcn}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-wider block">
              {t.groupNumLabel}
            </span>
            <span className="font-mono text-xs font-black text-white">{groupNumber}</span>
          </div>
        </div>

        {/* Clean Copays Row (Clean Numbers Without Clutter) */}
        <div className="relative z-10 grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-slate-800/80 rounded-xl p-1.5 border border-slate-700">
            <span className="text-[9px] text-slate-400 block font-medium truncate">{t.pcpCopayLabel}</span>
            <span className="text-xs font-black text-white">{copays.pcp}</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-1.5 border border-slate-700">
            <span className="text-[9px] text-slate-400 block font-medium truncate">{t.specialistCopayLabel}</span>
            <span className="text-xs font-black text-white">{copays.specialist}</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-1.5 border border-slate-700">
            <span className="text-[9px] text-slate-400 block font-medium truncate">{t.genericRxCopayLabel}</span>
            <span className="text-xs font-black text-white">{copays.genericRx}</span>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-1.5 border border-slate-700">
            <span className="text-[9px] text-slate-400 block font-medium truncate">{t.erCopayLabel}</span>
            <span className="text-xs font-black text-white">{copays.er}</span>
          </div>
        </div>

        {/* Deductible Progress Bar */}
        {deductible.total > 0 && (
          <div className="relative z-10 space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-300">
                {t.deductibleLabel} ${deductible.met} / ${deductible.total}
              </span>
              <span className="text-amber-300">{deductiblePercent}% {t.deductibleMetLabel}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${deductiblePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Barcode / QR toggle */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowBarcode(!showBarcode)}
            className="text-[11px] font-bold text-indigo-300 hover:text-white transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>{showBarcode ? t.hideClinicCode : t.showClinicCode}</span>
          </button>
          <span className="text-[9px] text-slate-400 font-semibold">
            {t.tapToScan}
          </span>
        </div>

        {/* Simulated Barcode / QR Display */}
        {showBarcode && (
          <div className="relative z-10 bg-white rounded-2xl p-4 text-center space-y-2 text-[#0F172A] shadow-inner">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {t.receptionScannerCode}
            </div>
            {/* Visual Barcode stripes */}
            <div className="h-12 flex items-center justify-center gap-1 py-1">
              {[4, 2, 6, 2, 8, 3, 2, 5, 2, 4, 7, 2, 3, 6, 2, 4, 5, 2, 8, 3, 4].map(
                (w, i) => (
                  <div
                    key={i}
                    className="bg-[#0F172A] h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                )
              )}
            </div>
            <div className="font-mono text-xs font-black tracking-widest text-slate-700">
              *{memberId}*
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DIGITAL FSA / UNSPENT BENEFITS CARD (Golden Amber Palette) */}
      {/* ------------------------------------------------------------- */}
      {typeof fsaBalance === 'number' && fsaBalance > 0 && (
        <div className="rounded-3xl bg-linear-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] text-white p-5 shadow-lg border border-amber-300/40 relative overflow-hidden space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 text-amber-100 text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.fsaCardTitle}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                ${fsaBalance.toFixed(2)}
              </div>
              <div className="text-[11px] text-amber-100 font-medium">
                {t.fsaAvailableBalance}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold text-amber-200 uppercase tracking-wider block">
                {t.fsaExpiresLabel}
              </span>
              <span className="text-xs font-black text-white bg-amber-900/40 px-2 py-0.5 rounded-md inline-block">
                {fsaExpires || 'Dec 31, 2027'}
              </span>
            </div>
          </div>

          <div className="bg-black/15 rounded-2xl p-2.5 flex items-center justify-between text-xs">
            <span className="font-mono text-xs font-bold tracking-wider">
              •••• •••• •••• 4821
            </span>
            <button
              onClick={() => setShowFsaDetails(!showFsaDetails)}
              className="text-[10px] font-bold text-white underline hover:opacity-80 flex items-center gap-0.5"
            >
              {showFsaDetails ? t.fsaHideItems : t.fsaWhatCanIBuy}
              {showFsaDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showFsaDetails && (
            <div className="bg-white/95 rounded-2xl p-3 text-xs text-[#0F172A] space-y-1.5 shadow-sm">
              <div className="font-bold text-[11px] text-[#92400E]">
                {t.fsaEligibleTitle}
              </div>
              <ul className="grid grid-cols-2 gap-1 text-[10px] text-slate-700">
                <li>• {t.fsaItem1}</li>
                <li>• {t.fsaItem2}</li>
                <li>• {t.fsaItem3}</li>
                <li>• {t.fsaItem4}</li>
                <li>• {t.fsaItem5}</li>
                <li>• {t.fsaItem6}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
