import React, { useEffect, useRef } from 'react';
import { MapPin, TrendingUp } from 'lucide-react';

interface IndonesiaMapEnhancedProps {
  userName?: string;
  userAvatar?: string;
}

const IndonesiaMapEnhanced: React.FC<IndonesiaMapEnhancedProps> = ({ 
  userName = 'Traveler', 
  userAvatar 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // EXPANDED CITY LIST - 30+ cities across Indonesia
    const cities = [
      // Sumatra
      { name: 'Banda Aceh', x: 50, y: 50, active: true, size: 5, region: 'sumatra' },
      { name: 'Medan', x: 70, y: 65, active: true, size: 7, region: 'sumatra' },
      { name: 'Pekanbaru', x: 75, y: 90, active: true, size: 5, region: 'sumatra' },
      { name: 'Padang', x: 60, y: 95, active: true, size: 5, region: 'sumatra' },
      { name: 'Palembang', x: 95, y: 110, active: true, size: 6, region: 'sumatra' },
      { name: 'Bengkulu', x: 75, y: 115, active: false, size: 4, region: 'sumatra' },
      { name: 'Lampung', x: 100, y: 130, active: true, size: 5, region: 'sumatra' },
      
      // Java
      { name: 'Jakarta', x: 130, y: 135, active: true, size: 9, region: 'java' },
      { name: 'Bogor', x: 135, y: 140, active: true, size: 5, region: 'java' },
      { name: 'Bandung', x: 145, y: 140, active: true, size: 7, region: 'java' },
      { name: 'Semarang', x: 180, y: 138, active: true, size: 6, region: 'java' },
      { name: 'Yogyakarta', x: 185, y: 145, active: true, size: 7, region: 'java' },
      { name: 'Surabaya', x: 210, y: 145, active: true, size: 8, region: 'java' },
      { name: 'Malang', x: 215, y: 152, active: true, size: 6, region: 'java' },
      
      // Kalimantan (Borneo)
      { name: 'Pontianak', x: 165, y: 95, active: true, size: 6, region: 'kalimantan' },
      { name: 'Palangkaraya', x: 200, y: 105, active: false, size: 4, region: 'kalimantan' },
      { name: 'Banjarmasin', x: 220, y: 120, active: true, size: 6, region: 'kalimantan' },
      { name: 'Balikpapan', x: 260, y: 100, active: true, size: 6, region: 'kalimantan' },
      { name: 'Samarinda', x: 270, y: 95, active: true, size: 5, region: 'kalimantan' },
      
      // Sulawesi
      { name: 'Manado', x: 315, y: 70, active: true, size: 6, region: 'sulawesi' },
      { name: 'Gorontalo', x: 305, y: 85, active: false, size: 4, region: 'sulawesi' },
      { name: 'Palu', x: 295, y: 105, active: false, size: 4, region: 'sulawesi' },
      { name: 'Makassar', x: 295, y: 125, active: true, size: 7, region: 'sulawesi' },
      
      // Bali & Nusa Tenggara
      { name: 'Bali', x: 235, y: 150, active: true, size: 8, region: 'bali' },
      { name: 'Lombok', x: 250, y: 153, active: true, size: 6, region: 'lombok' },
      { name: 'Mataram', x: 252, y: 155, active: true, size: 5, region: 'lombok' },
      { name: 'Labuan Bajo', x: 280, y: 155, active: true, size: 6, region: 'ntt' },
      { name: 'Kupang', x: 310, y: 165, active: true, size: 5, region: 'ntt' },
      
      // Maluku
      { name: 'Ambon', x: 350, y: 120, active: true, size: 5, region: 'maluku' },
      { name: 'Ternate', x: 335, y: 85, active: false, size: 4, region: 'maluku' },
      
      // Papua
      { name: 'Sorong', x: 370, y: 95, active: true, size: 5, region: 'papua' },
      { name: 'Manokwari', x: 380, y: 100, active: false, size: 4, region: 'papua' },
      { name: 'Jayapura', x: 420, y: 110, active: true, size: 6, region: 'papua' },
      { name: 'Wamena', x: 410, y: 120, active: false, size: 4, region: 'papua' },
    ];

    let animationFrame = 0;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Draw island shapes with DETAILED OUTLINES
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      
      // Sumatra - more detailed
      ctx.beginPath();
      ctx.moveTo(40, 45);
      ctx.quadraticCurveTo(55, 55, 60, 70);
      ctx.quadraticCurveTo(70, 85, 75, 105);
      ctx.quadraticCurveTo(80, 120, 90, 130);
      ctx.quadraticCurveTo(75, 125, 65, 110);
      ctx.quadraticCurveTo(55, 95, 50, 80);
      ctx.quadraticCurveTo(45, 65, 40, 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Java - elongated
      ctx.beginPath();
      ctx.ellipse(170, 143, 90, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Kalimantan (Borneo) - larger
      ctx.beginPath();
      ctx.ellipse(210, 105, 75, 65, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Sulawesi - distinctive K shape
      ctx.beginPath();
      ctx.moveTo(295, 65);
      ctx.lineTo(320, 75);
      ctx.quadraticCurveTo(325, 85, 310, 95);
      ctx.quadraticCurveTo(305, 105, 300, 115);
      ctx.lineTo(295, 135);
      ctx.quadraticCurveTo(285, 125, 290, 110);
      ctx.quadraticCurveTo(290, 90, 295, 65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Bali - small
      ctx.beginPath();
      ctx.ellipse(235, 150, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Papua - large eastern island
      ctx.beginPath();
      ctx.ellipse(395, 108, 55, 35, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw connections between nearby cities
      cities.forEach((city1, i) => {
        cities.forEach((city2, j) => {
          if (i < j && city1.active && city2.active) {
            const distance = Math.hypot(city2.x - city1.x, city2.y - city1.y);
            if (distance < 100) {
              const flowOffset = (animationFrame % 40) * 2;
              
              ctx.save();
              ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 + Math.sin(pulsePhase) * 0.08})`;
              ctx.lineWidth = 1.5;
              ctx.setLineDash([4, 4]);
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
          const glowSize = 12 + Math.sin(pulsePhase + city.x * 0.1) * 3;
          const gradient = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, glowSize);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(city.x, city.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // City dot
        ctx.fillStyle = city.active ? '#10B981' : '#64748b';
        ctx.shadowBlur = city.active ? 8 : 0;
        ctx.shadowColor = '#10B981';
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // City ring (pulse effect)
        if (city.active) {
          const ringRadius = (city.size + 3) + Math.sin(pulsePhase + animationFrame * 0.05 + city.y * 0.1) * 2;
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.7 - (ringRadius - city.size - 3) / 10})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(city.x, city.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // City labels for all active cities
        if (city.active) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.font = city.size > 6 ? 'bold 10px sans-serif' : 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 3;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.fillText(city.name, city.x, city.y - city.size - 6);
          ctx.shadowBlur = 0;
        }
      });

      animationFrame++;
      pulsePhase += 0.04;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 p-8 shadow-2xl border border-emerald-500/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* User Greeting with Avatar */}
      <div className="relative z-10 mb-6 flex items-center gap-4">
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
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-gray-900 flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">{userName}</span>! 👋
          </h2>
          <p className="text-emerald-200 text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Dunia terlalu luas cuma buat di scrolling, mending explore deh
          </p>
        </div>
      </div>

      {/* LARGER Map Canvas */}
      <div className="relative z-10">
        <canvas 
          ref={canvasRef}
          className="w-full h-96 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900/30 backdrop-blur-sm shadow-inner border border-emerald-500/20"
          style={{ imageRendering: 'crisp-edges' }}
        />
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-emerald-400/30">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <MapPin className="w-5 h-5" />
            <span>34 Kota • 17,000+ Pulau</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-emerald-400/30">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <TrendingUp className="w-5 h-5" />
            <span>Network Aktif</span>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
          <div className="text-3xl font-bold text-white mb-1">34+</div>
          <div className="text-xs text-emerald-200">Kota Terhubung</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
          <div className="text-3xl font-bold text-emerald-300 mb-1">2.4K+</div>
          <div className="text-xs text-emerald-200">Traveler Aktif</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
          <div className="text-3xl font-bold text-teal-300 mb-1">4.9★</div>
          <div className="text-xs text-emerald-200">Rating Rata-rata</div>
        </div>
      </div>
    </div>
  );
};

export default IndonesiaMapEnhanced;
