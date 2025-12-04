import React, { useEffect, useRef } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface IndonesiaMapVizProps {
  userName?: string;
  userAvatar?: string;
}

const IndonesiaMapViz: React.FC<IndonesiaMapVizProps> = ({ 
  userName = 'Traveler', 
  userAvatar 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Major cities and islands - better positioned for Indonesia archipelago
    const cities = [
      { name: 'Medan', x: 70, y: 60, active: true, size: 6 },
      { name: 'Jakarta', x: 150, y: 120, active: true, size: 8 },
      { name: 'Bandung', x: 160, y: 130, active: true, size: 5 },
      { name: 'Semarang', x: 200, y: 125, active: true, size: 5 },
      { name: 'Surabaya', x: 240, y: 130, active: true, size: 7 },
      { name: 'Bali', x: 270, y: 135, active: true, size: 7 },
      { name: 'Lombok', x: 285, y: 138, active: true, size: 4 },
      { name: 'Makassar', x: 330, y: 110, active: true, size: 6 },
      { name: 'Manado', x: 360, y: 50, active: true, size: 5 },
      { name: 'Papua', x: 420, y: 100, active: true, size: 6 },
      { name: 'Palembang', x: 120, y: 105, active: false, size: 4 },
      { name: 'Pontianak', x: 180, y: 80, active: false, size: 4 },
      { name: 'Balikpapan', x: 320, y: 90, active: false, size: 4 },
      { name: 'Ambon', x: 380, y: 110, active: false, size: 4 },
    ];

    // Animation state
    let animationFrame = 0;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Draw island shapes (background)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 2;
      
      // Sumatra
      ctx.beginPath();
      ctx.ellipse(80, 80, 40, 80, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Java
      ctx.beginPath();
      ctx.ellipse(190, 130, 80, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Kalimantan
      ctx.beginPath();
      ctx.ellipse(240, 80, 60, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Sulawesi
      ctx.beginPath();
      ctx.moveTo(330, 70);
      ctx.quadraticCurveTo(340, 90, 330, 110);
      ctx.quadraticCurveTo(320, 100, 330, 70);
      ctx.fill();
      ctx.stroke();
      
      // Papua
      ctx.beginPath();
      ctx.ellipse(420, 100, 50, 40, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw connections between cities
      cities.forEach((city1, i) => {
        cities.forEach((city2, j) => {
          if (i < j) {
            const distance = Math.hypot(city2.x - city1.x, city2.y - city1.y);
            if (distance < 120) {
              const flowOffset = (animationFrame % 40) * 2;
              
              ctx.save();
              ctx.strokeStyle = city1.active && city2.active
                ? `rgba(16, 185, 129, ${0.2 + Math.sin(pulsePhase) * 0.1})`
                : 'rgba(100, 116, 139, 0.1)';
              ctx.lineWidth = city1.active && city2.active ? 2 : 1;
              ctx.setLineDash([5, 5]);
              ctx.lineDashOffset = -flowOffset;
              ctx.beginPath();
              ctx.moveTo(city1.x, city1.y);
              ctx.lineTo(city2.x, city2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      // Draw cities
      cities.forEach((city) => {
        // Outer glow for active cities
        if (city.active) {
          const glowSize = 15 + Math.sin(pulsePhase) * 4;
          const gradient = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, glowSize);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.5)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(city.x, city.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // City dot
        ctx.fillStyle = city.active ? '#10B981' : '#64748b';
        ctx.shadowBlur = city.active ? 10 : 0;
        ctx.shadowColor = '#10B981';
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // City ring (pulse effect)
        if (city.active) {
          const ringRadius = (city.size + 4) + Math.sin(pulsePhase + animationFrame * 0.05) * 2;
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.6 - (ringRadius - city.size - 4) / 8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(city.x, city.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // City label for major cities
        if (city.active && city.size > 5) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(city.name, city.x, city.y - city.size - 8);
        }
      });

      animationFrame++;
      pulsePhase += 0.05;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 p-8 shadow-2xl border border-blue-500/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* User Greeting with Avatar */}
      <div className="relative z-10 mb-6 flex items-center gap-4">
        {/* User Avatar in Animated Frame */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl animate-pulse blur-sm"></div>
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            {!userAvatar && (
              <span className="text-white text-3xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-gray-900 flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* Greeting Text */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">{userName}</span>! 👋
          </h2>
          <p className="text-blue-200 text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Dunia terlalu luas cuma buat di scrolling, mending explore deh
          </p>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative z-10">
        <canvas 
          ref={canvasRef}
          className="w-full h-80 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900/30 backdrop-blur-sm"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
            <MapPin className="w-4 h-4" />
            <span>17,000+ Pulau Terhubung</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Network Aktif</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-white mb-1">248</div>
          <div className="text-xs text-blue-200">Destinasi Tersedia</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-amber-300 mb-1">1.2K+</div>
          <div className="text-xs text-blue-200">Traveler Aktif</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-emerald-300 mb-1">4.8★</div>
          <div className="text-xs text-blue-200">Rating Rata-rata</div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default IndonesiaMapViz;
