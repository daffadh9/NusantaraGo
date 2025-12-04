# 🗺️ GOOGLE MAPS API - STEP BY STEP TUTORIAL

## 🎯 TUJUAN:
Mengaktifkan Google Maps di Visual Route Planner dengan fitur:
- ✅ Real-time GPS tracking
- ✅ Interactive map
- ✅ User location marker
- ✅ Route display

---

## 📋 STEP 1: BUAT GOOGLE CLOUD PROJECT (5 menit)

### 1.1 Buka Google Cloud Console

```
🌐 https://console.cloud.google.com/
```

1. **Login** dengan akun Google kamu
2. Kalau belum punya akun, **Sign Up** (gratis!)
3. ✅ Kamu akan lihat dashboard Google Cloud

### 1.2 Create New Project

1. **Klik** "Select a Project" di top bar (atau klik dropdown project)
2. **Klik** "NEW PROJECT" (pojok kanan atas dialog)
3. **Isi:**
   - Project name: `NusantaraGo`
   - Location: No organization (atau pilih yang ada)
4. **Klik** "CREATE"
5. ⏳ Tunggu ~10 detik
6. ✅ Project created!

### 1.3 Select Your Project

1. **Klik** "Select a Project" lagi
2. **Pilih** "NusantaraGo" dari list
3. ✅ Project aktif (lihat nama di top bar)

---

## 💳 STEP 2: SETUP BILLING (WAJIB!)

### ⚠️ PENTING:
Google Maps API **BUTUH** credit card, tapi kamu **GRATIS $200/bulan**!

Kamu **TIDAK AKAN DICHARGE** kecuali usage > $200/bulan.

### 2.1 Enable Billing

1. **Go to:** https://console.cloud.google.com/billing
2. **Klik** "ADD BILLING ACCOUNT" (atau "Link a billing account")
3. **Country:** Indonesia
4. **Klik** "Continue"

### 2.2 Input Credit Card

1. **Isi:**
   - Card number
   - Expiration date
   - CVV/CVC
   - Billing address
2. **Check** "I agree to the terms of service"
3. **Klik** "START MY FREE TRIAL"

### 2.3 Verify

1. Google akan charge Rp 0 (untuk verifikasi)
2. ✅ Billing account active!
3. 🎉 Kamu dapat **$200 free credit every month**

---

## 🔧 STEP 3: ENABLE REQUIRED APIs (3 menit)

### 3.1 Go to APIs Library

```
🌐 https://console.cloud.google.com/apis/library
```

### 3.2 Enable Maps JavaScript API

1. **Search:** "Maps JavaScript API"
2. **Klik** card "Maps JavaScript API"
3. **Klik** "ENABLE"
4. ⏳ Tunggu ~5 detik
5. ✅ API Enabled!

### 3.3 Enable Directions API

1. **Klik** "← Back to Library" (atau search lagi)
2. **Search:** "Directions API"
3. **Klik** card "Directions API"
4. **Klik** "ENABLE"
5. ✅ API Enabled!

### 3.4 Enable Geocoding API

1. **Search:** "Geocoding API"
2. **Klik** card "Geocoding API"
3. **Klik** "ENABLE"
4. ✅ API Enabled!

### ✅ Summary APIs Enabled:
- [x] Maps JavaScript API
- [x] Directions API
- [x] Geocoding API

---

## 🔑 STEP 4: CREATE API KEY (2 menit)

### 4.1 Go to Credentials

```
🌐 https://console.cloud.google.com/apis/credentials
```

### 4.2 Create API Key

1. **Klik** "CREATE CREDENTIALS" (top bar)
2. **Pilih** "API key"
3. ⏳ Tunggu ~3 detik
4. 🎉 API Key created!
5. **COPY** API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXX`)

⚠️ **JANGAN TUTUP** dialog dulu!

### 4.3 Restrict API Key (PENTING!)

1. **Klik** "EDIT API KEY" di dialog
2. Atau **Klik** pencil icon di list credentials

**Application Restrictions:**
1. **Pilih:** "HTTP referrers (web sites)"
2. **ADD AN ITEM:**
   ```
   http://localhost:5173/*
   http://localhost:3000/*
   ```
3. Kalau sudah punya domain, tambah:
   ```
   https://yourdomain.com/*
   ```

**API Restrictions:**
1. **Pilih:** "Restrict key"
2. **Select APIs:**
   - [x] Maps JavaScript API
   - [x] Directions API
   - [x] Geocoding API
3. **Klik** "SAVE"

✅ API Key secured!

---

## 💾 STEP 5: ADD TO .ENV FILE (1 menit)

### 5.1 Open .env File

Kalau belum ada file `.env`, buat dengan cara:

```bash
# Copy dari .env.example
copy .env.example .env
```

### 5.2 Edit .env

Buka file `.env` dan **PASTE API KEY** kamu:

```env
# Gemini AI API Key
VITE_API_KEY=your_existing_gemini_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_existing_supabase_url
VITE_SUPABASE_ANON_KEY=your_existing_supabase_key

