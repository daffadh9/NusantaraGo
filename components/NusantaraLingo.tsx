
import React, { useState, useEffect } from 'react';
import { LingoPhrase } from '../types';
import { generateLocalLingo, generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';
import { Volume2, Languages, Loader2, Play, Hand, Heart, LifeBuoy } from 'lucide-react';

interface NusantaraLingoProps {
  destination: string;
}

const NusantaraLingo: React.FC<NusantaraLingoProps> = ({ destination }) => {
  const [phrases, setPhrases] = useState<LingoPhrase[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (destination) {
      loadLingo();
    }
  }, [destination]);

  const loadLingo = async () => {
    setLoading(true);
    try {
      // Clean destination name (remove "Trip to" prefixes if any) to get just the location
      const cleanDest = destination.replace(/Trip to|Trip ke|Eksplorasi|Wisata/i, '').trim();
      const result = await generateLocalLingo(cleanDest);
      setPhrases(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const playPronunciation = async (text: string, index: number) => {
    if (playingIndex !== null) return;
    setPlayingIndex(index);
    
    try {
      // Generate speech using Gemini TTS
      const base64Audio = await generateSpeech(`Say this slowly: ${text}`);
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000,
            1
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setPlayingIndex(null);
        source.start();
      } else {
        setPlayingIndex(null);
      }
    } catch (e) {
      console.error(e);
      setPlayingIndex(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'Greeting': return <Hand size={12} />;
        case 'Gratitude': return <Heart size={12} />;
        case 'Survival': return <LifeBuoy size={12} />;
        default: return <Languages size={12} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-slate-700 shadow-sm animate-pulse flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm w-full h-32">
        <Loader2 className="animate-spin" size={16} /> Learning Dialect...
      </div>
    );
  }

  if (phrases.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-slate-700/40 rounded-3xl p-5 shadow-lg animate-in slide-in-from-bottom duration-500 group">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-400/30 transition-all"></div>
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-500/20">
          <Languages size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Nusantara Lingo</h3>
          <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Dialect Coach</p>
        </div>
      </div>

      {/* Phrase List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {phrases.map((phrase, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                {getCategoryIcon(phrase.category)}
                {phrase.category}
              </span>
              <button 
                onClick={() => playPronunciation(phrase.native, idx)}
                disabled={playingIndex !== null}
                className={`p-1.5 rounded-full transition-all ${
                  playingIndex === idx 
                    ? 'bg-emerald-500 text-white scale-110' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600'
                }`}
                title="Dengar Pengucapan"
              >
                {playingIndex === idx ? <Volume2 size={12} className="animate-pulse" /> : <Play size={12} />}
              </button>
            </div>
            
            <div className="mb-1">
              <h4 className="font-extrabold text-slate-800 dark:text-white text-lg leading-tight truncate" title={phrase.native}>{phrase.native}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic font-serif">"{phrase.phonetic}"</p>
            </div>
            
            <div className="text-xs font-medium text-emerald-800 dark:text-emerald-400 border-t border-slate-200/50 dark:border-slate-700/50 pt-1 mt-1 truncate" title={phrase.meaning}>
              {phrase.meaning}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-center md:text-right">
        <p className="text-[10px] text-slate-400">Tap icon play untuk dengar cara ngomongnya!</p>
      </div>
    </div>
  );
};

export default NusantaraLingo;
