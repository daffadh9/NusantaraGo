// About Us Page - NusantaraGo
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Award, Heart, Sparkles, Globe, Shield, Zap } from 'lucide-react';

const AboutUs: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { label: 'Destinasi Terdaftar', value: '17,000+', icon: MapPin },
    { label: 'Pengguna Aktif', value: '500K+', icon: Users },
    { label: 'Trip Direncanakan', value: '1.2M+', icon: Award },
    { label: 'Rating Kepuasan', value: '4.9/5', icon: Heart }
  ];

  const values = [
    {
      icon: Sparkles,
      title: 'AI-Powered Innovation',
      desc: 'Menggunakan teknologi AI terdepan untuk memberikan rekomendasi perjalanan yang personal dan optimal.'
    },
    {
      icon: Globe,
      title: 'Indonesia First',
      desc: 'Fokus eksklusif pada destinasi Indonesia, dari Sabang sampai Merauke, dari yang populer hingga hidden gems.'
    },
    {
      icon: Shield,
      title: 'Trusted & Secure',
      desc: 'Keamanan data pengguna adalah prioritas utama kami. Certified ISO 27001 & SOC 2 compliant.'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      desc: 'Generate itinerary lengkap dalam hitungan detik, hemat waktu planning hingga 10x lebih cepat.'
    }
  ];

  const team = [
    { name: 'Daffa Dhiyaulhaq Khadafi', role: 'Founder & CEO', avatar: '👨‍💼' },
    { name: 'Tim Engineering', role: 'Product Development', avatar: '👨‍💻' },
    { name: 'Tim AI/ML', role: 'AI Research', avatar: '🤖' },
    { name: 'Tim Content', role: 'Destination Curation', avatar: '✍️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
      {/* Hero Section */}
      <motion.section 
        className="relative h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1920&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-50 dark:to-black"></div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Tentang NusantaraGo
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed">
            Platform AI Travel Companion #1 di Indonesia untuk merencanakan perjalanan impian kamu ke 17,000+ destinasi Nusantara 🇮🇩
          </p>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4">
                  <stat.icon className="text-white" size={28} />
                </div>
                <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</h3>
                <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div {...fadeIn} className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Award className="text-emerald-500" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Misi Kami</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Membuat perjalanan ke seluruh destinasi Indonesia menjadi <span className="font-semibold text-emerald-600 dark:text-emerald-400">mudah diakses</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">terjangkau</span>, dan <span className="font-semibold text-emerald-600 dark:text-emerald-400">personal</span> untuk semua orang dengan kekuatan teknologi AI. Kami percaya bahwa setiap warga Indonesia berhak menjelajahi keindahan negerinya sendiri.
              </p>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Globe className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Visi Kami</h2>
              <p className="text-white/90 leading-relaxed">
                Menjadi <span className="font-semibold">platform AI travel companion terpercaya</span> yang menginspirasi 100 juta orang Indonesia untuk menjelajahi Nusantara dan melestarikan kekayaan budaya lokal pada tahun 2030. Setiap trip = dukungan untuk UMKM lokal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Prinsip yang memandu setiap keputusan kami</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50 dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tim Kami</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Orang-orang di balik NusantaraGo</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-5xl mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Hubungi Kami</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Punya pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengar dari kamu!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:support@nusantarago.id" className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:shadow-2xl transition-all">
                support@nusantarago.id
              </a>
              <a href="mailto:daffa@nusantarago.id" className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white rounded-xl font-bold hover:bg-white/30 transition-all">
                daffa@nusantarago.id
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
