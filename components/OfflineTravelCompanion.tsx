import React, { useState } from 'react';
import { 
  WifiOff, Download, Check, Map, FileText, Image, Music, 
  Phone, AlertTriangle, Battery, Signal, Cloud, CloudOff,
  MapPin, Navigation, Compass, BookOpen, Languages, Volume2,
  Shield, Heart, Clock, Zap, Trash2, RefreshCw, HardDrive
} from 'lucide-react';

interface OfflineContent {
  id: string;
  type: 'map' | 'itinerary' | 'phrasebook' | 'emergency' | 'guide';
  title: string;
  size: string;
  downloaded: boolean;
  lastSync: string;
  region?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'ambulance' | 'hospital' | 'embassy' | 'personal';
}

const OfflineTravelCompanion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'companion' | 'emergency'>('downloads');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([
    { id: '1', type: 'map', title: 'Peta Bali Offline', size: '45 MB', downloaded: true, lastSync: '2 jam lalu', region: 'Bali' },
    { id: '2', type: 'itinerary', title: 'Itinerary Bali Trip', size: '2.5 MB', downloaded: true, lastSync: '1 jam lalu' },
    { id: '3', type: 'phrasebook', title: 'Bahasa Bali Dasar', size: '8 MB', downloaded: true, lastSync: '3 hari lalu' },
    { id: '4', type: 'emergency', title: 'Info Darurat Bali', size: '1.2 MB', downloaded: true, lastSync: '1 minggu lalu' },
    { id: '5', type: 'guide', title: 'Panduan Ubud', size: '15 MB', downloaded: false, lastSync: '-', region: 'Ubud' },
    { id: '6', type: 'map', title: 'Peta Yogyakarta', size: '38 MB', downloaded: false, lastSync: '-', region: 'Yogyakarta' }
  ]);

  const emergencyContacts: EmergencyContact[] = [
    { id: 'e1', name: 'Polisi', number: '110', type: 'police' },
    { id: 'e2', name: 'Ambulans', number: '118', type: 'ambulance' },
    { id: 'e3', name: 'RSUP Sanglah Bali', number: '(0361) 227911', type: 'hospital' },
    { id: 'e4', name: 'Basarnas', number: '115', type: 'ambulance' },
    { id: 'e5', name: 'Contact Darurat (Keluarga)', number: '+62 812-xxxx-xxxx', type: 'personal' }
  ];

  const phrases = [
    { id: 'p1', indo: 'Selamat pagi', english: 'Good morning', local: 'Rahajeng semeng', audio: true },
    { id: 'p2', indo: 'Terima kasih', english: 'Thank you', local: 'Suksma', audio: true },
    { id: 'p3', indo: 'Berapa harganya?', english: 'How much?', local: 'Kuda aji?', audio: true },
    { id: 'p4', indo: 'Tolong!', english: 'Help!', local: 'Tulung!', audio: true },
    { id: 'p5', indo: 'Di mana toilet?', english: 'Where is the toilet?', local: 'Dija WC?', audio: true }
  ];

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      map: <Map size={20} />,
      itinerary: <FileText size={20} />,
      phrasebook: <Languages size={20} />,
      emergency: <Shield size={20} />,
      guide: <BookOpen size={20} />
    };
    return icons[type] || <FileText size={20} />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      map: 'bg-blue-500',
      itinerary: 'bg-emerald-500',
      phrasebook: 'bg-purple-500',
      emergency: 'bg-red-500',
      guide: 'bg-amber-500'
    };
    return colors[type] || 'bg-slate-500';
  };

  const getContactIcon = (type: string) => {
    const icons: Record<string, string> = { police: '🚔', ambulance: '🚑', hospital: '🏥', embassy: '🏛️', personal: '👤' };
    return icons[type] || '📞';
  };

  const toggleDownload = (id: string) => {
    setOfflineContent(prev => prev.map(c => c.id === id ? { ...c, downloaded: !c.downloaded } : c));
  };

  const downloadedSize = offlineContent.filter(c => c.downloaded).reduce((a, b) => a + parseFloat(b.size), 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 ${isOfflineMode ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'} rounded-2xl flex items-center justify-center shadow-lg transition-all`}>
            {isOfflineMode ? <WifiOff className="text-white" size={28} /> : <Cloud className="text-white" size={28} />}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Offline Travel Companion</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Tetap terhubung meski tanpa internet</p>
          </div>
        </div>
        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold shadow-lg transition-all ${
            isOfflineMode ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          {isOfflineMode ? <WifiOff size={20} /> : <Cloud size={20} />}
          {isOfflineMode ? 'Mode Offline Aktif' : 'Mode Online'}
        </button>
      </div>

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <WifiOff size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Mode Offline Aktif</h3>
            <p className="text-sm opacity-90">Semua konten offline tersedia. Fitur online tidak aktif.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1"><Battery size={16} /> 85%</div>
            <div className="flex items-center gap-1"><Signal size={16} /> No Signal</div>
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="text-emerald-600" size={20} />
            <span className="font-bold text-slate-900 dark:text-white">Penyimpanan Offline</span>
          </div>
          <span className="text-sm text-slate-500">{downloadedSize.toFixed(1)} MB terpakai</span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${Math.min(100, (downloadedSize / 200) * 100)}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{offlineContent.filter(c => c.downloaded).length} item</span>
          <span>200 MB limit</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
        {[
          { id: 'downloads', label: 'Downloads', icon: Download },
          { id: 'companion', label: 'Companion', icon: Compass },
          { id: 'emergency', label: 'Emergency', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Downloads Tab */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Konten Offline</h3>
            <button className="text-emerald-600 text-sm font-bold flex items-center gap-1">
              <RefreshCw size={16} /> Sync All
            </button>
          </div>
          {offlineContent.map(content => (
            <div key={content.id} className={`bg-white dark:bg-slate-800 rounded-2xl border ${content.downloaded ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${getTypeColor(content.type)} rounded-xl flex items-center justify-center text-white`}>
                  {getTypeIcon(content.type)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{content.title}</div>
                  <div className="text-sm text-slate-500">
                    {content.size} • {content.downloaded ? `Sync: ${content.lastSync}` : 'Belum diunduh'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleDownload(content.id)}
                className={`p-3 rounded-xl transition-all ${
                  content.downloaded 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-600'
                }`}
              >
                {content.downloaded ? <Check size={20} /> : <Download size={20} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Companion Tab */}
      {activeTab === 'companion' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Compass, label: 'Compass', color: 'from-blue-500 to-indigo-600' },
              { icon: MapPin, label: 'Saved Places', color: 'from-emerald-500 to-teal-600' },
              { icon: Languages, label: 'Phrasebook', color: 'from-purple-500 to-violet-600' },
              { icon: Clock, label: 'World Clock', color: 'from-amber-500 to-orange-600' }
            ].map((action, i) => (
              <button key={i} className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white text-center hover:shadow-lg transition-all`}>
                <action.icon className="mx-auto mb-2" size={28} />
                <span className="font-bold text-sm">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Phrasebook Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Languages size={20} /> Phrasebook Bahasa Bali
            </h3>
            <div className="space-y-3">
              {phrases.map(phrase => (
                <div key={phrase.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{phrase.indo}</div>
                    <div className="text-sm text-slate-500">{phrase.english}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">{phrase.local}</div>
                  </div>
                  <button className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors">
                    <Volume2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          {/* SOS Button */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-center text-white">
            <button className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-all hover:scale-110 animate-pulse">
              <AlertTriangle size={40} />
            </button>
            <h3 className="text-2xl font-bold mb-2">SOS Emergency</h3>
            <p className="text-sm opacity-90">Tekan untuk mengirim lokasi ke kontak darurat</p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Phone size={20} /> Kontak Darurat
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map(contact => (
                <a
                  key={contact.id}
                  href={`tel:${contact.number.replace(/\D/g, '')}`}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-2xl">
                      {getContactIcon(contact.type)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{contact.name}</div>
                      <div className="text-sm text-red-600 dark:text-red-400 font-mono">{contact.number}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-red-500 text-white rounded-xl">
                    <Phone size={20} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-5">
            <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3">
              <Shield size={20} /> Tips Keamanan
            </h3>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li>• Simpan copy paspor & ID di cloud</li>
              <li>• Share lokasi real-time ke keluarga</li>
              <li>• Catat alamat hotel/penginapan</li>
              <li>• Siapkan uang tunai darurat</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineTravelCompanion;
