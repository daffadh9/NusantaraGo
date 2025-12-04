import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import LogoUnified from './LogoUnified';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <LogoUnified size={40} variant="full" showText={true} />
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Kebijakan Privasi</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                NusantaraGo mengumpulkan informasi yang Anda berikan secara langsung kepada kami ketika Anda:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Membuat akun dan menggunakan layanan kami</li>
                <li>Merencanakan perjalanan menggunakan fitur AI Planner</li>
                <li>Berinteraksi dengan fitur sosial (posts, stories, communities)</li>
                <li>Menghubungi customer support</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mt-3">
                Informasi yang dikumpulkan meliputi: nama, email, foto profil, preferensi perjalanan, dan data penggunaan aplikasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Penggunaan Informasi</h2>
              <p className="text-slate-600 dark:text-slate-300">Kami menggunakan informasi Anda untuk:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
                <li>Menghasilkan rekomendasi perjalanan yang dipersonalisasi</li>
                <li>Memproses transaksi dan mengirim notifikasi terkait</li>
                <li>Berkomunikasi dengan Anda tentang produk, layanan, dan promosi</li>
                <li>Melindungi keamanan dan integritas platform kami</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. Berbagi Informasi</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi Anda dalam situasi berikut:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Dengan persetujuan Anda</li>
                <li>Dengan penyedia layanan yang membantu operasional kami (Google Cloud, Supabase)</li>
                <li>Untuk mematuhi hukum atau melindungi hak kami</li>
                <li>Dalam konten yang Anda pilih untuk dibagikan secara publik (posts, stories)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">4. Keamanan Data</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami menggunakan enkripsi SSL/TLS untuk melindungi data Anda saat transit. Data disimpan di server yang aman dengan autentikasi multi-faktor dan audit keamanan rutin. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">5. Hak Anda</h2>
              <p className="text-slate-600 dark:text-slate-300">Anda memiliki hak untuk:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Mengakses dan memperbarui informasi pribadi Anda</li>
                <li>Menghapus akun Anda (data akan dihapus dalam 30 hari)</li>
                <li>Mengekspor data Anda dalam format yang dapat dibaca mesin</li>
                <li>Menolak penggunaan data untuk tujuan pemasaran</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">6. Cookies dan Teknologi Tracking</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda, menganalisis penggunaan, dan mempersonalisasi konten. Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi dengan baik.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">7. Perubahan Kebijakan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau notifikasi di aplikasi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">8. Hubungi Kami</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mt-3">
                <p className="text-slate-700 dark:text-slate-200 font-semibold">Email: privacy@nusantarago.id</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold">Website: https://nusantarago.id</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
