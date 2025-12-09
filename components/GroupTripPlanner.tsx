import React, { useState } from 'react';
import { 
  Users, Plus, UserPlus, MapPin, Calendar, DollarSign, Check, X,
  Crown, MessageCircle, Receipt, Split, Wallet, Share2, Copy,
  ChevronRight, Clock, AlertCircle, CheckCircle, Camera, Sparkles
} from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
  status: 'confirmed' | 'pending' | 'declined';
  totalPaid: number;
  balance: number;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  category: 'transport' | 'accommodation' | 'food' | 'activity' | 'other';
  splitType: 'equal' | 'custom';
  participants: string[];
  date: string;
  receipt?: string;
}

interface GroupTrip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  members: GroupMember[];
  expenses: Expense[];
  totalBudget: number;
  inviteCode: string;
}

const GroupTripPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'split' | 'chat'>('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const [trip] = useState<GroupTrip>({
    id: '1',
    name: 'Bali Squad Trip 2025 🏝️',
    destination: 'Bali, Indonesia',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    coverImage: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    inviteCode: 'BALI2025',
    totalBudget: 15000000,
    members: [
      { id: '1', name: 'Daffa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daffa', email: 'daffa@email.com', isAdmin: true, status: 'confirmed', totalPaid: 5500000, balance: 750000 },
      { id: '2', name: 'Rina', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', email: 'rina@email.com', isAdmin: false, status: 'confirmed', totalPaid: 3200000, balance: -450000 },
      { id: '3', name: 'Budi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', email: 'budi@email.com', isAdmin: false, status: 'confirmed', totalPaid: 4800000, balance: 200000 },
      { id: '4', name: 'Sari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sari', email: 'sari@email.com', isAdmin: false, status: 'pending', totalPaid: 0, balance: -500000 }
    ],
    expenses: [
      { id: 'e1', title: 'Villa Ubud (5 malam)', amount: 7500000, paidBy: '1', category: 'accommodation', splitType: 'equal', participants: ['1','2','3','4'], date: '2025-01-10' },
      { id: 'e2', title: 'Tiket Pesawat Daffa', amount: 1200000, paidBy: '1', category: 'transport', splitType: 'custom', participants: ['1'], date: '2025-01-08' },
      { id: 'e3', title: 'Sewa Motor (4 unit)', amount: 1600000, paidBy: '3', category: 'transport', splitType: 'equal', participants: ['1','2','3','4'], date: '2025-01-15' },
      { id: 'e4', title: 'Makan Malam Jimbaran', amount: 1800000, paidBy: '2', category: 'food', splitType: 'equal', participants: ['1','2','3','4'], date: '2025-01-16' },
      { id: 'e5', title: 'Tiket Waterbom', amount: 2400000, paidBy: '3', category: 'activity', splitType: 'equal', participants: ['1','2','3','4'], date: '2025-01-17' }
    ]
  });

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = { transport: '🚗', accommodation: '🏨', food: '🍽️', activity: '🎢', other: '📦' };
    return icons[cat] || '📦';
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = { transport: 'bg-blue-500', accommodation: 'bg-purple-500', food: 'bg-orange-500', activity: 'bg-pink-500', other: 'bg-slate-500' };
    return colors[cat] || 'bg-slate-500';
  };

  const totalExpenses = trip.expenses.reduce((a, b) => a + b.amount, 0);
  const confirmedMembers = trip.members.filter(m => m.status === 'confirmed').length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Cover & Header */}
      <div className="relative rounded-3xl overflow-hidden h-48 md:h-64">
        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1"><MapPin size={16} /> {trip.destination}</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> {trip.startDate} - {trip.endDate}</span>
            <span className="flex items-center gap-1"><Users size={16} /> {confirmedMembers} orang</span>
          </div>
        </div>
        <button className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/30 transition-all">
          <Share2 size={16} /> Share
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Total Budget</div>
          <div className="text-xl font-bold">{formatPrice(trip.totalBudget)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Total Expenses</div>
          <div className="text-xl font-bold">{formatPrice(totalExpenses)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Per Person</div>
          <div className="text-xl font-bold">{formatPrice(totalExpenses / confirmedMembers)}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Remaining</div>
          <div className="text-xl font-bold">{formatPrice(trip.totalBudget - totalExpenses)}</div>
        </div>
      </div>

      {/* Invite Code */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-violet-200 dark:border-violet-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center text-white">
            <UserPlus size={24} />
          </div>
          <div>
            <div className="text-sm text-violet-600 dark:text-violet-400">Invite Code</div>
            <div className="text-2xl font-bold text-violet-700 dark:text-violet-300 tracking-wider">{trip.inviteCode}</div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors">
          <Copy size={18} /> Copy Link
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Users },
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'split', label: 'Split Bill', icon: Split },
          { id: 'chat', label: 'Chat', icon: MessageCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Members */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={20} /> Trip Members
              </h3>
              <button className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Invite
              </button>
            </div>
            <div className="space-y-3">
              {trip.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                      {member.isAdmin && <Crown className="absolute -top-1 -right-1 text-amber-500 bg-white rounded-full p-0.5" size={14} />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.status === 'confirmed' && <CheckCircle className="text-emerald-500" size={18} />}
                    {member.status === 'pending' && <Clock className="text-amber-500" size={18} />}
                    {member.status === 'declined' && <X className="text-red-500" size={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt size={20} /> Recent Expenses
              </h3>
              <button onClick={() => setShowAddExpense(true)} className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {trip.expenses.slice(0, 4).map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getCategoryColor(expense.category)} rounded-xl flex items-center justify-center text-xl`}>
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{expense.title}</div>
                      <div className="text-xs text-slate-500">by {trip.members.find(m => m.id === expense.paidBy)?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{formatPrice(expense.amount)}</div>
                    <div className="text-xs text-slate-500">{expense.participants.length} orang</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">All Expenses</h3>
            <button onClick={() => setShowAddExpense(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm">
              <Plus size={18} /> Add Expense
            </button>
          </div>
          {trip.expenses.map(expense => (
            <div key={expense.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${getCategoryColor(expense.category)} rounded-xl flex items-center justify-center text-2xl`}>
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{expense.title}</div>
                  <div className="text-sm text-slate-500">
                    Paid by <span className="font-medium">{trip.members.find(m => m.id === expense.paidBy)?.name}</span> • {expense.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(expense.amount)}</div>
                <div className="text-sm text-slate-500">
                  {expense.splitType === 'equal' ? `÷ ${expense.participants.length} = ${formatPrice(expense.amount / expense.participants.length)}` : 'Custom split'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Split Bill Tab */}
      {activeTab === 'split' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} />
              <h3 className="text-xl font-bold">AI Settlement Suggestion</h3>
            </div>
            <p className="opacity-90 mb-4">Based on all expenses, here's the optimal way to settle:</p>
            <div className="space-y-3">
              <div className="bg-white/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={trip.members[3].avatar} className="w-10 h-10 rounded-full" />
                  <span className="font-bold">Sari</span>
                  <ChevronRight size={18} />
                  <img src={trip.members[0].avatar} className="w-10 h-10 rounded-full" />
                  <span className="font-bold">Daffa</span>
                </div>
                <div className="text-xl font-bold">{formatPrice(500000)}</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={trip.members[1].avatar} className="w-10 h-10 rounded-full" />
                  <span className="font-bold">Rina</span>
                  <ChevronRight size={18} />
                  <img src={trip.members[2].avatar} className="w-10 h-10 rounded-full" />
                  <span className="font-bold">Budi</span>
                </div>
                <div className="text-xl font-bold">{formatPrice(450000)}</div>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white">Balance Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {trip.members.map(member => (
              <div key={member.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                    <div className="text-sm text-slate-500">Paid: {formatPrice(member.totalPaid)}</div>
                  </div>
                </div>
                <div className={`text-xl font-bold ${member.balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {member.balance >= 0 ? '+' : ''}{formatPrice(member.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Tab Placeholder */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <MessageCircle className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={64} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Group Chat</h3>
          <p className="text-slate-500 mb-4">Coordinate with your trip buddies in real-time</p>
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold">Start Chatting</button>
        </div>
      )}
    </div>
  );
};

export default GroupTripPlanner;
