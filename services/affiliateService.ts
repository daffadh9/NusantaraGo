/**
 * Affiliate & Tracking Service
 * Handles affiliate links for hotels, flights, and activities bookings
 */

// ==================== TYPES ====================

export type AffiliatePartner = 
  | 'traveloka'
  | 'tiket_com'
  | 'agoda'
  | 'booking_com'
  | 'airbnb'
  | 'klook'
  | 'trip_com'
  | 'pegipegi'
  | 'trivago';

export interface AffiliateConfig {
  partner: AffiliatePartner;
  baseUrl: string;
  trackingParam: string;
  affiliateId: string;
}

// ==================== AFFILIATE CONFIGURATION ====================

// Replace these with your actual affiliate IDs when you register
const AFFILIATE_IDS: Record<AffiliatePartner, string> = {
  traveloka: process.env.VITE_TRAVELOKA_AFFILIATE_ID || 'nusantarago_123',
  tiket_com: process.env.VITE_TIKETCOM_AFFILIATE_ID || 'nusantarago_456',
  agoda: process.env.VITE_AGODA_AFFILIATE_ID || 'nusantarago_789',
  booking_com: process.env.VITE_BOOKINGCOM_AFFILIATE_ID || 'nusantarago_abc',
  airbnb: process.env.VITE_AIRBNB_AFFILIATE_ID || 'nusantarago_def',
  klook: process.env.VITE_KLOOK_AFFILIATE_ID || 'nusantarago_ghi',
  trip_com: process.env.VITE_TRIPCOM_AFFILIATE_ID || 'nusantarago_jkl',
  pegipegi: process.env.VITE_PEGIPEGI_AFFILIATE_ID || 'nusantarago_mno',
  trivago: process.env.VITE_TRIVAGO_AFFILIATE_ID || 'nusantarago_pqr',
};

const AFFILIATE_CONFIGS: Record<AffiliatePartner, Omit<AffiliateConfig, 'affiliateId'>> = {
  traveloka: {
    partner: 'traveloka',
    baseUrl: 'https://www.traveloka.com',
    trackingParam: 'ref',
  },
  tiket_com: {
    partner: 'tiket_com',
    baseUrl: 'https://www.tiket.com',
    trackingParam: 'aid',
  },
  agoda: {
    partner: 'agoda',
    baseUrl: 'https://www.agoda.com',
    trackingParam: 'cid',
  },
  booking_com: {
    partner: 'booking_com',
    baseUrl: 'https://www.booking.com',
    trackingParam: 'aid',
  },
  airbnb: {
    partner: 'airbnb',
    baseUrl: 'https://www.airbnb.com',
    trackingParam: 'af',
  },
  klook: {
    partner: 'klook',
    baseUrl: 'https://www.klook.com',
    trackingParam: 'aid',
  },
  trip_com: {
    partner: 'trip_com',
    baseUrl: 'https://www.trip.com',
    trackingParam: 'affiliateid',
  },
  pegipegi: {
    partner: 'pegipegi',
    baseUrl: 'https://www.pegipegi.com',
    trackingParam: 'ref',
  },
  trivago: {
    partner: 'trivago',
    baseUrl: 'https://www.trivago.co.id',
    trackingParam: 'ref',
  },
};

// ==================== AFFILIATE LINK GENERATION ====================

/**
 * Generate affiliate tracking link
 * @param originalUrl - The original booking URL
 * @param partner - The affiliate partner
 * @param additionalParams - Additional tracking parameters
 */
export const generateAffiliateLink = (
  originalUrl: string,
  partner: AffiliatePartner = 'traveloka',
  additionalParams?: Record<string, string>
): string => {
  try {
    const url = new URL(originalUrl);
    const config = AFFILIATE_CONFIGS[partner];
    const affiliateId = AFFILIATE_IDS[partner];

    // Add affiliate tracking parameter
    url.searchParams.set(config.trackingParam, affiliateId);

    // Add additional tracking params
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // Add UTM parameters for analytics
    url.searchParams.set('utm_source', 'nusantarago');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', 'beta_launch');

    return url.toString();
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    return originalUrl;
  }
};

/**
 * Generate hotel search affiliate link
 */
