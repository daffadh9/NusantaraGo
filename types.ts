
export enum BudgetLevel {
  Low = 'Low (Budget Traveler)',
  Medium = 'Medium (Comfort)',
  High = 'High (Premium)',
  Luxury = 'Luxury (Sultan)'
}

export enum TravelerType {
  Solo = 'Solo',
  Couple = 'Couple',
  Family = 'Family',
  Group = 'Group'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  time_start: string;
  time_end: string;
  place_name: string;
  type: string;
  is_hidden_gem: boolean;
  description: string;
  estimated_cost_idr: number;
  coordinates: Coordinates;
  booking_tip: string;
}

export interface DayItinerary {
  day: number;
  date_title: string;
  activities: Activity[];
}

export interface PackingItem {
  item: string;
  reason: string;
  checked?: boolean;
}

export interface LocalWisdom {
  dos: string[];
  donts: string[];
  local_phrase: {
    phrase: string;
    meaning: string;
  };
}

export interface TripSummary {
  title: string;
  description: string;
  total_estimated_cost_idr: number;
  vibe_tags: string[];
}

export interface TripPlan {
  trip_summary: TripSummary;
  smart_packing_list: PackingItem[];
  local_wisdom: LocalWisdom;
  itinerary: DayItinerary[];
}

export interface UserInput {
  destination: string;
  duration: number;
  budget: BudgetLevel;
  travelerType: TravelerType;
  interests: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

// --- Pandu AI Multi-Agent Types ---
export interface PanduMessage extends ChatMessage {
  agentId?: 'nara' | 'bima' | 'sigap' | 'rasa' | 'citra' | 'system';
  agentName?: string;
  uiColor?: string; // Hex color or Tailwind class
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  color: string;
  avatar: string;
  description: string;
}

export interface MapsResult {
  text: string;
  links: { title: string; uri: string }[];
}

export interface User {
  id: string; // Supabase auth user ID
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  location?: string;
  memberSince?: string;
  level?: string;
  points?: number; // Gamification Points
  miles?: number;  // Travel Miles
  walletBalance?: number; // E-Wallet
  isPremium?: boolean; // Elite Subscription
  badges?: string[];
  // Additional Supabase fields
  full_name?: string;
  avatar_url?: string;
}

// --- TripReady AI Specific Types ---

export interface TripReadyInput {
  destination: string;
  duration: number;
  weather: 'Sunny/Dry' | 'Rainy/Humid' | 'Cold/Highland' | 'Tropical/Mixed';
  transport: 'Plane' | 'Car' | 'Train' | 'Ship' | 'Bus' | 'Motorcycle';
  pax: number;
  personalNotes: string; // The "Deep Personalization" field
}

export interface ChecklistItem {
  item: string;
  reason: string;
  qty?: string;
  is_checked?: boolean;
}

export interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

export interface TripReadyResult {
  trip_analysis: {
    summary: string;
    ai_note: string;
  };
  departure_checklist: ChecklistCategory[];
  return_checklist: ChecklistCategory[];
}

// --- Nusantara Lingo Types ---
export interface LingoPhrase {
  native: string;
  meaning: string;
  phonetic: string;
  category: 'Greeting' | 'Gratitude' | 'Survival';
}

// --- Community & Social Types ---
export interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  image?: string;
  video?: string; // New: Video support
  likes: number;
  comments: number;
  location: string;
  type: 'Post' | 'Review' | 'Question'; // Simplified types
  timestamp: string;
}

// --- Monetization Types (New) ---
export interface MonetizationService {
  id: string;
  type: 'Jastip' | 'OpenTrip' | 'Itinerary' | 'Logistics';
  title: string;
  description: string;
  price: number;
  author: {
    name: string;
    avatar: string;
    rating: number;
  };
  image: string;
  location: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  type: 'Voucher' | 'Merch' | 'Cash' | 'Trip';
  image: string;
}

// --- Library Types (New) ---
export interface LibraryItem {
  id: string;
  name: string;
  province: string;
  city: string;
  image: string;
  description: string;
  category: string;
}

// --- AI Tools Types ---
export interface FoodRecommendation {
  name: string;
  description: string;
  price_range: string;
  match_reason: string;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage: number;
  tips: string;
}

export interface SnapStoryResult {
  title: string;
  description: string;
  cultural_significance: string;
}

// --- PlayZone Types (New) ---
export type GameType = 'guesser' | 'tetris' | 'rush' | 'runner' | 'myth' | 'mastermind';

export interface GameScore {
  gameId: string;
  score: number;
  timestamp: number;
}

export interface GachaCard {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  image: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Room {
  code: string;
  host: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
}

export type ViewState = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'about' | 'privacy' | 'terms' | 'cookie' | 'gdpr' | 'affiliate';
export type DashboardView = 'home' | 'planner' | 'trip_detail' | 'history' | 'profile' | 'trip_ready' | 'community' | 'pandu_ai' | 'monetization' | 'route_map' | 'library' | 'ai_tools' | 'play_zone' | 'settings' | 'social_feed' | 'communities' | 'travel_buddy' | 'live_sharing' | 'ticket_scanner' | 'insta_spot' | 'ibadah' | 'carbon' | 'local_deals' | 'island_hopper' | 'quests' | 'trip_movie' | 'ar_heritage' | 'bnpl' | 'voice_ai' | 'price_alert' | 'group_trip' | 'offline_companion' | 'creator_dashboard';

// --- New Feature Types ---

// Price Alert Types
export interface PriceAlert {
  id: string;
  user_id: string;
  type: 'flight' | 'hotel' | 'train' | 'bus';
  route: string;
  target_price: number;
  current_price: number;
  is_active: boolean;
  created_at: string;
}

// Group Trip Types
export interface GroupTrip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'admin' | 'member';
  status: 'confirmed' | 'pending' | 'declined';
  total_paid: number;
}

export interface GroupExpense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  paid_by: string;
  category: 'transport' | 'accommodation' | 'food' | 'activity' | 'other';
  split_type: 'equal' | 'custom';
  created_at: string;
}

// Offline Content Types
export interface OfflineContent {
  id: string;
  user_id: string;
  type: 'map' | 'itinerary' | 'phrasebook' | 'emergency' | 'guide';
  title: string;
  region: string;
  size_mb: number;
  downloaded_at: string;
}

// Creator Types
export interface CreatorProfile {
  id: string;
  user_id: string;
  tier: 'bronze' | 'silver' | 'gold' | 'pro';
  followers: number;
  total_earnings: number;
  pending_payout: number;
  is_verified: boolean;
}
