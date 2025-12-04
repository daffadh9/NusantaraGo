import React, { useState } from 'react';
import { 
  Sword, Shield, Trophy, Star, Zap, Target, Gift,
  MapPin, Camera, Users, Flame, Crown, Medal, Gem,
  ChevronRight, Lock, CheckCircle, Clock, Sparkles
} from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement' | 'special';
  category: 'explore' | 'social' | 'photo' | 'culture' | 'adventure';
  xpReward: number;
  milesReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  isLocked: boolean;
  icon: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
  isUnlocked: boolean;
}

interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  rank: string;
  totalQuests: number;
  streak: number;
  badges: number;
}

const QUESTS: Quest[] = [
  {
    id: '1', title: 'Photo Hunter', description: 'Upload 3 foto perjalanan hari ini',
    type: 'daily', category: 'photo', xpReward: 50, milesReward: 25,
    progress: 2, target: 3, isCompleted: false, isLocked: false, icon: '📸'
  },
  {
    id: '2', title: 'Social Butterfly', description: 'Like & comment 5 post traveler lain',
    type: 'daily', category: 'social', xpReward: 30, milesReward: 15,
    progress: 5, target: 5, isCompleted: true, isLocked: false, icon: '💬'
  },
  {
    id: '3', title: 'Province Explorer', description: 'Kunjungi 5 provinsi berbeda',
    type: 'weekly', category: 'explore', xpReward: 200, milesReward: 100,
    progress: 3, target: 5, isCompleted: false, isLocked: false, icon: '🗺️'
  },
  {
    id: '4', title: 'Culture Seeker', description: 'Kunjungi 3 tempat bersejarah',
    type: 'weekly', category: 'culture', xpReward: 150, milesReward: 75,
    progress: 1, target: 3, isCompleted: false, isLocked: false, icon: '🏛️'
  },
  {
    id: '5', title: 'Summit Master', description: 'Daki 3 gunung di Indonesia',
    type: 'achievement', category: 'adventure', xpReward: 500, milesReward: 250,
    progress: 1, target: 3, isCompleted: false, isLocked: false, icon: '⛰️'
  },
  {
    id: '6', title: 'Island Hopper Elite', description: 'Kunjungi 10 pulau berbeda',
    type: 'achievement', category: 'explore', xpReward: 1000, milesReward: 500,
    progress: 4, target: 10, isCompleted: false, isLocked: false, icon: '🏝️'
  }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Steps', description: 'Selesaikan quest pertama', icon: '👣', tier: 'bronze', isUnlocked: true, unlockedAt: '2024-01-15' },
  { id: '2', name: 'Explorer', description: 'Kunjungi 5 destinasi', icon: '🧭', tier: 'bronze', isUnlocked: true, unlockedAt: '2024-02-20' },
  { id: '3', name: 'Photographer', description: 'Upload 50 foto', icon: '📷', tier: 'silver', isUnlocked: true, unlockedAt: '2024-03-10' },
  { id: '4', name: 'Social Star', description: 'Dapatkan 100 likes', icon: '⭐', tier: 'silver', isUnlocked: false },
  { id: '5', name: 'Wanderer', description: 'Kunjungi 20 provinsi', icon: '🗺️', tier: 'gold', isUnlocked: false },
  { id: '6', name: 'Legend', description: 'Capai level 50', icon: '👑', tier: 'platinum', isUnlocked: false }
];

const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-slate-400 to-slate-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-cyan-400 to-blue-500'
};

