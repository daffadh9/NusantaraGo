
import { GoogleGenAI } from "@google/genai";
import { PanduMessage, AgentPersona } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Agent Definitions ---
export const PANDU_AGENTS: Record<string, AgentPersona> = {
  nara: {
    id: 'nara',
    name: 'Nara',
    role: 'The Negotiator',
    color: '#10B981', // Emerald
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nara&backgroundColor=d1fae5',
    description: 'Ahli hemat budget & promo. Cerdik dan to-the-point.'
  },
  bima: {
    id: 'bima',
    name: 'Bima',
    role: 'The Cultural Guardian',
    color: '#D97706', // Amber/Gold
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bima&backgroundColor=fef3c7&facialHair=beardMajestic',
    description: 'Ahli budaya & etika lokal. Bijaksana dan sopan.'
  },
  sigap: {
    id: 'sigap',
    name: 'Sigap',
    role: 'The Crisis Solver',
    color: '#EF4444', // Red
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sigap&backgroundColor=fee2e2&eyebrows=angry',
    description: 'Ahli keamanan & logistik. Tenang, tegas, protektif.'
  },
  rasa: {
    id: 'rasa',
    name: 'Rasa',
    role: 'The Culinary Concierge',
    color: '#F97316', // Orange
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rasa&backgroundColor=ffedd5',
    description: 'Ahli kuliner & diet. Ramah, menggugah selera.'
  },
  citra: {
    id: 'citra',
    name: 'Citra',
    role: 'The Memory Maker',
    color: '#EC4899', // Pink
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra&backgroundColor=fce7f3',
    description: 'Ahli konten & medsos. Trendy, asik, Gen-Z.'
  }
};

export const getRandomWelcomeMessage = (): PanduMessage => {
  const agents = Object.values(PANDU_AGENTS);
  const randomAgent = agents[Math.floor(Math.random() * agents.length)];
  
  let text = "";
  switch(randomAgent.id) {
    case 'nara': text = "Halo Daffa! Mau cari promo tiket murah atau tips hemat hari ini?"; break;
    case 'bima': text = "Sugeng Rawuh! Ada yang ingin ditanyakan soal adat atau sejarah tempat tujuanmu?"; break;
    case 'sigap': text = "Monitor. Sigap siap membantu. Pastikan dokumen perjalananmu aman. Ada kendala?"; break;
    case 'rasa': text = "Hai kak! Udah makan belum? Kalau belum, Rasa punya rekomendasi enak nih!"; break;
    case 'citra': text = "Hola! Siap bikin konten aesthetic hari ini? Tanya spot foto terbaik ke Citra ya!"; break;
  }

  return {
    id: Date.now().toString(),
    role: 'assistant',
    text: text,
    timestamp: Date.now(),
    agentId: randomAgent.id as any,
    agentName: randomAgent.name,
    uiColor: randomAgent.color
  };
};

// --- The Orchestrator Logic ---
export const askPandu = async (userMessage: string, context: string = ""): Promise<PanduMessage> => {
  const prompt = `
    **ROLE:** You are "Pandu AI", a Multi-Agent Orchestrator for a travel app.
    **TASK:** Analyze the USER MESSAGE and route it to the BEST agent. Then, generate the response acting AS that agent.

    **AVAILABLE AGENTS:**
    1. **Nara** (The Negotiator): Budget, prices, promos, haggling, cheap tips. Tone: Cerdik, Hemat, To-the-point.
    2. **Bima** (The Cultural Guardian): History, culture, manners, ethics, temples. Tone: Bijaksana, Sopan, Storyteller (uses formal/polite Indonesian).
    3. **Sigap** (The Crisis Solver): Safety, hospitals, lost items, transport logistics, emergencies. Tone: Tegas, Tenang, Protektif.
    4. **Rasa** (The Culinary Concierge): Food, restaurants, dietary restrictions, recipes. Tone: Ramah, Cheerful.
    5. **Citra** (The Memory Maker): Photography spots, outfits (OOTD), social media captions, trends. Tone: Gaul, Trendy, Gen-Z (uses slang).

    **USER MESSAGE:** "${userMessage}"
    **CONTEXT:** ${context}

    **OUTPUT FORMAT (JSON ONLY):**
    {
      "selected_agent_id": "nara" | "bima" | "sigap" | "rasa" | "citra",
      "reason": "Why you chose this agent",
      "response_text": "The actual response to the user in the specific Persona and Tone of the selected agent."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Fast model for routing
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
    const result = JSON.parse(jsonString);
    
    const agentId = result.selected_agent_id.toLowerCase();
    const agentProfile = PANDU_AGENTS[agentId] || PANDU_AGENTS['nara']; // Fallback to Nara

    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: result.response_text,
      timestamp: Date.now(),
      agentId: agentId as any,
      agentName: agentProfile.name,
      uiColor: agentProfile.color
    };

  } catch (error) {
    console.error("Pandu Orchestrator Error:", error);
    // Fallback response from "System"
    return {
      id: Date.now().toString(),
      role: 'assistant',
      text: "Maaf, sistem Pandu sedang sibuk. Coba tanya lagi ya!",
      timestamp: Date.now(),
      agentId: 'nara', // Default
      agentName: 'System',
      uiColor: '#94a3b8'
    };
  }
};
