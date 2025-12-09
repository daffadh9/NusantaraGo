# 📋 PRODUCT REQUIREMENT DOCUMENT (PRD)
## NusantaraGo - AI-Powered Travel Companion

**Version:** 1.0  
**Status:** MVP Development  
**Product Owner:** Daffa Dhiyaulhaq Khadafi  
**Target Launch:** July 2026

---

## 1. PRODUCT OVERVIEW

### Vision
Menjadi platform travel #1 di Indonesia yang menggabungkan AI, komunitas, dan booking dalam satu ekosistem.

### Mission
Membantu 10 juta orang Indonesia merencanakan dan menikmati perjalanan yang lebih baik dengan teknologi AI.

### Value Proposition
"Rencanakan trip impianmu dalam hitungan detik dengan AI, temukan travel buddy, dan dapatkan harga terbaik - semua dalam satu aplikasi."

---

## 2. TARGET USERS

### Primary Persona: "ADVENTURE ADIT" (25-30)
- **Demographics:** Urban professional, Jakarta/Bandung/Surabaya
- **Behavior:** Active on Instagram, loves exploring new places
- **Trip Style:** Solo/couple, 3-5 days, domestic
- **Budget:** Rp 3-5 juta/trip
- **Pain Points:** 
  - Planning takes too long (2-3 hours)
  - Hard to find hidden gems
  - Overwhelmed by options

### Secondary Persona: "FAMILY FITRI" (35-45)
- **Demographics:** Working mom, suburban
- **Behavior:** Practical, values safety
- **Trip Style:** Family with kids, weekend getaways
- **Budget:** Rp 10-20 juta/trip
- **Pain Points:**
  - Need kid-friendly places
  - Safety concerns
  - Complex logistics

### Tertiary Persona: "BUDGET BUDI" (20-25)
- **Demographics:** College student/fresh grad
- **Behavior:** Price-sensitive, backpacker
- **Trip Style:** Backpacking, adventure
- **Budget:** < Rp 2 juta/trip
- **Pain Points:**
  - Limited budget
  - Finding cheapest options
  - Meeting travel buddies

---

## 3. FEATURE SPECIFICATIONS

### 3.1 Core Features (MVP)

#### F1: AI Itinerary Generator ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Input | Destination, Duration, Budget, Interests |
| Output | Day-by-day itinerary with timing, costs, tips |
| AI Model | Google Gemini |
| Response Time | < 10 seconds |
| Quota (Free) | 3/month |
| Quota (Premium) | Unlimited |

**User Story:**
> As a traveler, I want to generate a personalized itinerary in seconds, so that I don't spend hours researching.

---

#### F2: User Authentication ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Methods | Email/Password, Google OAuth |
| Provider | Supabase Auth |
| Session | 7 days persistent |
| Security | JWT tokens, secure cookies |

---

#### F3: Social Feed ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Post Types | Text, Image, Story |
| Interactions | Like, Comment, Share |
| Real-time | Supabase Realtime |
| Media Storage | Supabase Storage |

---

#### F4: Travel Buddy Matcher ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Matching | Swipe-based (Tinder-like) |
| Filters | Gender, Age, Travel Style, Verified |
| Safety | Verified badges, Report system |
| Chat | In-app messaging (planned) |

---

#### F5: Trip Ready AI (Packing List) ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Input | Trip details, personal preferences |
| Output | Categorized checklist |
| Features | Custom items, memo, save to profile |
| Export | PDF, Share |

---

#### F6: Live Trip Sharing ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Tracking | Real-time location |
| Safety | SOS button with countdown |
| Contacts | Emergency contacts list |
| Privacy | User-controlled sharing |

---

#### F7: Smart Ticket Scanner ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Scan Types | Flight, Train, Bus, Hotel, Event |
| AI Extraction | Auto-detect ticket info |
| Actions | Add to calendar, Share, QR display |
| Storage | Local + Cloud sync |

---

#### F8: Rewards & Gamification ✅
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Points | Earn from activities |
| Challenges | Weekly/monthly tasks |
| Rewards | Discounts, vouchers, premium |
| Tiers | Bronze, Silver, Gold, Platinum |

---

#### F9: Smart Price Alert & Prediction 
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Types | Flight, Hotel, Train, Bus |
| AI Prediction | Best time to book, price trends |
| Alerts | Real-time notifications when price drops |
| Flash Deals | Time-limited exclusive offers |
| Confidence Score | AI accuracy percentage |

---

#### F10: AI Travel Concierge (NARA) 
**Status:** Enhanced

| Attribute | Specification |
|-----------|---------------|
| Quick Actions | 6 preset travel assistance buttons |
| Destinations | Trending destinations with tags |
| Chat Modes | Quick actions, Free chat, Itinerary builder |
| Capabilities | Destination info, Kuliner, Hidden gems, Photo spots |
| AI Engine | Google Gemini with travel context |

