import React from 'react';

/**
 * NusantaraGo Logo Component - Version 2.0
 * 
 * FILOSOFI LOGO:
 * 🌿 Warna: Emerald Green - melambangkan alam Indonesia yang hijau & subur
 * ✨ Bentuk: Letter "N" modern dengan garis melengkung seperti pantai & pulau
 * 🗺️ Konsep: Minimalis, profesional, mudah diingat
 * 💚 Makna: Kelestarian alam, perjalanan hijau, eksplorasi berkelanjutan
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  const iconSize = iconSizes[size];

  if (variant === 'icon') {
    return (
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle cx="50" cy="50" r="46" fill="url(#logoGradient)" filter="url(#shadow)" />
        
        {/* Letter "N" - Modern & Curved */}
        <path 
          d="M 28 25 L 28 75 M 28 25 Q 35 30, 50 50 T 72 75 M 72 25 L 72 75" 
          stroke="white" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Decorative dots (archipelago concept) */}
        <circle cx="40" cy="35" r="2" fill="white" opacity="0.6" />
        <circle cx="50" cy="50" r="2.5" fill="white" opacity="0.8" />
        <circle cx="60" cy="65" r="2" fill="white" opacity="0.6" />
      </svg>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 tracking-tight">
          <span className="text-3xl">Nusantara</span>
          <span className="text-3xl font-black">Go</span>
        </span>
      </div>
    );
  }

  // Full logo (icon + text)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="shadow2">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#logoGradient2)" filter="url(#shadow2)" />
        <path 
          d="M 28 25 L 28 75 M 28 25 Q 35 30, 50 50 T 72 75 M 72 25 L 72 75" 
          stroke="white" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="40" cy="35" r="2" fill="white" opacity="0.6" />
        <circle cx="50" cy="50" r="2.5" fill="white" opacity="0.8" />
        <circle cx="60" cy="65" r="2" fill="white" opacity="0.6" />
      </svg>
      
      <div className="flex flex-col">
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 tracking-tight leading-none">
          <span className={size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : size === 'lg' ? 'text-3xl' : 'text-4xl'}>
            Nusantara<span className="font-black">Go</span>
          </span>
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400 tracking-wide">
          Jelajah Nusantara
        </span>
      </div>
    </div>
  );
};

export default Logo;
