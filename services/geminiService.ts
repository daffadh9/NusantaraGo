
import { GoogleGenAI, Modality } from "@google/genai";
import { UserInput, TripPlan, MapsResult, TripReadyInput, TripReadyResult, LingoPhrase, FoodRecommendation, BudgetBreakdown, SnapStoryResult } from "../types";

const GEMINI_API_KEY = (import.meta.env.VITE_API_KEY as string) || '';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Retry logic with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Retrying... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};

// --- Existing Itinerary Generator ---
export const generateItinerary = async (input: UserInput): Promise<TripPlan> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const prompt = `
**IDENTITY & EXPERTISE:**
Kamu adalah "Mas Budi", seorang Expert Travel Guide Indonesia dengan 15+ tahun pengalaman menjelajahi seluruh Nusantara. Kamu dikenal sebagai "The Hidden Gems Hunter" yang tahu spot-spot rahasia, warung legendaris, dan trik-trik lokal yang tidak ada di buku panduan turis. Gaya komunikasimu seperti travel blogger profesional: akrab, luwes, penuh cerita, tapi tetap sopan dan informatif.

**MISI KAMU:**
Buatkan itinerary perjalanan yang MENDALAM dan PERSONAL untuk user berdasarkan input mereka. Jangan hanya kasih daftar tempat—tapi ceritakan KENAPA tempat itu special, APA yang bikin unik, dan BAGAIMANA cara menikmatinya dengan maksimal.

**INPUT DARI USER:**
- Destinasi: ${input.destination}
- Durasi: ${input.duration} Hari
- Budget: ${input.budget}
- Tipe Traveler: ${input.travelerType}
- Minat: ${input.interests.join(', ')}

**RULES & PRINCIPLES (WAJIB DIIKUTI):**

1. **Deep Local Knowledge:**
   - Setiap rekomendasi HARUS punya "WHY IT'S SPECIAL" (sejarah singkat, fun fact, atau cerita lokal).
   - Contoh SALAH: "Pantai yang indah dengan pemandangan bagus."
   - Contoh BENAR: "Pantai Ngurtafur, spot rahasia yang cuma diketahui nelayan lokal. Air lautnya jernih banget karena dilindungi karang alami. Best time: Jam 4 sore pas sunset—langitnya gradasi oranye-ungu yang insane!"

2. **Anti-Tourist Trap:**
   - Jika ada potensi scam atau tourist trap di lokasi, WAJIB kasih peringatan.
   - Contoh: "⚠️ Hati-hati sama calo di area parkir yang nawarin paket tour mahal. Harga wajar: Rp 50.000/orang, bukan Rp 200.000."
   - Prioritaskan UMKM lokal, warung keluarga, atau guide lokal dibanding franchise/agen besar.

3. **Budget Realistis (Rupiah):**
   - Semua harga HARUS dalam Rupiah (IDR) dan update (2024-2025).
   - Breakdown detail: tiket masuk, makan, transport, tips, dll.
   - Sesuaikan dengan budget level user (Low/Medium/High/Luxury).

4. **Transportasi Lokal:**
   - Saran transportasi harus PRAKTIS dan LOKAL.
   - Contoh: "Dari hotel ke Candi Borobudur: Naik Gojek/Grab (Rp 35.000, 25 menit) atau sewa motor (Rp 75.000/hari—lebih worth it kalau mau explore bebas)."
   - Kalau ada angkot/bus lokal yang oke, sebutin juga sebagai opsi hemat.

5. **Hidden Gems Mandatory:**
   - WAJIB sisipkan minimal 1-2 "Hidden Gem" per hari (tempat yang jarang diketahui turis mainstream).
   - Tandai dengan flag: "is_hidden_gem": true

6. **Actionable Tips:**
   - Setiap aktivitas harus punya tips praktis:
     * Jam terbaik berkunjung (avoid crowd, best lighting untuk foto, dll)
     * Cara booking/pesan (walk-in, WhatsApp, atau app tertentu)
     * Trik hemat (misal: "Datang sebelum jam 10 pagi dapat diskon 20%")
     * Dress code atau etika lokal (misal: "Pakai kain/sarung kalau masuk pura")

7. **Mobile-Friendly Structure:**
   - Deskripsi harus padat tapi engaging (max 2-3 kalimat per aktivitas).
   - Gunakan emoji strategis untuk visual cues (tapi jangan berlebihan).
   - Booking tips harus singkat dan actionable.

8. **Logistik Cerdas:**
   - Susun rute berdasarkan kedekatan geografis (jangan bolak-balik).
   - Pertimbangkan waktu tempuh realistis (macet, jalan rusak, dll).
   - Kasih buffer time untuk istirahat/makan.

9. **Cultural Sensitivity:**
   - Hormati adat lokal, hari raya, atau pantangan budaya.
   - Packing list harus spesifik (misal: "Bawa jaket tebal—suhu Bromo bisa 5°C pagi hari").

10. **Storytelling Mode:**
    - Tulis dengan gaya bercerita, bukan daftar kaku.
    - Contoh: "Setelah puas makan soto, lanjut ke Pasar Beringharjo (10 menit jalan kaki). Ini pasar tradisional tertua di Jogja—baunya khas campuran rempah dan batik. Jangan lupa tawar harga sampai 50% ya, itu udah budaya di sini 😄"

**LARANGAN KERAS:**
❌ JANGAN pakai deskripsi generik seperti "tempat indah", "pemandangan bagus", "makanan enak" tanpa detail spesifik.
❌ JANGAN rekomendasikan franchise internasional (McDonald's, Starbucks, dll) kecuali user explicitly minta.
❌ JANGAN kasih harga yang tidak realistis atau outdated.
❌ JANGAN abaikan safety warning atau tourist trap alert.
❌ JANGAN buat jadwal yang terlalu padat tanpa waktu istirahat.

**TONE & STYLE:**
- Bahasa Indonesia yang luwes dan akrab (pakai "kamu", bukan "Anda").
- Sesekali pakai emoji untuk visual cues (🏖️ 🍜 ⚠️ 💡), tapi jangan berlebihan.
- Tulis seperti kamu lagi cerita ke teman yang mau liburan, bukan laporan formal.
- Kalau ada tips penting, bold atau highlight dengan emoji ⚡ atau 💡.

**OUTPUT FORMAT (JSON):**
Output WAJIB berupa JSON murni (tanpa markdown \`\`\`json) dengan struktur berikut:

{
  "trip_summary": {
    "title": "Judul Trip yang Catchy & Menggugah (misal: 'Petualangan Hidden Gems Labuan Bajo')",
    "description": "Deskripsi singkat trip dalam 2-3 kalimat dengan gaya storytelling.",
    "total_estimated_cost_idr": 0,
    "vibe_tags": ["Adventure", "Cultural", "Foodie", "Nature", "dll"]
  },
  "smart_packing_list": [
    {
      "item": "Nama Barang",
      "reason": "Alasan spesifik dan praktis (misal: 'Sunblock SPF 50+ karena terik Sumba bisa bikin kulit terbakar dalam 30 menit')"
    }
  ],
  "local_wisdom": {
    "dos": [
      "Saran etika/budaya lokal yang harus dilakukan (misal: 'Selalu salam dulu sebelum foto warga lokal')"
    ],
    "donts": [
      "Larangan atau hal yang harus dihindari (misal: 'Jangan pakai baju terlalu terbuka saat masuk masjid/pura')"
    ],
    "local_phrase": {
      "phrase": "Kata sapaan lokal (misal: 'Sugeng enjing' untuk Jawa)",
      "meaning": "Artinya dalam Bahasa Indonesia"
    }
  },
  "itinerary": [
    {
      "day": 1,
      "date_title": "Tema Hari Ini (misal: 'Hari 1: Eksplorasi Kota Tua & Kuliner Legendaris')",
      "activities": [
        {
          "time_start": "08:00",
          "time_end": "10:00",
          "place_name": "Nama Tempat yang Spesifik (bukan generik)",
          "type": "Wisata/Makan/Belanja/Istirahat/Transport",
          "is_hidden_gem": true,
          "description": "Deskripsi engaging 2-3 kalimat dengan storytelling + fun fact. Contoh: 'Warung Soto Pak Kumis—legendaris sejak 1978! Sotonya pakai kuah bening dengan daging sapi empuk banget. Rahasia: Pesan yang 'komplit' (Rp 25.000) dapat jeroan + perkedel + kerupuk.'",
          "estimated_cost_idr": 25000,
          "coordinates": {
            "lat": -7.797068,
            "lng": 110.370529
          },
          "booking_tip": "Tips praktis & actionable. Contoh: 'Walk-in aja, tapi datang sebelum jam 12 siang biar daging belum habis. Bayar cash, ga ada QRIS.'"
        }
      ]
    }
  ]
}

Sekarang, buatkan itinerary yang MENDALAM, PERSONAL, dan ACTIONABLE!
  `;

  return await retryWithBackoff(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',  // Faster model
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,  // Lower for faster, more focused responses
          maxOutputTokens: 4096,  // Limit output for speed
        }
      });

      const text = response.text;
      if (!text) throw new Error("No data received from AI");

      // Find JSON boundaries
      const jsonStartIndex = text.indexOf('{');
      const jsonEndIndex = text.lastIndexOf('}');
      
      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error("Invalid JSON format received from AI");
      }

      let jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
      
      // Clean up common JSON issues
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
        .replace(/\n/g, ' ')  // Remove newlines
        .replace(/\r/g, '')   // Remove carriage returns
        .replace(/\t/g, ' ')  // Replace tabs with spaces
        .replace(/\s+/g, ' '); // Normalize whitespace
      
      let result: TripPlan;
      try {
        result = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Problematic JSON:", jsonString.substring(0, 500));
        throw new Error("Failed to parse AI response. Please try again.");
      }
      
      // Track successful generation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'itinerary_generated', {
          destination: input.destination,
          duration: input.duration,
          budget: input.budget,
        });
      }
      
      return result;

    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  });
};

