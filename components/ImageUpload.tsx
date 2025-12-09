import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, Camera } from 'lucide-react';
import { uploadToCloudinary, getOptimizedUrl, UploadProgress, CloudinaryUploadResult } from '../services/cloudinaryService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free';
  maxSizeMB?: number;
  className?: string;
  placeholder?: string;
  showPreview?: boolean;
  variant?: 'default' | 'avatar' | 'cover';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'nusantarago/uploads',
  aspectRatio = 'free',
  maxSizeMB = 10,
  className = '',
  placeholder = 'Upload gambar',
  showPreview = true,
  variant = 'default'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    free: 'min-h-[200px]'
  }[aspectRatio];

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, folder, (p: UploadProgress) => {
        setProgress(p.percent);
      });
      
      onChange(result.secure_url);
    } catch (err) {
      setError('Gagal upload gambar. Coba lagi.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [folder, maxSizeMB, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // Avatar variant
  if (variant === 'avatar') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg">
          {value ? (
            <img 
              src={getOptimizedUrl(value, { width: 200, height: 200, crop: 'fill' })} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon size={32} />
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 bg-solar-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-solar-600 transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {error && (
          <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
        )}
      </div>
    );
  }

  // Cover variant
  if (variant === 'cover') {
    return (
      <div className={`relative ${className}`}>
        <div 
          className={`relative w-full aspect-[3/1] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed ${isDragging ? 'border-solar-500 bg-solar-50' : 'border-slate-300 dark:border-slate-600'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {value ? (
            <>
              <img 
                src={getOptimizedUrl(value, { width: 1200, crop: 'fill' })} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                >
                  Ganti
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <span className="text-sm">{progress}%</span>
                </>
              ) : (
                <>
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm font-medium">Upload Cover</span>
                  <span className="text-xs text-slate-400">Drag & drop atau klik</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-full ${aspectRatioClass} rounded-xl border-2 border-dashed 
          transition-all duration-200 overflow-hidden
          ${isDragging 
            ? 'border-solar-500 bg-solar-50 dark:bg-solar-900/20' 
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50'
          }
          ${value ? 'border-solid border-slate-200' : ''}
        `}
      >
        {value && showPreview ? (
          <div className="relative w-full h-full group">
            <img 
              src={getOptimizedUrl(value, { width: 800, quality: 'auto' })} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Success indicator */}
            <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
              <CheckCircle size={16} />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            {isUploading ? (
              <div className="text-center">
                <Loader2 size={40} className="animate-spin text-solar-500 mx-auto mb-3" />
                <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-solar-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">Uploading... {progress}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <Upload size={28} className="text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">{placeholder}</p>
                <p className="text-sm text-slate-400">Drag & drop atau klik untuk memilih</p>
                <p className="text-xs text-slate-400 mt-2">PNG, JPG, WEBP (max {maxSizeMB}MB)</p>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
