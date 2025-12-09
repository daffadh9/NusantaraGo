<div align="center">
  <img src="https://nusantarago.id/logo-unified.png" alt="NusantaraGo Logo" width="200" />
  
  # 🌴 NusantaraGo
  
  **AI-Powered Travel Companion untuk Indonesia**
  
  [![Website](https://img.shields.io/badge/Website-nusantarago.id-10B981?style=for-the-badge)](https://nusantarago.id)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
  [![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg?style=for-the-badge)](https://nusantarago.id)
</div>

---

## 🚀 Overview

NusantaraGo adalah platform travel AI-powered untuk menjelajahi **17,000+ destinasi** di Indonesia. Dari Sabang sampai Merauke, dari hidden gems hingga tempat viral - semuanya ada di sini!

### ✨ Key Features

- **🤖 AI Trip Planner** - Generate itinerary personal dalam hitungan detik
- **📱 Mobile-First** - Responsive design yang mulus di semua device
- **🗺️ 80+ Curated Destinations** - Hidden gems, pantai, kuliner, budaya, dll
- **💬 Community** - Connect dengan traveler lain
- **🎮 Gamification** - Earn miles & rewards saat explore
- **💎 Premium Features** - Local expert chat, advanced planning

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Animation | Framer Motion |
| Backend | Supabase (Auth, Database, Edge Functions) |
| AI | Google Gemini AI, Vertex AI |
| Payment | Xendit |
| Media | Cloudinary |
| Deployment | Netlify |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/NusantaraGo.git
cd NusantaraGo

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your API keys in .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

---

## 🏗️ Project Structure

```
NusantaraGo/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── LandingPage.tsx  # Landing page
│   └── ...
├── services/            # API services
├── hooks/               # Custom React hooks
├── data/                # Static data
├── lib/                 # Utilities
├── supabase/           # Supabase config & functions
└── public/             # Static assets
```

---

## 🌐 Deployment

### Netlify (Recommended)

1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy!

### Manual Build

```bash
npm run build
# Output in /dist folder
```

---

## 🔒 Security

- ✅ Environment variables protected via `.gitignore`
- ✅ CSP headers configured
- ✅ XSS protection enabled
- ✅ API keys stored in Supabase secrets
- ✅ GDPR compliant

---

## 📱 Mobile Support

- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly (44px tap targets)
- ✅ iOS safe area support
- ✅ Reduced motion support
- ✅ PWA ready

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 📧 Contact

- **Website**: [nusantarago.id](https://nusantarago.id)
- **Email**: support@nusantarago.id
- **Creator**: Daffa Dhiyaulhaq Khadafi

---

<div align="center">
  Made with ❤️ in Indonesia 🇮🇩
</div>
