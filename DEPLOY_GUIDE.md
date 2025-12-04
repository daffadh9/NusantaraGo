# 🚀 DEPLOY GUIDE - NusantaraGo Production

**Target:** nusantarago.id  
**Date:** December 4, 2024

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **1. Environment Variables**
Pastikan `.env` production sudah benar:

```bash
# .env.production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_API_KEY=your_gemini_api_key
```

### **2. Supabase Configuration**
- [ ] OAuth redirect URLs updated to `nusantarago.id`
- [ ] Database tables created (users, posts, stories, etc.)
- [ ] Storage policies configured
- [ ] RLS policies enabled

### **3. Build Test**
```bash
npm run build
```

Check for errors. Should output to `dist/` folder.

---

## 🔨 BUILD FOR PRODUCTION

### **Step 1: Clean Previous Build**
```bash
rm -rf dist
```

### **Step 2: Build**
```bash
npm run build
```

**Expected Output:**
```
✓ 1580 modules transformed.
dist/index.html                   0.51 kB │ gzip: 0.33 kB
dist/assets/index-xxx.css        45.23 kB │ gzip: 8.12 kB
dist/assets/index-xxx.js      1,234.56 kB │ gzip: 345.67 kB
✓ built in 15.23s
```

### **Step 3: Test Production Build Locally**
```bash
npm run preview
```

Open http://localhost:4173 and test:
- [ ] Login works
- [ ] Dashboard loads
- [ ] All features functional
- [ ] Images load correctly
- [ ] No console errors

---

## 🌐 DEPLOYMENT OPTIONS

### **OPTION 1: Netlify (Recommended)**

#### **A. Via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### **B. Via Netlify Dashboard**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag & drop `dist/` folder
4. Set custom domain: nusantarago.id

#### **Environment Variables in Netlify:**
1. Site settings → Environment variables
2. Add all VITE_ variables
3. Redeploy

---

### **OPTION 2: Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set custom domain in Vercel dashboard.

---

### **OPTION 3: Traditional Hosting (cPanel/VPS)**

#### **Upload Files:**
```bash
# Via FTP/SFTP
# Upload contents of dist/ folder to public_html/

# Or via SSH
scp -r dist/* user@nusantarago.id:/var/www/html/
```

#### **Configure Web Server:**

**For Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**For Nginx:**
```nginx
server {
    listen 80;
    server_name nusantarago.id www.nusantarago.id;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

---

## 🔐 SSL CERTIFICATE

### **Netlify/Vercel:**
SSL automatically provided ✅

### **Traditional Hosting:**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d nusantarago.id -d www.nusantarago.id

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### **Option: GitHub Actions**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

---

## 🧪 POST-DEPLOYMENT TESTING

### **Checklist:**
- [ ] nusantarago.id loads correctly
- [ ] SSL certificate valid (🔒 padlock)
- [ ] Login with Google OAuth works
- [ ] Dashboard loads with user data
- [ ] All 9 features functional
- [ ] Images load (check Network tab)
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] Performance score > 90 (Lighthouse)

### **Test Tools:**
```bash
# Lighthouse
npx lighthouse https://nusantarago.id --view

# PageSpeed Insights
# https://pagespeed.web.dev/
```

---

## 🔥 DOMAIN CONFIGURATION

### **DNS Settings:**

**For Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Cloudflare (if using):**
1. Add site to Cloudflare
2. Update nameservers at domain registrar
3. Set SSL/TLS mode to "Full"
4. Enable "Always Use HTTPS"

---

## ⚡ PERFORMANCE OPTIMIZATION

### **Already Implemented:**
✅ Code splitting (Vite)
✅ Tree shaking
✅ CSS minification
✅ Image lazy loading
✅ Gzip compression

### **Additional (Optional):**

**1. CDN for Static Assets:**
```tsx
// Use Cloudflare Images or Imgix
const imageUrl = `https://cdn.nusantarago.id/images/${filename}`;
```

**2. Service Worker (PWA):**
Already configured in `vite.config.ts` with PWA plugin.

**3. Preload Critical Assets:**
```html
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

---

## 📊 MONITORING

### **Recommended Tools:**

1. **Sentry** - Error tracking
```bash
npm install @sentry/react
```

2. **Google Analytics** - User analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

3. **Uptime Monitoring**
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## 🐛 TROUBLESHOOTING

### **Issue: Build Fails**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### **Issue: OAuth Redirect Fails**
Check Supabase → Authentication → URL Configuration:
- Site URL: https://nusantarago.id
- Redirect URLs: https://nusantarago.id/**, http://localhost:3002/**

### **Issue: Images Not Loading**
Check CORS settings in Supabase Storage.

### **Issue: Blank Page After Deploy**
Check browser console for errors. Usually:
- Missing environment variables
- Wrong base URL in router
- CORS issues

---

## 🔄 ROLLBACK PROCEDURE

### **Netlify:**
```bash
# List deploys
netlify deploy:list

# Rollback to previous
netlify rollback
```

### **Vercel:**
Dashboard → Deployments → Click previous → "Promote to Production"

### **Manual:**
```bash
# Keep backup
cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)

# Restore
rm -rf dist
cp -r dist.backup.20241204_180000 dist
```

---

## ✅ DEPLOYMENT COMPLETE!

**Post-Deployment:**
1. Update `SUPABASE_BRANDING_FIX.md` OAuth URLs
2. Test all features on production
3. Monitor error logs
4. Announce to users! 🎉

**Next:**
- Set up monitoring
- Configure backups
- Plan feature releases

---

**Developer:** Ready for Production  
**Quality:** ⭐⭐⭐⭐⭐  
**Status:** Deploy-Ready! 🚀
