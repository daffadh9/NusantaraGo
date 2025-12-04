import React, { useState } from 'react';
import { 
  User, Lock, Globe, CreditCard, Bell, HelpCircle, FileText, 
  LogOut, ChevronRight, Moon, Sun, Monitor, Trash2, Link2, 
  Users, Wallet, MapPin, Settings as SettingsIcon, Check, Shield
} from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, isDarkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'display' | 'notifications' | 'payment' | 'preferences' | 'help'>('account');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(isDarkMode ? 'dark' : 'light');
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    transactions: true,
    promos: true,
    reminders: true,
    community: false,
  });

  const menuItems = [
    { id: 'account' as const, icon: User, label: 'Akun', desc: 'Detail pribadi & keamanan' },
    { id: 'display' as const, icon: Monitor, label: 'Tampilan', desc: 'Theme & bahasa' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifikasi', desc: 'Kelola pemberitahuan' },
    { id: 'payment' as const, icon: Wallet, label: 'Pembayaran', desc: 'Metode & wallet' },
    { id: 'preferences' as const, icon: MapPin, label: 'Preferensi', desc: 'Travel style & data' },
    { id: 'help' as const, icon: HelpCircle, label: 'Bantuan', desc: 'FAQ & support' },
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'dark' && !isDarkMode) {
      toggleDarkMode();
    } else if (newTheme === 'light' && isDarkMode) {
      toggleDarkMode();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-emerald-600 dark:text-emerald-400" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Kelola akun dan preferensi kamu</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid md:grid-cols-4 gap-6">
        
        {/* Sidebar Menu */}
        <div className="md:col-span-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
              <div className="flex-1 text-left">
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-xs opacity-70">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          
          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={24} /> Pusat Akun
              </h2>
              
              {/* Detail Pribadi */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Detail Pribadi</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Nomor Telepon"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Kata Sandi */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Lock size={18} /> Kata Sandi & Keamanan
                </h3>
                <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-between">
                  <span>Ubah Kata Sandi</span>
                  <ChevronRight size={18} />
                </button>
                <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-between">
                  <span>Verifikasi Akun</span>
                  <Shield size={18} className="text-emerald-500" />
                </button>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Link2 size={18} /> Akun Terhubung
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">Google</div>
                      <div className="text-xs text-slate-500">Terhubung</div>
                    </div>
                  </div>
                  <button className="text-red-500 text-sm font-semibold hover:underline">Putus</button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Hapus Akun
                </button>
              </div>
            </div>
          )}

          {/* DISPLAY TAB */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Monitor size={24} /> Tampilan
              </h2>

              {/* Theme */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Terang' },
                    { value: 'dark', icon: Moon, label: 'Gelap' },
                    { value: 'system', icon: Monitor, label: 'Sistem' },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value as 'light' | 'dark' | 'system')}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        theme === value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-sm font-semibold">{label}</span>
                      {theme === value && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Globe size={18} /> Bahasa
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'id', label: '🇮🇩 Indonesia', name: 'Bahasa Indonesia' },
                    { value: 'en', label: '🇬🇧 English', name: 'English (US)' },
                  ].map(({ value, label, name }) => (
                    <button
                      key={value}
                      onClick={() => setLanguage(value as 'id' | 'en')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        language === value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Wallet size={18} /> Mata Uang
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'IDR', label: 'IDR', name: 'Rupiah Indonesia' },
                    { value: 'USD', label: 'USD', name: 'US Dollar' },
                  ].map(({ value, label, name }) => (
                    <button
                      key={value}
                      onClick={() => setCurrency(value as 'IDR' | 'USD')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        currency === value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell size={24} /> Notifikasi
              </h2>

              {/* Notification Toggles */}
              <div className="space-y-4">
                {[
                  { key: 'transactions', label: 'Status Transaksi', desc: 'Pembayaran, booking, dan konfirmasi tiket', required: true },
                  { key: 'promos', label: 'Promo & Diskon', desc: 'Penawaran spesial dan flash sale', required: false },
                  { key: 'reminders', label: 'Pengingat Perjalanan', desc: 'H-1 sebelum keberangkatan', required: false },
                  { key: 'community', label: 'Aktivitas Komunitas', desc: 'Komentar, like, dan mention', required: false },
                ].map(({ key, label, desc, required }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {label}
                        {required && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">Wajib</span>}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{desc}</div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={notifications[key as keyof typeof notifications]}
                        onChange={() => !required && setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))}
                        disabled={required}
                        className="sr-only peer"
                      />
                      <div className={`w-12 h-6 rounded-full transition-all ${
                        notifications[key as keyof typeof notifications]
                          ? 'bg-emerald-500'
                          : 'bg-slate-300 dark:bg-slate-600'
                      } ${required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[key as keyof typeof notifications] ? 'translate-x-6' : ''
                        }`} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet size={24} /> Metode Pembayaran
              </h2>

              <p className="text-slate-600 dark:text-slate-400">Pilih dan simpan metode pembayaran untuk checkout lebih cepat</p>

              {/* Bank & Kartu Kredit */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CreditCard size={18} /> Bank & Kartu Kredit
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['BCA', 'Mandiri', 'BNI', 'BRI', 'VISA', 'Mastercard'].map(bank => (
                    <button key={bank} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-center font-semibold text-slate-700 dark:text-slate-300">
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Account */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">💳 Virtual Account</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['BCA VA', 'Mandiri VA', 'BNI VA', 'Permata VA'].map(va => (
                    <button key={va} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-center font-semibold text-slate-700 dark:text-slate-300">
                      {va}
                    </button>
                  ))}
                </div>
              </div>

              {/* E-Wallet */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">📱 E-Wallet</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'GoPay', color: 'bg-green-500' },
                    { name: 'ShopeePay', color: 'bg-orange-500' },
                    { name: 'DANA', color: 'bg-blue-500' },
                    { name: 'OVO', color: 'bg-purple-500' },
                    { name: 'LinkAja', color: 'bg-red-500' },
                  ].map(wallet => (
                    <button key={wallet.name} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-center font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${wallet.color}`}></span>
                      {wallet.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Retail */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">🏪 Retail / Gerai</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Alfamart', 'Indomaret', 'Alfamidi'].map(retail => (
                    <button key={retail} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-center font-semibold text-slate-700 dark:text-slate-300">
                      {retail}
                    </button>
                  ))}
                </div>
              </div>

              {/* QRIS */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">📷 QRIS</h3>
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-3xl">📷</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Scan QRIS</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Bayar dengan scan QR code di semua merchant QRIS</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Saved Methods */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">✅ Metode Tersimpan</h3>
                {[
                  { type: 'card', last4: '8888', brand: 'VISA', icon: '💳' },
                  { type: 'ewallet', name: 'GoPay', phone: '0812****3456', icon: '📱' },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {method.type === 'card' ? 'Kartu Kredit' : method.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded">Default</span>
                      <button className="text-red-500 text-sm font-semibold hover:underline">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin size={24} /> Preferensi Travel
              </h2>

              {/* Travel Style */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Gaya Liburan Default</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Budget', 'Comfort', 'Luxury', 'Nature', 'City', 'Kuliner'].map(style => (
                    <button
                      key={style}
                      className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Travelers */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Users size={18} /> Data Penumpang Tersimpan
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Simpan data keluarga untuk booking lebih cepat</p>
                <button className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  + Tambah Penumpang
                </button>
              </div>
            </div>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={24} /> Bantuan & Support
              </h2>

              <div className="space-y-3">
                {[
                  { icon: HelpCircle, label: 'Pusat Bantuan (FAQ)', href: '#' },
                  { icon: FileText, label: 'Syarat & Ketentuan', href: '/terms.html' },
                  { icon: Shield, label: 'Kebijakan Privasi', href: '/privacy.html' },
                  { icon: Users, label: 'Hubungi Customer Service', href: '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">{label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </a>
                ))}
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
