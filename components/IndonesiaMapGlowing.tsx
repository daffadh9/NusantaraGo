import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Sparkles, Plane, Camera, Music, MessageCircle, Lightbulb, Play, Wifi } from 'lucide-react';

interface IndonesiaMapGlowingProps {
  userName?: string;
  userAvatar?: string;
}

/**
 * Stunning Indonesia Map dengan Glowing Effects
 * Inspired by modern tech landing pages
 * 
 * Features:
 * - Animated glowing connections between islands
 * - Pulsing dots at major cities
 * - Floating icons above map
 * - Dark gradient background
 * - Eye-catching cyan/teal glow effects
 */
const IndonesiaMapGlowing: React.FC<IndonesiaMapGlowingProps> = ({ 
  userName = 'Traveler', 
  userAvatar 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<{name: string, x: number, y: number} | null>(null);

  // Major cities/points with coordinates (scaled for canvas)
  const points = [
    // Sumatra
    { name: 'Aceh', x: 70, y: 55, size: 4, glow: true },
    { name: 'Medan', x: 90, y: 75, size: 6, glow: true },
    { name: 'Padang', x: 80, y: 110, size: 5, glow: true },
    { name: 'Pekanbaru', x: 105, y: 90, size: 4, glow: false },
    { name: 'Palembang', x: 120, y: 125, size: 5, glow: true },
    
    // Java
    { name: 'Jakarta', x: 155, y: 165, size: 10, glow: true, major: true },
    { name: 'Bandung', x: 170, y: 168, size: 6, glow: true },
    { name: 'Semarang', x: 200, y: 165, size: 5, glow: true },
    { name: 'Yogyakarta', x: 210, y: 172, size: 6, glow: true },
    { name: 'Surabaya', x: 245, y: 165, size: 8, glow: true, major: true },
    
    // Kalimantan
    { name: 'Pontianak', x: 185, y: 105, size: 5, glow: true },
    { name: 'Banjarmasin', x: 245, y: 130, size: 5, glow: true },
    { name: 'Balikpapan', x: 285, y: 110, size: 6, glow: true },
    { name: 'Samarinda', x: 295, y: 100, size: 5, glow: false },
    
    // Sulawesi
    { name: 'Makassar', x: 330, y: 150, size: 7, glow: true, major: true },
    { name: 'Manado', x: 355, y: 80, size: 5, glow: true },
    { name: 'Palu', x: 335, y: 115, size: 4, glow: false },
    
    // Bali & Nusa Tenggara
    { name: 'Bali', x: 265, y: 175, size: 7, glow: true, major: true },
    { name: 'Lombok', x: 280, y: 178, size: 5, glow: true },
    { name: 'Kupang', x: 330, y: 190, size: 4, glow: false },
    
    // Maluku & Papua
    { name: 'Ambon', x: 390, y: 140, size: 5, glow: true },
    { name: 'Jayapura', x: 470, y: 120, size: 6, glow: true },
    { name: 'Sorong', x: 420, y: 115, size: 4, glow: false },
  ];

  // Connection lines between major hubs
  const connections = [
    // Jakarta hub
    { from: 'Jakarta', to: 'Medan' },
    { from: 'Jakarta', to: 'Surabaya' },
    { from: 'Jakarta', to: 'Bali' },
    { from: 'Jakarta', to: 'Makassar' },
    { from: 'Jakarta', to: 'Pontianak' },
    { from: 'Jakarta', to: 'Bandung' },
    
    // Surabaya hub
    { from: 'Surabaya', to: 'Bali' },
    { from: 'Surabaya', to: 'Makassar' },
    { from: 'Surabaya', to: 'Balikpapan' },
    
    // Makassar hub
    { from: 'Makassar', to: 'Manado' },
    { from: 'Makassar', to: 'Ambon' },
    { from: 'Makassar', to: 'Bali' },
    
    // Eastern connections
    { from: 'Ambon', to: 'Jayapura' },
    { from: 'Manado', to: 'Ambon' },
    
    // Sumatra connections
    { from: 'Medan', to: 'Padang' },
    { from: 'Medan', to: 'Palembang' },
    { from: 'Palembang', to: 'Jakarta' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrame: number;
    let time = 0;

    const getPoint = (name: string) => points.find(p => p.name === name);

    const draw = () => {
      const width = rect.width;
      const height = rect.height;
      
      // Clear with dark gradient background
      const bgGradient = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, width * 0.8
      );
      bgGradient.addColorStop(0, '#0f172a');
      bgGradient.addColorStop(0.5, '#0c1524');
      bgGradient.addColorStop(1, '#020617');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Scale factor for responsive
      const scaleX = width / 520;
      const scaleY = height / 220;

      // Draw connections with animated glow
      connections.forEach((conn, idx) => {
        const fromPoint = getPoint(conn.from);
        const toPoint = getPoint(conn.to);
        if (!fromPoint || !toPoint) return;

        const x1 = fromPoint.x * scaleX;
        const y1 = fromPoint.y * scaleY;
        const x2 = toPoint.x * scaleX;
        const y2 = toPoint.y * scaleY;

        // Animated pulse along the line
        const progress = ((time * 0.001 + idx * 0.3) % 1);
        
        // Main connection line (subtle)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing effect line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        const lineGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        lineGradient.addColorStop(Math.max(0, progress - 0.2), 'rgba(20, 184, 166, 0)');
        lineGradient.addColorStop(progress, 'rgba(6, 182, 212, 0.8)');
        lineGradient.addColorStop(Math.min(1, progress + 0.2), 'rgba(20, 184, 166, 0)');
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Moving dot along the line
        const dotX = x1 + (x2 - x1) * progress;
        const dotY = y1 + (y2 - y1) * progress;
        
        // Dot glow
        const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 8);
        dotGlow.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
        dotGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Dot center
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Indonesia island outlines (simplified glowing silhouette)
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
      ctx.lineWidth = 2;
      
      // Sumatra
      ctx.beginPath();
      ctx.moveTo(60 * scaleX, 40 * scaleY);
      ctx.bezierCurveTo(100 * scaleX, 50 * scaleY, 120 * scaleX, 100 * scaleY, 125 * scaleX, 145 * scaleY);
      ctx.bezierCurveTo(100 * scaleX, 140 * scaleY, 70 * scaleX, 100 * scaleY, 60 * scaleX, 40 * scaleY);
      ctx.stroke();

      // Java
      ctx.beginPath();
      ctx.moveTo(140 * scaleX, 160 * scaleY);
      ctx.bezierCurveTo(180 * scaleX, 155 * scaleY, 220 * scaleX, 158 * scaleY, 260 * scaleX, 165 * scaleY);
      ctx.stroke();

      // Kalimantan
      ctx.beginPath();
      ctx.ellipse(230 * scaleX, 100 * scaleY, 70 * scaleX, 45 * scaleY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Sulawesi
      ctx.beginPath();
      ctx.moveTo(320 * scaleX, 70 * scaleY);
      ctx.bezierCurveTo(340 * scaleX, 100 * scaleY, 330 * scaleX, 140 * scaleY, 345 * scaleX, 160 * scaleY);
      ctx.stroke();

      // Papua
      ctx.beginPath();
      ctx.ellipse(440 * scaleX, 120 * scaleY, 50 * scaleX, 35 * scaleY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Draw points (cities)
      points.forEach((point, idx) => {
        const x = point.x * scaleX;
        const y = point.y * scaleY;
        const pulseSize = point.glow ? Math.sin(time * 0.003 + idx) * 2 + point.size : point.size;

        // Outer glow
        if (point.glow) {
          const glowRadius = point.major ? 25 : 15;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          glow.addColorStop(0, point.major ? 'rgba(16, 185, 129, 0.6)' : 'rgba(20, 184, 166, 0.4)');
          glow.addColorStop(0.5, point.major ? 'rgba(16, 185, 129, 0.2)' : 'rgba(20, 184, 166, 0.1)');
          glow.addColorStop(1, 'rgba(20, 184, 166, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pulse ring for major cities
        if (point.major) {
          const ringSize = 15 + (time * 0.02 % 20);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.5 - (ringSize - 15) / 40})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, ringSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner dot
        const dotGradient = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, pulseSize);
        dotGradient.addColorStop(0, point.major ? '#34d399' : '#5eead4');
        dotGradient.addColorStop(1, point.major ? '#10b981' : '#14b8a6');
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // White center highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x - pulseSize * 0.3, y - pulseSize * 0.3, pulseSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 16;
      if (isAnimating) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Selamat Pagi', emoji: '☀️' };
    if (hour < 15) return { text: 'Selamat Siang', emoji: '🌤️' };
    if (hour < 18) return { text: 'Selamat Sore', emoji: '🌅' };
    return { text: 'Selamat Malam', emoji: '🌙' };
  };

  const greeting = getGreeting();

  // Handle mouse move for city tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const scaleX = rect.width / 520;
    const scaleY = rect.height / 220;
    
    // Check if mouse is near any city point
    let foundCity = null;
    for (const point of points) {
      const cityX = point.x * scaleX;
      const cityY = point.y * scaleY;
      const distance = Math.sqrt(Math.pow(mouseX - cityX, 2) + Math.pow(mouseY - cityY, 2));
      
      if (distance < 20) {
        foundCity = { name: point.name, x: cityX, y: cityY };
        break;
      }
    }
    
    setHoveredCity(foundCity);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredCity(null)}
      className="relative w-full h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden cursor-crosshair">
      {/* Floating Icons - Like reference image */}
      <div className="absolute top-4 right-8 z-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute top-16 right-24 z-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Play className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute top-8 right-40 z-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-20 right-12 z-20 animate-pulse">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Wifi className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

      {/* Main Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Greeting Overlay - TOP LEFT - BIGGER TEXT */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden border-2 border-white/20 shadow-xl shadow-emerald-500/30">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={userAvatar ? 'hidden' : ''}>{userName.charAt(0).toUpperCase()}</span>
          </div>
          
          {/* Text */}
          <div>
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
              {greeting.emoji} {greeting.text}
            </p>
            <h2 className="text-white text-3xl font-black tracking-tight">
              Halo, {userName}! 👋
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xs">
              Dunia terlalu luas cuma di-scroll dari layar. Udah siap jadi petualang bar-bar? 🔥
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar - Bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-300 text-sm font-medium">34 Provinsi</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span className="text-slate-300 text-sm font-medium">17,508 Pulau</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 text-sm font-medium">1,340+ Destinasi</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold">Live Connected</span>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-teal-500/10 to-transparent"></div>
      
      {/* City Tooltip on Hover */}
      {hoveredCity && (
        <div 
          className="absolute z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          style={{ 
            left: hoveredCity.x, 
            top: hoveredCity.y - 50,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-emerald-500/50 rounded-xl px-4 py-2 shadow-xl shadow-emerald-500/20">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-400" />
              <span className="text-white font-bold text-sm">{hoveredCity.name}</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Klik untuk explore</p>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-slate-900/95 border-r border-b border-emerald-500/50 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default IndonesiaMapGlowing;
