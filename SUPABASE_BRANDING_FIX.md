# 🔐 FIX: Login Shows "Supabase" Instead of "NusantaraGo"

## Problem
Saat login via Google OAuth, user melihat "Login to [project-id].supabase.co" bukan "Login to NusantaraGo"

## Solution: Update Supabase Project Settings

### Step 1: Go to Supabase Dashboard
```
https://supabase.com/dashboard/project/[your-project-id]/settings/general
```

### Step 2: Update Project Name
1. Go to **Settings** → **General**
2. Find "Project name"
3. Change from default to: **NusantaraGo**
4. Click **Save**

### Step 3: Update Auth Settings (IMPORTANT!)
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://nusantarago.id` (or your production URL)
3. Add **Redirect URLs**:
   - `https://nusantarago.id/*`
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
   - `http://localhost:5173/*`

### Step 4: Update Email Templates
1. Go to **Authentication** → **Email Templates**
2. Update all templates to use "NusantaraGo" branding:

**Confirm signup:**
```html
<h2>Selamat Datang di NusantaraGo! 🌴</h2>
<p>Halo {{ .Email }},</p>
<p>Klik link di bawah untuk konfirmasi akun NusantaraGo kamu:</p>
<p><a href="{{ .ConfirmationURL }}">Konfirmasi Email</a></p>
<p>Salam petualang,<br/>Tim NusantaraGo</p>
```

**Reset password:**
```html
<h2>Reset Password NusantaraGo 🔐</h2>
<p>Halo {{ .Email }},</p>
<p>Kamu request untuk reset password. Klik link di bawah:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>Link ini expired dalam 24 jam.</p>
<p>Salam,<br/>Tim NusantaraGo</p>
```

### Step 5: Update Google OAuth Consent Screen (GCP)
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Edit OAuth consent screen:
   - **App name**: NusantaraGo
   - **User support email**: support@nusantarago.id
   - **App logo**: Upload NusantaraGo logo (512x512)
   - **Application home page**: https://nusantarago.id
   - **Privacy policy**: https://nusantarago.id/privacy
   - **Terms of service**: https://nusantarago.id/terms
3. Save changes

### Step 6: Verify OAuth Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Verify **Authorized redirect URIs** include:
   - `https://[your-project].supabase.co/auth/v1/callback`

---

## Quick Checklist ✅

- [ ] Supabase project name = "NusantaraGo"
- [ ] Site URL configured correctly
- [ ] Redirect URLs added for all environments
- [ ] Email templates updated with branding
- [ ] GCP OAuth consent screen = "NusantaraGo"
- [ ] GCP app logo uploaded
- [ ] Privacy & Terms URLs added

---

## After These Changes

Users will see:
- ✅ "Sign in to NusantaraGo" (instead of Supabase project ID)
- ✅ NusantaraGo logo on Google OAuth popup
- ✅ Branded emails with NusantaraGo styling
- ✅ Professional trust signals

---

**Time Required**: 10-15 minutes
**Difficulty**: Easy (just settings changes)
**Impact**: High (professional branding)
