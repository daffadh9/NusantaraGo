# ⚡ QUICK DEPLOY - NUSANTARAGO

**Cara Tercepat Deploy ke nusantarago.id** (5 menit!)

---

## 🎯 METHOD 1: NETLIFY DROP (PALING MUDAH!)

### **Step 1: Build**
✅ **SUDAH SELESAI!** (`dist/` folder sudah ready)

### **Step 2: Deploy**

1. **Buka Netlify:**
   👉 https://app.netlify.com/drop

2. **Drag & Drop:**
   - Drag folder `dist/` ke area upload
   - Atau klik "Browse to upload" → pilih folder `dist/`

3. **Wait... (30 detik)**
   - Netlify auto-upload & deploy
   - Dapat URL sementara: `random-name-123.netlify.app`

4. **Set Custom Domain:**
   - Site settings → Domain management
   - Add custom domain: `nusantarago.id`
   - Update DNS (lihat di bawah)

5. **DONE!** ✅
   - SSL otomatis aktif
   - CDN global aktif
   - Site live di nusantarago.id

---

## 🎯 METHOD 2: NETLIFY CLI

### **Step 1: Login**
```bash
netlify login
```
→ Browser terbuka → Authorize → Done!

### **Step 2: Deploy**
```bash
netlify deploy --prod --dir=dist
```
→ Follow prompts → Done!

### **Step 3: Set Custom Domain**
```bash
netlify domains:add nusantarago.id
```

---

## 🎯 METHOD 3: GITHUB + NETLIFY (CI/CD)

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### **Step 2: Connect Netlify**
1. Netlify Dashboard → "Import from Git"
2. Connect GitHub
3. Select repository: `NusantaraGo`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

### **Benefit:**
- ✅ Auto-deploy on push
- ✅ Preview for PRs
- ✅ Rollback easy

---

## 🌐 DNS CONFIGURATION

### **Setelah Deploy, Update DNS di Registrar Domain:**

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: Auto
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: [your-site-name].netlify.app
TTL: Auto
```

**Netlify DNS (Recommended):**
```
ns1.netlify.com
ns2.netlify.com
```

**Wait:** 1-24 jam (biasanya 1-2 jam)

---

## 🔐 POST-DEPLOYMENT

### **1. Update Supabase OAuth:**
```
Dashboard → Authentication → URL Configuration

Site URL: https://nusantarago.id

Redirect URLs:
https://nusantarago.id/**
https://www.nusantarago.id/**
```

### **2. Update Google OAuth:**
```
Google Console → Credentials

Authorized redirect URIs:
https://nusantarago.id/auth/callback
https://[project].supabase.co/auth/v1/callback
```

### **3. Environment Variables:**
Netlify Dashboard → Site settings → Environment variables

Add:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_GEMINI_API_KEY=your_key
VITE_GOOGLE_MAPS_API_KEY=your_key
```

Then **Redeploy** (Deploys → Trigger deploy → Clear cache)

---

## 🧪 TESTING

After deploy, test:
- [ ] https://nusantarago.id loads
- [ ] SSL valid (🔒 green padlock)
- [ ] Login works
- [ ] Dashboard loads
- [ ] All features work
- [ ] Images load
- [ ] Mobile responsive

---

## ⚡ RECOMMENDED: METHOD 1 (DRAG & DROP)

**Kenapa?**
- ✅ Paling cepat (5 menit)
- ✅ Tidak perlu CLI
- ✅ Tidak perlu login terminal
- ✅ Visual & mudah
- ✅ SSL otomatis

**Steps:**
1. Buka: https://app.netlify.com/drop
2. Drag folder `dist/`
3. Wait 30 detik
4. Done!

---

## 🆘 TROUBLESHOOTING

### **Build Fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

### **Deploy Fails:**
- Check internet connection
- Check Netlify status
- Try drag & drop method

### **Domain Not Working:**
- Wait 1-2 hours for DNS
- Check DNS settings correct
- Clear browser cache
- Try incognito mode

### **OAuth Fails:**
- Update Supabase URLs
- Update Google OAuth URLs
- Redeploy after ENV changes

---

## 📞 SUPPORT

**Netlify Docs:** https://docs.netlify.com  
**Netlify Status:** https://www.netlifystatus.com  
**Netlify Forums:** https://answers.netlify.com

---

## ✅ CURRENT STATUS

- [x] Code ready
- [x] Build successful
- [x] `dist/` folder ready
- [ ] **DEPLOY NOW!** 👉 https://app.netlify.com/drop

---

**Next Action:**  
🚀 Buka https://app.netlify.com/drop  
🎯 Drag folder `dist/` ke browser  
⏰ 5 menit → LIVE! 🎉