export const generateHotelSearchLink = (
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number = 2,
  partner: AffiliatePartner = 'traveloka'
): string => {
  const baseUrl = AFFILIATE_CONFIGS[partner].baseUrl;
  let searchUrl = '';

  switch (partner) {
    case 'traveloka':
      searchUrl = `${baseUrl}/hotel/search?spec=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&numOfRooms=1&numOfAdults=${guests}`;
      break;
    case 'tiket_com':
      searchUrl = `${baseUrl}/hotel/search?d=${encodeURIComponent(destination)}&startDate=${checkIn}&endDate=${checkOut}&room=1&adult=${guests}`;
      break;
    case 'agoda':
      searchUrl = `${baseUrl}/pages/agoda/default/DestinationSearchResult.aspx?city=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=${guests}`;
      break;
    case 'booking_com':
      searchUrl = `${baseUrl}/searchresults.html?ss=${encodeURIComponent(destination)}&checkin=${checkIn}&checkout=${checkOut}&no_rooms=1&group_adults=${guests}`;
      break;
    default:
      searchUrl = `${baseUrl}/hotel/search?q=${encodeURIComponent(destination)}`;
  }

  return generateAffiliateLink(searchUrl, partner);
};

/**
 * Generate flight search affiliate link
 */
export const generateFlightSearchLink = (
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string,
  passengers: number = 1,
  partner: AffiliatePartner = 'traveloka'
): string => {
  const baseUrl = AFFILIATE_CONFIGS[partner].baseUrl;
  let searchUrl = '';

  switch (partner) {
    case 'traveloka':
      searchUrl = returnDate
        ? `${baseUrl}/flight/search?spec=${origin}.${destination}.${departDate}.${returnDate}.${passengers}.0.0.1`
        : `${baseUrl}/flight/search?spec=${origin}.${destination}.${departDate}.${passengers}.0.0.0`;
      break;
    case 'tiket_com':
      searchUrl = `${baseUrl}/pesawat/search?d=${destination}&a=${origin}&date=${departDate}&adult=${passengers}&class=economy`;
      break;
    default:
      searchUrl = `${baseUrl}/flight?from=${origin}&to=${destination}`;
  }

  return generateAffiliateLink(searchUrl, partner);
};

/**
 * Generate activity/tour affiliate link
 */
export const generateActivityLink = (
  activityName: string,
  destination: string,
  partner: AffiliatePartner = 'klook'
): string => {
  const baseUrl = AFFILIATE_CONFIGS[partner].baseUrl;
  const searchUrl = `${baseUrl}/search/result?query=${encodeURIComponent(activityName + ' ' + destination)}`;
  return generateAffiliateLink(searchUrl, partner);
};

// ==================== TRACKING & ANALYTICS ====================

/**
 * Track affiliate click (for analytics)
 */
export const trackAffiliateClick = async (
  userId: string | null,
  partner: AffiliatePartner,
  productType: 'hotel' | 'flight' | 'activity',
  productName: string
): Promise<void> => {
  try {
    // Log to console for now (implement proper analytics later)
    console.log('Affiliate Click:', {
      timestamp: new Date().toISOString(),
      userId,
      partner,
      productType,
      productName,
    });

    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
    // TODO: Store in database for commission tracking
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
};

/**
 * Open affiliate link in new tab with tracking
 */
export const openAffiliateLink = (
  url: string,
  partner: AffiliatePartner,
  productType: 'hotel' | 'flight' | 'activity',
  productName: string,
  userId: string | null = null
): void => {
  trackAffiliateClick(userId, partner, productType, productName);
  window.open(url, '_blank', 'noopener,noreferrer');
};

// ==================== COMMISSION RATES ====================

export const COMMISSION_RATES: Record<AffiliatePartner, { hotel: number; flight: number; activity: number }> = {
  traveloka: { hotel: 5, flight: 1, activity: 3 },
  tiket_com: { hotel: 4, flight: 1, activity: 2 },
  agoda: { hotel: 6, flight: 0, activity: 0 },
  booking_com: { hotel: 4, flight: 0, activity: 0 },
  airbnb: { hotel: 3, flight: 0, activity: 0 },
  klook: { hotel: 0, flight: 0, activity: 5 },
  trip_com: { hotel: 4, flight: 1, activity: 3 },
  pegipegi: { hotel: 4, flight: 1, activity: 2 },
  trivago: { hotel: 3, flight: 0, activity: 0 },
};

/**
 * Calculate estimated commission
 */
export const calculateCommission = (
  bookingAmount: number,
  partner: AffiliatePartner,
  productType: 'hotel' | 'flight' | 'activity'
): number => {
  const rate = COMMISSION_RATES[partner][productType];
  return Math.round(bookingAmount * (rate / 100));
};
