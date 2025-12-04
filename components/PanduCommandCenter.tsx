
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Zap, Shield, Heart, Camera, Coffee, Mic } from 'lucide-react';
import { PanduMessage } from '../types';
import { askPandu, getRandomWelcomeMessage, PANDU_AGENTS } from '../services/panduService';

interface PanduCommandCenterProps {
  onClose: () => void;
  userName: string;
}

const PanduCommandCenter: React.FC<PanduCommandCenterProps> = ({ onClose, userName }) => {
  const [messages, setMessages] = useState<PanduMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with random welcome
  useEffect(() => {
    const welcome = getRandomWelcomeMessage();
    setMessages([welcome]);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: PanduMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setActiveAgent(null); // System thinking...

    try {
      const response = await askPandu(userMsg.text, `User is ${userName}`);
      setActiveAgent(response.agentId || 'nara');
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
      // Reset active agent highlight after a while
      setTimeout(() => setActiveAgent(null), 3000);
    }
  };

  const getAgentIcon = (id: string) => {
    switch(id) {
      case 'nara': return <Zap size={14} />;
      case 'bima': return <Bot size={14} />;
      case 'sigap': return <Shield size={14} />;
      case 'rasa': return <Coffee size={14} />;
      case 'citra': return <Camera size={14} />;
      default: return <Bot size={14} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-[85vh] bg-slate-900/90 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Futuristic Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00A86B 1px, transparent 1px), linear-gradient(90deg, #00A86B 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* Header */}
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 animate-pulse">
               <Bot className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-bold tracking-wider">PANDU <span className="text-emerald-400">AI</span></h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-400 font-mono">5 AGENTS ONLINE</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Agents Status Bar */}
        <div className="relative z-10 px-4 py-2 bg-slate-900/50 border-b border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
          {Object.values(PANDU_AGENTS).map(agent => (
            <div 
              key={agent.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                activeAgent === agent.id 
                  ? 'bg-white/10 border-white/40 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                  : 'bg-transparent border-slate-700 opacity-60'
              }`}
              style={{ borderColor: activeAgent === agent.id ? agent.color : '' }}
            >
              <img src={agent.avatar} className="w-5 h-5 rounded-full bg-white/10" alt={agent.name} />
              <span className="text-xs font-bold text-slate-200" style={{ color: activeAgent === agent.id ? agent.color : '' }}>{agent.name}</span>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end'} gap-3 group`}>
              
              {msg.role === 'assistant' && msg.agentId && PANDU_AGENTS[msg.agentId] && (
                 <div className="flex flex-col items-center gap-1 mb-1">
                   <div 
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-slate-800 overflow-hidden shadow-lg transition-transform group-hover:scale-110"
                      style={{ borderColor: msg.uiColor }}
                   >
                      <img src={PANDU_AGENTS[msg.agentId].avatar} alt={msg.agentName} />
                   </div>
                 </div>
              )}

              <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <span className="text-[10px] font-bold mb-1 ml-2 opacity-80" style={{ color: msg.uiColor }}>
                    {msg.agentName} • {PANDU_AGENTS[msg.agentId as string]?.role}
                  </span>
                )}
                
                <div 
                  className={`px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm border ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600/90 text-white rounded-tr-none border-emerald-500/50' 
                      : 'bg-slate-800/80 text-slate-100 rounded-tl-none border-slate-700'
                  }`}
                  style={msg.role === 'assistant' ? { boxShadow: `0 4px 20px -5px ${msg.uiColor}20` } : {}}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 mx-2 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex justify-start items-end gap-3">
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 animate-pulse"></div>
               <div className="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  <span className="ml-2 font-mono">ORCHESTRATING...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 p-4 bg-slate-900/90 border-t border-slate-800">
           <form onSubmit={handleSend} className="relative flex items-center gap-3">
              <div className="bg-slate-800/50 p-3 rounded-full text-slate-400 border border-slate-700 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors cursor-pointer">
                 <Mic size={20} />
              </div>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tanya Nara soal promo, atau Bima soal budaya..."
                className="flex-1 bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 placeholder-slate-500"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <Send size={20} className={inputText.trim() ? "translate-x-0.5" : ""} />
              </button>
           </form>
           <div className="text-center mt-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Powered by Pandu AI Multi-Agent System v1.0
           </div>
        </div>

      </div>
    </div>
  );
};

export default PanduCommandCenter;
