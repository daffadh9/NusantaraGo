/**
 * Development Test Controls
 * Floating panel to test paywall and subscription features
 * Only shown in development mode
 */

import React, { useState, useEffect } from 'react';
import { 
  Bug, X, ChevronUp, ChevronDown, Zap, 
  Crown, RefreshCw, Trash2, Plus, Minus 
} from 'lucide-react';
import { 
  MOCK_MODE, 
  MOCK_USAGE_COUNT, 
  setMockUsageCount,
  SUBSCRIPTION_PLANS 
} from '../services/subscriptionService';

interface DevTestControlsProps {
  onRefresh?: () => void;
}

const DevTestControls: React.FC<DevTestControlsProps> = ({ onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUsage, setCurrentUsage] = useState(MOCK_USAGE_COUNT);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Only render in development
  if (import.meta.env.PROD) return null;
  if (!MOCK_MODE) return null;

  const limit = SUBSCRIPTION_PLANS.free.features.aiItineraryLimit;

  const updateUsage = (newValue: number) => {
    const clamped = Math.max(0, newValue);
    setMockUsageCount(clamped);
    setCurrentUsage(clamped);
    showToastMessage(`Usage set to ${clamped}/${limit}`);
  };

  const showToastMessage = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2000);
  };

  const presets = [
    { label: 'Fresh (0)', value: 0, color: 'emerald' },
    { label: '1 left', value: 2, color: 'amber' },
    { label: 'At limit', value: 3, color: 'red' },
    { label: 'Over limit', value: 5, color: 'red' },
  ];

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[200] bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top-2 text-sm font-medium">
          🧪 {showToast}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 z-[150] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white`}
        title="Dev Test Controls"
      >
        {isOpen ? <X size={20} /> : <Bug size={20} />}
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-[150] w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug size={18} />
              <span className="font-bold text-sm">Dev Test Controls</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Mock Mode
            </span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Usage Counter */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                AI Usage Count
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateUsage(currentUsage - 1)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center">
                  <span className={`text-3xl font-bold ${
                    currentUsage >= limit ? 'text-red-500' : 
                    currentUsage >= limit - 1 ? 'text-amber-500' : 
                    'text-emerald-500'
                  }`}>
                    {currentUsage}
                  </span>
                  <span className="text-slate-400 text-lg">/{limit}</span>
                </div>
                <button
                  onClick={() => updateUsage(currentUsage + 1)}
                  className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    currentUsage >= limit ? 'bg-red-500' : 
                    currentUsage >= limit - 1 ? 'bg-amber-500' : 
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min((currentUsage / limit) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => updateUsage(preset.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      currentUsage === preset.value
                        ? `bg-${preset.color}-500 text-white`
                        : `bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600`
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <button
                onClick={() => {
                  updateUsage(0);
                  showToastMessage('Usage reset to 0');
                }}
                className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <RefreshCw size={14} />
                Reset Usage
              </button>
              
              <button
                onClick={() => {
                  updateUsage(3);
                  showToastMessage('Set to limit - try generating!');
                }}
                className="w-full py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <Zap size={14} />
                Trigger Paywall
              </button>
            </div>

            {/* Info */}
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
              Go to Trip Planner and click "Generate" to test paywall
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTestControls;
