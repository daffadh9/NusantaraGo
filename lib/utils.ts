import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get time-based greeting and context
 */
export function getTimeBasedContext() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      period: 'morning',
      greeting: 'Selamat Pagi',
      message: 'Siap mengejar sunrise?',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      gradient: 'from-orange-500/30 via-amber-500/20 to-transparent'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      period: 'afternoon',
      greeting: 'Halo',
      message: 'Butuh vitamin sea hari ini?',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      gradient: 'from-cyan-500/30 via-blue-500/20 to-transparent'
    };
  } else {
    return {
      period: 'evening',
      greeting: 'Selamat Malam',
      message: 'Cari inspirasi buat weekend?',
      image: 'https://images.unsplash.com/photo-1496318522424-191e6e7e835e?w=1920&q=80',
      gradient: 'from-purple-500/30 via-indigo-500/20 to-transparent'
    };
  }
}
