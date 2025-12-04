import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, MessageSquare, Send,
  Loader2, Sparkles, Globe, Settings, History, Trash2,
  ChevronRight, Bot, User, Zap, Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceCommand {
  trigger: string[];
  action: string;
  description: string;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  { trigger: ['hey nusa', 'hai nusa', 'halo nusa'], action: 'activate', description: 'Aktifkan asisten' },
  { trigger: ['cari tempat', 'find place', 'cari destinasi'], action: 'search', description: 'Cari destinasi wisata' },
  { trigger: ['buat itinerary', 'plan trip', 'rencanakan'], action: 'plan', description: 'Buat rencana perjalanan' },
  { trigger: ['cuaca hari ini', 'weather', 'prakiraan cuaca'], action: 'weather', description: 'Cek cuaca' },
  { trigger: ['translate', 'terjemahkan', 'artinya'], action: 'translate', description: 'Terjemahkan bahasa' },
  { trigger: ['terima kasih', 'thank you', 'thanks'], action: 'thanks', description: 'Akhiri percakapan' },
];

const QUICK_ACTIONS = [
  { icon: '🗺️', label: 'Rekomendasi Trip', prompt: 'Rekomendasikan destinasi wisata untuk liburan akhir pekan' },
  { icon: '🍜', label: 'Kuliner Lokal', prompt: 'Apa makanan khas yang harus dicoba di Yogyakarta?' },
  { icon: '💰', label: 'Tips Hemat', prompt: 'Tips hemat untuk traveling ke Bali dengan budget 2 juta' },
  { icon: '🏛️', label: 'Sejarah', prompt: 'Ceritakan sejarah Candi Borobudur' },
];

const AIVoiceAssistant: React.FC<{ userId: string }> = ({ userId }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', role: 'assistant',
      content: 'Halo! 👋 Saya Nusa, asisten perjalanan AI kamu. Bilang "Hey Nusa" atau ketik pertanyaan untuk mulai. Saya bisa bantu cari destinasi, buat itinerary, dan banyak lagi!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('id-ID');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
        
        if (event.results[current].isFinal) {
          handleVoiceInput(transcriptResult);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;
    await processMessage(text, true);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await processMessage(inputText, false);
    setInputText('');
  };

  const processMessage = async (text: string, isVoice: boolean) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));

    // Generate response based on input
    let response = generateResponse(text);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);

    // Speak response if voice enabled
    if (voiceEnabled) {
      speak(response);
    }
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('rekomendasi') || lowerInput.includes('destinasi') || lowerInput.includes('trip')) {
      return '🌴 Untuk liburan akhir pekan, saya rekomendasikan:\n\n1. **Bandung** - Wisata alam & kuliner (2 jam dari Jakarta)\n2. **Yogyakarta** - Budaya & candi (1 jam flight)\n3. **Bali** - Pantai & sunset (1.5 jam flight)\n\nMau saya buatkan itinerary lengkap untuk salah satunya?';
    }

    if (lowerInput.includes('makanan') || lowerInput.includes('kuliner') || lowerInput.includes('makan')) {
      return '🍜 Kuliner khas yang wajib dicoba:\n\n1. **Gudeg** - Makanan legendaris Jogja\n2. **Bakpia** - Oleh-oleh favorit\n3. **Sate Klathak** - Sate khas Jogja\n4. **Wedang Ronde** - Minuman hangat tradisional\n\nMau tau lokasi resto terbaik?';
    }

    if (lowerInput.includes('hemat') || lowerInput.includes('budget') || lowerInput.includes('murah')) {
      return '💰 Tips hemat traveling:\n\n1. Book tiket 2-3 minggu sebelumnya\n2. Pilih homestay/guesthouse\n3. Makan di warung lokal\n4. Gunakan transportasi umum\n5. Kunjungi tempat gratis\n\nDengan Rp 2 juta bisa 3-4 hari di Bali!';
    }

    if (lowerInput.includes('sejarah') || lowerInput.includes('candi') || lowerInput.includes('borobudur')) {
      return '🏛️ Candi Borobudur dibangun sekitar abad ke-8 oleh Dinasti Sailendra. Ini adalah candi Buddha terbesar di dunia dengan 2.672 panel relief dan 504 arca Buddha. \n\nFun fact: Sempat terkubur abu vulkanik dan ditemukan kembali tahun 1814!';
    }

    if (lowerInput.includes('cuaca') || lowerInput.includes('weather')) {
      return '☀️ Cuaca hari ini di Jakarta:\n\n🌡️ Suhu: 32°C\n💧 Kelembaban: 75%\n🌤️ Kondisi: Cerah berawan\n\nCocok untuk jalan-jalan! Jangan lupa sunscreen ya!';
    }

    if (lowerInput.includes('terima kasih') || lowerInput.includes('thanks')) {
      return '😊 Sama-sama! Senang bisa membantu. Kalau ada pertanyaan lain tentang traveling, bilang aja "Hey Nusa"! Selamat liburan! 🌴';
    }

    return '🤔 Hmm, saya kurang mengerti. Coba tanyakan tentang:\n\n• Rekomendasi destinasi wisata\n• Kuliner lokal\n• Tips hemat traveling\n• Sejarah tempat wisata\n• Cuaca\n\nAtau bilang "Hey Nusa" untuk mulai percakapan baru!';
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Remove markdown formatting for speech
    const cleanText = text.replace(/\*\*/g, '').replace(/[#🌴🍜💰🏛️☀️😊🤔]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage;
    utterance.rate = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearHistory = () => {
    setMessages([{
      id: '1', role: 'assistant',
      content: 'Percakapan dihapus. Ada yang bisa saya bantu?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center relative">
          <Bot size={24} className="text-white" />
          {isListening && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hey Nusa</h1>
          <p className="text-slate-500 dark:text-slate-400">AI Voice Travel Assistant 🎤</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl ${voiceEnabled ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600' : 'bg-slate-100 dark:bg-slate-700'}`}>
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button onClick={clearHistory} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Voice Commands Info */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} className="text-cyan-600" />
          <span className="font-semibold text-cyan-700 dark:text-cyan-400">Voice Commands</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Hey Nusa', 'Cari tempat', 'Buat itinerary', 'Cuaca', 'Translate'].map(cmd => (
            <span key={cmd} className="px-2 py-1 bg-white dark:bg-slate-700 rounded-lg text-xs text-cyan-700 dark:text-cyan-400">
              "{cmd}"
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-emerald-500' : 'bg-cyan-500'
              }`}>
                {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-emerald-500 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  {message.isVoice && <Mic size={10} />}
                  <span>{message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-none p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {QUICK_ACTIONS.map((action, idx) => (
          <button key={idx} onClick={() => processMessage(action.prompt, false)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-700">
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Voice Input Indicator */}
      {isListening && (
        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-4 mb-4 text-center">
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 bg-cyan-500 rounded-full animate-pulse"
                style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <p className="text-cyan-700 dark:text-cyan-400 font-medium">
            {transcript || 'Mendengarkan...'}
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <button onClick={toggleListening}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}>
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
            placeholder="Ketik atau bilang 'Hey Nusa'..."
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
            disabled={isListening || isProcessing} />
          <button type="submit" disabled={!inputText.trim() || isProcessing}
            className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-50">
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-cyan-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <Volume2 size={16} className="animate-pulse" />
          <span className="text-sm font-medium">Nusa sedang berbicara...</span>
          <button onClick={stopSpeaking} className="ml-2 p-1 bg-white/20 rounded-full">
            <VolumeX size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AIVoiceAssistant;
