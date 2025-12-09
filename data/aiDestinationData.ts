export interface AIDestination {
  id: string;
  title: string;
  city: string;
  matchScore: number;
  vibeTag: string;
  vibeEmoji: string;
  aiInsight: string;
  openHours: string;
  distance: string;
  priceTier: string;
  crowdLevel: 'low' | 'medium' | 'high';
  category: string;
}

export const AI_RECOMMENDED_DESTINATIONS: AIDestination[] = [
  {
    id: 'raja-ampat-1',
    title: 'Raja Ampat',
    city: 'Papua Barat',
    matchScore: 96,
    vibeTag: 'Hidden Paradise',
    vibeEmoji: '🏝️',
    aiInsight: 'Spot diving terbaik Asia Tenggara! Cocok untukmu yang suka snorkeling & foto underwater.',
    openHours: '24 jam',
    distance: '3.200 km',
    priceTier: 'Rp5-15jt',
    crowdLevel: 'low',
    category: 'beach'
  },
  {
    id: 'borobudur-1',
    title: 'Candi Borobudur',
    city: 'Magelang',
    matchScore: 92,
    vibeTag: 'Heritage Spot',
    vibeEmoji: '🏛️',
    aiInsight: 'UNESCO World Heritage! Sunrise di sini magical, datang jam 5 pagi untuk view terbaik.',
    openHours: '06:00-17:00',
    distance: '420 km',
    priceTier: 'Rp50-100k',
    crowdLevel: 'high',
    category: 'culture'
  },
  {
    id: 'bromo-1',
    title: 'Gunung Bromo',
    city: 'Probolinggo',
    matchScore: 89,
    vibeTag: 'Epic Sunrise',
    vibeEmoji: '🌋',
    aiInsight: 'Sunrise paling ikonik di Jawa! Rekomen naik jeep jam 3 pagi ke Penanjakan.',
    openHours: '24 jam',
    distance: '780 km',
    priceTier: 'Rp300-500k',
    crowdLevel: 'medium',
    category: 'nature'
  },
  {
    id: 'toba-1',
    title: 'Danau Toba',
    city: 'Samosir',
    matchScore: 94,
    vibeTag: 'Cultural Lake',
    vibeEmoji: '🏔️',
    aiInsight: 'Danau vulkanik terbesar di dunia! Explore budaya Batak dan stay di Samosir.',
    openHours: '24 jam',
    distance: '1.800 km',
    priceTier: 'Rp2-5jt',
    crowdLevel: 'low',
    category: 'nature'
  },
  {
    id: 'bali-ubud-1',
    title: 'Tegallalang Rice Terrace',
    city: 'Ubud, Bali',
    matchScore: 88,
    vibeTag: 'Instagramable',
    vibeEmoji: '📸',
    aiInsight: 'Spot foto iconic! Best time jam 7-9 pagi sebelum ramai. Ada swing untuk content.',
    openHours: '08:00-18:00',
    distance: '950 km',
    priceTier: 'Rp15-50k',
    crowdLevel: 'high',
    category: 'nature'
  },
  {
    id: 'labuan-bajo-1',
    title: 'Labuan Bajo',
    city: 'Flores',
    matchScore: 91,
    vibeTag: 'Dragon Island',
    vibeEmoji: '🐉',
    aiInsight: 'Gerbang ke Pulau Komodo! Book sailing trip 3D2N untuk experience lengkap.',
    openHours: '24 jam',
    distance: '1.500 km',
    priceTier: 'Rp3-8jt',
    crowdLevel: 'medium',
    category: 'beach'
  },
  {
    id: 'gedung-sate-1',
    title: 'Gedung Sate',
    city: 'Bandung',
    matchScore: 78,
    vibeTag: 'Heritage Walk',
    vibeEmoji: '🏛️',
    aiInsight: 'Ikon kota Bandung! Arsitektur art deco klasik, cocok untuk foto vintage style.',
    openHours: '08:00-16:00',
    distance: '150 km',
    priceTier: 'Gratis',
    crowdLevel: 'medium',
    category: 'culture'
  }
];

export default AI_RECOMMENDED_DESTINATIONS;
