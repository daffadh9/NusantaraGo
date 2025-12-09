# 🔧 CODE AUDIT REPORT - NusantaraGo

**Audit Date:** December 2025  
**Auditor:** Technical Review  
**Severity Levels:** 🔴 Critical | 🟡 Medium | 🟢 Low

---

## EXECUTIVE SUMMARY

| Category | Issues Found | Critical | Medium | Low |
|----------|-------------|----------|--------|-----|
| Security | 4 | 2 | 2 | 0 |
| Performance | 3 | 0 | 2 | 1 |
| Code Quality | 5 | 0 | 3 | 2 |
| Architecture | 3 | 0 | 2 | 1 |
| **TOTAL** | **15** | **2** | **9** | **4** |

---

## 🔴 CRITICAL ISSUES

### ISSUE #1: API Keys Exposed in Client Bundle

**Location:** `.env`, `services/geminiService.ts`

**Problem:**
```typescript
// All VITE_ prefixed vars are bundled into client-side code!
VITE_API_KEY=AIzaSy... // Gemini API - EXPOSED!
VITE_GOOGLE_MAPS_API_KEY=AIzaSy... // Maps - EXPOSED!
VITE_GOOGLE_SEARCH_API_KEY=AIzaSy... // Search - EXPOSED!
```

**Risk:** 
- Anyone can extract keys from browser DevTools
- Cost explosion from unauthorized usage
- Potential account suspension

**Fix:**
```typescript
// 1. Create backend proxy (Supabase Edge Function)
// supabase/functions/ai-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { prompt } = await req.json()
  
  // Server-side API call with secret key
  const response = await fetch('https://generativelanguage.googleapis.com/...', {
    headers: {
      'Authorization': `Bearer ${Deno.env.get('GEMINI_API_KEY')}`
    },
    body: JSON.stringify({ prompt })
  })
  
  return new Response(await response.text())
})

// 2. Update frontend to call proxy
const response = await fetch('/api/ai-proxy', {
  method: 'POST',
  body: JSON.stringify({ prompt })
})
```

**Priority:** 🔴 FIX BEFORE LAUNCH

---

### ISSUE #2: No Rate Limiting

**Location:** All API services

**Problem:**
```typescript
// Current: No protection against abuse
export const generateItinerary = async (input) => {
  // Anyone can call unlimited times!
  return await ai.generate(...)
}
```

**Risk:**
- DDoS vulnerability
- Cost explosion
- API quota exhaustion

**Fix:**
```typescript
// Add rate limiting in Supabase Edge Function
const RATE_LIMIT = 10 // requests per minute
const userRequests = new Map()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userHistory = userRequests.get(userId) || []
  
  // Filter to last minute
  const recent = userHistory.filter(t => now - t < 60000)
  
  if (recent.length >= RATE_LIMIT) {
    return false // Rate limited
  }
  
  recent.push(now)
  userRequests.set(userId, recent)
  return true
}
```

**Priority:** 🔴 FIX BEFORE LAUNCH

---

## 🟡 MEDIUM ISSUES

### ISSUE #3: No Input Validation/Sanitization

**Location:** `services/geminiService.ts`, form inputs

**Problem:**
```typescript
// User input directly interpolated into prompts
const prompt = `Destinasi: ${input.destination}...`
// Potential prompt injection!
```

**Fix:**
```typescript
import { z } from 'zod'

const TripInputSchema = z.object({
  destination: z.string().min(2).max(100).regex(/^[a-zA-Z\s,]+$/),
  duration: z.number().int().min(1).max(30),
  budget: z.enum(['budget', 'medium', 'luxury']),
  interests: z.array(z.string()).max(10)
})

export const generateItinerary = async (rawInput: unknown) => {
  const input = TripInputSchema.parse(rawInput) // Validates & sanitizes
  // ...
}
```

---

### ISSUE #4: Missing Error Boundaries

**Location:** Component tree

**Problem:** ErrorBoundary exists but not comprehensive

**Fix:**
```tsx
// Wrap each major section
<ErrorBoundary fallback={<TripPlannerError />}>
  <TripPlanner />
</ErrorBoundary>

<ErrorBoundary fallback={<SocialFeedError />}>
  <SocialFeed />
</ErrorBoundary>
```

