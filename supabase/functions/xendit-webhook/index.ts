/**
 * Supabase Edge Function: Xendit Webhook Handler
 * 
 * This function handles payment status updates from Xendit
 * 
 * Setup in Xendit Dashboard:
 * 1. Go to Settings → Webhooks
 * 2. Add webhook URL: https://hjmgoppcbqnxciqvixdf.supabase.co/functions/v1/xendit-webhook
 * 3. Select events: invoice.paid, invoice.expired
 * 4. Copy the Webhook Verification Token
 * 5. Set secret: supabase secrets set XENDIT_WEBHOOK_TOKEN=xxx
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-callback-token',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook token
    const XENDIT_WEBHOOK_TOKEN = Deno.env.get('XENDIT_WEBHOOK_TOKEN')
    const callbackToken = req.headers.get('x-callback-token')

    if (XENDIT_WEBHOOK_TOKEN && callbackToken !== XENDIT_WEBHOOK_TOKEN) {
      console.error('Invalid webhook token')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse webhook payload
    const payload = await req.json()
    console.log('Received webhook:', JSON.stringify(payload, null, 2))

    const { 
      external_id,
      status,
      payment_method,
      payment_channel,
      paid_at,
      metadata 
    } = payload

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update transaction status
    const { error: txError } = await supabase
      .from('payment_transactions')
      .update({
        status: status === 'PAID' ? 'paid' : status === 'EXPIRED' ? 'expired' : 'failed',
        payment_method: payment_method,
        payment_channel: payment_channel,
        paid_at: paid_at,
        updated_at: new Date().toISOString(),
      })
      .eq('external_id', external_id)

    if (txError) {
      console.error('Error updating transaction:', txError)
    }

    // If payment successful, upgrade user subscription
    if (status === 'PAID' && metadata) {
      const { user_id, plan, billing_cycle } = metadata

      // Calculate expiry date
      const expiryDate = new Date()
      if (billing_cycle === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      }

      // Update user subscription
      const { error: subError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user_id,
          plan: plan,
          usage_count: 0, // Reset usage on upgrade
          usage_reset_date: getNextResetDate(),
          premium_expires_at: expiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (subError) {
        console.error('Error updating subscription:', subError)
      } else {
        console.log(`✅ User ${user_id} upgraded to ${plan}`)
      }

      // Record in subscription history
      await supabase
        .from('subscription_history')
        .insert({
          user_id: user_id,
          old_plan: 'free', // Could query current plan first
          new_plan: plan,
          change_reason: 'payment',
          payment_id: external_id,
        })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Helper function
function getNextResetDate(): string {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toISOString()
}