const TravelQuestSystem: React.FC<{ userId: string; userMiles?: number }> = ({ userId, userMiles = 0 }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements' | 'leaderboard'>('quests');
  const [questFilter, setQuestFilter] = useState<'all' | 'daily' | 'weekly' | 'achievement'>('all');

  const [playerStats] = useState<PlayerStats>({
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    title: 'Wandering Explorer',
    rank: 'Silver III',
    totalQuests: 47,
    streak: 5,
    badges: 8
  });

  const filteredQuests = QUESTS.filter(q => questFilter === 'all' || q.type === questFilter);
  const xpProgress = (playerStats.xp / playerStats.xpToNext) * 100;

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Sword size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Travel Quest</h1>
          <p className="text-slate-500 dark:text-slate-400">Level up your travel journey 🎮</p>
        </div>
      </div>

      {/* Player Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
            🧙‍♂️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{playerStats.title}</h3>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{playerStats.rank}</span>
            </div>
            <p className="text-sm opacity-90">Level {playerStats.level}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{userMiles}</p>
            <p className="text-xs opacity-75">Miles</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>XP: {playerStats.xp}/{playerStats.xpToNext}</span>
            <span>Level {playerStats.level + 1}</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xl font-bold">{playerStats.totalQuests}</p>
            <p className="text-xs opacity-75">Quests</p>
          </div>
          <div className="text-center p-2 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xl font-bold">🔥 {playerStats.streak}</p>
            <p className="text-xs opacity-75">Day Streak</p>
          </div>
          <div className="text-center p-2 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xl font-bold">{playerStats.badges}</p>
            <p className="text-xs opacity-75">Badges</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        {[
          { id: 'quests', label: 'Quests', icon: <Target size={16} /> },
          { id: 'achievements', label: 'Badges', icon: <Medal size={16} /> },
          { id: 'leaderboard', label: 'Ranking', icon: <Trophy size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-purple-600 shadow' : 'text-slate-500'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'quests' && (
        <div className="space-y-4">
          {/* Quest Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: '🎯 Semua' },
              { id: 'daily', label: '📅 Harian' },
              { id: 'weekly', label: '📆 Mingguan' },
              { id: 'achievement', label: '🏆 Achievement' }
            ].map(f => (
              <button key={f.id} onClick={() => setQuestFilter(f.id as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm ${
                  questFilter === f.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Quest List */}
          {filteredQuests.map(quest => (
            <div key={quest.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow ${quest.isCompleted ? 'opacity-70' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl">
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{quest.title}</h4>
                    {quest.isCompleted && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{quest.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${quest.isCompleted ? 'bg-green-500' : 'bg-purple-500'}`}
                        style={{ width: `${(quest.progress / quest.target) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{quest.progress}/{quest.target}</span>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Zap size={12} /> +{quest.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Star size={12} /> +{quest.milesReward} Miles
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      quest.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                      quest.type === 'weekly' ? 'bg-green-100 text-green-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {quest.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-2 gap-4">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`relative bg-white dark:bg-slate-800 rounded-2xl p-4 text-center shadow ${!ach.isUnlocked ? 'opacity-50' : ''}`}>
              {!ach.isUnlocked && (
                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
              )}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${TIER_COLORS[ach.tier]} flex items-center justify-center text-3xl`}>
                {ach.icon}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">{ach.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
              {ach.isUnlocked && ach.unlockedAt && (
                <p className="text-xs text-green-500 mt-2">✅ {ach.unlockedAt}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Ayu Lestari', level: 45, xp: 12500, avatar: '👸' },
            { rank: 2, name: 'Budi Santoso', level: 42, xp: 11200, avatar: '🧔' },
            { rank: 3, name: 'Citra Dewi', level: 38, xp: 9800, avatar: '👩' },
            { rank: 4, name: 'You', level: playerStats.level, xp: playerStats.xp, avatar: '🧙‍♂️', isYou: true },
            { rank: 5, name: 'Eko Prasetyo', level: 10, xp: 2100, avatar: '👨' }
          ].map((player, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl ${player.isYou ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-white dark:bg-slate-800'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                player.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                player.rank === 2 ? 'bg-slate-300 text-slate-700' :
                player.rank === 3 ? 'bg-amber-600 text-amber-100' :
                'bg-slate-100 dark:bg-slate-700 text-slate-600'
              }`}>
                {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
                {player.avatar}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${player.isYou ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-white'}`}>
                  {player.name} {player.isYou && '(You)'}
                </p>
                <p className="text-xs text-slate-500">Level {player.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-600">{player.xp.toLocaleString()}</p>
                <p className="text-xs text-slate-500">XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelQuestSystem;
