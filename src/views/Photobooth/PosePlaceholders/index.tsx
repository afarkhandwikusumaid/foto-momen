import React from 'react';

interface PoseProps {
  className?: string;
  color?: string;
}

export function PosePeace({ className = 'w-full h-full', color = 'currentColor' }: PoseProps) {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background soft circle */}
      <circle cx="60" cy="50" r="32" fill="#dbeafe" opacity="0.5" />
      {/* Person silhouette */}
      <path d="M30 90C30 75 42 63 57 63H63C78 63 90 75 90 90" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="40" r="14" stroke={color} strokeWidth="3.5" />
      {/* Peace Hand */}
      <path d="M85 58C85 50 83 48 83 44C83 42 84 41 85 41C86 41 87 42 87 44L87 53M87 53C87 48 89 46 89 42C89 40 90 39 91 39C92 39 93 40 93 42L93 58M93 58C95 58 97 60 97 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Small sparkle */}
      <path d="M15 25L18 28L21 25L18 22L15 25Z" fill="#3b82f6" />
    </svg>
  );
}

export function PoseHeart({ className = 'w-full h-full', color = 'currentColor' }: PoseProps) {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background soft circle */}
      <circle cx="60" cy="50" r="32" fill="#fef08a" opacity="0.4" />
      {/* Person silhouette */}
      <path d="M30 90C30 75 42 63 57 63H63C78 63 90 75 90 90" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="40" r="14" stroke={color} strokeWidth="3.5" />
      {/* Heart Hands symbol in center of chest */}
      <path d="M54 62C51 59 48 59 48 62C48 65 53 69 60 73C67 69 72 65 72 62C72 59 69 59 66 62L60 67L54 62Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#f43f5e" fillOpacity="0.2" />
      {/* Sparkles */}
      <path d="M100 20L102 23L105 20L102 17L100 20Z" fill="#fbbf24" />
    </svg>
  );
}

export function PoseWink({ className = 'w-full h-full', color = 'currentColor' }: PoseProps) {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background soft circle */}
      <circle cx="60" cy="50" r="32" fill="#bbf7d0" opacity="0.4" />
      {/* Person silhouette */}
      <path d="M30 90C30 75 42 63 57 63H63C78 63 90 75 90 90" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="40" r="14" stroke={color} strokeWidth="3.5" />
      {/* Face Wink details (winking eye + happy eye + smile) */}
      <path d="M52 38C54 39 56 39 58 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" /> {/* Left happy curve eye */}
      <path d="M62 38L67 38" stroke={color} strokeWidth="2.5" strokeLinecap="round" /> {/* Right wink straight eye */}
      <path d="M56 46C56 49 60 51 64 46" stroke={color} strokeWidth="2" strokeLinecap="round" /> {/* Happy open mouth/smile */}
      {/* Sparkle */}
      <path d="M22 62L24 64L26 62L24 60L22 62Z" fill="#22c55e" />
    </svg>
  );
}

export function PoseCool({ className = 'w-full h-full', color = 'currentColor' }: PoseProps) {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background soft circle */}
      <circle cx="60" cy="50" r="32" fill="#fbcfe8" opacity="0.4" />
      {/* Person silhouette */}
      <path d="M30 90C30 75 42 63 57 63H63C78 63 90 75 90 90" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="40" r="14" stroke={color} strokeWidth="3.5" />
      {/* Sunglasses */}
      <rect x="49" y="36" width="10" height="7" rx="3" fill={color} />
      <rect x="61" y="36" width="10" height="7" rx="3" fill={color} />
      <path d="M59 38H61" stroke={color} strokeWidth="2" />
      {/* Confident Smile */}
      <path d="M56 47C59 48.5 61 48.5 64 47" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Party Sparkle */}
      <path d="M96 55L98 58L101 55L98 52L96 55Z" fill="#ec4899" />
    </svg>
  );
}

// Map helper to return placeholders based on indexes
export function getPosePlaceholder(index: number, className = 'w-full h-full', color = '#94a3b8') {
  const poses = [
    <PosePeace className={className} color={color} />,
    <PoseHeart className={className} color={color} />,
    <PoseWink className={className} color={color} />,
    <PoseCool className={className} color={color} />,
  ];
  return poses[index % poses.length];
}
