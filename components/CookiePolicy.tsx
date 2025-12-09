import React from 'react';
import { Cookie, Shield } from 'lucide-react';

const CookiePolicy: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-black p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-emerald-500 text-white p-12 rounded-3xl mb-8 text-center">
        <Cookie size={48} className="mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-xl">Cara NusantaraGo menggunakan cookies</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Apa itu Cookies?</h2>
          <p className="text-slate-600 dark:text-slate-300">
            File kecil yang menyimpan preferensi Anda seperti login status, bahasa, dan tema.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Jenis Cookies</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-bold">Essential Cookies (Required)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Authentication, security, session management</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-bold">Analytics Cookies (Optional)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Google Analytics untuk improve UX</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h3 className="font-bold">Functional Cookies (Optional)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Theme, language, preferences</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cara Mengelola</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Anda bisa block/delete cookies via browser settings (Privacy → Cookies).
          </p>
        </section>

        <section className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <h3 className="font-bold text-lg mb-2">Third-Party Partners:</h3>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
            <li>• Google Analytics - Analytics</li>
            <li>• Google Maps - Location services</li>
            <li>• Supabase - Auth & Database</li>
          </ul>
        </section>

        <div className="text-center pt-4">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Questions?</p>
          <a href="mailto:support@nusantarago.id" className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default CookiePolicy;
