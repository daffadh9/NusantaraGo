import React, { useState, useRef } from 'react';
import { 
  Camera, Ticket, QrCode, Plane, Train, Bus, Ship,
  Calendar, Clock, MapPin, CheckCircle, AlertCircle,
  Upload, Loader2, Sparkles, FileText, Download, Trash2,
  Share2, CalendarPlus, Eye, ChevronDown, ChevronUp
} from 'lucide-react';

interface ScannedTicket {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'ship' | 'event' | 'hotel';
  title: string;
  from?: string;
  to?: string;
  date: string;
  time: string;
  bookingCode: string;
  passenger: string;
  seat?: string;
  gate?: string;
  status: 'upcoming' | 'used' | 'expired';
  rawImage: string;
  extractedData: Record<string, string>;
}

const TICKET_ICONS = {
  flight: Plane,
  train: Train,
  bus: Bus,
  ship: Ship,
  event: Ticket,
  hotel: MapPin
};

const SmartTicketScanner: React.FC<{ userId: string }> = ({ userId }) => {
  const [tickets, setTickets] = useState<ScannedTicket[]>([
    {
      id: '1', type: 'flight', title: 'Garuda Indonesia GA-401',
      from: 'Jakarta (CGK)', to: 'Bali (DPS)',
      date: '2025-01-15', time: '08:30', bookingCode: 'ABC123',
      passenger: 'Daffa Dhiyaulhaq', seat: '12A', gate: 'B7',
      status: 'upcoming', rawImage: '', extractedData: {}
    },
    {
      id: '2', type: 'train', title: 'Argo Bromo Anggrek',
      from: 'Gambir', to: 'Surabaya Gubeng',
      date: '2025-02-20', time: '20:00', bookingCode: 'TRN456',
      passenger: 'Daffa Dhiyaulhaq', seat: 'EKS-1', 
      status: 'upcoming', rawImage: '', extractedData: {}
    }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedTicket | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'tickets'>('tickets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (file: File) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2000));

    // Mock extracted ticket
    const mockTicket: ScannedTicket = {
      id: Date.now().toString(),
      type: 'flight',
      title: 'Lion Air JT-510',
      from: 'Surabaya (SUB)',
      to: 'Makassar (UPG)',
      date: '2025-03-10',
      time: '14:45',
      bookingCode: 'LN' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      passenger: 'Daffa Dhiyaulhaq',
      seat: '8C',
      gate: 'A3',
      status: 'upcoming',
      rawImage: URL.createObjectURL(file),
      extractedData: {
        'Airline': 'Lion Air',
        'Flight': 'JT-510',
        'Class': 'Economy'
      }
    };

    setScanResult(mockTicket);
    setIsScanning(false);
  };

  const saveTicket = () => {
    if (scanResult) {
      setTickets(prev => [scanResult, ...prev]);
      setScanResult(null);
      setActiveTab('tickets');
    }
  };

  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const addToCalendar = (ticket: ScannedTicket) => {
    // In real app: Use native calendar API
    const event = {
      title: ticket.title,
      start: `${ticket.date}T${ticket.time}`,
      location: `${ticket.from} to ${ticket.to}`
    };
    alert(`📅 Tiket ditambahkan ke kalender!\n${ticket.title} - ${ticket.date}`);
  };

  const shareTicket = (ticket: ScannedTicket) => {
    const text = `🎫 ${ticket.title}\n📍 ${ticket.from} → ${ticket.to}\n📅 ${ticket.date} ${ticket.time}\n🎟️ Booking: ${ticket.bookingCode}`;
    if (navigator.share) {
      navigator.share({ title: 'My Ticket', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('✅ Info tiket disalin ke clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <QrCode size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Ticket Scanner</h1>
          <p className="text-slate-500 dark:text-slate-400">Scan & organize tiket otomatis 🎫</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('scan')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'scan' ? 'bg-white dark:bg-slate-700 text-violet-600 shadow' : 'text-slate-500'
          }`}>
          <Camera size={18} /> Scan Tiket
        </button>
        <button onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tickets' ? 'bg-white dark:bg-slate-700 text-violet-600 shadow' : 'text-slate-500'
          }`}>
          <Ticket size={18} /> My Tickets ({tickets.length})
        </button>
      </div>

      {activeTab === 'scan' && (
        <div className="space-y-4">
          {/* Scan Area */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleScan(e.target.files[0])} />
            
            {isScanning ? (
              <div className="text-center py-12">
                <Loader2 size={48} className="mx-auto text-violet-500 animate-spin mb-4" />
                <p className="text-slate-600 dark:text-slate-400">AI sedang membaca tiket...</p>
                <p className="text-sm text-slate-400">Extracting booking info dengan AI</p>
              </div>
            ) : scanResult ? (
              /* Scan Result */
              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-4">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Tiket berhasil di-scan!</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    {React.createElement(TICKET_ICONS[scanResult.type], { size: 24, className: 'text-violet-500' })}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{scanResult.title}</h4>
                      <p className="text-sm text-slate-500">{scanResult.from} → {scanResult.to}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar size={14} /> {scanResult.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Clock size={14} /> {scanResult.time}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-xs text-slate-500">Booking Code</p>
                    <p className="font-mono font-bold text-lg text-violet-600">{scanResult.bookingCode}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={saveTicket}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-semibold">
                    ✅ Simpan Tiket
                  </button>
                  <button onClick={() => setScanResult(null)}
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl">
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-violet-400 transition-colors">
                <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} className="text-violet-500" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Scan atau Upload Tiket</h4>
                <p className="text-sm text-slate-500 mb-4">Foto tiket, boarding pass, atau e-ticket</p>
                <button className="px-6 py-2 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600">
                  <Upload size={16} className="inline mr-2" /> Upload Gambar
                </button>
              </div>
            )}
          </div>

          {/* Supported Formats */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" /> AI Support
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {['✈️ Flight', '🚄 Train', '🚌 Bus', '⛴️ Ship', '🎫 Event', '🏨 Hotel'].map(type => (
                <div key={type} className="text-center py-2 bg-white dark:bg-slate-700 rounded-lg text-sm">
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Belum ada tiket tersimpan</p>
            </div>
          ) : (
            tickets.map(ticket => {
              const Icon = TICKET_ICONS[ticket.type];
              const isExpanded = expandedTicket === ticket.id;
              return (
                <div key={ticket.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">
                  {/* Status Badge */}
                  <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                    ticket.status === 'upcoming' ? 'bg-emerald-500 text-white' :
                    ticket.status === 'used' ? 'bg-slate-400 text-white' : 'bg-red-500 text-white'
                  }`}>
                    <span>{ticket.status === 'upcoming' ? '🟢 Upcoming' : ticket.status === 'used' ? '✓ Used' : '⏰ Expired'}</span>
                    <span className="font-mono">{ticket.bookingCode}</span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={24} className="text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white">{ticket.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{ticket.from} → {ticket.to}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {ticket.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {ticket.time}</span>
                          {ticket.seat && <span className="bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded text-violet-600 dark:text-violet-400 font-bold">Seat {ticket.seat}</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)} 
                        className="p-2 text-slate-400 hover:text-violet-500"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Expanded Actions */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                        {/* QR Code Placeholder */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4 text-center">
                          <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-slate-200">
                            <QrCode size={80} className="text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-500 mt-2">Scan QR ini di counter / gate</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button 
                            onClick={() => addToCalendar(ticket)}
                            className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <CalendarPlus size={14} /> Kalender
                          </button>
                          <button 
                            onClick={() => shareTicket(ticket)}
                            className="py-2 px-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Share2 size={14} /> Share
                          </button>
                          <button 
                            onClick={() => deleteTicket(ticket.id)}
                            className="py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>

                        {/* Additional Info */}
                        {ticket.gate && (
                          <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-center">
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Gate: </span>
                            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{ticket.gate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SmartTicketScanner;
