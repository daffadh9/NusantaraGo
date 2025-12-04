# 🔍 DEBUG CHECKLIST - Auth Not Working

## ✅ LANGKAH-LANGKAH DEBUG:

### **STEP 1: Hard Refresh Browser**
```
1. Tutup semua tab NusantaraGo
2. Buka fresh: http://localhost:3001
3. Tekan F12 (open DevTools)
4. Tab Console
```

---

### **STEP 2: Check Console Logs**

**Saat halaman load, harus muncul:**
```
🔐 Setting up Supabase auth listener...
```

**Kalau ada error merah, SCREENSHOT dan kirim ke saya!**

Possible errors:
- ❌ "Missing Supabase environment variables" → Check .env.local
- ❌ "Failed to fetch" → Supabase URL salah
- ❌ "Invalid API key" → Supabase key salah
- ❌ Other error → Screenshot!

---

### **STEP 3: Test Google Login**

1. Click **"Masuk / Daftar"**
2. Click **"Lanjut dengan Google"**
3. Pilih akun Google
4. Grant permissions

**Setelah redirect kembali, di Console harus muncul:**
```
🔄 Auth state changed: {id, email, name}
✅ User authenticated: your@email.com
```

**Kalau tidak muncul = masalah di sini!**

---

### **STEP 4: Verify .env.local**

Buka file `.env.local`, pastikan format persis seperti ini:

```env
VITE_API_KEY=AIzaSyAonAgzN30j3PqKRRvEoDnhL1XhWC3y7Zk
VITE_SUPABASE_URL=https://hjmgoppcbqnxciqyixdf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**CRITICAL:**
- ✅ Prefix `VITE_` harus ada!
- ✅ Tidak boleh ada spasi sebelum/sesudah `=`
- ✅ URL harus `.supabase.co`
- ✅ Key harus dimulai dengan `eyJ`

**Kalau salah satu tidak benar, FIX dan restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### **STEP 5: Test Supabase Connection**

Di browser console, paste command ini:

```javascript
// Test 1: Check env variables
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Has ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

// Test 2: Try to get session
supabase.auth.getSession().then(({data, error}) => {
  console.log('Session:', data)
  console.log('Error:', error)
})
```

**Expected:**
- URL shows: `https://...supabase.co`
- Has ANON_KEY: `true`
- Session: `{session: null}` or `{session: {...}}`
- Error: `null`

---

### **STEP 6: Verify SQL Tables Created**

1. Buka **Supabase Dashboard**: https://supabase.com/dashboard
2. Select project **NusantaraGo**
3. Sidebar → **Table Editor**

**Harus ada 4 tables:**
- ✅ profiles
- ✅ saved_trips
- ✅ user_preferences
- ✅ trip_reviews

**Kalau tidak ada = SQL script belum di-run!**

**FIX:**
1. Copy semua isi file `database/schema.sql`
2. Supabase → SQL Editor → New query
3. Paste & Run (F5)

---

### **STEP 7: Check Google OAuth Config**

Di **Supabase Dashboard**:

1. Authentication → Providers → Google
2. Verify:
   - ✅ Enabled = ON
   - ✅ Client ID = ada
   - ✅ Client Secret = ada

Di **Google Cloud Console**:

1. APIs & Services → Credentials
2. OAuth 2.0 Client ID → NusantaraGo
3. Verify:
   - ✅ Authorized redirect URIs: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

---

## 🐛 COMMON ERRORS & FIXES:

### **Error: "Missing Supabase environment variables"**
**Fix:**
- Check `.env.local` exists
- Verify VITE_ prefix
- Restart dev server

---

### **Error: "Invalid login credentials"**
**Fix:**
- Email might not be verified
- Disable email confirmation di Supabase:
  - Authentication → Settings
  - Uncheck "Enable email confirmations"

---

### **Error: "Failed to fetch"**
**Fix:**
- Check internet connection
- Verify SUPABASE_URL is correct
- Check Supabase project status (might be paused)

---

### **Auth state changed but still redirects to landing**
**Fix:**
- Check if `setViewState('dashboard')` is called (console log)
- Clear browser cache & storage:
  - F12 → Application → Storage → Clear site data
- Hard refresh: Ctrl+Shift+R

---

## 📸 WHAT TO SHARE IF STILL ERROR:

**Please send me:**

1. **Screenshot** browser console (F12 → Console tab)
2. **Copy-paste** any red error messages
3. **Confirm:**
   - ✅ SQL script sudah di-run?
   - ✅ Tables ada di Supabase?
   - ✅ .env.local sudah benar?
   - ✅ Server sudah di-restart?

---

## 🎯 QUICK DIAGNOSTIC COMMAND:

Paste ini di browser console untuk instant diagnosis:

```javascript
// === NUSANTARAGO DIAGNOSTIC ===
console.clear()
console.log('=== DIAGNOSTIC START ===')

// 1. Check env
console.log('1. ENV VARIABLES:')
console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || '❌ MISSING')
console.log('  Has ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌')

// 2. Check Supabase client
console.log('\n2. SUPABASE CLIENT:')
console.log('  Exists:', typeof supabase !== 'undefined' ? '✅' : '❌')

// 3. Check auth state
if (typeof supabase !== 'undefined') {
  supabase.auth.getSession().then(({data, error}) => {
    console.log('\n3. AUTH STATE:')
    console.log('  Logged in:', data.session ? '✅ YES' : '❌ NO')
    if (data.session) {
      console.log('  Email:', data.session.user.email)
    }
    console.log('  Error:', error || 'None')
  })
}

console.log('\n=== DIAGNOSTIC END ===')
console.log('Share screenshot of this to debug!')
```

---

## ✅ SUCCESS INDICATORS:

**When everything works, you should see:**

1. **Console logs:**
   ```
   🔐 Setting up Supabase auth listener...
   🔄 Auth state changed: {email: "..."}
   ✅ User authenticated: your@email.com
   ```

2. **URL changes:**
   ```
   http://localhost:3001/#access_token=...
   ```
   *(briefly, then redirects)*

3. **Dashboard appears** with user data!

---

**RUN THROUGH THIS CHECKLIST AND REPORT BACK!** 🚀
