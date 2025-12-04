import React, { useState, useRef } from 'react';
import { 
  Film, Play, Pause, Upload, Music, Sparkles, Download,
  Image, Video, Clock, ChevronLeft, ChevronRight, Trash2,
  Plus, Settings, Palette, Type, Loader2, Share2, Check
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  caption?: string;
}

interface MovieTemplate {
  id: string;
  name: string;
  style: string;
  duration: string;
  preview: string;
  transitions: string;
}

const TEMPLATES: MovieTemplate[] = [
  { id: '1', name: 'Cinematic', style: 'Dramatic', duration: '30-60s', preview: '🎬', transitions: 'Slow fade, Ken Burns' },
  { id: '2', name: 'Dynamic', style: 'Energetic', duration: '15-30s', preview: '⚡', transitions: 'Fast cuts, Zoom' },
  { id: '3', name: 'Vintage', style: 'Nostalgic', duration: '30-45s', preview: '📽️', transitions: 'Film grain, Sepia' },
  { id: '4', name: 'Social', style: 'Trendy', duration: '15-30s', preview: '📱', transitions: 'Vertical, Stories' },
];

const MUSIC_TRACKS = [
  { id: '1', name: 'Epic Adventure', mood: 'Cinematic', duration: '2:30', emoji: '🎻' },
  { id: '2', name: 'Chill Vibes', mood: 'Relaxed', duration: '3:15', emoji: '🎵' },
  { id: '3', name: 'Upbeat Travel', mood: 'Happy', duration: '2:45', emoji: '🎶' },
  { id: '4', name: 'Lo-Fi Journey', mood: 'Calm', duration: '4:00', emoji: '🎧' },
];

