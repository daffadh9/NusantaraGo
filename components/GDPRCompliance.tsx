import React from 'react';
import { Shield, Lock, Eye, Download, Trash2, Edit } from 'lucide-react';

const GDPRCompliance: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-black p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-12 rounded-3xl mb-8">
        <Shield size={48} className="mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4 text-center">GDPR Compliance</h1>
        <p className="text-xl text-center">Your Data Rights & Our Commitment</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">What is GDPR?</h2>
          <p className="text-slate-600 dark:text-slate-300">
            General Data Protection Regulation (GDPR) adalah regulasi perlindungan data dari EU. 
            Meskipun NusantaraGo berbasis di Indonesia, kami menerapkan standar GDPR untuk melindungi 
            hak privasi semua pengguna kami di seluruh dunia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Hak Anda (Your Rights)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Eye, title: 'Right to Access', desc: 'Lihat data pribadi yang kami simpan tentang Anda' },
              { icon: Edit, title: 'Right to Rectification', desc: 'Update atau koreksi data yang tidak akurat' },
              { icon: Trash2, title: 'Right to Erasure', desc: 'Hapus data Anda ("right to be forgotten")' },
              { icon: Download, title: 'Right to Portability', desc: 'Download data Anda dalam format portabel' },
              { icon: Lock, title: 'Right to Restriction', desc: 'Batasi cara kami process data Anda' },
              { icon: Shield, title: 'Right to Object', desc: 'Tolak processing untuk marketing purposes' }
            ].map((right, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex gap-3">
                <right.icon className="text-emerald-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold mb-1">{right.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{right.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            <li>• Account info: Name, email, profile photo</li>
            <li>• Travel preferences: Budget, interests, destinations</li>
            <li>• Usage data: App interactions, features used</li>
            <li>• Device info: Browser type, IP address (anonymized)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How We Protect Your Data</h2>
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">🔒 Encryption</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">TLS/SSL encryption untuk semua data transfer</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="font-semibold text-blue-700 dark:text-blue-300">🛡️ Secure Storage</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Data stored di Supabase (AWS-backed, ISO 27001 certified)</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="font-semibold text-purple-700 dark:text-purple-300">👥 Access Control</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Strict role-based access untuk internal team</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Kami menyimpan data Anda selama akun aktif. Setelah akun dihapus:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            <li>• Personal data: Dihapus dalam 30 hari</li>
            <li>• Anonymized analytics: Retained for improvement (no PII)</li>
            <li>• Backup copies: Purged within 90 hari</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Exercise Your Rights</h2>
          <p className="mb-6">Untuk menggunakan hak GDPR Anda, hubungi Data Protection Officer kami:</p>
          <div className="space-y-2">
            <a href="mailto:dpo@nusantarago.id" className="block px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-center hover:shadow-xl transition-shadow">
              dpo@nusantarago.id
            </a>
            <p className="text-sm text-white/80 text-center">Response time: Within 30 days</p>
          </div>
        </section>

        <section className="text-sm text-slate-500 dark:text-slate-400 text-center pt-4 border-t border-slate-200 dark:border-slate-800">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="mt-2">NusantaraGo is committed to protecting your privacy and complying with GDPR standards.</p>
        </section>
      </div>
    </div>
  </div>
);

export default GDPRCompliance;