# Google Maps API Key (PASTE DI SINI!)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
```

⚠️ **Ganti** `AIzaSyXXXXXXXXXXXXXXXXX` dengan API key kamu yang asli!

### 5.3 Save File

1. **Save** file `.env`
2. ✅ API key ready!

---

## 🚀 STEP 6: RESTART DEV SERVER (1 menit)

### 6.1 Stop Server

Kalau dev server sedang running:

```bash
# Tekan Ctrl+C di terminal
```

### 6.2 Start Server Lagi

```bash
npm run dev
```

### 6.3 Verify

Lihat terminal, seharusnya ada output:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

✅ Server running!

---

## 🧪 STEP 7: TEST GOOGLE MAPS (2 menit)

### 7.1 Open Browser

```
http://localhost:5173/
```

### 7.2 Login

1. Login ke app
2. **Klik** "Peta Rute" di sidebar
3. ✅ Map muncul!

### 7.3 Test Location

1. **Klik** button "Lokasi Saya" (pojok kanan atas)
2. Browser akan minta permission
3. **Klik** "Allow"
4. ⏳ Tunggu ~2 detik
5. 🎉 Green marker muncul di map!

### 7.4 Verify Success

Kalau berhasil, kamu akan lihat:
- ✅ Google Maps display
- ✅ Green marker di lokasi kamu
- ✅ Coordinates display (lat, lng)
- ✅ Map zoom ke lokasi kamu

---

## 🐛 TROUBLESHOOTING

### ❌ Map tidak muncul?

**Check 1: API Key Correct?**
```bash
# Buka .env
# Pastikan VITE_GOOGLE_MAPS_API_KEY ada dan benar
```

**Check 2: Browser Console**
```bash
# Tekan F12
# Lihat Console tab
# Ada error message?
```

**Check 3: APIs Enabled?**
```bash
# Go to: https://console.cloud.google.com/apis/dashboard
# Verify semua API status: Enabled
```

**Check 4: Billing Active?**
```bash
# Go to: https://console.cloud.google.com/billing
# Verify billing account linked
```

**Check 5: Restart Dev Server**
```bash
# Ctrl+C stop server
# npm run dev start lagi
```

---

### ❌ "This API project is not authorized to use this API"?

**Fix:**
```bash
1. Go to: https://console.cloud.google.com/apis/credentials
2. Klik API Key kamu
3. Check "API restrictions" → Pastikan semua API dicentang
4. Klik SAVE
5. Tunggu 1-2 menit
6. Refresh browser
```

---

### ❌ "API keys with referer restrictions cannot be used with this API"?

**Fix:**
```bash
1. Go to: https://console.cloud.google.com/apis/credentials
2. Klik API Key kamu
3. Application restrictions: "HTTP referrers"
4. Add:
   - http://localhost:5173/*
   - http://localhost:3000/*