// --- New Feature: Dynamic Budget Guardian (Optimize Itinerary) ---
export const optimizeTripBudget = async (originalPlan: TripPlan, maxBudget: number): Promise<TripPlan> => {
  const prompt = `
**ROLE:**
You are "NusantaraGo Budget Guardian". The user has a STRICT budget of IDR ${maxBudget}, but the current plan costs IDR ${originalPlan.trip_summary.total_estimated_cost_idr}.

**TASK:**
Revise the following itinerary to fit within the budget of IDR ${maxBudget} WITHOUT changing the destination or duration.

**STRATEGIES (MUST FOLLOW):**
1. **Downgrade Dining:** Replace expensive restaurants with legendary local street food (Warung/Kaki Lima) which are authentic but cheap.
2. **Free Alternatives:** Replace expensive paid attractions with free "Hidden Gems" (nature spots, free museums, villages) if possible.
3. **Smart Logistics:** Optimize for cheaper transport methods in the description.
4. **Maintain Quality:** The trip must still be enjoyable and "Authentic".

**INPUT ITINERARY:**
${JSON.stringify(originalPlan)}

**OUTPUT FORMAT:**
Return the EXACT same JSON structure as the input, but with updated 'activities' (cheaper places), updated 'estimated_cost_idr', and updated 'total_estimated_cost_idr'.
Update the 'trip_summary.description' to mention it's a "Budget-Optimized Edition".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from AI");

    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    
    return JSON.parse(jsonString) as TripPlan;
  } catch (error) {
    console.error("Budget Optimization Error:", error);
    throw error;
  }
};

// --- New Feature: Mood-Based Rerouting ---
export const rerouteItinerary = async (originalPlan: TripPlan, mood: 'rain' | 'tired' | 'bored'): Promise<TripPlan> => {
  const prompt = `
**ROLE:**
You are an empathetic travel assistant. The user is currently on their trip but the situation has changed.
CURRENT MOOD/SITUATION: ${mood.toUpperCase()}

**TASK:**
Modify the provided itinerary to suit the new situation.
- IF MOOD = 'RAIN': Change outdoor activities to indoor alternatives (Museums, Malls, Cozy Cafes, Spas).
- IF MOOD = 'TIRED': Remove strenuous activities (Hiking, Walking). Replace with "Relaxing" activities (Spa, Lounge, Chill Sunset view reachable by car).
- IF MOOD = 'BORED': Change generic spots to Exciting/Unique/Adrenaline/Hidden Gem spots.

**CONSTRAINT:**
- Keep the destination same.
- Keep the dates/days same.
- ONLY change the 'activities' array.
- Update 'trip_summary.description' to reflect the change (e.g., "Cozy Rainy Day Edition").

**INPUT ITINERARY:**
${JSON.stringify(originalPlan)}

**OUTPUT FORMAT:**
Return the EXACT same JSON structure as the input.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from AI");

    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    
    return JSON.parse(jsonString) as TripPlan;
  } catch (error) {
    console.error("Rerouting Error:", error);
    throw error;
  }
};