---

#### F11: Group Trip Planner & Split Bill 
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Trip Management | Shared trip with invite code |
| Members | Add/remove, role-based (admin/member) |
| Expenses | Track per-person, categories |
| Split Bill | Equal/Custom split with AI settlement |
| Balance | Real-time who owes who |
| Chat | Group communication |

---

#### F12: Offline Mode & Travel Companion 
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Offline Maps | Download maps per region |
| Offline Itinerary | Access saved trips offline |
| Phrasebook | Local language with audio pronunciation |
| Emergency | SOS button, emergency contacts |
| Compass | Built-in navigation tool |
| Storage | Up to 200MB offline content |

---

#### F13: Creator Monetization Dashboard 
**Status:** Implemented

| Attribute | Specification |
|-----------|---------------|
| Creator Tiers | Bronze, Silver, Gold, Pro |
| Content Types | Itinerary, Guide, Video, Story |
| Monetization | Revenue share from content sales |
| Analytics | Views, engagement, earnings breakdown |
| Milestones | Achievement-based rewards |
| Payouts | Direct bank transfer |

---

### 3.2 Future Planned Features

| Feature | Priority | Timeline |
|---------|----------|---------|
| Booking Integration | HIGH | Q1 2026 |
| AI Voice Concierge | MEDIUM | Q2 2026 |
| AR Heritage Tour | LOW | Q3 2026 |
| Travel Now Pay Later | LOW | Q4 2026 |

---

## 4. TECHNICAL REQUIREMENTS

### 4.1 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| API Response (p95) | < 500ms |
| Crash-free Rate | > 99.5% |

### 4.2 Scalability

| Metric | MVP | Scale |
|--------|-----|-------|
| Concurrent Users | 1,000 | 100,000 |
| Daily Active Users | 5,000 | 500,000 |
| Database Size | 10GB | 1TB |
| File Storage | 50GB | 5TB |

### 4.3 Security

- [ ] API keys in backend only
- [ ] Rate limiting (10 req/min/user)
- [ ] Input validation (Zod)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] HTTPS only
- [ ] Data encryption at rest

---

## 5. SUCCESS METRICS

### 5.1 North Star Metric
**Trips Planned per Week** - measures core value delivery

### 5.2 KPIs by Category

#### Acquisition
| Metric | Month 1 | Month 6 | Year 1 |
|--------|---------|---------|--------|
| Downloads | 5,000 | 30,000 | 100,000 |
| Registrations | 2,000 | 15,000 | 50,000 |
| CAC | Rp 15,000 | Rp 10,000 | Rp 8,000 |

#### Activation
| Metric | Target |
|--------|--------|
| Onboarding completion | > 70% |
| First itinerary generated | > 50% |
| Profile completion | > 40% |

#### Retention
| Metric | Target |
|--------|--------|
| Day 1 retention | > 40% |
| Day 7 retention | > 20% |
| Day 30 retention | > 10% |
| Monthly Active Users | > 30% of total |

#### Revenue
| Metric | Month 6 | Year 1 |
|--------|---------|--------|
| Premium conversion | 2% | 5% |
| ARPU | Rp 5,000 | Rp 15,000 |
| MRR | Rp 10 juta | Rp 100 juta |

#### Referral
| Metric | Target |
|--------|--------|
| NPS | > 50 |
| Referral rate | > 10% |
| Viral coefficient | > 0.5 |

---

## 6. RELEASE PLAN

### MVP (Q1 2025)
- ✅ AI Itinerary Generator
- ✅ User Auth (Email + Google)
- ✅ Social Feed
- ✅ Travel Buddy Matcher
- ✅ Trip Ready AI
- ✅ Live Trip Sharing
- ✅ Smart Ticket Scanner
- ✅ Rewards System

### v1.1 (Q2 2025) - CURRENT
- ✅ Smart Price Alert & Prediction
- ✅ AI Travel Concierge (NARA) Enhanced
- ✅ Group Trip Planner & Split Bill
- ✅ Offline Mode & Travel Companion
- ✅ Creator Monetization Dashboard
- ⬜ Push Notifications

### v1.2 (Q3 2025)
- Booking Integration (Affiliate)
- AI Voice Concierge
- Direct Booking

### v2.0 (2026)
- AR Heritage Tour
- BNPL Integration
- International Expansion

---

## 7. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API cost explosion | Medium | High | Rate limiting, caching |
| Low retention | High | High | Gamification, notifications |
| Competitor copies features | Medium | Medium | Speed to market, community |
| Technical debt | High | Medium | Code reviews, refactoring sprints |
| Security breach | Low | Critical | Security audit, bug bounty |

---

## 8. APPENDIX

### A. User Flow Diagrams
(To be added in Figma)

### B. API Documentation
(To be added in Swagger)

### C. Database Schema
(See database/schema.sql)