5. Klik SAVE
```

---

### ❌ "RefererNotAllowedMapError"?

**Fix:**
```bash
1. Check URL di browser matches referrer di API key
2. Tambahkan wildcard: http://localhost:*/*
3. Save & wait 2 minutes
```

---

### ❌ Location button not working?

**Check 1: HTTPS atau localhost?**
```bash
# Geolocation hanya work di:
# - https:// (secure)
# - http://localhost (development)
```

**Check 2: Browser Permission**
```bash
# Chrome:
# Settings → Privacy and Security → Site Settings → Location
# Pastikan site allowed
```

**Check 3: GPS/Location Active?**
```bash
# Windows: Settings → Privacy → Location → On
# Check device location service active
```

---

### ❌ "You have exceeded your request quota"?

**Check:**
```bash
# Go to: https://console.cloud.google.com/apis/dashboard
# Check usage vs quota
# Free tier: $200/month = ~28,000 map loads
```

**If really exceeded:**
```bash
# Option 1: Wait until next month (quota resets)
# Option 2: Set up paid billing
# Option 3: Optimize requests (cache, reduce calls)
```

---

## 💰 MONITORING USAGE

### Check Daily Usage

```bash
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Select: Maps JavaScript API
3. See: Requests per day graph
4. ✅ Monitor usage
```

### Set Budget Alerts

```bash
1. Go to: https://console.cloud.google.com/billing/budgets
2. Klik: CREATE BUDGET
3. Name: "Google Maps Budget"
4. Amount: $10 (or whatever you want)
5. Set alerts at: 50%, 90%, 100%
6. Add your email
7. ✅ You'll get alert if approaching limit
```

---

## 🎯 WHAT YOU GET (FREE TIER)

### Monthly Free Credits: $200

**Breakdown:**

| API | Free Quota | After Free Tier |
|-----|-----------|----------------|
| **Maps JavaScript API** | 28,000 loads | $7 per 1,000 |
| **Directions API** | 40,000 requests | $5 per 1,000 |
| **Geocoding API** | 40,000 requests | $5 per 1,000 |

### Example Calculation:

```
Scenario: 100 users/day

Daily:
- 100 users × 5 page views = 500 map loads
- 50 route requests

Monthly:
- 500 × 30 = 15,000 map loads (under 28K free!)
- 50 × 30 = 1,500 routes (under 40K free!)

Cost: $0 (100% FREE!)
```

### When to Worry:

```
1,000+ users/day = ~$50/month
5,000+ users/day = ~$200/month
10,000+ users/day = ~$400/month
```

---

## ✅ VERIFICATION CHECKLIST

Before going to next feature, verify:

- [ ] Google Cloud Project created
- [ ] Billing account linked (credit card)
- [ ] 3 APIs enabled (Maps JS, Directions, Geocoding)
- [ ] API Key created & copied
- [ ] API Key restrictions set
- [ ] Added to .env file
- [ ] Dev server restarted
- [ ] Map displays in browser
- [ ] Location button works
- [ ] Green marker shows your location
- [ ] Budget alert set up

---

## 📱 TESTING ON MOBILE

### Local Network Testing:

1. **Find your IP:**
   ```bash
   # Windows:
   ipconfig
   # Look for: IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update vite.config.ts:**
   ```typescript
   export default defineConfig({
     server: {
       host: '0.0.0.0', // Allow network access
       port: 5173
     }
   })
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Open on phone:**
   ```
   http://192.168.1.100:5173
   # Replace with your IP
   ```

5. **Update API Key Restrictions:**
   - Add: `http://192.168.1.100:5173/*`

---

## 🔒 SECURITY BEST PRACTICES

### ✅ DO:
- Store API key in .env (not in code)
- Add .env to .gitignore
- Set HTTP referrer restrictions
- Set API restrictions
- Monitor usage daily
- Set budget alerts
- Use separate keys for dev/prod

### ❌ DON'T:
- Commit API key to Git
- Share API key publicly
- Leave unrestricted
- Ignore usage alerts
- Use same key across projects

---

## 🎉 SUCCESS!

Kalau semua langkah sudah diikuti dan test berhasil:

✅ **Google Maps Integration COMPLETE!**

Sekarang Visual Route Planner punya:
- 🗺️ Real Google Maps
- 📍 GPS Tracking
- 🎯 User Location Marker
- 🔄 Real-time Updates

---

## 📞 NEXT STEPS

1. **Test thoroughly** di berbagai browser
2. **Test di mobile** (if possible)
3. **Monitor usage** for first week
4. **Optimize** if needed
5. **Deploy** to production (update referrers!)

---

## 💡 TIPS

### Optimize Costs:

```typescript
// 1. Cache map instance (already done in code)
const googleMapRef = useRef<any>(null);

// 2. Lazy load (only when needed)
if (activeView === 'route_map') {
  loadGoogleMaps();
}

// 3. Debounce API calls
const debouncedSearch = debounce(searchLocation, 500);
```

### Production Deployment:

When deploying:
1. Update API key restrictions with production domain
2. Use environment-specific keys
3. Enable HTTPS only
4. Set up monitoring alerts
5. Consider CDN for assets

---

**GOOGLE MAPS READY!** 🗺️🎉

Need help? Check errors in browser console or Supabase logs!
