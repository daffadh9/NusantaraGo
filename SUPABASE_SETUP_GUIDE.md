# 🚀 SUPABASE SETUP GUIDE - NusantaraGo

## 📌 Kenapa Supabase?
✅ **Free tier generous** (50,000 monthly active users)  
✅ **PostgreSQL database** (powerful & scalable)  
✅ **Built-in Auth** (Email, Google, Apple, dll)  
✅ **Real-time subscriptions**  
✅ **Storage untuk images/files**  
✅ **Edge Functions** (serverless backend)  
✅ **Open source** (bisa self-host nanti)

---

## 🎯 STEP-BY-STEP SETUP

### **STEP 1: Create Supabase Account**

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up dengan GitHub/Google
4. Buat **New Project**:
   - **Name:** NusantaraGo
   - **Database Password:** (simpan ini! butuh nanti)
   - **Region:** Singapore (closest to Indonesia)
   - **Pricing:** Free tier

⏳ **Wait 2-3 minutes** untuk project setup

---

### **STEP 2: Get API Keys**

1. Di Supabase Dashboard → **Settings** → **API**
2. Copy these keys:
   - ✅ **`anon/public` key** (untuk client-side)
   - ✅ **Project URL**

**Example:**
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **STEP 3: Enable Google OAuth**

1. Dashboard → **Authentication** → **Providers**
2. Enable **Google**
3. Klik **Configure** → Butuh:
   - Google Client ID
   - Google Client Secret

**Cara dapat Google OAuth credentials:**

#### A. Buat Google Cloud Project
1. Go to https://console.cloud.google.com
2. **Create New Project** → Name: "NusantaraGo"
3. Wait project creation (30 detik)

#### B. Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search **"Google+ API"**
3. Click **Enable**

#### C. Create OAuth Consent Screen
1. **APIs & Services** → **OAuth consent screen**
2. Select **External**
3. Fill:
   - **App name:** NusantaraGo
   - **User support email:** your email
   - **Developer email:** your email
4. Click **Save and Continue** → Skip scopes → Save

#### D. Create OAuth Credentials
1. **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. **Application type:** Web application
4. **Name:** NusantaraGo Web
5. **Authorized redirect URIs:** (IMPORTANT!)
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   Example:
   ```
   https://abcdefghijklmnop.supabase.co/auth/v1/callback
   ```
6. Click **Create**
7. **Copy:**
   - Client ID
   - Client Secret

#### E. Configure di Supabase
1. Kembali ke Supabase Dashboard
2. **Authentication** → **Providers** → **Google**
3. Paste:
   - Client ID
   - Client Secret
4. **Save**

---

### **STEP 4: Install Supabase Client**

Di terminal project NusantaraGo:

```bash
npm install @supabase/supabase-js
```

---

### **STEP 5: Create Supabase Client**

Create file: `src/lib/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

### **STEP 6: Update .env.local**

```env
# Gemini API (existing)
VITE_API_KEY=AIzaSyAonAgzN30j3PqKRRvEoDnhL1XhWC3y7Zk

# Supabase (NEW)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **STEP 7: Create Auth Service**

Create file: `src/services/authService.ts`

```typescript
import { supabase } from '../lib/supabaseClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

// Sign up dengan email
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  
  if (error) throw error
  return data
}

// Sign in dengan email
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Sign in dengan Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    }
  })
  
  if (error) throw error
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Reset password
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) throw error
}

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata.avatar_url,
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChanged((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
        avatar: session.user.user_metadata.avatar_url,
      })
    } else {
      callback(null)
    }
  })
}
```

---

### **STEP 8: Create Database Tables**

Di Supabase Dashboard → **SQL Editor** → **New query**

```sql
-- Users profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  member_since TIMESTAMP DEFAULT NOW(),
  level TEXT DEFAULT 'Newbie Explorer',
  points INTEGER DEFAULT 0,
  miles INTEGER DEFAULT 0,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved trips table
CREATE TABLE IF NOT EXISTS saved_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  duration INTEGER,
  budget_range TEXT,
  traveler_type TEXT,
  interests TEXT[],
  itinerary_data JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policies for saved_trips
CREATE POLICY "Users can view own trips" 
ON saved_trips FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" 
ON saved_trips FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" 
ON saved_trips FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" 
ON saved_trips FOR DELETE 
USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Click **Run** untuk execute!

---

## ✅ TESTING

### Test 1: Email Sign Up
```bash
# Di browser console
import { signUpWithEmail } from './services/authService'
await signUpWithEmail('test@example.com', 'password123', 'Test User')
```

### Test 2: Email Login
```bash
import { signInWithEmail } from './services/authService'
await signInWithEmail('test@example.com', 'password123')
```

### Test 3: Google Login
- Click button "Lanjut dengan Google"
- Should redirect to Google login
- After auth, redirect back to app

---

## 🎯 NEXT STEPS (Implementation)

1. ✅ Update `AuthPageNew.tsx` to use real Supabase auth
2. ✅ Replace mock `onLogin` with Supabase calls
3. ✅ Add auth state persistence
4. ✅ Update `storageService.ts` to save trips to Supabase instead of localStorage
5. ✅ Add real-time sync for saved trips

---

## 📱 PRODUCTION CHECKLIST

Before deploy:
- [ ] Enable email confirmations (Settings → Auth → Email templates)
- [ ] Setup custom email SMTP (optional)
- [ ] Add rate limiting
- [ ] Enable MFA (Multi-Factor Authentication)
- [ ] Setup monitoring & alerts
- [ ] Backup database regularly

---

## 💡 TIPS

1. **Development:** Use `.env.local` (git-ignored)
2. **Production:** Set env vars di Netlify/Vercel
3. **Security:** NEVER commit API keys to git
4. **Testing:** Use Supabase's test mode for development

---

## 🆘 TROUBLESHOOTING

**Problem:** Google auth not working  
**Solution:** Check redirect URI matches exactly

**Problem:** "Invalid API key"  
**Solution:** Check VITE_ prefix di env variables

**Problem:** Database permission denied  
**Solution:** Check RLS policies di Supabase

---

## 📚 RESOURCES

- 📖 Supabase Docs: https://supabase.com/docs
- 🎓 Auth Guide: https://supabase.com/docs/guides/auth
- 💬 Community: https://discord.supabase.com

---

## ✨ READY TO IMPLEMENT?

Kalau sudah follow semua steps di atas, bilang:

**"Oke, Supabase setup done! Lanjut implement auth logic!"**

Dan saya akan update `AuthPageNew.tsx` untuk menggunakan real Supabase authentication! 🚀