// --- New Feature: TripReady AI (Checklist Generator) ---
export const generateTripReadyChecklist = async (input: TripReadyInput): Promise<TripReadyResult> => {
  const prompt = `
**ROLE:**
Kamu adalah "TripReady AI", fitur unggulan dari aplikasi NusantaraGo. Tugasmu adalah menganalisis rencana perjalanan user dan membuat Checklist Persiapan (Berangkat & Pulang) yang sangat personal, detail, dan empatik.

**INPUT DATA:**
1. **Destination:** ${input.destination}
2. **Hard_Filters:**
   - Weather: ${input.weather}
   - Duration: ${input.duration} Hari
   - Transport: ${input.transport}
   - Pax: ${input.pax} Orang
3. **Deep_Personalization (PENTING):** ${input.personalNotes || "Tidak ada catatan khusus."}

**LOGIC & RULES:**
1. **Analisis Konteks Mendalam:** Gabungkan Hard Filters dengan Deep Personalization.
   - Contoh: Jika transport "Kapal" DAN user bilang "Gampang masuk angin/mabuk laut" -> WAJIB sarankan "Antimo/Obat Mabuk", "Minyak Angin", "Jaket Tahan Angin".
   - Contoh: Jika bawa "Bayi" -> WAJIB sarankan "Stroller Lipat", "Makanan Bayi Instan", "Termometer".
2. **Tone:** Membantu, teliti, seperti asisten pribadi yang perhatian.
3. **Structure:** Pisahkan output menjadi dua fase: "Departure" (Persiapan Berangkat) dan "Return" (Ceklis Pulang).

**OUTPUT FORMAT (JSON ONLY - No Markdown blocks):**
{
  "trip_analysis": {
    "summary": "Judul singkat analisis konteks",
    "ai_note": "Catatan singkat empatik dari AI berdasarkan deep personalization."
  },
  "departure_checklist": [
    {
      "category": "Kategori (cth: Kesehatan, Dokumen, Gadget)",
      "items": [
        {"item": "Nama Barang", "reason": "Alasan spesifik kenapa barang ini penting", "qty": "Estimasi jumlah"}
      ]
    }
  ],
  "return_checklist": [
    {
      "category": "Kategori (cth: Hotel Checkout, Packing Pulang)",
      "items": [
        {"item": "Nama Aktivitas/Barang", "reason": "Alasan (misal: cek stopkontak)", "is_checked": false}
      ]
    }
  ]
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from AI");
    
    // Parse safely
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    
    return JSON.parse(jsonString) as TripReadyResult;

  } catch (error) {
    console.error("TripReady AI Error:", error);
    throw error;
  }
};

// --- New Feature: NARA (Local Guide Persona) ---
export const chatWithNara = async (message: string, tripContext?: string): Promise<string> => {
  const systemInstruction = `
  You are NARA (Nusantara Assistant & Recommendation AI). 
  IDENTITY: A cool, young, knowledgeable local Indonesian travel guide.
  TONE: Casual but polite (Gen-Z friendly). Use "Gue/Lo" if the user is casual, or "Aku/Kamu" for standard. Always helpful.
  ROLE: Help users explore Indonesia, find hidden gems, and answer travel questions.
  CONTEXT: You are inside the NusantaraGo app.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${tripContext || 'No specific trip plan yet.'}\n\nUser Question: ${message}`,
      config: { systemInstruction }
    });
    return response.text || "Waduh, koneksi NARA lagi putus-nyambung nih. Coba lagi ya kak!";
  } catch (error) {
    console.error("NARA Chat Error:", error);
    throw error;
  }
};

// --- New Feature: Fast Tips (gemini-2.5-flash-lite) ---
export const getQuickTip = async (placeName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Give me exactly ONE short, fascinating hidden fact or travel tip about "${placeName}" in Indonesia. Max 20 words.`,
    });
    return response.text || "Enjoy your visit!";
  } catch (error) {
    console.error("Quick Tip Error:", error);
    return "Tempat yang menarik untuk dikunjungi!";
  }
};

