/**
 * Cloudinary Service for NusantaraGo
 * Upload & manage media assets
 * 
 * Setup: Add these to your .env file:
 * VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * VITE_CLOUDINARY_UPLOAD_PRESET=nusantarago_upload
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  original_filename: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Upload file to Cloudinary (Unsigned Upload)
 * Works without backend - direct browser upload
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'nusantarago',
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100)
        });
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        resolve(result as CloudinaryUploadResult);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed: Network error'));
    });
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Upload multiple files
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = 'nusantarago',
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<CloudinaryUploadResult[]> => {
  const results: CloudinaryUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadToCloudinary(
      files[i],
      folder,
      (progress) => onProgress?.(i, progress)
    );
    results.push(result);
  }
  
  return results;
};

/**
 * Generate optimized Cloudinary URL with transformations
 * This is the "magic" - auto-optimize images
 */
export const getOptimizedUrl = (
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    blur?: number;
    grayscale?: boolean;
  } = {}
): string => {
  // If it's already a full URL, extract the public_id
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('cloudinary.com')) {
    const match = publicIdOrUrl.match(/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    if (match) publicId = match[1];
  }
  
  const transformations: string[] = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  if (options.grayscale) transformations.push('e_grayscale');
  
  // Always add auto format and quality for optimization
  if (!options.format) transformations.push('f_auto');
  if (!options.quality) transformations.push('q_auto');
  
  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/'
    : '';
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}${publicId}`;
};

/**
 * Get thumbnail URL (small, optimized for lists)
 */
export const getThumbnailUrl = (publicIdOrUrl: string, size: number = 150): string => {
  return getOptimizedUrl(publicIdOrUrl, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto',
    format: 'auto'
  });
};

/**
 * Get avatar URL (circular crop optimized)
 */
export const getAvatarUrl = (publicIdOrUrl: string, size: number = 100): string => {
  return getOptimizedUrl(publicIdOrUrl, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
};

/**
 * Get hero/banner URL (large, full width)
 */
export const getHeroUrl = (publicIdOrUrl: string, width: number = 1200): string => {
  return getOptimizedUrl(publicIdOrUrl, {
    width,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
};

/**
 * Delete image from Cloudinary (requires backend)
 * Note: For security, deletion should be done via backend
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  // This would typically call your backend API
  // which then calls Cloudinary's destroy API with signed credentials
  console.warn('Delete requires backend implementation for security');
  return false;
};
