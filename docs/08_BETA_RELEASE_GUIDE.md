# 🚀 BETA RELEASE SETUP GUIDE
## NusantaraGo - Complete Step-by-Step

**Last Updated:** December 2025  
**Target:** Closed Beta di Google Play Store

---

## 📋 PRE-REQUISITES

Before starting, ensure you have:
- [ ] Google account untuk Play Console
- [ ] $25 untuk Play Console registration (one-time)
- [ ] Credit card untuk Play Console payment
- [ ] Apple ID jika mau di iOS (opsional)
- [ ] Domain email untuk business (founder@nusantarago.id)

---

## STEP 1: CHOOSE TECH STACK FOR MOBILE 📱

### Option A: React Native (RECOMMENDED for long-term)

**Pros:** 
- Full native experience
- Best performance
- Access to all device features
- Better for complex apps

**Cons:**
- Learning curve jika belum familiar
- 2-3 bulan development time

**Setup:**
```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project
npx react-native init NusantaraGo --template react-native-template-typescript

# Install dependencies
cd NusantaraGo
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install @supabase/supabase-js
npm install lucide-react-native
npm install react-native-vector-icons
npm install @google/genai

# iOS specific (if targeting iOS)
cd ios && pod install && cd ..

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

**Code Sharing Strategy:**
```
nusantarago/
├── packages/
│   ├── shared/           # Shared code (types, utils, services)
│   ├── web/             # Web app (current)
│   └── mobile/          # React Native app (new)
```

---

### Option B: Capacitor/Ionic (FASTEST to market)

**Pros:**
- Reuse existing React code ~80%
- Deploy dalam 2-4 minggu
- Minimal learning curve

**Cons:**
- Slightly lower performance
- Some UI quirks on native

**Setup:**
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build web app
npm run build

# Copy to native
npx cap copy

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

---

### Option C: TWA (Trusted Web Activity) - EMERGENCY FAST

**Pros:**
- Deploy dalam 1 minggu
- Zero native code
- Instant updates (web updates)

**Cons:**
- Limited to Android only
- Requires HTTPS domain
- Some limitations

**Setup:**
```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize TWA
bubblewrap init --manifest https://nusantarago.id/manifest.json

# Build APK
bubblewrap build

# Output: app-release-signed.apk
```

---

## STEP 2: SETUP GOOGLE PLAY CONSOLE 🎮

### 2.1 Create Developer Account

1. Go to: https://play.google.com/console/signup
2. Login dengan Google account
3. Accept Developer Agreement
4. Pay $25 registration fee (one-time, selamanya)
5. Complete account details:
   - Developer name: "NusantaraGo"
   - Email: founder@nusantarago.id
   - Website: nusantarago.id (or GitHub)

### 2.2 Create App

1. Click **"Create app"**
2. Fill details:
   - **App name:** NusantaraGo - AI Travel Planner
   - **Default language:** Indonesian
   - **App type:** App
   - **Free or Paid:** Free

3. Declarations:
   - ✅ This is not a game
   - ✅ Follows Play policies
   - ✅ US export laws compliant

---

## STEP 3: PREPARE APP ASSETS 🎨

### 3.1 App Icon
- **Size:** 512x512 px
- **Format:** PNG (32-bit, no alpha)
- **Design:** Simple, recognizable

**Tools:** Figma, Canva, or https://icon.kitchen

### 3.2 Feature Graphic
- **Size:** 1024x500 px
- **Format:** PNG or JPEG
- **Content:** App showcase banner

### 3.3 Screenshots
- **Minimum:** 2 screenshots
- **Recommended:** 4-8 screenshots
- **Sizes:**
  - Phone: 1080x1920 px
  - Tablet: 1200x1920 px (optional)

**Tip:** Use https://mockuphone.com for device frames

### 3.4 Promo Video (Optional but recommended)
- **Platform:** YouTube
- **Duration:** 30-90 seconds
- **Content:** App walkthrough, key features

---

## STEP 4: BUILD SIGNED APK/AAB 📦

### For React Native:

```bash
# Generate upload keystore
cd android/app
keytool -genkeypair -v -storetype PKCS12 \
  -keystore nusantarago-upload-key.keystore \
  -alias nusantarago-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Add to gradle.properties
MYAPP_UPLOAD_STORE_FILE=nusantarago-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=nusantarago-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=****
MYAPP_UPLOAD_KEY_PASSWORD=****