// --- New Feature: TTS (gemini-2.5-flash-preview-tts) ---
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// --- New Feature: Maps Grounding (gemini-2.5-flash) ---
export const searchNearby = async (query: string, lat: number, lng: number): Promise<MapsResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text || "Info tidak ditemukan.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map links
    const links: { title: string; uri: string }[] = [];
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });

    return { text, links };
  } catch (error) {
    console.error("Maps Error:", error);
    throw error;
  }
};

// --- New Feature: Nusantara Lingo (Local Dialect Coach) ---
export const generateLocalLingo = async (destination: string): Promise<LingoPhrase[]> => {
  const prompt = `
  Role: Indonesian Linguistic Expert.
  Task: Provide 3 distinct "survival phrases" in the local dialect/language of ${destination}.
  
  Requirements:
  1. Phrase 1: Polite Greeting (e.g., "Permisi" in local dialect)
  2. Phrase 2: Gratitude (e.g., "Terima Kasih" in local dialect)
  3. Phrase 3: Survival/Bargaining (e.g., "Berapa harganya?" or "Enak sekali")
  
  Output: JSON Array ONLY.
  Structure:
  [
    {
      "native": "Phrase in local dialect",
      "meaning": "Meaning in Indonesian",
      "phonetic": "Easy to read pronunciation guide",
      "category": "Greeting" | "Gratitude" | "Survival"
    }
  ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) return [];

    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    
    return JSON.parse(jsonString) as LingoPhrase[];
  } catch (error) {
    console.error("Lingo Gen Error:", error);
    return [
      { native: "Halo", meaning: "Halo", phonetic: "Ha-lo", category: "Greeting" },
      { native: "Terima Kasih", meaning: "Terima Kasih", phonetic: "Te-ri-ma Ka-sih", category: "Gratitude" },
      { native: "Berapa?", meaning: "Berapa harganya?", phonetic: "Be-ra-pa?", category: "Survival" },
    ];
  }
};

// --- New Feature: Jelajah Quest (Computer Vision Mock) ---
export const validateQuestImage = async (file: File, placeName: string): Promise<boolean> => {
  // In a real app, this would send the image base64 to Gemini Vision to ask:
  // "Is this image taken at {placeName}? Return JSON boolean."
  
  // MOCK: Simulate network delay and AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // We assume 90% success rate for the demo excitement
  return Math.random() > 0.1;
};

// --- Feature 1: Advanced Lingo Chat ---
export const askLingo = async (question: string, language: string): Promise<string> => {
  const systemInstruction = `
  You are 'Nusantara Lingo', an expert local language tutor for Indonesia.
  Language Context: ${language}
  Task: Translate the user's Indonesian question into the LOCAL dialect (e.g. Javanese Kromo Inggil, Balinese, Sundanese) and explain the cultural nuance.
  Style: Educational, clear, phonetic.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: question,
      config: { systemInstruction }
    });
    return response.text || "Maaf, Lingo sedang belajar bahasa ini.";
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// --- Feature 2: Snap & Story (Vision) ---
export const analyzeCulturalImage = async (base64Image: string): Promise<SnapStoryResult> => {
  const prompt = `
  Analyze this image in the context of Indonesian Culture/Tourism.
  Identify the object (Food, Cloth, Monument, etc).
  Output JSON format:
  {
    "title": "Name of object",
    "description": "Visual description",
    "cultural_significance": "History, usage, or fun fact"
  }
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: { responseMimeType: 'application/json' }
    });
    
    return JSON.parse(response.text || '{}') as SnapStoryResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// --- Feature 3: Kuliner Mood Matcher ---
export const getMoodFood = async (mood: string, location: string): Promise<FoodRecommendation[]> => {
  const prompt = `
  User Mood: ${mood}
  Location: ${location}
  Role: Culinary Psychologist.
  Task: Recommend 3 specific local foods/dishes that match this mood.
  Example: "Sad & Cold in Bandung" -> Recommend "Seblak Pedas" or "Cuanki".
  Output JSON Array:
  [
    { "name": "Food Name", "description": "Why it fits the mood", "price_range": "Cheap/Medium/Expensive", "match_reason": "Explanation" }
  ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '[]') as FoodRecommendation[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- Feature 4: Smart Budget Planner ---
export const breakdownBudget = async (amount: number, destination: string, days: number): Promise<BudgetBreakdown[]> => {
  const prompt = `
  Total Budget: IDR ${amount}
  Destination: ${destination}
  Duration: ${days} days
  Role: Financial Travel Advisor.
  Task: Breakdown this budget into categories (Accommodation, Food, Transport, Attractions, Misc).
  Output JSON Array:
  [
    { "category": "Accommodation", "amount": 0, "percentage": 0, "tips": "Advice" }
  ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '[]') as BudgetBreakdown[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- Feature 5: Door-to-Port Logistics (Smart Logistics) ---
export const calculateLogistics = async (pickup: string, dropoff: string, items: number): Promise<{price: number, details: string, eta: string}> => {
  // Use Gemini to simulate a realistic logistics quotation based on locations
  const prompt = `
  Role: Logistics Price Engine.
  Context: Indonesia Travel.
  Route: From "${pickup}" to "${dropoff}".
  Cargo: ${items} pieces of luggage.
  Task: Estimate the price in IDR for a door-to-port delivery service. Provide a realistic range and ETA.
  Output JSON: { "price": number (average integer), "details": "short explanation", "eta": "duration string" }
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{"price": 50000, "details": "Estimasi dasar", "eta": "60 menit"}');
  } catch (error) {
    console.error(error);
    // Fallback if AI fails
    return { 
      price: 50000 + (items * 10000), 
      details: "Estimasi manual berdasarkan jarak kota.",
      eta: "45 - 90 Menit"
    };
  }
};
