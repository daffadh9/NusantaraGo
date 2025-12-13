/**
 * Midtrans Payment Service
 * Handles Midtrans Snap payment integration for NusantaraGo
 * 
 * Setup Instructions:
 * 1. Register at https://dashboard.midtrans.com
 * 2. Get Server Key & Client Key from Settings > Access Keys
 * 3. Set environment variables:
 *    - VITE_MIDTRANS_CLIENT_KEY (for frontend)
 *    - MIDTRANS_SERVER_KEY (for Supabase Edge Function)
 * 4. For sandbox testing, use sandbox keys
 * 5. For production, switch to production keys
 */

import { supabase } from '../lib/supabaseClient';
import { SubscriptionPlan, SUBSCRIPTION_PLANS, formatPriceIDR } from './subscriptionService';

// Midtrans Client Key (public, safe for frontend)
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_IS_PRODUCTION = import.meta.env.VITE_MIDTRANS_PRODUCTION === 'true';

// Snap.js URL
const SNAP_JS_URL = MIDTRANS_IS_PRODUCTION 
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

// ==================== TYPES ====================

export interface MidtransTransactionParams {
  plan: 'premium' | 'business';
  billingCycle: 'monthly' | 'yearly';
}

export interface MidtransSnapResult {
  success: boolean;
  snapToken?: string;
  orderId?: string;
  error?: string;
}

export interface MidtransTransaction {
  id: string;
  user_id: string;
  order_id: string;
  snap_token?: string;
  amount: number;
  status: 'pending' | 'settlement' | 'capture' | 'deny' | 'cancel' | 'expire' | 'refund';
  payment_type?: string;
  plan: SubscriptionPlan;
  billing_cycle: 'monthly' | 'yearly';
  transaction_time?: string;
  settlement_time?: string;
  created_at: string;
}

// ==================== SNAP.JS LOADER ====================

let snapLoaded = false;
let snapLoadPromise: Promise<void> | null = null;

/**
 * Load Midtrans Snap.js script
 */
export const loadSnapScript = (): Promise<void> => {
  if (snapLoaded) return Promise.resolve();
  if (snapLoadPromise) return snapLoadPromise;

  snapLoadPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).snap) {
      snapLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = SNAP_JS_URL;
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    script.async = true;

    script.onload = () => {
      snapLoaded = true;
      console.log('✅ Midtrans Snap.js loaded');
      resolve();
    };

    script.onerror = () => {
      snapLoadPromise = null;
      reject(new Error('Failed to load Midtrans Snap.js'));
    };

    document.head.appendChild(script);
  });

  return snapLoadPromise;
};

// ==================== CREATE TRANSACTION ====================

/**
 * Create Midtrans Snap transaction via Supabase Edge Function
 */
export const createMidtransTransaction = async (
  params: MidtransTransactionParams
): Promise<MidtransSnapResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const planConfig = SUBSCRIPTION_PLANS[params.plan];
  const amount = params.billingCycle === 'yearly' 
    ? planConfig.yearlyPrice 
    : planConfig.price;

  const orderId = `NUSGO-${params.plan.toUpperCase()}-${Date.now()}`;

  try {
    // Call Supabase Edge Function to get Snap Token
    const { data, error } = await supabase.functions.invoke('midtrans-create-transaction', {
      body: {
        orderId,
        amount,
        plan: params.plan,
        billingCycle: params.billingCycle,
        customer: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        },
        itemDetails: {
          id: `${params.plan}-${params.billingCycle}`,
          name: `NusantaraGo ${planConfig.name} (${params.billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'})`,
          price: amount,
          quantity: 1,
        },
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      // Fallback to mock for development
      return createMockMidtransTransaction(params);
    }

    // Save transaction to database
    await supabase.from('payment_transactions').insert({
      user_id: user.id,
      external_id: orderId,
      order_id: orderId,
      snap_token: data.snapToken,
      amount,
      status: 'pending',
      plan: params.plan,
      billing_cycle: params.billingCycle,
      payment_provider: 'midtrans',
    });

    return {
      success: true,
      snapToken: data.snapToken,
      orderId,
    };
  } catch (err) {
    console.error('Midtrans service error:', err);
    return createMockMidtransTransaction(params);
  }
};

// ==================== MOCK TRANSACTION (Development) ====================

/**
 * Create mock Midtrans transaction for development
 */
