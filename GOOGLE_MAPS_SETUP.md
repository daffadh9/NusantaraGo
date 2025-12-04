# 🗺️ GOOGLE MAPS API SETUP - FREE TIER

## ✅ BENEFITS:
- $200 free credit every month
- ~28,000 map loads/month FREE
- ~40,000 directions requests/month FREE
- Perfect for early-stage startup!

---

## 📋 STEP-BY-STEP SETUP:

### 1. Create Google Cloud Project

1. **Go to:** https://console.cloud.google.com/
2. **Click:** "Create Project"
3. **Name:** NusantaraGo
4. **Click:** Create

### 2. Enable Billing (Required for free tier!)

⚠️ **IMPORTANT:** You need credit card, but won't be charged unless you exceed $200/month!

1. **Go to:** Billing → Link a billing account
2. **Add:** Credit card
3. **Don't worry:** Free tier is automatic, no charges for first $200

### 3. Enable Required APIs

**Go to:** APIs & Services → Library

Enable these 4 APIs:
- ✅ **Maps JavaScript API** (for displaying maps)
- ✅ **Directions API** (for route planning)
- ✅ **Geocoding API** (for address → coordinates)
- ✅ **Places API** (for POI details)

### 4. Create API Key

1. **Go to:** APIs & Services → Credentials
2. **Click:** Create Credentials → API Key
3. **Copy** the API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXX`)

### 5. Secure Your API Key

**CRITICAL:** Restrict your API key!

1. **Click:** Edit API Key (pencil icon)
2. **Application restrictions:**
   - Select: **HTTP referrers (websites)**
   - Add: `http://localhost:3000/*`
   - Add: `https://your-domain.com/*` (when deployed)
3. **API restrictions:**
   - Select: **Restrict key**
   - Choose: Maps JavaScript API, Directions API, Geocoding API, Places API
4. **Save**

### 6. Add to Environment Variables

**In your `.env` file:**

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **SECURITY:** Never commit `.env` to Git!

Add to `.gitignore`:
```
.env
.env.local
```

---

## 💰 PRICING (Free Tier):

### Monthly Free Credits: $200

**What you get FREE:**

| API | Free Quota | Cost After Free |
|-----|-----------|----------------|
| Maps JavaScript API | 28,000 loads | $7 per 1,000 |
| Directions API | 40,000 requests | $5 per 1,000 |
| Geocoding API | 40,000 requests | $5 per 1,000 |
| Places API | 28,000 requests | $17 per 1,000 |

**Example:**
- 1,000 users/day × 5 map loads = 150,000 loads/month
- Cost: (150,000 - 28,000) × $7/1000 = **$854/month**
- But first $200 is FREE = **$654/month**

For early stage: **100% FREE** jika under 28K loads!

---

## 🚀 USAGE TIPS:

### Monitor Your Usage:
1. **Go to:** APIs & Services → Dashboard
2. **Check:** Requests per day
3. **Set alerts:** When nearing limit

### Set Budget Alerts:
1. **Go to:** Billing → Budgets & alerts
2. **Create budget:** $10 (will alert before charges)

### Optimize Costs:
- ✅ Cache map tiles
- ✅ Use static maps when possible
- ✅ Limit autocomplete queries
- ✅ Batch geocoding requests

---

## ⚠️ IMPORTANT SECURITY:

### DO:
✅ Restrict API key to your domains
✅ Use environment variables
✅ Set budget alerts
✅ Monitor usage daily

### DON'T:
❌ Commit API key to GitHub
❌ Share API key publicly
❌ Leave unrestricted
❌ Ignore budget alerts

---

## 🧪 TEST YOUR API KEY:

Open browser console and paste:

```javascript
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Jakarta&key=YOUR_API_KEY`)
  .then(r => r.json())
  .then(d => console.log(d))
```

Should return Jakarta coordinates!

---

## 📞 SUPPORT:

If issues:
1. Check API is enabled
2. Check billing is linked
3. Check restrictions
4. Check quota limits
5. Contact Google Cloud Support (free)

---

**READY TO INTEGRATE!** 🎉
