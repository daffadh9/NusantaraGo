/**
 * Payment Service
 * Handles Xendit invoice creation and payment flow
 */

import { supabase } from '../lib/supabaseClient';
import { SubscriptionPlan, SUBSCRIPTION_PLANS, formatPriceIDR } from './subscriptionService';

// ==================== TYPES ====================

export interface CreateInvoiceParams {
  plan: 'premium' | 'business';
  billingCycle: 'monthly' | 'yearly';
}

export interface InvoiceResult {
  success: boolean;
  invoice_url?: string;
  external_id?: string;
  error?: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  external_id: string;
  invoice_id?: string;
  invoice_url?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  payment_method?: string;
  payment_channel?: string;
  plan: SubscriptionPlan;
  billing_cycle: 'monthly' | 'yearly';
  paid_at?: string;
  expires_at?: string;
  created_at: string;
}

// ==================== MOCK PAYMENT (For Development) ====================

/**
 * Mock payment for development/testing
 * Simulates Xendit invoice creation
 */
export const createMockInvoice = async (params: CreateInvoiceParams): Promise<InvoiceResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  const planConfig = SUBSCRIPTION_PLANS[params.plan];
  const amount = params.billingCycle === 'yearly' 
    ? planConfig.yearlyPrice 
    : planConfig.price;

  const externalId = `NUSGO-${params.plan.toUpperCase()}-${Date.now()}-${user.id.slice(0, 8)}`;
  
  // Simulate invoice URL (in production, this comes from Xendit)
  const mockInvoiceUrl = `https://checkout-staging.xendit.co/web/mock-invoice?external_id=${externalId}&amount=${amount}`;

  // Save to database
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        external_id: externalId,
        invoice_url: mockInvoiceUrl,
        amount: amount,
        status: 'pending',
        plan: params.plan,
        billing_cycle: params.billingCycle,
        expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours
      });

    if (error) {
      console.error('Error saving transaction:', error);
      // Continue anyway for mock mode
    }
  } catch (err) {
    console.error('Database error:', err);
  }

  return {
    success: true,
    invoice_url: mockInvoiceUrl,
    external_id: externalId,
  };
};

// ==================== PRODUCTION PAYMENT ====================

/**
 * Create payment invoice via Supabase Edge Function
 */
export const createPaymentInvoice = async (params: CreateInvoiceParams): Promise<InvoiceResult> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Check if Supabase Edge Function is available
    const { data, error } = await supabase.functions.invoke('create-invoice', {
      body: {
        userId: user.id,
        plan: params.plan,
        billingCycle: params.billingCycle,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      // Fallback to mock for development
      return createMockInvoice(params);
    }

    return data;
  } catch (err) {
    console.error('Payment service error:', err);
    // Fallback to mock for development
    return createMockInvoice(params);
  }
};

/**
 * Redirect user to payment page
 */
export const redirectToPayment = async (params: CreateInvoiceParams): Promise<void> => {
  const result = await createPaymentInvoice(params);
  
  if (result.success && result.invoice_url) {
    // Open in same window for better UX
    window.location.href = result.invoice_url;
  } else {
    throw new Error(result.error || 'Failed to create payment invoice');
  }
};

/**
 * Open payment in new tab
 */
export const openPaymentInNewTab = async (params: CreateInvoiceParams): Promise<void> => {
  const result = await createPaymentInvoice(params);
  
  if (result.success && result.invoice_url) {
    window.open(result.invoice_url, '_blank', 'noopener,noreferrer');
  } else {
    throw new Error(result.error || 'Failed to create payment invoice');
  }
};

// ==================== TRANSACTION HISTORY ====================

/**
 * Get user's payment history
 */
export const getPaymentHistory = async (): Promise<PaymentTransaction[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }

  return data || [];
};

/**
 * Get single transaction by external ID
 */
export const getTransactionByExternalId = async (externalId: string): Promise<PaymentTransaction | null> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('external_id', externalId)
    .single();

  if (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }

  return data;
};

// ==================== MOCK SUCCESS (For Testing) ====================

/**
 * Simulate successful payment (for development testing)
 */
export const simulatePaymentSuccess = async (externalId: string): Promise<boolean> => {
  try {
    // Get transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (fetchError || !transaction) {
      console.error('Transaction not found');
      return false;
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: 'MOCK',
        payment_channel: 'DEVELOPMENT',
      })
      .eq('external_id', externalId);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      return false;
    }

    // Upgrade subscription
    const expiresAt = new Date();
    if (transaction.billing_cycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    await supabase
      .from('user_subscriptions')
      .update({
        plan: transaction.plan,
        premium_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', transaction.user_id);

    return true;
  } catch (err) {
    console.error('Simulate payment error:', err);
    return false;
  }
};

// ==================== PRICING HELPERS ====================

/**
 * Get price display for plan
 */
export const getPriceDisplay = (
  plan: 'premium' | 'business',
  billingCycle: 'monthly' | 'yearly'
): { price: string; original?: string; savings?: string } => {
  const planConfig = SUBSCRIPTION_PLANS[plan];
  
  if (billingCycle === 'yearly') {
    const monthlyEquivalent = Math.round(planConfig.yearlyPrice / 12);
    const originalYearly = planConfig.price * 12;
    const savings = Math.round(((originalYearly - planConfig.yearlyPrice) / originalYearly) * 100);
    
    return {
      price: `${formatPriceIDR(monthlyEquivalent)}/bulan`,
      original: formatPriceIDR(planConfig.price),
      savings: `Hemat ${savings}%`,
    };
  }
  
  return {
    price: `${formatPriceIDR(planConfig.price)}/bulan`,
  };
};

/**
 * Get total price for checkout
 */
export const getTotalPrice = (
  plan: 'premium' | 'business',
  billingCycle: 'monthly' | 'yearly'
): number => {
  const planConfig = SUBSCRIPTION_PLANS[plan];
  return billingCycle === 'yearly' ? planConfig.yearlyPrice : planConfig.price;
};
