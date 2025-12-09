
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2, Mic, Sparkles, MapPin, Calendar, Utensils, Hotel, Plane, Camera, Clock, Star, Zap, ChevronRight } from 'lucide-react';
import { chatWithNara } from '../services/geminiService';
import { ChatMessage } from '../types';

interface NaraAssistantProps {
  userName: string;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  color: string;
}

const NaraAssistant: React.FC<NaraAssistantProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'quick' | 'itinerary'>('quick');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Halo Kak ${userName}! 👋 Gue NARA, AI Travel Concierge kamu. Mau planning trip, cari hidden gems, atau rekomendasi kuliner? Pilih quick action atau langsung chat aja!`,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    { id: 'destination', icon: <MapPin size={18} />, label: 'Rekomendasi Destinasi', prompt: 'Rekomendasikan destinasi wisata terbaik di Indonesia untuk liburan minggu ini', color: 'bg-blue-500' },
    { id: 'itinerary', icon: <Calendar size={18} />, label: 'Buat Itinerary', prompt: 'Buatkan itinerary lengkap 3 hari di Bali dengan budget 5 juta', color: 'bg-emerald-500' },
    { id: 'food', icon: <Utensils size={18} />, label: 'Kuliner Lokal', prompt: 'Rekomendasi kuliner wajib coba dan street food terbaik di Yogyakarta', color: 'bg-orange-500' },
    { id: 'hotel', icon: <Hotel size={18} />, label: 'Hotel Terbaik', prompt: 'Rekomendasi hotel dengan view terbaik dan harga terjangkau di Bali', color: 'bg-purple-500' },
    { id: 'hidden', icon: <Star size={18} />, label: 'Hidden Gems', prompt: 'Kasih tau hidden gems dan tempat yang belum banyak orang tau di Lombok', color: 'bg-pink-500' },
    { id: 'photo', icon: <Camera size={18} />, label: 'Spot Foto', prompt: 'Rekomendasi spot foto instagramable dan waktu terbaik untuk foto di Bromo', color: 'bg-amber-500' },
  ];

  const trendingDestinations = [
    { name: 'Bali', emoji: '🏝️', tag: 'Trending' },
    { name: 'Raja Ampat', emoji: '🤿', tag: 'Diving' },
    { name: 'Yogyakarta', emoji: '🏛️', tag: 'Culture' },
    { name: 'Labuan Bajo', emoji: '🐉', tag: 'Adventure' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setActiveMode('chat');
    setIsLoading(true);

    try {
      const responseText = await chatWithNara(textToSend);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Waduh, sinyal gue lagi jelek nih kak. Coba tanya lagi bentar lagi ya!',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(undefined, action.prompt);
  };

  const handleDestinationClick = (dest: string) => {
    handleSend(undefined, `Kasih info lengkap tentang ${dest}: destinasi populer, hidden gems, kuliner wajib coba, dan tips traveling kesana`);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-0 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white dark:border-slate-800 ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden relative ${isOpen ? 'bg-red-500' : 'bg-solar-500'}`}>
           {isOpen ? (
             <X className="text-white" size={32} />
           ) : (
             <>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nara&backgroundColor=ffdfbf&clothing=graphicShirt&clothingColor=3c4f5c" alt="NARA" className="w-full h-full object-cover" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
             </>
           )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[650px] max-h-[85vh] bg-white dark:bg-dark-card rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-200 dark:border-dark-border overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-4 ring-black/5 dark:ring-white/5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-solar-500 to-orange-600 p-4 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nara&backgroundColor=ffdfbf" alt="NARA" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">NARA AI</h3>
                <p className="text-xs text-orange-100 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Online • AI Travel Concierge</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setActiveMode('quick')} className={`p-2 rounded-full transition-colors ${activeMode === 'quick' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>
                <Zap size={16} />
              </button>
              <button onClick={() => setActiveMode('chat')} className={`p-2 rounded-full transition-colors ${activeMode === 'chat' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>
                <MessageCircle size={16} />
              </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          {activeMode === 'quick' && messages.length <= 1 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 mb-3 font-medium">⚡ Quick Actions</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className={`${action.color} text-white p-3 rounded-xl text-left hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <div className="flex items-center gap-2 mb-1">{action.icon}</div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-2 font-medium">🔥 Trending Destinations</p>
              <div className="flex gap-2 flex-wrap">
                {trendingDestinations.map(dest => (
                  <button
                    key={dest.name}
                    onClick={() => handleDestinationClick(dest.name)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-solar-400 hover:text-solar-600 transition-all flex items-center gap-1"
                  >
                    <span>{dest.emoji}</span> {dest.name}
                    <span className="text-[10px] text-slate-400">• {dest.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-solar-100 border border-solar-200 flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden mt-1">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nara" alt="Bot" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-dark-card text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-dark-border rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-solar-100 border border-solar-200 flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden mt-1">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nara" alt="Bot" />
                  </div>
                <div className="bg-white dark:bg-dark-card p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-dark-border shadow-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-solar-500" size={16} />
                  <span className="text-xs text-slate-400 italic">Nara lagi mikir...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-dark-border">
            <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-3xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-solar-400 focus-within:bg-white dark:focus-within:bg-dark-card transition-all">
              <button type="button" className="p-2 text-slate-400 hover:text-solar-600 transition-colors">
                <Mic size={20} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanya rekomendasi..."
                className="flex-1 bg-transparent focus:outline-none text-sm py-2 max-h-24 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-solar-500 text-white rounded-full hover:bg-solar-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send size={18} className={inputValue.trim() ? "ml-0.5" : ""} />
              </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">Powered by Gemini Pro • NARA bisa salah, cek ulang ya!</p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default NaraAssistant;
