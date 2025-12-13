import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Share2, Users, Shield, Phone, AlertTriangle,
  Navigation, Clock, Battery, Signal, Eye, EyeOff,
  UserPlus, Copy, Check, Bell, Loader2, Compass, MessageCircle,
  PhoneCall, Map, Link2, Power, PlayCircle, StopCircle
} from 'lucide-react';

interface TripShare {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  shareCode: string;
  isLive: boolean;
  currentLocation?: { lat: number; lng: number; address: string; };
  lastUpdate?: string;
  viewers: { id: string; name: string; avatar: string; }[];
  sosEnabled: boolean;
  batteryLevel: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const LiveTripSharing: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeTrip, setActiveTrip] = useState<TripShare | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'contacts' | 'history'>('share');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Mama', phone: '+62812345678', relation: 'Ibu' },
    { id: '2', name: 'Ayah', phone: '+62812345679', relation: 'Ayah' }
  ]);
  
  // GPS Tracking States
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [trackingAccuracy, setTrackingAccuracy] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  
  // Communication States
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const [tripForm, setTripForm] = useState({
    tripName: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  // Start GPS tracking
  useEffect(() => {
    if (isSharing && gpsEnabled) {
      if ('geolocation' in navigator) {
        // Request high-accuracy GPS tracking
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentPosition(position);
            setTrackingAccuracy(position.coords.accuracy);
            setLocationError(null);
            
            // Update trip location
            if (activeTrip) {
              // Reverse geocode to get address (mock for now)
              setActiveTrip({
                ...activeTrip,
                currentLocation: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
                },
                lastUpdate: new Date().toLocaleTimeString(),
                batteryLevel: Math.floor(Math.random() * 20) + 75 // Mock battery
              });
            }
          },
          (error) => {
            setLocationError(error.message);
            setGpsEnabled(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError('GPS tidak tersedia di browser ini');
      }
    }
    
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isSharing, gpsEnabled]);
  
  const startSharing = () => {
    const newTrip: TripShare = {
      id: Date.now().toString(),
      ...tripForm,
      shareCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      isLive: true,
      currentLocation: { lat: -6.2088, lng: 106.8456, address: 'Menunggu GPS...' },
      lastUpdate: new Date().toLocaleTimeString(),
      viewers: [],
      sosEnabled: true,
      batteryLevel: 85
    };
    setActiveTrip(newTrip);
    setIsSharing(true);
    setGpsEnabled(true);
  };

  const copyShareCode = () => {
    if (activeTrip) {
      navigator.clipboard.writeText(`https://nusantarago.id/track/${activeTrip.shareCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosTriggered, setSosTriggered] = useState(false);

  const sendSOSMessage = () => {
    if (!currentPosition || !activeTrip) return;
    
    const location = `https://www.google.com/maps?q=${currentPosition.coords.latitude},${currentPosition.coords.longitude}`;
    const message = `🆘 DARURAT! ${activeTrip.tripName}. Lokasi saya: ${location}. Mohon bantuan segera!`;
    
    // Send to all emergency contacts
    emergencyContacts.forEach(contact => {
      // SMS (will open default SMS app)
      const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
      window.open(smsUrl, '_blank');
    });
  };
  
  const triggerSOS = () => {
    setShowSOS(true);
    setSosCountdown(5);
    
    // Countdown before sending SOS
    const interval = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSosTriggered(true);
          sendSOSMessage();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setShowSOS(false);
    setSosCountdown(5);
    setSosTriggered(false);
  };
  
  const callEmergencyContact = (contact: EmergencyContact) => {
    window.location.href = `tel:${contact.phone}`;
  };
  
  const sendMessageToContact = (contact: EmergencyContact) => {
    if (!currentPosition || !activeTrip) return;
    
    const location = `https://www.google.com/maps?q=${currentPosition.coords.latitude},${currentPosition.coords.longitude}`;
    const message = `Halo ${contact.name}, saya sedang di ${activeTrip.tripName}. Lokasi: ${location}`;
    const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };
  
  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, {
        id: Date.now().toString(),
        ...newContact
      }]);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowContactModal(false);
    }
  };
  
  const removeContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95">
            {!sosTriggered ? (
              <>
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <span className="text-4xl font-bold text-white">{sosCountdown}</span>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">🚨 Mengirim SOS...</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Alert akan dikirim ke kontak darurat dalam {sosCountdown} detik.
                  <br/>Tekan tombol di bawah untuk membatalkan.
                </p>
                <button
                  onClick={cancelSOS}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300"
                >
                  BATALKAN
                </button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">✅ SOS Terkirim!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Alert darurat telah dikirim ke:
                </p>
                <div className="space-y-2 mb-6">
                  {emergencyContacts.map(c => (
                    <div key={c.id} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm">
                      <strong>{c.name}</strong> ({c.relation}) - {c.phone}
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-sm text-amber-700 dark:text-amber-400 mb-4">
                  <strong>Nomor Darurat Indonesia:</strong><br/>
                  🚔 Polisi: 110 | 🚑 Ambulans: 119 | 🚒 Damkar: 113
                </div>
                <button
                  onClick={cancelSOS}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold"
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
          <Share2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Trip Sharing</h1>
          <p className="text-slate-500 dark:text-slate-400">Share lokasi real-time dengan keluarga 📍</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'share', label: 'Share Trip', icon: <Navigation size={18} /> },
          { id: 'contacts', label: 'Emergency', icon: <Phone size={18} /> },
          { id: 'history', label: 'History', icon: <Clock size={18} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-blue-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'share' && (
        <>
          {!isSharing ? (
            /* Start New Share */
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Mulai Share Trip</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Trip</label>
                  <input type="text" placeholder="Liburan ke Bali"
                    value={tripForm.tripName} onChange={e => setTripForm({...tripForm, tripName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Destinasi</label>
                  <input type="text" placeholder="Bali, Indonesia"
                    value={tripForm.destination} onChange={e => setTripForm({...tripForm, destination: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mulai</label>
                    <input type="date" value={tripForm.startDate} 
                      onChange={e => setTripForm({...tripForm, startDate: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Selesai</label>
                    <input type="date" value={tripForm.endDate}
                      onChange={e => setTripForm({...tripForm, endDate: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0" />
                  </div>
                </div>
              </div>

              <button onClick={startSharing}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Navigation size={20} /> Mulai Share Lokasi
              </button>
            </div>
          ) : (
            /* Active Sharing */
            <div className="space-y-4">
              {/* Live Status */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-bold">LIVE</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Battery size={16} /> {activeTrip?.batteryLevel}%
                    <Signal size={16} /> Strong
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{activeTrip?.tripName}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <MapPin size={14} /> {activeTrip?.currentLocation?.address}
                </div>
                <p className="text-xs mt-2 opacity-75">Update terakhir: {activeTrip?.lastUpdate}</p>
              </div>

              {/* Share Code */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
                <label className="block text-sm font-medium text-slate-500 mb-2">Share Link</label>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={`nusantarago.id/track/${activeTrip?.shareCode}`}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm" />
                  <button onClick={copyShareCode}
                    className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Viewers */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    <Eye size={16} className="inline mr-2" />
                    {activeTrip?.viewers.length || 0} orang memantau
                  </span>
                  <button className="text-blue-500 text-sm font-semibold">+ Invite</button>
                </div>
              </div>

              {/* SOS Button */}
              <button onClick={triggerSOS}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg">
                <AlertTriangle size={24} /> 🆘 EMERGENCY SOS
              </button>

              {/* Stop Sharing */}
              <button onClick={() => setIsSharing(false)}
                className="w-full py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-2xl font-semibold">
                Stop Sharing
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {/* Add Contact Modal */}
          {showContactModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tambah Kontak Darurat</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama</label>
                    <input type="text" placeholder="Nama lengkap"
                      value={newContact.name}
                      onChange={e => setNewContact({...newContact, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nomor HP</label>
                    <input type="tel" placeholder="+628123456789"
                      value={newContact.phone}
                      onChange={e => setNewContact({...newContact, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hubungan</label>
                    <select value={newContact.relation}
                      onChange={e => setNewContact({...newContact, relation: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-blue-500">
                      <option value="">Pilih hubungan</option>
                      <option value="Orangtua">Orangtua</option>
                      <option value="Saudara">Saudara</option>
                      <option value="Pasangan">Pasangan</option>
                      <option value="Teman">Teman</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowContactModal(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300">
                    Batal
                  </button>
                  <button onClick={addEmergencyContact}
                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Kontak Darurat</h3>
            <div className="space-y-3">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Phone size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-slate-500">{contact.phone} • {contact.relation}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => callEmergencyContact(contact)}
                      className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                      <PhoneCall size={16} className="text-green-600 dark:text-green-400" />
                    </button>
                    <button onClick={() => sendMessageToContact(contact)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowContactModal(true)}
              className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 font-semibold flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-500 transition-colors">
              <UserPlus size={18} /> Tambah Kontak
            </button>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-2">💡 Tips Keselamatan</h4>
            <ul className="text-sm text-amber-600 dark:text-amber-500 space-y-1">
              <li>• Share lokasi ke minimal 2 orang terpercaya</li>
              <li>• Pastikan baterai HP selalu terisi</li>
              <li>• Simpan nomor darurat lokal (110, 119)</li>
              <li>• Aktifkan SOS di HP kamu</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Belum ada riwayat sharing</p>
        </div>
      )}
    </div>
  );
};

export default LiveTripSharing;
