
import React, { useState, useEffect } from 'react';
import { Brain, Eye, Trophy, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

interface MastermindTriviaProps {
  onScore: (score: number) => void;
}

const TRIVIA = [
  { q: "Apa nama rumah adat Sumatera Barat?", options: ["Rumah Gadang", "Joglo", "Honai", "Tongkonan"], a: 0, fact: "Rumah Gadang memiliki atap berbentuk tanduk kerbau" },
  { q: "Pulau Komodo terletak di provinsi?", options: ["Bali", "NTT", "NTB", "Maluku"], a: 1, fact: "Komodo adalah kadal terbesar di dunia" },
  { q: "Tari Kecak berasal dari daerah?", options: ["Jawa", "Bali", "Sumatra", "Sulawesi"], a: 1, fact: "Tari Kecak menggambarkan kisah Ramayana" },
  { q: "Gunung tertinggi di Indonesia adalah?", options: ["Semeru", "Rinjani", "Puncak Jaya", "Kerinci"], a: 2, fact: "Puncak Jaya (Carstensz) setinggi 4.884 meter" },
  { q: "Batik Indonesia diakui UNESCO tahun?", options: ["2007", "2009", "2011", "2013"], a: 1, fact: "2 Oktober diperingati sebagai Hari Batik Nasional" },
  { q: "Danau terbesar di Indonesia adalah?", options: ["Danau Toba", "Danau Sentani", "Danau Poso", "Danau Maninjau"], a: 0, fact: "Danau Toba adalah danau vulkanik terbesar di dunia" },
];

const BLUR_IMAGES = [
  { image: 'https://images.unsplash.com/photo-1555982845-8c7694318d10?q=80&w=800', answer: 'Monas', options: ['Monas', 'Tugu Jogja', 'Gedung Sate', 'Lawang Sewu'] },
  { image: 'https://images.unsplash.com/photo-1596402187264-eb63e0856996?q=80&w=800', answer: 'Borobudur', options: ['Prambanan', 'Borobudur', 'Ratu Boko', 'Mendut'] },
  { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800', answer: 'Tanah Lot', options: ['Uluwatu', 'Tanah Lot', 'Besakih', 'Tirta Empul'] },
];

const MastermindTrivia: React.FC<MastermindTriviaProps> = ({ onScore }) => {
  const [mode, setMode] = useState<'trivia' | 'blur'>('trivia');
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Blur Game State
  const [blurQ, setBlurQ] = useState(0);
  const [blurLevel, setBlurLevel] = useState(25);
  const [blurScore, setBlurScore] = useState(100);
  const [blurAnswered, setBlurAnswered] = useState(false);

  useEffect(() => {
    let interval: any;
    if (mode === 'blur' && blurLevel > 0 && !blurAnswered) {
        interval = setInterval(() => {
            setBlurLevel(b => Math.max(0, b - 1));
            setBlurScore(s => Math.max(10, s - 3));
        }, 150);
    }
    return () => clearInterval(interval);
  }, [mode, blurLevel, blurAnswered]);

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);
    
    if (idx === TRIVIA[currentQ].a) {
        const points = 50 + (streak * 10);
        setTriviaScore(prev => prev + points);
        setStreak(prev => prev + 1);
        onScore(points);
    } else {
        setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ < TRIVIA.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswered(null);
    } else {
      // Reset game
      setCurrentQ(0);
      setAnswered(null);
    }
  };

  const handleBlurAnswer = (answer: string) => {
    if (blurAnswered) return;
    setBlurAnswered(true);
    
    if (answer === BLUR_IMAGES[blurQ].answer) {
      onScore(blurScore);
    }
  };

  const nextBlurRound = () => {
    if (blurQ < BLUR_IMAGES.length - 1) {
      setBlurQ(blurQ + 1);
    } else {
      setBlurQ(0);
    }
    setBlurLevel(25);
    setBlurScore(100);
    setBlurAnswered(false);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nusantara Mastermind</h2>
            <p className="text-sm text-slate-400">Uji pengetahuanmu tentang Indonesia!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mode === 'trivia' && streak > 0 && (
            <div className="bg-orange-500/20 border border-orange-500/50 px-3 py-1 rounded-full">
              <span className="text-orange-400 text-sm font-bold">🔥 Streak: {streak}</span>
            </div>
          )}
          <div className="bg-slate-800 px-4 py-2 rounded-xl">
            <span className="text-yellow-400 font-bold">{mode === 'trivia' ? triviaScore : blurScore} pts</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-xl">
         <button 
           onClick={() => setMode('trivia')} 
           className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${mode === 'trivia' ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg' : 'hover:bg-slate-700'}`}
         >
           <Brain size={18} /> Kuis Trivia
         </button>
         <button 
           onClick={() => { setMode('blur'); setBlurLevel(25); setBlurScore(100); setBlurAnswered(false); }} 
           className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${mode === 'blur' ? 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg' : 'hover:bg-slate-700'}`}
         >
           <Eye size={18} /> Tebak Gambar
         </button>
      </div>

      {mode === 'trivia' ? (
        <div className="flex-1 flex flex-col">
          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {TRIVIA.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-pink-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>

          {/* Question Card */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-8 max-w-lg w-full border border-slate-700">
              <div className="text-center mb-8">
                <span className="text-xs text-slate-400 uppercase font-bold">Pertanyaan {currentQ + 1}/{TRIVIA.length}</span>
                <h3 className="text-2xl font-bold mt-2">{TRIVIA[currentQ].q}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {TRIVIA[currentQ].options.map((opt, i) => {
                  const isCorrect = i === TRIVIA[currentQ].a;
                  const isSelected = answered === i;
                  
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i)} 
                      disabled={answered !== null}
                      className={`p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        answered === null 
                          ? 'bg-slate-700 hover:bg-pink-600 hover:scale-105' 
                          : isCorrect 
                            ? 'bg-emerald-500 text-white' 
                            : isSelected 
                              ? 'bg-red-500 text-white' 
                              : 'bg-slate-700 opacity-50'
                      }`}
                    >
                      {answered !== null && isCorrect && <CheckCircle size={18} />}
                      {answered !== null && isSelected && !isCorrect && <XCircle size={18} />}
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Result & Fact */}
              {answered !== null && (
                <div className="mt-6 animate-in slide-in-from-bottom-4">
                  <div className={`p-4 rounded-xl mb-4 ${answered === TRIVIA[currentQ].a ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <p className="text-sm">
                      {answered === TRIVIA[currentQ].a ? '✅ Benar!' : '❌ Salah!'} {TRIVIA[currentQ].fact}
                    </p>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {currentQ < TRIVIA.length - 1 ? 'Pertanyaan Selanjutnya' : 'Main Lagi'} <RefreshCcw size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-lg w-full">
            {/* Blur Image */}
            <div className="relative rounded-3xl overflow-hidden mb-6 border-4 border-slate-700">
              <img 
                src={BLUR_IMAGES[blurQ].image} 
                className="w-full h-64 object-cover transition-all duration-100" 
                style={{ filter: `blur(${blurLevel}px)` }}
                alt="Guess"
              />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-4 py-2 rounded-xl">
                <span className="text-xs text-slate-400">Potensi Skor</span>
                <div className="text-xl font-bold text-yellow-400">{blurScore}</div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-4 py-2 rounded-xl">
                <span className="text-sm font-bold">🔍 Gambar semakin jelas...</span>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3">
              {BLUR_IMAGES[blurQ].options.map((opt, i) => {
                const isCorrect = opt === BLUR_IMAGES[blurQ].answer;
                return (
                  <button 
                    key={i}
                    onClick={() => handleBlurAnswer(opt)}
                    disabled={blurAnswered}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      !blurAnswered 
                        ? 'bg-slate-700 hover:bg-emerald-600' 
                        : isCorrect 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-700 opacity-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {blurAnswered && (
              <button 
                onClick={nextBlurRound}
                className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl font-bold"
              >
                Gambar Selanjutnya
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MastermindTrivia;
