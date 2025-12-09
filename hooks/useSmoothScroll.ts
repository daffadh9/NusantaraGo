import { useEffect } from 'react';

/**
 * Custom hook for buttery smooth scrolling
 * Alternative to react-lenis that works with React 19
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling globally
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
}
