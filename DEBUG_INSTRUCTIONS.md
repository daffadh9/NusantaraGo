# 🔍 DEBUG INSTRUCTIONS - ERROR SAAT BUAT TRIP

## LANGKAH DEBUG:

### 1. Buka Browser Console
```
Chrome: F12 atau Ctrl+Shift+I
Edge: F12
Firefox: F12
```

### 2. Pergi ke Tab "Console"

### 3. Refresh Halaman (Ctrl+Shift+R)

### 4. Coba Buat Trip Baru

### 5. Lihat Error di Console

---

## YANG HARUS DICARI:

### Error Messages:
- ❌ "Error generating itinerary"
- ❌ "Invalid trip plan"
- ❌ "Cannot read property"
- ❌ "undefined is not an object"
- ❌ API error messages

### Stack Trace:
- Lihat baris mana yang error
- Component mana yang crash
- Function mana yang bermasalah

---

## KEMUNGKINAN PENYEBAB:

### 1. Gemini API Error
```
Error: Failed to generate itinerary
Solution: Check API key, quota, network
```

### 2. Invalid Response Format
```
Error: Cannot read property 'trip_summary' of undefined
Solution: API response format berubah
```

### 3. Component Crash
```
Error: Cannot read property 'map' of undefined
Solution: Data array tidak ada
```

### 4. Network Error
```
Error: Network request failed
Solution: Check internet connection
```

---

## SCREENSHOT ERROR:

Tolong screenshot:
1. ✅ Console tab (semua error merah)
2. ✅ Network tab (request yang gagal)
3. ✅ Error boundary screen

Kirim screenshot ke saya untuk analisis lebih lanjut!

---

## TEMPORARY FIX:

Jika error terus muncul, coba:

1. **Clear Browser Cache:**
   - Chrome: Ctrl+Shift+Delete
   - Pilih "Cached images and files"
   - Clear data

2. **Hard Refresh:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

3. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check Environment Variables:**
   - Pastikan VITE_GEMINI_API_KEY ada
   - Pastikan VITE_SUPABASE_URL ada
   - Pastikan VITE_SUPABASE_ANON_KEY ada

---

## NEXT STEPS:

Setelah dapat error message dari console:
1. Screenshot error
2. Kirim ke saya
3. Saya akan fix spesifik error tersebut

**JANGAN LUPA SCREENSHOT CONSOLE!** 📸
