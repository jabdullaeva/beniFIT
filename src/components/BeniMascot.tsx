import React from 'react';

export type BeniExpression =
  | 'default'
  | 'waving'
  | 'may_qualify'
  | 'confirmed'
  | 'warning'
  | 'thinking'
  | 'not_sure';

interface MascotProps {
  className?: string;
  size?: number;
  expression?: BeniExpression;
}

export const BeniMascot: React.FC<MascotProps> = ({
  className = '',
  size = 56,
  expression = 'default',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label={`Beni AI Assistant (${expression})`}
    >
      <defs>
        {/* Warm Golden Yellow Gradient (from Brand Board) */}
        <linearGradient id="beniGold" x1="20" y1="20" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="0.6" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>

        {/* Soft Inner Shadow */}
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D97706" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Golden-Yellow Cloud Body (Reference Board Mascot) */}
      <path
        d="M32 46C24 46 16 54 16 66C16 78 26 88 38 90C44 94 54 96 66 94C76 96 88 92 94 84C102 82 108 72 106 60C104 48 94 42 84 42C82 32 72 24 60 25C48 26 38 34 32 46Z"
        fill="url(#beniGold)"
        filter="url(#softGlow)"
      />

      {/* Rosy Cheeks */}
      <circle cx="40" cy="65" r="5.5" fill="#F97316" opacity="0.45" />
      <circle cx="76" cy="65" r="5.5" fill="#F97316" opacity="0.45" />

      {/* EYES & FACE DEPENDING ON EXPRESSION */}
      {expression === 'thinking' ? (
        <>
          {/* Eyes looking up/curious */}
          <ellipse cx="46" cy="54" rx="4" ry="5" fill="#0F172A" />
          <circle cx="47.5" cy="52" r="1.5" fill="#FFFFFF" />
          <ellipse cx="70" cy="54" rx="4" ry="5" fill="#0F172A" />
          <circle cx="71.5" cy="52" r="1.5" fill="#FFFFFF" />
          {/* Slight thoughtful mouth */}
          <ellipse cx="58" cy="66" rx="2.5" ry="1.5" fill="#78350F" />
          {/* Hand on chin */}
          <ellipse cx="64" cy="74" rx="5" ry="3.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        </>
      ) : expression === 'not_sure' ? (
        <>
          {/* Slightly wide curious eyes */}
          <ellipse cx="44" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
          <circle cx="45.5" cy="54" r="1.8" fill="#FFFFFF" />
          <ellipse cx="72" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
          <circle cx="73.5" cy="54" r="1.8" fill="#FFFFFF" />
          {/* Slightly wavy uncertain mouth */}
          <path d="M52 68Q58 65 64 68" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Floating question mark above head */}
          <text x="82" y="32" fill="#4F46E5" fontSize="22" fontWeight="bold" fontFamily="sans-serif">?</text>
        </>
      ) : expression === 'warning' ? (
        <>
          {/* Alert focused eyes */}
          <ellipse cx="44" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
          <circle cx="45.5" cy="54" r="1.8" fill="#FFFFFF" />
          <ellipse cx="72" cy="56" rx="4.5" ry="5.5" fill="#0F172A" />
          <circle cx="73.5" cy="54" r="1.8" fill="#FFFFFF" />
          <path d="M53 67Q58 64 63 67" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Warning sign badge */}
          <g transform="translate(86, 26)">
            <polygon points="12,2 22,20 2,20" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="12" y1="8" x2="12" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.2" fill="#FFFFFF" />
          </g>
        </>
      ) : expression === 'confirmed' ? (
        <>
          {/* Happy squinting/joy eyes */}
          <path d="M41 57Q46 51 51 57" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M67 57Q72 51 77 57" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Big happy smile */}
          <path d="M49 64Q59 74 69 64" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" fill="#78350F" />
          {/* Celebration blue & emerald stars */}
          <polygon points="102,30 104,35 109,36 105,40 106,45 102,42 98,45 99,40 95,36 100,35" fill="#10B981" />
          <polygon points="20,38 21,41 24,42 22,44 22,47 20,45 18,47 18,44 16,42 19,41" fill="#4F46E5" />
        </>
      ) : expression === 'may_qualify' ? (
        <>
          {/* Wide bright eyes */}
          <ellipse cx="44" cy="56" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="46" cy="53.5" r="2" fill="#FFFFFF" />
          <ellipse cx="72" cy="56" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="74" cy="53.5" r="2" fill="#FFFFFF" />
          {/* Cheerful open smile */}
          <path d="M49 65Q58 74 67 65" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="#92400E" />
          {/* Golden sparkles */}
          <circle cx="94" cy="36" r="3" fill="#F59E0B" />
          <circle cx="102" cy="48" r="2" fill="#F59E0B" />
          <circle cx="18" cy="44" r="2.5" fill="#F59E0B" />
        </>
      ) : (
        /* Default / Waving */
        <>
          <ellipse cx="44" cy="56" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="46" cy="53.5" r="2" fill="#FFFFFF" />
          <ellipse cx="72" cy="56" rx="4.5" ry="6" fill="#0F172A" />
          <circle cx="74" cy="53.5" r="2" fill="#FFFFFF" />
          <path d="M49 66Q58 75 67 66" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" />
          {/* Friendly wave little hand */}
          <ellipse cx="98" cy="50" rx="5" ry="7" fill="#F59E0B" transform="rotate(20 98 50)" />
        </>
      )}
    </svg>
  );
};
