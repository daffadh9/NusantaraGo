import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { getPlacePhoto, getFallbackImage } from '../services/googlePlacesService';

interface PlaceImageProps {
  placeName: string;
  category?: string;
  className?: string;
  width?: number;
  height?: number;
  showAttribution?: boolean;
  fallbackCategory?: string;
  onClick?: () => void;
}

const PlaceImage: React.FC<PlaceImageProps> = ({
  placeName,
  category,
  className = '',
  width,
  height,
  showAttribution = true,
  fallbackCategory = 'nature',
  onClick
}) => {
  // Use unique ID for this instance
  const instanceId = React.useId();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [source, setSource] = useState<string>('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const loadImage = async () => {
      setLoading(true);
      
      // Use full placeName (including city) for consistent caching
      const destName = placeName.trim();
      
      console.log(`[${instanceId}] Loading image for: "${destName}"`);
      
      try {
        // Use the new intelligent photo service
        const result = await getPlacePhoto(destName, 800, fallbackCategory);
        
        if (cancelled) return;
        
        if (result.imageUrl) {
          console.log(`[${instanceId}] Got image from: ${result.source}`);
          setImageUrl(result.imageUrl);
          setSource(result.source);
        } else {
          setImageUrl(getFallbackImage(fallbackCategory));
          setSource('fallback');
        }
      } catch (err) {
        if (cancelled) return;
        console.error(`[${instanceId}] Error:`, err);
        setImageUrl(getFallbackImage(fallbackCategory));
        setSource('error');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    loadImage();
    
    return () => {
      cancelled = true;
    };
  }, [placeName, instanceId, fallbackCategory]);

  // Loading skeleton
  if (loading) {
    return (
      <div 
        className={`relative bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl overflow-hidden ${className}`}
        style={{ width: width || '100%', height: height || 200 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state - no image at all
  if (!imageUrl && !loading) {
    return (
      <div 
        className={`relative bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center ${className}`}
        style={{ width: width || '100%', height: height || 200 }}
      >
        <div className="text-center text-slate-400">
          <ImageOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Gambar tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-xl overflow-hidden group ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: width || '100%', height: height || 200 }}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={placeName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Only fallback once to prevent infinite loop
          if (!imageUrl.includes('unsplash.com')) {
            console.log(`[img] Load error for "${placeName}", trying fallback...`);
            const fallback = getFallbackImage(fallbackCategory);
            setImageUrl(fallback);
            setSource('fallback');
          }
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Place name - hide default since TravelerLibrary has its own overlay */}
      {/* 
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-1.5 text-white">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="text-sm font-medium truncate">{placeName}</span>
        </div>
      </div>
      */}

      {/* Source indicator */}
      {source === 'google_cached' && (
        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white/90 flex items-center gap-1">
          <span>📍</span>
          <span>Google Maps</span>
        </div>
      )}

      {source === 'wikimedia' && (
        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white/90 flex items-center gap-1">
          <span>Ⓦ</span>
          <span>Wikipedia</span>
        </div>
      )}

      {source === 'curated' && (
        <div className="absolute top-2 right-2 bg-emerald-500/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white flex items-center gap-1">
          <span>✓</span>
          <span>Verified</span>
        </div>
      )}
    </div>
  );
};

export default PlaceImage;

// ============================================
// Optimized Image Grid Component for Galleries
// ============================================

interface PlaceImageGridProps {
  places: { name: string; category?: string }[];
  columns?: 2 | 3 | 4;
  gap?: number;
  imageHeight?: number;
  onPlaceClick?: (placeName: string) => void;
}

export const PlaceImageGrid: React.FC<PlaceImageGridProps> = ({
  places,
  columns = 3,
  gap = 4,
  imageHeight = 200,
  onPlaceClick
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-${gap}`}>
      {places.map((place, index) => (
        <PlaceImage
          key={`${place.name}-${index}`}
          placeName={place.name}
          category={place.category}
          height={imageHeight}
          onClick={() => onPlaceClick?.(place.name)}
        />
      ))}
    </div>
  );
};
