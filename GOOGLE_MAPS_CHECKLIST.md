# ✅ GOOGLE MAPS API - SETUP CHECKLIST

Copy & paste checklist ini, centang satu per satu!

---

## 📋 PHASE 1: GOOGLE CLOUD SETUP

```
[ ] 1.1 Buka https://console.cloud.google.com/
[ ] 1.2 Login dengan akun Google
[ ] 1.3 Klik "Select a Project" → "NEW PROJECT"
[ ] 1.4 Project name: "NusantaraGo"
[ ] 1.5 Klik "CREATE"
[ ] 1.6 Pilih project "NusantaraGo"
[ ] 1.7 ✅ Project name terlihat di top bar

🎯 Estimated time: 2 minutes
```

---

## 💳 PHASE 2: BILLING SETUP

```
[ ] 2.1 Buka https://console.cloud.google.com/billing
[ ] 2.2 Klik "ADD BILLING ACCOUNT"
[ ] 2.3 Country: Indonesia
[ ] 2.4 Input credit card details
[ ] 2.5 Check "I agree to terms"
[ ] 2.6 Klik "START MY FREE TRIAL"
[ ] 2.7 ✅ Billing account linked
[ ] 2.8 ✅ See "$200 credit" badge

⚠️ JANGAN KHAWATIR: You only pay if usage > $200/month!

🎯 Estimated time: 3 minutes
```

---

## 🔧 PHASE 3: ENABLE APIs

### API #1: Maps JavaScript API
```
[ ] 3.1 Buka https://console.cloud.google.com/apis/library
[ ] 3.2 Search: "Maps JavaScript API"
[ ] 3.3 Klik card "Maps JavaScript API"
[ ] 3.4 Klik "ENABLE"
[ ] 3.5 ✅ Status: "API enabled"
```

### API #2: Directions API
```
[ ] 3.6 Klik "← Back to Library"
[ ] 3.7 Search: "Directions API"
[ ] 3.8 Klik card "Directions API"
[ ] 3.9 Klik "ENABLE"
[ ] 3.10 ✅ Status: "API enabled"
```

### API #3: Geocoding API
```
[ ] 3.11 Klik "← Back to Library"
[ ] 3.12 Search: "Geocoding API"
[ ] 3.13 Klik card "Geocoding API"
[ ] 3.14 Klik "ENABLE"
[ ] 3.15 ✅ Status: "API enabled"
```

🎯 Estimated time: 3 minutes

---

## 🔑 PHASE 4: CREATE API KEY

```
[ ] 4.1 Buka https://console.cloud.google.com/apis/credentials
[ ] 4.2 Klik "CREATE CREDENTIALS"
[ ] 4.3 Pilih "API key"
[ ] 4.4 ✅ API key created!
[ ] 4.5 COPY API key (Ctrl+C)
[ ] 4.6 Paste di notepad sementara
```

🎯 Estimated time: 1 minute

---

## 🔒 PHASE 5: RESTRICT API KEY

```
[ ] 5.1 Klik "EDIT API KEY" di dialog (atau pencil icon)
[ ] 5.2 Application restrictions: "HTTP referrers"
[ ] 5.3 ADD AN ITEM: "http://localhost:5173/*"
[ ] 5.4 ADD AN ITEM: "http://localhost:3000/*"
[ ] 5.5 API restrictions: "Restrict key"
[ ] 5.6 Check: Maps JavaScript API
[ ] 5.7 Check: Directions API
[ ] 5.8 Check: Geocoding API
[ ] 5.9 Klik "SAVE"
[ ] 5.10 ✅ See "Key restrictions" updated

🎯 Estimated time: 2 minutes
```

---

## 💾 PHASE 6: ADD TO .ENV

