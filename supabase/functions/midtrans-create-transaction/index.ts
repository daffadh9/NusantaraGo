/**
 * Supabase Edge Function: midtrans-create-transaction
 * Creates Midtrans Snap transaction and returns snap token
 * 
 * Deploy: supabase functions deploy midtrans-create-transaction
 * Set secrets: supabase secrets set MIDTRANS_SERVER_KEY=your_server_key
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY') || '';
const MIDTRANS_IS_PRODUCTION = Deno.env.get('MIDTRANS_PRODUCTION') === 'true';

const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  orderId: string;
  amount: number;
  plan: string;
  billingCycle: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
  itemDetails: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { orderId, amount, customer, itemDetails } = body;

    // Validate request
    if (!orderId || !amount || !customer) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Midtrans transaction
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
      },
      item_details: [itemDetails],
      callbacks: {
        finish: `${Deno.env.get('APP_URL') || 'https://nusantarago.id'}/payment/finish`,
      },
    };

    // Call Midtrans API
    const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);
    const response = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Midtrans error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to create transaction', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const midtransResponse = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        snapToken: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
        orderId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