# Build release bundle
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### For Capacitor:

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# Build > Generate Signed Bundle/APK > Android App Bundle
```

---

## STEP 5: COMPLETE PLAY STORE LISTING ✍️

### 5.1 Store Presence > Main Store Listing

**App name:** NusantaraGo - AI Travel Planner

**Short description (80 chars):**
```
Rencanakan trip impian dalam detik dengan AI. Jelajah Nusantara lebih mudah!
```

**Full description (4000 chars max):**
```
🌴 NUSANTARAGO - AI Travel Companion untuk Jelajah Indonesia

Capek planning trip yang ribet? NusantaraGo bantu kamu bikin itinerary lengkap dalam hitungan DETIK pakai AI!

✨ FITUR UTAMA:
🤖 AI Itinerary Generator - Input destinasi, durasi, budget → AI kasih rencana lengkap
💰 Budget Calculator - Hitung biaya trip real-time
📍 Hidden Gems - Temukan spot-spot tersembunyi yang jarang orang tahu
👥 Travel Buddy Matcher - Cari teman traveling se-vibe
📱 Offline Mode - Akses itinerary tanpa internet
🎫 Smart Ticket Scanner - Scan & organize tiket otomatis

🎯 COCOK UNTUK:
✓ Solo traveler yang mau explore sendiri
✓ Keluarga yang butuh planning praktis
✓ Backpacker budget-friendly
✓ Couple yang mau romantic getaway

💎 KENAPA NUSANTARAGO?
• AI yang paham Indonesia (bukan generic travel app)
• Fokus ke hidden gems, bukan tourist trap
• Community support dari fellow travelers
• Safety features (SOS, live tracking)

🆓 GRATIS SELAMANYA
• 3x AI itinerary per bulan
• Save unlimited trips
• Travel tips & guides

⭐ PREMIUM (Rp 49.900/bulan)
• Unlimited AI generations
• Priority support
• Exclusive deals & discounts
• Ad-free experience

📲 DOWNLOAD SEKARANG & MULAI PETUALANGANMU!

---
Butuh bantuan? Email: support@nusantarago.id
Follow Instagram: @nusantarago
```

**App category:** Travel & Local

**Tags:** travel, trip planner, ai, indonesia, itinerary

**Contact details:**
- Email: support@nusantarago.id
- Website: https://nusantarago.id
- Privacy Policy: https://nusantarago.id/privacy

---

## STEP 6: CONTENT RATING 📝

1. Go to **Content rating**
2. Fill questionnaire honestly:
   - Does app share location? YES
   - Does app have social features? YES (if social feed enabled)
   - Does app have user-generated content? YES (if enabled)
   - Does app have payment? YES

3. Get rating (likely: PEGI 3 / Everyone)

---

## STEP 7: SETUP TESTING TRACK 🧪

### 7.1 Internal Testing (First)

1. Go to **Testing > Internal testing**
2. Create new release
3. Upload AAB file
4. Add testers (email list, max 100)
5. Release notes:
```
🎉 NusantaraGo Internal Alpha v0.1.0

This is our first internal test release. Please test:
✓ Login/Register flow
✓ AI Itinerary generation
✓ Save & view trips
✓ Profile management

Known issues:
- Some features still in development
- UI polish ongoing

Feedback: Discord/Telegram group
```

### 7.2 Closed Testing (Beta)

1. Go to **Testing > Closed testing**
2. Create testing track (e.g., "Beta Testers")
3. Create new release
4. Upload AAB
5. Create email list OR publish to Google Groups
6. Share opt-in link with beta users

**Opt-in URL format:**
```
https://play.google.com/apps/testing/com.nusantarago.app
```

### 7.3 Open Testing (Optional)

1. Go to **Testing > Open testing**
2. Anyone can join (no limit)
3. Visible in Play Store with "Early Access" badge

---

## STEP 8: SETUP ANALYTICS & MONITORING 📊

### 8.1 Firebase Setup

```bash
# Install Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics

# Download google-services.json
# Place in android/app/google-services.json

# Add to build.gradle
dependencies {
  classpath 'com.google.gms:google-services:4.4.0'
  classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
}
```

### 8.2 Track Key Events

```typescript
import analytics from '@react-native-firebase/analytics';

// Track screen views
await analytics().logScreenView({
  screen_name: 'Trip_Planner',
  screen_class: 'TripPlannerScreen',
});

// Track AI generation
await analytics().logEvent('generate_itinerary', {
  destination: 'Bali',
  duration: 5,
  budget: 'medium'
});