```
[ ] 6.1 Buka folder project: e:/Projects/NusantaraGo/
[ ] 6.2 Cari file ".env"
[ ] 6.3 Kalau tidak ada, copy dari ".env.example"
[ ] 6.4 Buka file ".env" dengan text editor
[ ] 6.5 Cari baris: VITE_GOOGLE_MAPS_API_KEY=
[ ] 6.6 Paste API key kamu setelah "="
[ ] 6.7 Remove "your_google_maps_api_key_here"
[ ] 6.8 Save file (Ctrl+S)
[ ] 6.9 ✅ File saved
```

**Example:**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx
```

🎯 Estimated time: 1 minute

---

## 🚀 PHASE 7: RESTART SERVER

```
[ ] 7.1 Buka terminal yang running dev server
[ ] 7.2 Tekan Ctrl+C untuk stop server
[ ] 7.3 Ketik: npm run dev
[ ] 7.4 Tekan Enter
[ ] 7.5 ✅ See: "Local: http://localhost:5173/"
```

🎯 Estimated time: 30 seconds

---

## 🧪 PHASE 8: TEST IN BROWSER

```
[ ] 8.1 Buka browser (Chrome/Edge/Firefox)
[ ] 8.2 Go to: http://localhost:5173/
[ ] 8.3 Login ke app
[ ] 8.4 Klik "Peta Rute" di sidebar
[ ] 8.5 ✅ Google Maps muncul!
[ ] 8.6 Klik button "Lokasi Saya" (top right)
[ ] 8.7 Browser minta permission → Klik "Allow"
[ ] 8.8 ✅ Green marker muncul!
[ ] 8.9 ✅ Map zoom ke lokasi kamu
[ ] 8.10 ✅ Coordinates display (lat, lng)
```

🎯 Estimated time: 2 minutes

---

## 📊 PHASE 9: SETUP MONITORING

```
[ ] 9.1 Buka https://console.cloud.google.com/billing/budgets
[ ] 9.2 Klik "CREATE BUDGET"
[ ] 9.3 Name: "Google Maps Alert"
[ ] 9.4 Amount: $10
[ ] 9.5 Set alerts: 50%, 90%, 100%
[ ] 9.6 Add email: (your email)
[ ] 9.7 Klik "SAVE"
[ ] 9.8 ✅ Budget alert created
```

🎯 Estimated time: 2 minutes

---

## 🎉 FINAL VERIFICATION

```
[ ] ✅ Project created
[ ] ✅ Billing linked
[ ] ✅ 3 APIs enabled
[ ] ✅ API key created
[ ] ✅ API key restricted
[ ] ✅ Added to .env
[ ] ✅ Server restarted
[ ] ✅ Map displays
[ ] ✅ Location works
[ ] ✅ Budget alert set

🎊 ALL DONE! GOOGLE MAPS ACTIVE!
```

**Total time: ~15 minutes**

---

## 🐛 IF SOMETHING FAILS:

### Map tidak muncul?
```bash
1. Tekan F12 di browser
2. Klik tab "Console"
3. Screenshot error message
4. Check GOOGLE_MAPS_TUTORIAL.md troubleshooting section
```

### Location button tidak work?
```bash
1. Check permission di browser settings
2. Windows: Settings → Privacy → Location → ON
3. Try different browser
```

### "API key not valid" error?
```bash
1. Double-check API key di .env
2. No extra spaces
3. Restart dev server
4. Wait 1-2 minutes (propagation time)
```

---

## 📞 NEED HELP?

**Docs:**
- Full tutorial: `GOOGLE_MAPS_TUTORIAL.md`
- Quick start: `REAL_TIME_TRACKING_SETUP.md`
- Complete guide: `GOOGLE_MAPS_SETUP.md`

**Check:**
- Browser console (F12)
- Terminal for errors
- Google Cloud Console for API status

---

## 🔥 AFTER SUCCESS:

Try these features:
1. Input route: Bekasi → Sidoarjo
2. Pilih transport: Mobil
3. Klik "Simulasikan Rute"
4. Watch AI generate waypoints!
5. Timeline animation starts
6. (Future) Route line on map

---

**GOOD LUCK!** 🚀

Centang satu per satu, jangan skip! 💪
