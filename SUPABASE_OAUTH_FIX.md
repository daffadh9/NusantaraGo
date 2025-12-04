# 🔧 FIX: Supabase OAuth Showing Project Name Instead of "NusantaraGo"

## ❌ MASALAH:
Ketika login dengan Google, yang muncul adalah nama project Supabase, bukan "NusantaraGo"

## ✅ SOLUSI:

### 1. **Update Supabase Project Settings**

Masuk ke Supabase Dashboard:
```
https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/settings/general
```

#### Update di Tab "General":
- **Project name**: `NusantaraGo`
- **Organization**: `NusantaraGo`

#### Update di Tab "API":
- **Project URL**: Pastikan sudah custom domain (jika punya)
- **Anon Key**: (tidak perlu diubah)

---

### 2. **Update Google OAuth Configuration**

Masuk ke Google Cloud Console:
```
https://console.cloud.google.com/apis/credentials/consent
```

#### OAuth Consent Screen:
- **Application name**: `NusantaraGo`
- **Application logo**: Upload logo-unified.svg (converted to PNG 512x512)
- **Application homepage**: `https://nusantarago.id`
- **Application privacy policy**: `https://nusantarago.id/privacy-policy`
- **Application terms of service**: `https://nusantarago.id/terms-of-service`

#### Authorized domains:
```
nusantarago.id
localhost (untuk development)
```

#### Authorized redirect URIs (di Credentials > OAuth 2.0 Client IDs):
```
https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
http://localhost:3000/auth/callback (untuk development)
```

---

### 3. **Update Supabase Auth Configuration**

Di Supabase Dashboard > Authentication > URL Configuration:

#### Site URL:
```
https://nusantarago.id
```

#### Redirect URLs (whitelist):
```
https://nusantarago.id
https://nusantarago.id/auth/callback
http://localhost:3000
http://localhost:3000/auth/callback
```

---

### 4. **Update Email Templates (Opsional)**

Di Supabase Dashboard > Authentication > Email Templates:

Update semua email templates untuk menggunakan nama "NusantaraGo":

**Confirm Signup:**
```html
<h2>Selamat datang di NusantaraGo! 🎉</h2>
<p>Klik link di bawah untuk mengkonfirmasi email Anda:</p>
<p><a href="{{ .ConfirmationURL }}">Konfirmasi Email</a></p>
```

**Reset Password:**
```html
<h2>Reset Password - NusantaraGo</h2>
<p>Klik link di bawah untuk reset password Anda:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

---

### 5. **Update Environment Variables**

Pastikan `.env` sudah benar:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=NusantaraGo
VITE_APP_URL=https://nusantarago.id
```

---

### 6. **Clear Cache & Test**

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Logout dari semua akun Google**
3. **Test login ulang**

Expected result: 
✅ Akan muncul "NusantaraGo wants to access your Google Account"
✅ Bukan nama project Supabase

---

## 📝 CHECKLIST:

- [ ] Update Supabase Project Name di Settings > General
- [ ] Update Google OAuth Consent Screen (name, logo, URLs)
- [ ] Update Authorized domains & redirect URIs
- [ ] Update Supabase Site URL & Redirect URLs
- [ ] Update Email Templates (optional)
- [ ] Clear cache & test login

---

## 🆘 TROUBLESHOOTING:

**Masih muncul nama project?**
1. Bersihkan cache browser (Ctrl+Shift+Delete)
2. Coba di Incognito/Private mode
3. Tunggu 5-10 menit (propagasi perubahan Google)
4. Revoke akses aplikasi lama di: https://myaccount.google.com/permissions

**Error "redirect_uri_mismatch"?**
- Pastikan redirect URI di Google Console EXACT match dengan Supabase callback URL
- Tidak boleh ada trailing slash
- Harus include protokol (https://)

---

## 💡 TIPS:

- Google OAuth changes bisa butuh 5-10 menit untuk propagasi
- Jika masih gagal, coba revoke & re-grant permissions
- Test di Incognito mode untuk menghindari cache issues

---

**Status:** Ready to implement
**Priority:** HIGH
**Time estimate:** 15-20 minutes