export const createMockMidtransTransaction = async (
  params: MidtransTransactionParams
): Promise<MidtransSnapResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const planConfig = SUBSCRIPTION_PLANS[params.plan];
  const amount = params.billingCycle === 'yearly' 
    ? planConfig.yearlyPrice 
    : planConfig.price;

  const orderId = `NUSGO-MOCK-${params.plan.toUpperCase()}-${Date.now()}`;
  const mockSnapToken = `MOCK-SNAP-${Date.now()}`;

  // Save to database
  try {
    await supabase.from('payment_transactions').insert({
      user_id: user.id,
      external_id: orderId,
      order_id: orderId,
      snap_token: mockSnapToken,
      amount,
      status: 'pending',
      plan: params.plan,
      billing_cycle: params.billingCycle,
      payment_provider: 'midtrans',
    });
  } catch (err) {
    console.error('Database error:', err);
  }

  return {
    success: true,
    snapToken: mockSnapToken,
    orderId,
  };
};

// ==================== OPEN SNAP POPUP ====================

interface SnapCallbacks {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

/**
 * Open Midtrans Snap payment popup
 */
export const openSnapPopup = async (
  snapToken: string,
  callbacks?: SnapCallbacks
): Promise<void> => {
  await loadSnapScript();

  const snap = (window as any).snap;
  if (!snap) {
    throw new Error('Midtrans Snap not loaded');
  }

  snap.pay(snapToken, {
    onSuccess: (result: any) => {
      console.log('✅ Payment success:', result);
      callbacks?.onSuccess?.(result);
    },
    onPending: (result: any) => {
      console.log('⏳ Payment pending:', result);
      callbacks?.onPending?.(result);
    },
    onError: (result: any) => {
      console.error('❌ Payment error:', result);
      callbacks?.onError?.(result);
    },
    onClose: () => {
      console.log('🚪 Payment popup closed');
      callbacks?.onClose?.();
    },
  });
};

// ==================== FULL PAYMENT FLOW ====================

/**
 * Complete payment flow: create transaction and open popup
 */
export const processPayment = async (
  params: MidtransTransactionParams,
  callbacks?: SnapCallbacks
): Promise<void> => {
  // Create transaction
  const result = await createMidtransTransaction(params);
  
  if (!result.success || !result.snapToken) {
    throw new Error(result.error || 'Failed to create transaction');
  }

  // Check if mock mode
  if (result.snapToken.startsWith('MOCK-')) {
    // Simulate payment popup for development
    const confirmed = window.confirm(
      `[MOCK MODE] Simulasi Pembayaran\n\n` +
      `Order ID: ${result.orderId}\n` +
      `Plan: ${params.plan}\n` +
      `Billing: ${params.billingCycle}\n\n` +
      `Klik OK untuk simulasi pembayaran berhasil.`
    );

    if (confirmed) {
      await simulateMidtransSuccess(result.orderId!);
      callbacks?.onSuccess?.({ order_id: result.orderId, transaction_status: 'settlement' });
    } else {
      callbacks?.onClose?.();
    }
    return;
  }

  // Open real Snap popup
  await openSnapPopup(result.snapToken, callbacks);
};

// ==================== SIMULATE SUCCESS (Development) ====================

/**
 * Simulate successful payment for development
 */
export const simulateMidtransSuccess = async (orderId: string): Promise<boolean> => {
  try {
    // Get transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !transaction) {
      console.error('Transaction not found');
      return false;
    }

    // Update transaction status
    await supabase
      .from('payment_transactions')
      .update({
        status: 'settlement',
        settlement_time: new Date().toISOString(),
        payment_type: 'MOCK',
      })
      .eq('order_id', orderId);

    // Upgrade subscription
    const expiresAt = new Date();
    if (transaction.billing_cycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: transaction.user_id,
        plan: transaction.plan,
        premium_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      });

    return true;
  } catch (err) {
    console.error('Simulate payment error:', err);
    return false;
  }
};

// ==================== CHECK STATUS ====================

/**
 * Check transaction status
 */
export const checkTransactionStatus = async (orderId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('status')
    .eq('order_id', orderId)
    .single();

  if (error) return null;
  return data?.status || null;
};

// ==================== EXPORTS ====================

export default {
  loadSnapScript,
  createMidtransTransaction,
  openSnapPopup,
  processPayment,
  simulateMidtransSuccess,
  checkTransactionStatus,
};
