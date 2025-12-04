
import React, { useState } from 'react';
import { User } from '../types';
import { Camera, MapPin, Mail, Phone, Calendar, Award, Edit3, Shield, Bell, Globe, ChevronRight, Star, Trophy, Wallet } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'settings'>('overview');

  const badges = [
    { name: 'Early Adopter', icon: <Star size={16} />, color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' },
    { name: 'Bali Expert', icon: <MapPin size={16} />, color: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' },
    { name: 'Foodie', icon: <Award size={16} />, color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden mb-6 relative group transition-colors duration-300">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2">
                <Camera size={14} /> Change Cover
            </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-12 mb-6">
                <div className="flex items-end gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white dark:border-dark-card shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                             <img 
                                src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                             />
                        </div>
                        <button className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-dark-card rounded-full shadow-md text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
                            <Edit3 size={14} />
                        </button>
                    </div>
                    <div className="mb-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{user.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                            <MapPin size={14} /> {user.location || "Indonesia"}
                        </p>
                    </div>
                </div>
                
                {/* Gamification Stats */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level</div>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Trophy size={14} /> {user.level || "Explorer"}
                        </div>
                    </div>
                    <div className="text-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Points</div>
                        <div className="font-extrabold text-slate-800 dark:text-white">{user.points?.toLocaleString() || 0}</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-slate-100 dark:border-dark-border">
                {['overview', 'edit', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-sm font-bold capitalize transition-all relative ${
                            activeTab === tab 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Quick Info */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-emerald-500" /> Identity
                  </h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Mail size={16} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                              <div className="text-xs text-slate-400 dark:text-slate-500">Email</div>
                              <div className="font-medium truncate text-slate-800 dark:text-slate-200">{user.email}</div>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Phone size={16} />
                          </div>
                          <div>
                              <div className="text-xs text-slate-400 dark:text-slate-500">Phone</div>
                              <div className="font-medium text-slate-800 dark:text-slate-200">{user.phone || "-"}</div>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <Calendar size={16} />
                          </div>
                          <div>
                              <div className="text-xs text-slate-400 dark:text-slate-500">Joined</div>
                              <div className="font-medium text-slate-800 dark:text-slate-200">{user.memberSince || "Just now"}</div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-1">Go Premium</h3>
                      <p className="text-emerald-200 text-sm mb-4">Dapatkan akses ke itinerary eksklusif & hidden gems tanpa batas.</p>
                      <button className="w-full py-2 bg-white text-emerald-900 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors">
                          Upgrade Now
                      </button>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
          </div>

          {/* Right: Tab Content */}
          <div className="lg:col-span-2">
              
              {activeTab === 'overview' && (
                  <div className="space-y-6">
                      {/* Badges */}
                      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Achievements</h3>
                          <div className="flex flex-wrap gap-3">
                              {user.badges && user.badges.length > 0 ? (
                                  badges.map((badge, idx) => (
                                      <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${badge.color}`}>
                                          {badge.icon}
                                          {badge.name}
                                      </div>
                                  ))
                              ) : (
                                  <p className="text-slate-400 text-sm">Belum ada badge. Mulai trip pertamamu!</p>
                              )}
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border border-dashed border-slate-300 dark:border-slate-600 text-slate-400">
                                  + 3 More Locked
                              </div>
                          </div>
                      </div>

                      {/* Recent Activity Mock */}
                      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
                          <div className="space-y-4">
                              {[1, 2].map((i) => (
                                  <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                          <MapPin size={20} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Menyelesaikan Trip ke Bali</h4>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 Minggu yang lalu • 5 Hari Perjalanan</p>
                                      </div>
                                      <div className="ml-auto text-emerald-600 dark:text-emerald-400 font-bold text-xs">+500 pts</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'edit' && (
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-6">Edit Personal Info</h3>
                      <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">First Name</label>
                                  <input type="text" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user.name.split(' ')[0]} />
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Last Name</label>
                                  <input type="text" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user.name.split(' ')[1]} />
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email</label>
                              <input type="email" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user.email} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Phone Number</label>
                              <input type="tel" className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none" defaultValue={user.phone} />
                          </div>
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Bio</label>
                              <textarea className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none h-24" placeholder="Tell us about your travel style..."></textarea>
                          </div>
                          <div className="pt-4 flex justify-end">
                              <button type="button" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                                  Save Changes
                              </button>
                          </div>
                      </form>
                  </div>
              )}

              {activeTab === 'settings' && (
                  <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm space-y-6">
                      <div>
                          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Notifications</h3>
                          <div className="space-y-3">
                              {['Email Newsletter', 'Trip Reminders', 'Special Offers'].map((item, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                      <div className="flex items-center gap-3">
                                          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400"><Bell size={16} /></div>
                                          <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                                      </div>
                                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                          <input type="checkbox" name={`toggle-${i}`} id={`toggle-${i}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-emerald-500"/>
                                          <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-700 cursor-pointer checked:bg-emerald-500"></label>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      
                      <div className="border-t border-slate-100 dark:border-dark-border pt-6">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Preferences</h3>
                           <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400"><Globe size={16} /></div>
                                  <div>
                                      <div className="font-medium text-slate-700 dark:text-slate-300">Language</div>
                                      <div className="text-xs text-slate-400">Bahasa Indonesia</div>
                                  </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-400" />
                          </div>
                           <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400"><Wallet size={16} /></div>
                                  <div>
                                      <div className="font-medium text-slate-700 dark:text-slate-300">Currency</div>
                                      <div className="text-xs text-slate-400">IDR (Rupiah)</div>
                                  </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-400" />
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default UserProfile;
