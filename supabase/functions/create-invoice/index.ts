/**
 * Supabase Edge Function: Create Xendit Invoice
 * 
 * This function creates a payment invoice using Xendit API
 * 
 * To deploy:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Link project: supabase link --project-ref hjmgoppcbqnxciqvixdf
 * 4. Set secrets:
 *    supabase secrets set XENDIT_SECRET_KEY=xnd_development_xxx
 * 5. Deploy: supabase functions deploy create-invoice
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Pricing configuration (in IDR)
const PLANS = {
  premium: {
    monthly: 49000,
    yearly: 399000,
    name: 'Traveler Pro',
  },
  business: {
    monthly: 199000,
    yearly: 1599000,
    name: 'Travel Agent',
  },
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Xendit secret key from environment
    const XENDIT_SECRET_KEY = Deno.env.get('XENDIT_SECRET_KEY')
    
    if (!XENDIT_SECRET_KEY) {
      console.error('XENDIT_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment service not configured. Please contact support.' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Parse request body
    const { userId, plan, billingCycle, email, name } = await req.json()

    // Validate input
    if (!userId || !plan || !billingCycle || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get plan pricing
    const planConfig = PLANS[plan as keyof typeof PLANS]
    if (!planConfig) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid plan' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const amount = billingCycle === 'yearly' ? planConfig.yearly : planConfig.monthly
    const externalId = `NUSGO-${plan.toUpperCase()}-${Date.now()}-${userId.slice(0, 8)}`

    // Create invoice via Xendit API
    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: amount,
        currency: 'IDR',
        payer_email: email,
        description: `NusantaraGo ${planConfig.name} - ${billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}`,
        invoice_duration: 86400, // 24 hours
        customer: {
          given_names: name,
          email: email,
        },
        success_redirect_url: `${Deno.env.get('APP_URL') || 'https://nusantarago.app'}/payment/success?external_id=${externalId}`,
        failure_redirect_url: `${Deno.env.get('APP_URL') || 'https://nusantarago.app'}/payment/failed?external_id=${externalId}`,
        // Payment methods to show
        payment_methods: [
          'CREDIT_CARD',
          'BCA',
          'BNI',
          'BSI',
          'BRI',
          'MANDIRI',
          'PERMATA',
          'SAHABAT_SAMPOERNA',
          'OVO',
          'DANA',
          'SHOPEEPAY',
          'LINKAJA',
          'ASTRAPAY',
          'QRIS',
          'ALFAMART',
          'INDOMARET',
        ],
        // Metadata for webhook processing
        metadata: {
          user_id: userId,
          plan: plan,
          billing_cycle: billingCycle,
        },
      }),
    })

    const xenditData = await xenditResponse.json()

    if (!xenditResponse.ok) {
      console.error('Xendit API error:', xenditData)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: xenditData.message || 'Failed to create invoice' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Save transaction to database
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        external_id: externalId,
        invoice_id: xenditData.id,
        invoice_url: xenditData.invoice_url,
        amount: amount,
        currency: 'IDR',
        status: 'pending',
        plan: plan,
        billing_cycle: billingCycle,
        expires_at: xenditData.expiry_date,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't fail - invoice was created, just logging failed
    }

    // Return success with invoice URL
    return new Response(
      JSON.stringify({
        success: true,
        invoice_url: xenditData.invoice_url,
        external_id: externalId,
        invoice_id: xenditData.id,
        amount: amount,
        expiry_date: xenditData.expiry_date,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