// Track conversions
await analytics().logEvent('purchase', {
  currency: 'IDR',
  value: 49900,
  items: [{ item_name: 'premium_monthly' }]
});
```

---

## STEP 9: PRE-LAUNCH CHECKLIST ✅

### Technical
- [ ] App installed dan buka tanpa crash
- [ ] Login/register working
- [ ] Core feature (AI itinerary) working
- [ ] Data persists (no data loss)
- [ ] Permissions handled gracefully
- [ ] Back button behavior correct
- [ ] Deep linking working (optional)

### Content
- [ ] No "Lorem ipsum" or placeholder text
- [ ] All images loaded
- [ ] Error messages helpful
- [ ] Loading states clear
- [ ] Empty states dengan CTA

### Legal
- [ ] Privacy Policy uploaded
- [ ] Terms of Service uploaded
- [ ] Data collection disclosed
- [ ] Compliance with Play policies

### Business
- [ ] Branding consistent
- [ ] Contact email working
- [ ] Support channel ready
- [ ] Feedback mechanism in-app

---

## STEP 10: RELEASE TO INTERNAL TESTING 🎉

1. **Upload AAB** to Internal testing track
2. **Add testers** (10-20 emails)
3. **Send invitation** via Play Console
4. Testers receive email with **opt-in link**
5. After opt-in, app appears in their Play Store
6. **Collect feedback** via Discord/Telegram/Form

### Sample Tester Invitation Email:

```
Subject: 🎉 You're Invited: NusantaraGo Beta Testing!

Hi [Name],

Kamu terpilih untuk jadi Beta Tester NusantaraGo! 🚀

NusantaraGo adalah AI-powered travel planner yang bantu kamu planning trip Indonesia dalam hitungan detik.

📱 How to Join:
1. Click link ini: [Play Store Opt-in Link]
2. Accept invitation
3. Install "NusantaraGo" dari Play Store
4. Test semua fitur
5. Kasih feedback di: [Discord/Telegram Link]

⏰ Testing Period: 2 minggu
🎁 Reward: 3 bulan Premium gratis!

Thanks for being early supporter! 💚

Daffa
Founder, NusantaraGo
```

---

## STEP 11: ITERATE BASED ON FEEDBACK 🔄

### Week 1-2: Firefighting
- Fix critical bugs immediately
- Respond to all feedback
- Daily monitoring

### Week 3-4: Improvements
- Implement top feature requests
- Polish UI/UX
- Performance optimization

### Week 5-6: Expansion
- Add more testers (50-100)
- Expand to Closed Testing track
- Prepare for wider beta

---

## STEP 12: GRADUATE TO PRODUCTION 🎓

When ready (90%+ satisfaction, <1% crash rate):

1. **Create Production release**
2. **Upload final AAB**
3. **Submit for review** (takes 3-7 days)
4. **Rollout gradually:**
   - 10% → 25% → 50% → 100%

5. **Monitor closely:**
   - Crash rate
   - ANRs (App Not Responding)
   - User reviews

---

## 📞 SUPPORT CHANNELS FOR BETA

### Option 1: Discord (Recommended)
- Create private server
- Channels: #announcements, #feedback, #bugs, #general
- Easy untuk discussion

### Option 2: Telegram Group
- Simple, instant
- Good for Indonesian users
- Voice note support

### Option 3: Google Forms
- Structured feedback
- Easy to analyze
- No real-time discussion

**Recommended: Discord + Google Form**

---

## 🎯 SUCCESS METRICS FOR BETA

| Metric | Target |
|--------|--------|
| Onboarding completion | > 70% |
| Day 1 retention | > 40% |
| Day 7 retention | > 20% |
| Crash-free sessions | > 98% |
| NPS (Net Promoter Score) | > 30 |
| Feature usage (AI generate) | > 50% of users |

---

## 🚨 COMMON PITFALLS TO AVOID

❌ **Releasing too broken** - Wait sampai core flow working
❌ **Ignoring feedback** - Respond semua, prioritas yang relevan
❌ **No analytics** - Blind flying tanpa data
❌ **Terlalu lama di beta** - Max 3 bulan, lanjut ke production
❌ **No clear goal** - Set target metrics jelas

---

## 📚 RESOURCES

- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [React Native Docs](https://reactnative.dev/)
- [Capacitor Docs](https://capacitorjs.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [App Store Guidelines](https://developer.android.com/distribute/best-practices)

---

**Questions?** Contact Daffa at founder@nusantarago.id

*Last Updated: December 2025*
