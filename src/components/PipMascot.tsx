import React from 'react';

interface MascotProps {
  className?: string;
  size?: number;
}

export const PipMascot: React.FC<MascotProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-label="Pip Guardian Mascot"
    >
      {/* Outer Glow Circle */}
      <circle cx="50" cy="50" r="48" fill="#FFEDD5" />
      <circle cx="50" cy="50" r="46" fill="#EA580C" />

      {/* Warm Orange Face / Body Base */}
      <circle cx="50" cy="52" r="40" fill="#F97316" />

      {/* Cheerful Inner Cheek Creams */}
      <ellipse cx="32" cy="58" rx="14" ry="12" fill="#FED7AA" />
      <ellipse cx="68" cy="58" rx="14" ry="12" fill="#FED7AA" />
      <ellipse cx="50" cy="62" rx="18" ry="15" fill="#FFEDD5" />

      {/* Cute Ears / Crest */}
      <circle cx="24" cy="22" r="13" fill="#EA580C" />
      <circle cx="24" cy="22" r="8" fill="#FDBA74" />
      <circle cx="76" cy="22" r="13" fill="#EA580C" />
      <circle cx="76" cy="22" r="8" fill="#FDBA74" />

      {/* Friendly Big Dark Eyes with Sparkle Highlights */}
      <ellipse cx="36" cy="46" rx="6" ry="7.5" fill="#0F172A" />
      <circle cx="38" cy="43.5" r="2.5" fill="#FFFFFF" />
      <circle cx="34.5" cy="48" r="1.2" fill="#FFFFFF" />

      <ellipse cx="64" cy="46" rx="6" ry="7.5" fill="#0F172A" />
      <circle cx="66" cy="43.5" r="2.5" fill="#FFFFFF" />
      <circle cx="62.5" cy="48" r="1.2" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <circle cx="26" cy="56" r="4" fill="#FB923C" opacity="0.8" />
      <circle cx="74" cy="56" r="4" fill="#FB923C" opacity="0.8" />

      {/* Little Button Nose */}
      <path
        d="M47 54C47 52.5 53 52.5 53 54C53 56 47 56 47 54Z"
        fill="#9A3412"
      />

      {/* Happy Smile */}
      <path
        d="M44 60C46 64 54 64 56 60"
        stroke="#7C2D12"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Signature NY Guardian Blue Scarf Badge */}
      <path
        d="M32 78C40 85 60 85 68 78C64 74 36 74 32 78Z"
        fill="#0284C7"
      />
      <circle cx="50" cy="80" r="4" fill="#38BDF8" />
      <path
        d="M50 78L51 81L54 81L52 83L53 86L50 84L47 86L48 83L46 81L49 81Z"
        fill="#FDE047"
      />
    </svg>
  );
};
