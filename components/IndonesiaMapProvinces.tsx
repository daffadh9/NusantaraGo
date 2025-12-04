import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users } from 'lucide-react';

interface IndonesiaMapProvincesProps {
  userName?: string;
  userAvatar?: string;
}

const IndonesiaMapProvinces: React.FC<IndonesiaMapProvincesProps> = ({ 
  userName = 'Traveler', 
  userAvatar 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 34 PROVINSI INDONESIA - Complete list
  const provinces = [
    // Sumatra (10 provinsi)
    { name: 'Aceh', x: 50, y: 40, active: true, population: '5.3 juta', region: 'sumatra' },
    { name: 'Sumut', x: 70, y: 55, active: true, population: '14.8 juta', region: 'sumatra' },
    { name: 'Sumbar', x: 60, y: 80, active: true, population: '5.5 juta', region: 'sumatra' },
    { name: 'Riau', x: 80, y: 85, active: true, population: '6.8 juta', region: 'sumatra' },
    { name: 'Kepri', x: 95, y: 80, active: true, population: '2.1 juta', region: 'sumatra' },
    { name: 'Jambi', x: 85, y: 100, active: true, population: '3.5 juta', region: 'sumatra' },
    { name: 'Sumsel', x: 100, y: 110, active: true, population: '8.5 juta', region: 'sumatra' },
    { name: 'Bengkulu', x: 75, y: 115, active: true, population: '2 juta', region: 'sumatra' },
    { name: 'Babel', x: 110, y: 105, active: true, population: '1.5 juta', region: 'sumatra' },
    { name: 'Lampung', x: 105, y: 130, active: true, population: '9.2 juta', region: 'sumatra' },
    
    // Jawa (6 provinsi)
    { name: 'Banten', x: 120, y: 138, active: true, population: '13.1 juta', region: 'java' },
    { name: 'DKI Jakarta', x: 135, y: 136, active: true, population: '10.6 juta', region: 'java' },
    { name: 'Jabar', x: 145, y: 140, active: true, population: '49.3 juta', region: 'java' },
    { name: 'Jateng', x: 175, y: 140, active: true, population: '36.5 juta', region: 'java' },
    { name: 'DIY', x: 185, y: 145, active: true, population: '3.7 juta', region: 'java' },
    { name: 'Jatim', x: 210, y: 145, active: true, population: '40.7 juta', region: 'java' },
    
    // Kalimantan (5 provinsi)
    { name: 'Kalbar', x: 160, y: 90, active: true, population: '5.4 juta', region: 'kalimantan' },
    { name: 'Kalteng', x: 200, y: 105, active: true, population: '2.7 juta', region: 'kalimantan' },
    { name: 'Kalsel', x: 220, y: 120, active: true, population: '4.2 juta', region: 'kalimantan' },
    { name: 'Kaltim', x: 270, y: 95, active: true, population: '3.7 juta', region: 'kalimantan' },
    { name: 'Kaltara', x: 265, y: 70, active: true, population: '0.7 juta', region: 'kalimantan' },
    
    // Sulawesi (6 provinsi)
    { name: 'Sulut', x: 320, y: 65, active: true, population: '2.6 juta', region: 'sulawesi' },
    { name: 'Gorontalo', x: 305, y: 82, active: true, population: '1.2 juta', region: 'sulawesi' },
    { name: 'Sulteng', x: 300, y: 100, active: true, population: '3 juta', region: 'sulawesi' },
    { name: 'Sulbar', x: 280, y: 115, active: true, population: '1.4 juta', region: 'sulawesi' },
    { name: 'Sulsel', x: 300, y: 128, active: true, population: '9 juta', region: 'sulawesi' },
    { name: 'Sultra', x: 315, y: 120, active: true, population: '2.6 juta', region: 'sulawesi' },
    
    // Nusa Tenggara, Bali, Maluku, Papua (7 provinsi)
    { name: 'Bali', x: 235, y: 150, active: true, population: '4.3 juta', region: 'bali' },
    { name: 'NTB', x: 255, y: 152, active: true, population: '5.3 juta', region: 'nusa' },
    { name: 'NTT', x: 285, y: 155, active: true, population: '5.4 juta', region: 'nusa' },
    { name: 'Maluku', x: 345, y: 120, active: true, population: '1.8 juta', region: 'maluku' },
    { name: 'Malut', x: 345, y: 95, active: true, population: '1.3 juta', region: 'maluku' },
    { name: 'Papua', x: 400, y: 115, active: true, population: '4.3 juta', region: 'papua' },
    { name: 'Papua Barat', x: 375, y: 105, active: true, population: '1.1 juta', region: 'papua' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Animation frame
    let animationFrame: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, 'rgba(5, 150, 105, 0.05)');
      bgGradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections between nearby provinces (simplified)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      provinces.forEach((prov, i) => {
        provinces.slice(i + 1).forEach(other => {
          const dx = other.x - prov.x;
          const dy = other.y - prov.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Draw connection if provinces are close and in same region
          if (distance < 60 && prov.region === other.region) {
            ctx.beginPath();
            ctx.moveTo(prov.x, prov.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw provinces
      provinces.forEach((prov, index) => {
        const isHovered = hoveredProvince === prov.name;
        const pulse = Math.sin(time * 0.002 + index * 0.3) * 0.5 + 0.5;

        // Outer glow ring (animated)
        if (prov.active) {
          const glowRadius = isHovered ? 18 + pulse * 4 : 12 + pulse * 3;
          const glowGradient = ctx.createRadialGradient(prov.x, prov.y, 0, prov.x, prov.y, glowRadius);
          glowGradient.addColorStop(0, isHovered ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)');
          glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(prov.x, prov.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main dot
        const dotSize = isHovered ? 7 : 5;
        const dotGradient = ctx.createRadialGradient(prov.x, prov.y, 0, prov.x, prov.y, dotSize);
        dotGradient.addColorStop(0, isHovered ? '#14B8A6' : '#10B981');
        dotGradient.addColorStop(1, isHovered ? '#0D9488' : '#059669');
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(prov.x, prov.y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // White center highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(prov.x, prov.y, dotSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Province label
        ctx.font = isHovered ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.fillStyle = isHovered ? '#10B981' : '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(prov.name, prov.x, prov.y - 12);
      });

      time++;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    // Mouse move handler for hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / (dpr * rect.width);
      const scaleY = canvas.height / (dpr * rect.height);
      const x = (e.clientX - rect.left) * scaleX / dpr;
      const y = (e.clientY - rect.top) * scaleY / dpr;

      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if mouse is over any province
      let found = false;
      for (const prov of provinces) {
        const dx = x - prov.x;
        const dy = y - prov.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
          setHoveredProvince(prov.name);
          canvas.style.cursor = 'pointer';
          found = true;
          break;
        }
      }

      if (!found) {
        setHoveredProvince(null);
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredProvince]);

  const hoveredProvinceData = provinces.find(p => p.name === hoveredProvince);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-2xl"
        style={{ height: '400px' }}
      />
      
      {/* Province count badge */}
      <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          34 Provinsi
        </span>
      </div>

      {/* Hover tooltip */}
      {hoveredProvinceData && (
        <div 
          className="fixed z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/30 pointer-events-none"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y - 60,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="text-sm font-bold text-emerald-400">{hoveredProvinceData.name}</div>
          <div className="text-xs text-slate-300 flex items-center gap-1">
            <Users size={12} />
            {hoveredProvinceData.population}
          </div>
        </div>
      )}

      {/* User greeting overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-slate-900/95 to-emerald-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-emerald-500/20">
          <div className="flex items-center gap-3">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full border-2 border-emerald-500" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-emerald-300 font-semibold">Halo {userName}! 👋</p>
              <p className="text-xs text-slate-300">17,000+ pulau menunggu untuk dijelajahi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndonesiaMapProvinces;