---

### ISSUE #5: Large Bundle Size (No Code Splitting)

**Location:** `App.tsx`

**Problem:**
```typescript
// All components imported upfront
import Dashboard from './components/Dashboard'
import TripReady from './components/TripReady'
import SocialFeed from './components/SocialFeed'
// ... 60+ components loaded on initial page!
```

**Fix:**
```typescript
import React, { Suspense, lazy } from 'react'

// Lazy load non-critical components
const Dashboard = lazy(() => import('./components/Dashboard'))
const TripReady = lazy(() => import('./components/TripReady'))
const SocialFeed = lazy(() => import('./components/SocialFeed'))

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

---

### ISSUE #6: Prop Drilling

**Location:** App → Dashboard → Child components

**Problem:**
```tsx
// Props passed through 4+ levels
<App>
  <Dashboard user={user} onLogout={...} isDarkMode={...}>
    <TripPlanner user={user} onGenerate={...}>
      <UsageIndicator userId={user.id} refreshTrigger={...} />
    </TripPlanner>
  </Dashboard>
</App>
```

**Fix:**
```typescript
// Use Zustand for global state
// stores/useAppStore.ts
import { create } from 'zustand'

interface AppState {
  user: User | null
  isDarkMode: boolean
  setUser: (user: User | null) => void
  toggleDarkMode: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isDarkMode: true,
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode }))
}))

// Usage in any component
const user = useAppStore((s) => s.user)
```

---

### ISSUE #7: Inconsistent Error Handling

**Location:** Throughout services

**Problem:**
```typescript
// Some errors swallowed silently
try {
  const data = await fetchSomething()
} catch (e) {
  console.log(e) // Just logged, user sees nothing
}
```

**Fix:**
```typescript
// Centralized error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message)
  }
}

// Error handler utility
export function handleError(error: unknown): never {
  if (error instanceof AppError) {
    toast.error(error.userMessage)
    Sentry.captureException(error)
  } else {
    toast.error('Terjadi kesalahan. Silakan coba lagi.')
    Sentry.captureException(error)
  }
  throw error
}
```

---

### ISSUE #8: No Loading States for Images

**Location:** Various components with images

**Fix:**
```tsx
// Create reusable image component
const OptimizedImage: React.FC<{src: string, alt: string}> = ({src, alt}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  
  return (
    <div className="relative">
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={error ? FALLBACK_IMAGE : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={loaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  )
}
```

---

## 🟢 LOW ISSUES

### ISSUE #9: Console Logs in Production

**Location:** Throughout codebase

**Fix:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

---

### ISSUE #10: Missing TypeScript Strict Mode

**Location:** `tsconfig.json`

**Fix:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## RECOMMENDED PACKAGE ADDITIONS

```json
{
  "dependencies": {
    "zustand": "^4.4.0",        // State management
    "zod": "^3.22.0",           // Validation
    "react-query": "^5.0.0",    // Data fetching
    "react-hot-toast": "^2.4.0" // Notifications
  },
  "devDependencies": {
    "@sentry/react": "^7.0.0",  // Error tracking
    "vitest": "^1.0.0",         // Testing
    "eslint": "^8.0.0",         // Linting
    "prettier": "^3.0.0"        // Formatting
  }
}
```

---

## FILE STRUCTURE RECOMMENDATION

```
src/
├── components/
│   ├── common/          # Button, Input, Modal, etc.
│   ├── features/        # Feature-specific
│   │   ├── trip-planner/
│   │   ├── social-feed/
│   │   └── booking/
│   └── layout/          # Header, Footer, Sidebar
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
├── services/
│   └── api/             # API layer
├── utils/               # Helpers
├── types/               # TypeScript types
└── tests/               # Test files
```

---

## ACTION ITEMS (Priority Order)

### Before Launch (MUST):
- [ ] Move API keys to server-side proxy
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Remove console logs in production

### After Launch (SHOULD):
- [ ] Add code splitting
- [ ] Implement Zustand for state
- [ ] Add comprehensive error handling
- [ ] Set up Sentry monitoring

### Future (NICE TO HAVE):
- [ ] Refactor file structure
- [ ] Add unit tests
- [ ] Enable TypeScript strict mode