const TripMovieMaker: React.FC<{ userId: string }> = ({ userId }) => {
  const [activeStep, setActiveStep] = useState<'upload' | 'edit' | 'preview' | 'export'>('upload');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1');
  const [selectedMusic, setSelectedMusic] = useState<string>('1');
  const [movieTitle, setMovieTitle] = useState('My Trip to Indonesia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems: MediaItem[] = Array.from(files).map((file: File, idx: number) => ({
      id: Date.now().toString() + idx,
      type: file.type.startsWith('video') ? 'video' as const : 'image' as const,
      url: URL.createObjectURL(file),
      caption: ''
    }));

    setMediaItems(prev => [...prev, ...newItems]);
  };

  const removeMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const generateMovie = async () => {
    setIsGenerating(true);
    // Simulate AI video generation
    await new Promise(r => setTimeout(r, 3000));
    setGeneratedVideoUrl('/mock-video.mp4');
    setIsGenerating(false);
    setActiveStep('preview');
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Film size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Movie Maker</h1>
          <p className="text-slate-500 dark:text-slate-400">Buat video cinematic dari trip kamu 🎬</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {['upload', 'edit', 'preview', 'export'].map((step, idx) => (
          <React.Fragment key={step}>
            <button 
              onClick={() => setActiveStep(step as any)}
              className={`flex flex-col items-center gap-1 ${activeStep === step ? 'text-rose-500' : 'text-slate-400'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep === step ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {idx + 1}
              </div>
              <span className="text-xs capitalize">{step}</span>
            </button>
            {idx < 3 && <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step: Upload */}
      {activeStep === 'upload' && (
        <div className="space-y-6">
          <input type="file" ref={fileInputRef} multiple accept="image/*,video/*" className="hidden"
            onChange={handleFileUpload} />
          
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl p-12 text-center cursor-pointer hover:border-rose-400 transition-colors">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Upload size={40} className="text-rose-500" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Upload Foto & Video</h4>
            <p className="text-sm text-slate-500 mb-4">Drag & drop atau klik untuk upload</p>
            <p className="text-xs text-slate-400">Support: JPG, PNG, MP4, MOV (max 50MB each)</p>
          </div>

          {/* Uploaded Media Grid */}
          {mediaItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Media ({mediaItems.length})</h3>
              <div className="grid grid-cols-4 gap-3">
                {mediaItems.map((item, idx) => (
                  <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden">
                    {item.type === 'image' ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="text-white text-sm font-bold">{idx + 1}</span>
                      <button onClick={() => removeMedia(item.id)} className="p-1 bg-red-500 rounded-full">
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                    {item.type === 'video' && (
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-white text-xs">
                        <Video size={10} className="inline" />
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-rose-400">
                  <Plus size={24} className="text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {mediaItems.length >= 3 && (
            <button onClick={() => setActiveStep('edit')}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold">
              Lanjut Edit →
            </button>
          )}
          {mediaItems.length > 0 && mediaItems.length < 3 && (
            <p className="text-center text-sm text-slate-500">Minimal 3 foto/video untuk membuat movie</p>
          )}
        </div>
      )}

      {/* Step: Edit */}
      {activeStep === 'edit' && (
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Type size={16} className="inline mr-2" /> Judul Video
            </label>
            <input type="text" value={movieTitle} onChange={e => setMovieTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-0 text-lg font-semibold" />
          </div>

          {/* Templates */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Palette size={18} /> Pilih Template
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(template => (
                <button key={template.id} onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedTemplate === template.id 
                      ? 'bg-rose-100 dark:bg-rose-900/30 ring-2 ring-rose-500' 
                      : 'bg-slate-50 dark:bg-slate-700'
                  }`}>
                  <span className="text-3xl">{template.preview}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-2">{template.name}</h4>
                  <p className="text-xs text-slate-500">{template.style} • {template.duration}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Music */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Music size={18} /> Background Music
            </h3>
            <div className="space-y-2">
              {MUSIC_TRACKS.map(track => (
                <button key={track.id} onClick={() => setSelectedMusic(track.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                    selectedMusic === track.id 
                      ? 'bg-rose-100 dark:bg-rose-900/30 ring-2 ring-rose-500' 
                      : 'bg-slate-50 dark:bg-slate-700'
                  }`}>
                  <span className="text-2xl">{track.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">{track.name}</p>
                    <p className="text-xs text-slate-500">{track.mood} • {track.duration}</p>
                  </div>
                  {selectedMusic === track.id && <Check size={20} className="text-rose-500" />}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generateMovie} disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Generating Video...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Movie ✨
              </>
            )}
          </button>
        </div>
      )}

      {/* Step: Preview */}
      {activeStep === 'preview' && (
        <div className="space-y-6">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video relative">
            {/* Mock video player */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="text-center">
                <Film size={64} className="mx-auto text-rose-500 mb-4" />
                <h3 className="text-white text-xl font-bold">{movieTitle}</h3>
                <p className="text-slate-400 text-sm mt-2">AI-Generated Trip Movie</p>
              </div>
            </div>
            
            {/* Play button */}
            <button onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                {isPlaying ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white ml-1" />}
              </div>
            </button>
          </div>

          {/* Video Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{movieTitle}</h3>
                <p className="text-sm text-slate-500">{mediaItems.length} clips • 30 seconds</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setActiveStep('edit')} className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl font-semibold">
              ← Edit Lagi
            </button>
            <button onClick={() => setActiveStep('export')} className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold">
              Export →
            </button>
          </div>
        </div>
      )}

      {/* Step: Export */}
      {activeStep === 'export' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white text-center">
            <Check size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Video Siap! 🎉</h2>
            <p className="opacity-90">{movieTitle}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Export Options</h3>
            
            <button className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                <Download size={24} className="text-rose-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900 dark:text-white">Download HD</p>
                <p className="text-xs text-slate-500">1080p MP4 • ~50MB</p>
              </div>
            </button>

            <button className="w-full p-4 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Share2 size={24} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900 dark:text-white">Share to Social</p>
                <p className="text-xs text-slate-500">Instagram, TikTok, YouTube</p>
              </div>
            </button>
          </div>

          <button onClick={() => { setActiveStep('upload'); setMediaItems([]); }}
            className="w-full py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl font-semibold">
            + Buat Video Baru
          </button>
        </div>
      )}
    </div>
  );
};

export default TripMovieMaker;
