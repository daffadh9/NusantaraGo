import { supabase } from '../lib/supabaseClient';
import { PriceAlert, GroupTrip, GroupMember, GroupExpense, OfflineContent, CreatorProfile } from '../types';

// ==================== PRICE ALERT SERVICE ====================

export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([alert])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserPriceAlerts = async (userId: string) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as PriceAlert[];
};

export const updatePriceAlert = async (alertId: string, updates: Partial<PriceAlert>) => {
  const { data, error } = await supabase
    .from('price_alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePriceAlert = async (alertId: string) => {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId);
  
  if (error) throw error;
};

// ==================== GROUP TRIP SERVICE ====================

export const createGroupTrip = async (trip: Omit<GroupTrip, 'id' | 'created_at' | 'invite_code'>) => {
  // Generate unique invite code
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { data, error } = await supabase
    .from('group_trips')
    .insert([{ ...trip, invite_code: inviteCode }])
    .select()
    .single();
  
  if (error) throw error;
  
  // Add creator as admin member
  await addGroupMember({
    trip_id: data.id,
    user_id: trip.created_by,
    role: 'admin',
    status: 'confirmed',
    total_paid: 0
  });
  
  return data as GroupTrip;
};

export const getGroupTrip = async (tripId: string) => {
  const { data, error } = await supabase
    .from('group_trips')
    .select('*')
    .eq('id', tripId)
    .single();
  
  if (error) throw error;
  return data as GroupTrip;
};

export const getGroupTripByCode = async (inviteCode: string) => {
  const { data, error } = await supabase
    .from('group_trips')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();
  
  if (error) throw error;
  return data as GroupTrip;
};

export const getUserGroupTrips = async (userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      group_trips (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const addGroupMember = async (member: Omit<GroupMember, 'id'>) => {
  const { data, error } = await supabase
    .from('group_members')
    .insert([member])
    .select()
    .single();
  
  if (error) throw error;
  return data as GroupMember;
};

export const updateGroupMember = async (memberId: string, updates: Partial<GroupMember>) => {
  const { data, error } = await supabase
    .from('group_members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getGroupMembers = async (tripId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url)
    `)
    .eq('trip_id', tripId);
  
  if (error) throw error;
  return data;
};

// ==================== GROUP EXPENSE SERVICE ====================

export const addGroupExpense = async (expense: Omit<GroupExpense, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('group_expenses')
    .insert([expense])
    .select()
    .single();
  
  if (error) throw error;
  return data as GroupExpense;
};

export const getGroupExpenses = async (tripId: string) => {
  const { data, error } = await supabase
    .from('group_expenses')
    .select(`
      *,
      paid_by_user:paid_by (full_name, avatar_url)
    `)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const deleteGroupExpense = async (expenseId: string) => {
  const { error } = await supabase
    .from('group_expenses')
    .delete()
    .eq('id', expenseId);
  
  if (error) throw error;
};

export const calculateSplitBill = async (tripId: string) => {
  const expenses = await getGroupExpenses(tripId);
  const members = await getGroupMembers(tripId);
  
  const confirmedMembers = members.filter(m => m.status === 'confirmed');
  const memberCount = confirmedMembers.length;
  
  // Calculate total per person
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = totalExpenses / memberCount;
  
  // Calculate balances
  const balances = confirmedMembers.map(member => {
    const memberPaid = expenses
      .filter(e => e.paid_by === member.user_id)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      ...member,
      total_paid: memberPaid,
      balance: memberPaid - perPerson
    };
  });
  
  return { totalExpenses, perPerson, balances };
};

// ==================== OFFLINE CONTENT SERVICE ====================

export const saveOfflineContent = async (content: Omit<OfflineContent, 'id' | 'downloaded_at'>) => {
  const { data, error } = await supabase
    .from('offline_content')
    .insert([{ ...content, downloaded_at: new Date().toISOString() }])
    .select()
    .single();
  
  if (error) throw error;
  return data as OfflineContent;
};

export const getUserOfflineContent = async (userId: string) => {
  const { data, error } = await supabase
    .from('offline_content')
    .select('*')
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false });
  
  if (error) throw error;
  return data as OfflineContent[];
};

export const deleteOfflineContent = async (contentId: string) => {
  const { error } = await supabase
    .from('offline_content')
    .delete()
    .eq('id', contentId);
  
  if (error) throw error;
};

// ==================== CREATOR SERVICE ====================

export const getCreatorProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
  return data as CreatorProfile | null;
};

export const createCreatorProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('creator_profiles')
    .insert([{
      user_id: userId,
      tier: 'bronze',
      followers: 0,
      total_earnings: 0,
      pending_payout: 0,
      is_verified: false
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data as CreatorProfile;
};

export const updateCreatorProfile = async (userId: string, updates: Partial<CreatorProfile>) => {
  const { data, error } = await supabase
    .from('creator_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCreatorContent = async (userId: string) => {
  const { data, error } = await supabase
    .from('creator_content')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createCreatorContent = async (content: {
  user_id: string;
  type: 'itinerary' | 'guide' | 'video' | 'story';
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  status: 'draft' | 'published' | 'review';
}) => {
  const { data, error } = await supabase
    .from('creator_content')
    .insert([content])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCreatorEarnings = async (userId: string) => {
  const { data, error } = await supabase
    .from('creator_earnings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// ==================== FLASH DEALS SERVICE ====================

export const getFlashDeals = async () => {
  const { data, error } = await supabase
    .from('flash_deals')
    .select('*')
    .gte('expires_at', new Date().toISOString())
    .order('discount_percent', { ascending: false })
    .limit(10);
  
  if (error) throw error;
  return data;
};

export const claimFlashDeal = async (dealId: string, userId: string) => {
  const { data, error } = await supabase
    .from('deal_claims')
    .insert([{ deal_id: dealId, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
