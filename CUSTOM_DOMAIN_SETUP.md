# 🌐 Custom Domain Setup Guide - NusantaraGo

## Overview
Setup custom domain untuk NusantaraGo menggunakan:
- **Main App:** nusantarago.com (Netlify/Vercel)
- **Auth:** auth.nusantarago.com (Supabase)
- **Domain Provider:** Hostinger

---

## Prerequisites
- ✅ Supabase Pro subscription ($25/month)
- ✅ Domain purchased (nusantarago.com)
- ✅ Access to Hostinger DNS management
- ✅ Access to Google Cloud Console

---

## Part 1: Buy Domain (Hostinger)

### Step 1: Purchase Domain
1. Go to: https://www.hostinger.com
2. Search: `nusantarago.com`
3. Add to cart
4. Complete purchase (~Rp 150k-300k/year)

### Step 2: Verify Ownership
1. Login to Hostinger dashboard
2. Go to: Domains → Manage
3. Verify domain is active

---

## Part 2: Setup Custom Auth Domain (Supabase)

### Step 1: Add Custom Domain in Supabase

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/hjmgoppcbqnxciqyixdf
   ```

2. **Navigate to:**
   ```
   Settings → General → Custom Domains
   ```

3. **Click "Add Custom Domain"**

4. **Enter:**
   ```
   Domain: auth.nusantarago.com
   Type: Auth
   ```

5. **Click "Add"**

6. **Supabase will show DNS records:**
   ```
   Type: CNAME
   Name: auth
   Value: hjmgoppcbqnxciqyixdf.supabase.co
   TTL: 3600
   ```

### Step 2: Configure DNS in Hostinger

1. **Login to Hostinger:**
   ```
   https://hpanel.hostinger.com
   ```

2. **Navigate to:**
   ```
   Domains → Manage → DNS/Name Servers
   ```

3. **Click "Add Record"**

4. **Add CNAME Record:**
   ```
   Type: CNAME
   Name: auth
   Points to: hjmgoppcbqnxciqyixdf.supabase.co
   TTL: 3600 (or Auto)
   ```

5. **Click "Save"**

### Step 3: Verify Domain in Supabase

1. **Wait 5-30 minutes** for DNS propagation

2. **Check DNS propagation:**
   ```
   https://dnschecker.org
   Search: auth.nusantarago.com
   ```

3. **Back to Supabase Dashboard**

4. **Click "Verify" button**

5. **Status should change to:** ✅ Active

6. **SSL Certificate:** Auto-provisioned by Supabase (Let's Encrypt)

---

## Part 3: Deploy App to Main Domain

### Option A: Deploy to Netlify (Recommended)

#### Step 1: Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Build app:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Follow prompts:**
   - Create new site
   - Build directory: `dist`
   - Deploy!

6. **Get Netlify URL:**
   ```
   https://nusantarago.netlify.app
   ```

#### Step 2: Add Custom Domain in Netlify

1. **Netlify Dashboard:**
   ```
   Site settings → Domain management → Add custom domain
   ```

2. **Enter:**
   ```
   nusantarago.com
   ```

3. **Netlify will show DNS records:**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: nusantarago.netlify.app
   ```

#### Step 3: Update DNS in Hostinger

1. **Add A Record:**
   ```
   Type: A
   Name: @ (or leave blank)
   Points to: 75.2.60.5
   TTL: Auto
   ```

2. **Add CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Points to: nusantarago.netlify.app
   TTL: Auto
   ```

3. **Save**

#### Step 4: Enable HTTPS in Netlify

1. **Netlify Dashboard → Domain settings**
2. **SSL/TLS certificate:** Auto-provisioned (Let's Encrypt)
3. **Force HTTPS:** Enable
4. **Wait 5-10 minutes**
5. ✅ **HTTPS active!**

---

### Option B: Deploy to Vercel (Alternative)

Similar process:
1. Install Vercel CLI
2. Deploy: `vercel --prod`
3. Add custom domain in Vercel dashboard
4. Update DNS in Hostinger with Vercel records

---

## Part 4: Update Google OAuth

### Step 1: Update Authorized Redirect URIs

1. **Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Select OAuth 2.0 Client ID:** NusantaraGo

3. **Authorized redirect URIs:**
   
   **Remove:**
   ```
   https://hjmgoppcbqnxciqyixdf.supabase.co/auth/v1/callback
   ```
   
   **Add:**
   ```
   https://auth.nusantarago.com/auth/v1/callback
   ```

4. **Save**

### Step 2: Update Authorized JavaScript Origins

**Add:**
```
https://nusantarago.com
https://www.nusantarago.com
```

### Step 3: Update OAuth Consent Screen

1. **Application home page:**
   ```
   https://nusantarago.com
   ```

2. **Privacy policy:**
   ```
   https://nusantarago.com/privacy.html
   ```

3. **Terms of service:**
   ```
   https://nusantarago.com/terms.html
   ```

4. **Save**

---

## Part 5: Update Environment Variables

### Update .env.local (Development)

Keep localhost for development:
```env
VITE_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Add .env.production (Production)

