import React from 'react';

interface BeniAvatarProps {
  size?: number;
  className?: string;
  mood?: 'happy' | 'alert' | 'thinking' | 'wink';
  pulse?: boolean;
}

export const BeniAvatar: React.FC<BeniAvatarProps> = ({
  size = 40,
  className = '',
  mood = 'happy',
  pulse = false,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {pulse && (
        <span
          className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"
          style={{ animationDuration: '2.5s' }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
        aria-label="Beni your benefits helper"
      >
        {/* Soft Warm Helper Base Glow */}
        <circle cx="50" cy="50" r="46" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="2" />

        {/* Outer Round Head/Body (Warm Coral & Sun Amber) */}
        <ellipse cx="50" cy="53" rx="36" ry="34" fill="url(#beniGradient)" />

        {/* Cheerful Ear/Antenna Nodes */}
        <circle cx="28" cy="22" r="8" fill="#F97316" />
        <path d="M33 28L40 38" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />

        <circle cx="72" cy="22" r="8" fill="#F97316" />
        <path d="M67 28L60 38" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="32" cy="62" rx="6" ry="4" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="68" cy="62" rx="6" ry="4" fill="#FCA5A5" opacity="0.8" />

        {/* Eyes */}
        {mood === 'happy' && (
          <>
            <circle cx="38" cy="50" r="5" fill="#1E293B" />
            <circle cx="40" cy="48" r="1.8" fill="#FFFFFF" />
            <circle cx="62" cy="50" r="5" fill="#1E293B" />
            <circle cx="64" cy="48" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {mood === 'wink' && (
          <>
            <path
              d="M32 50C34 46 42 46 44 50"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="62" cy="50" r="5" fill="#1E293B" />
            <circle cx="64" cy="48" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {mood === 'alert' && (
          <>
            <circle cx="38" cy="49" r="6" fill="#1E293B" />
            <circle cx="40" cy="47" r="2.2" fill="#FFFFFF" />
            <circle cx="62" cy="49" r="6" fill="#1E293B" />
            <circle cx="64" cy="47" r="2.2" fill="#FFFFFF" />
          </>
        )}

        {/* Happy Smile */}
        <path
          d="M42 61C45 66 55 66 58 61"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Little Heart Badge / Sparkle on Belly */}
        <path
          d="M50 76C50 76 43 71 43 67C43 64.5 45 63 47.5 63C49 63 50 64.5 50 64.5C50 64.5 51 63 52.5 63C55 63 57 64.5 57 67C57 71 50 76 50 76Z"
          fill="#EF4444"
        />

        <defs>
          <linearGradient id="beniGradient" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDBA74" />
            <stop offset="0.6" stopColor="#FB923C" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
