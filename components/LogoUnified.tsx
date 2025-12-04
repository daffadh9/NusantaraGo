import React from 'react';

/**
 * NusantaraGo - Unified Logo Component (Version 3.0)
 * 
 * 🎨 FILOSOFI LOGO:
 * ==============
 * Konsep: "TIGA PULAU NUSANTARA"
 * 
 * 🏝️ Bentuk: Tiga bentuk pulau organik yang menyatu membentuk huruf "N"
 *    - Pulau 1 (Kiri): Sumatra (vertical stroke kiri dari N)
 *    - Pulau 2 (Tengah): Java/Kalimantan (diagonal connector)
 *    - Pulau 3 (Kanan): Papua (vertical stroke kanan dari N)
 * 
 * 🌊 Elemen Visual:
 *    - Gelombang laut di antara pulau (melambangkan konektivitas)
 *    - Dot pattern menunjukkan kepulauan (17,000+ pulau)
 *    - Smooth curves = ramah, approachable, modern
 * 
 * 💚 Warna: 
 *    - Primary: Emerald Green (#10B981) - Alam Indonesia yang subur
 *    - Accent: Teal (#14B8A6) - Laut yang menyatukan
 *    - Shadow: Deep Green (#047857) - Kedalaman & trust
 * 
 * ✨ Keunikan:
 *    - Bukan sekadar huruf N generic
 *    - Ada makna geografis Indonesia
 *    - Simple tapi memorable
 *    - Scalable untuk semua ukuran
 */

interface LogoUnifiedProps {
  size?: number;
  variant?: 'icon' | 'full' | 'text';
  className?: string;
  showText?: boolean;
}

const LogoUnified: React.FC<LogoUnifiedProps> = ({ 
  size = 48, 
  variant = 'icon',
  className = '',
  showText = true 
}) => {
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="islandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          
          <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle - Subtle */}
        <circle cx="50" cy="50" r="48" fill="#F0FDF4" />
        <circle cx="50" cy="50" r="48" fill="url(#islandGradient)" opacity="0.1" />
        
        {/* Main Logo: Three Islands forming "N" */}
        
        {/* Island 1 (Sumatra) - Left vertical stroke */}
        <path
          d="M 25 20 
             Q 28 18, 32 20
             L 32 75
             Q 28 77, 25 75
             L 25 20 Z"
          fill="url(#islandGradient)"
          filter="url(#glow)"
        />
        
        {/* Decorative dots on Island 1 (cities) */}
        <circle cx="28.5" cy="30" r="1.5" fill="#F0FDF4" opacity="0.8" />
        <circle cx="28.5" cy="45" r="2" fill="#F0FDF4" opacity="1" />
        <circle cx="28.5" cy="60" r="1.5" fill="#F0FDF4" opacity="0.8" />
        
        {/* Island 2 (Java/Kalimantan) - Diagonal connector with wave pattern */}
        <path
          d="M 32 25
             Q 35 23, 38 25
             L 65 68
             Q 68 70, 65 73
             Q 62 71, 60 68
             L 32 25 Z"
          fill="url(#islandGradient)"
          filter="url(#glow)"
        />
        
        {/* Wave pattern on diagonal */}
        <path
          d="M 40 35 Q 42 33, 44 35 Q 46 37, 48 35"
          stroke="#F0FDF4"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
        
        {/* Island 3 (Papua) - Right vertical stroke */}
        <path
          d="M 68 25
             Q 71 23, 75 25
             L 75 80
             Q 71 82, 68 80
             L 68 25 Z"
          fill="url(#islandGradient)"
          filter="url(#glow)"
        />
        
        {/* Decorative dots on Island 3 (cities) */}
        <circle cx="71.5" cy="35" r="1.5" fill="#F0FDF4" opacity="0.8" />
        <circle cx="71.5" cy="50" r="2" fill="#F0FDF4" opacity="1" />
        <circle cx="71.5" cy="65" r="1.5" fill="#F0FDF4" opacity="0.8" />
        
        {/* Ocean waves between islands (subtle) */}
        <path
          d="M 20 85 Q 30 83, 40 85 Q 50 87, 60 85 Q 70 83, 80 85"
          stroke="#14B8A6"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          strokeLinecap="round"
        />
        
        {/* Small archipelago dots (bottom) */}
        <circle cx="35" cy="82" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="45" cy="80" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="55" cy="82" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="65" cy="80" r="1" fill="#10B981" opacity="0.4" />
      </svg>
    );
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 tracking-tight text-2xl">
          Nusantara<span className="font-black">Go</span>
        </span>
      </div>
    );
  }

  // Full variant (icon + text)
  const textSize = size > 64 ? 'text-2xl' : size > 48 ? 'text-xl' : size > 32 ? 'text-lg' : 'text-base';
  const taglineSize = size > 64 ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="islandGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="50" r="48" fill="#F0FDF4" />
        <circle cx="50" cy="50" r="48" fill="url(#islandGradient2)" opacity="0.1" />
        
        <path d="M 25 20 Q 28 18, 32 20 L 32 75 Q 28 77, 25 75 L 25 20 Z" fill="url(#islandGradient2)" filter="url(#glow2)" />
        <circle cx="28.5" cy="30" r="1.5" fill="#F0FDF4" opacity="0.8" />
        <circle cx="28.5" cy="45" r="2" fill="#F0FDF4" opacity="1" />
        <circle cx="28.5" cy="60" r="1.5" fill="#F0FDF4" opacity="0.8" />
        
        <path d="M 32 25 Q 35 23, 38 25 L 65 68 Q 68 70, 65 73 Q 62 71, 60 68 L 32 25 Z" fill="url(#islandGradient2)" filter="url(#glow2)" />
        <path d="M 40 35 Q 42 33, 44 35 Q 46 37, 48 35" stroke="#F0FDF4" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
        
        <path d="M 68 25 Q 71 23, 75 25 L 75 80 Q 71 82, 68 80 L 68 25 Z" fill="url(#islandGradient2)" filter="url(#glow2)" />
        <circle cx="71.5" cy="35" r="1.5" fill="#F0FDF4" opacity="0.8" />
        <circle cx="71.5" cy="50" r="2" fill="#F0FDF4" opacity="1" />
        <circle cx="71.5" cy="65" r="1.5" fill="#F0FDF4" opacity="0.8" />
        
        <path d="M 20 85 Q 30 83, 40 85 Q 50 87, 60 85 Q 70 83, 80 85" stroke="#14B8A6" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
        <circle cx="35" cy="82" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="45" cy="80" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="55" cy="82" r="1" fill="#10B981" opacity="0.4" />
        <circle cx="65" cy="80" r="1" fill="#10B981" opacity="0.4" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 tracking-tight leading-none ${textSize}`}>
            Nusantara<span className="font-black">Go</span>
          </span>
          <span className={`text-gray-600 dark:text-gray-400 tracking-wide ${taglineSize}`}>
            Liburan Puas dalam Satu Klik
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoUnified;