Create new file for production:
```env
VITE_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note:** Supabase URL stays the same! Custom domain only for auth callback.

---

## Part 6: Testing

### Test Custom Auth Domain

1. **Open:**
   ```
   https://nusantarago.com
   ```

2. **Click "Masuk / Daftar"**

3. **Click "Lanjut dengan Google"**

4. **Observe URL flow:**
   ```
   nusantarago.com
   → accounts.google.com (Google login)
   → auth.nusantarago.com/auth/v1/callback (flash)
   → nusantarago.com (logged in!)
   ```

5. **✅ Success!** No more Supabase project URL visible!

### Test HTTPS

1. **Check SSL:**
   ```
   https://www.ssllabs.com/ssltest/analyze.html?d=nusantarago.com
   ```

2. **Should get:** A or A+ rating

### Test DNS Propagation

```
https://dnschecker.org
```

Check:
- `nusantarago.com` → Points to Netlify
- `www.nusantarago.com` → Points to Netlify
- `auth.nusantarago.com` → Points to Supabase

---

## Complete DNS Records Summary

After all setup, your Hostinger DNS should look like:

```
Type    Name    Value                                   TTL
─────────────────────────────────────────────────────────────────
A       @       75.2.60.5 (Netlify IP)                 Auto
CNAME   www     nusantarago.netlify.app                Auto
CNAME   auth    hjmgoppcbqnxciqyixdf.supabase.co      Auto
```

---

## Troubleshooting

### Issue: DNS not propagating
**Solution:**
- Wait 24-48 hours (max)
- Check TTL settings (lower = faster)
- Use `nslookup auth.nusantarago.com`

### Issue: SSL certificate error
**Solution:**
- Wait 10-15 minutes after DNS propagation
- Force HTTPS in Netlify/Vercel
- Clear browser cache

### Issue: OAuth redirect error
**Solution:**
- Verify redirect URI exactly matches in Google Cloud
- Check Supabase custom domain is "Active"
- Test in incognito mode

### Issue: "This site can't be reached"
**Solution:**
- Check DNS records in Hostinger
- Verify domain is not expired
- Check Netlify deployment status

---

## Cost Breakdown

| Service | Cost | Billing |
|---------|------|---------|
| Supabase Pro | $25 | Monthly |
| Domain (Hostinger) | ~Rp 150k-300k | Yearly |
| Netlify (Free tier) | $0 | Free |
| SSL Certificate | $0 | Free (Let's Encrypt) |
| **Total** | **~$25/month + Rp 150k-300k/year** | |

---

## Timeline

| Week | Task | Duration |
|------|------|----------|
| 1 | Buy domain | 1 hour |
| 2 | Setup custom auth domain | 2-3 hours |
| 3 | Deploy app to production | 3-4 hours |
| 4 | Update OAuth & testing | 2 hours |
| **Total** | | **~8-10 hours** |

---

## Benefits

### Before Custom Domain:
```
❌ User sees: hjmgoppcbqnxciqyixdf.supabase.co
❌ Looks unprofessional
❌ Hard to remember
```

### After Custom Domain:
```
✅ User sees: nusantarago.com
✅ Professional branding
✅ Easy to remember
✅ Better SEO
✅ Increased trust
```

---

## Next Steps

1. ✅ Buy domain from Hostinger
2. ✅ Setup custom auth domain in Supabase
3. ✅ Deploy app to Netlify/Vercel
4. ✅ Update Google OAuth
5. ✅ Test everything
6. ✅ Launch! 🚀

---

## Resources

- **Supabase Custom Domains:** https://supabase.com/docs/guides/platform/custom-domains
- **Netlify Custom Domains:** https://docs.netlify.com/domains-https/custom-domains/
- **Hostinger DNS Guide:** https://support.hostinger.com/en/articles/1583227-how-to-manage-dns-records
- **Google OAuth Setup:** https://developers.google.com/identity/protocols/oauth2

---

**Good luck with your custom domain setup!** 🌐✨
