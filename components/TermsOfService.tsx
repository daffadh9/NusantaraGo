import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import LogoUnified from './LogoUnified';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Syarat dan Ketentuan</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Penerimaan Ketentuan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Dengan mengakses dan menggunakan NusantaraGo ("Layanan"), Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan Layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Deskripsi Layanan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                NusantaraGo adalah platform perjalanan berbasis AI yang menyediakan:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Perencanaan itinerary perjalanan otomatis menggunakan AI</li>
                <li>Rekomendasi destinasi dan akomodasi</li>
                <li>Fitur sosial untuk berbagi pengalaman perjalanan</li>
                <li>Alat bantu perjalanan (budget calculator, packing list, dll)</li>
                <li>Integrasi peta dan navigasi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. Akun Pengguna</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Untuk menggunakan fitur tertentu, Anda harus membuat akun. Anda bertanggung jawab untuk:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Menjaga kerahasiaan kredensial akun Anda</li>
                <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                <li>Memberikan informasi yang akurat dan terkini</li>
                <li>Memberi tahu kami segera jika ada penggunaan tidak sah</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">4. Penggunaan yang Dapat Diterima</h2>
              <p className="text-slate-600 dark:text-slate-300">Anda setuju untuk TIDAK:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Menggunakan Layanan untuk tujuan ilegal atau tidak sah</li>
                <li>Mengunggah konten yang melanggar hukum, ofensif, atau melanggar hak orang lain</li>
                <li>Melakukan spamming, phishing, atau aktivitas berbahaya lainnya</li>
                <li>Mencoba mengakses bagian tidak sah dari sistem kami</li>
                <li>Menggunakan bot atau scraper tanpa izin</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">5. Konten Pengguna</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Anda mempertahankan kepemilikan atas konten yang Anda posting. Namun, dengan memposting konten, Anda memberikan NusantaraGo lisensi non-eksklusif, bebas royalti, dapat dialihkan untuk menggunakan, mereproduksi, dan menampilkan konten tersebut dalam Layanan kami.
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-3">
                Kami berhak menghapus konten yang melanggar ketentuan ini tanpa pemberitahuan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">6. Disclaimer</h2>
              <p className="text-slate-600 dark:text-slate-300">
                <strong>LAYANAN DISEDIAKAN "SEBAGAIMANA ADANYA"</strong> tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Layanan akan selalu tersedia atau bebas dari kesalahan</li>
                <li>Rekomendasi AI selalu akurat atau sesuai dengan kebutuhan Anda</li>
                <li>Informasi pihak ketiga (harga, ketersediaan) selalu terkini</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mt-3">
                Anda bertanggung jawab penuh atas keputusan perjalanan Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">7. Batasan Tanggung Jawab</h2>
              <p className="text-slate-600 dark:text-slate-300">
                NusantaraGo tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Penggunaan atau ketidakmampuan menggunakan Layanan</li>
                <li>Akurasi informasi pihak ketiga</li>
                <li>Kehilangan data atau konten</li>
                <li>Tindakan pengguna lain</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">8. Pembayaran dan Refund</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Layanan gratis tersedia dengan fitur terbatas. Langganan Premium tersedia dengan berbagai paket harga:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Pembayaran diproses melalui penyedia pembayaran pihak ketiga yang aman</li>
                <li>Langganan diperpanjang otomatis kecuali dibatalkan</li>
                <li>Pengembalian dana tersedia dalam 7 hari untuk kasus tertentu</li>
                <li>Kami berhak mengubah harga dengan pemberitahuan 30 hari</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">9. Penangguhan dan Penghentian</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami berhak menangguhkan atau menghentikan akses Anda jika:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Anda melanggar Syarat dan Ketentuan ini</li>
                <li>Aktivitas Anda merugikan pengguna lain atau sistem kami</li>
                <li>Diminta oleh penegak hukum</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mt-3">
                Anda dapat menghapus akun Anda kapan saja melalui pengaturan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">10. Perubahan Ketentuan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Kami dapat mengubah Syarat dan Ketentuan ini kapan saja. Perubahan material akan diberitahukan melalui email atau notifikasi di aplikasi. Penggunaan berkelanjutan Anda setelah perubahan berarti Anda menerima ketentuan baru.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">11. Hukum yang Berlaku</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap perselisihan akan diselesaikan melalui mediasi terlebih dahulu, dan jika perlu, melalui pengadilan di Jakarta, Indonesia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">12. Kontak</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Pertanyaan tentang Syarat dan Ketentuan? Hubungi kami:
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mt-3">
                <p className="text-slate-700 dark:text-slate-200 font-semibold">📧 Email: support@nusantarago.id</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold">🌐 Website: https://nusantarago.id</p>
                <p className="text-slate-700 dark:text-slate-200 font-semibold">🏢 PT NusantaraGo Teknologi Indonesia</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
