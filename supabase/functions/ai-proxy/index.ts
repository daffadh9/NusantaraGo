// Supabase Edge Function: AI Proxy
// This keeps API keys secure on the server side
// Deploy: supabase functions deploy ai-proxy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Rate limiting: 10 requests per minute per user
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000 // 1 minute
const userRequests = new Map<string, number[]>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const requests = userRequests.get(userId) || []
  
  // Filter to requests within window
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW)
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false
  }
  
  recentRequests.push(now)
  userRequests.set(userId, recentRequests)
  return true
}

// Input validation
function validateInput(input: any): { valid: boolean; error?: string } {
  if (!input.destination || typeof input.destination !== 'string') {
    return { valid: false, error: 'Invalid destination' }
  }
  if (input.destination.length > 100) {
    return { valid: false, error: 'Destination too long' }
  }
  if (!input.duration || input.duration < 1 || input.duration > 30) {
    return { valid: false, error: 'Invalid duration (1-30 days)' }
  }
  if (!['budget', 'medium', 'luxury'].includes(input.budget)) {
    return { valid: false, error: 'Invalid budget type' }
  }
  return { valid: true }
}

serve(async (req) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }
  
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers }
      )
    }
    
    // Create Supabase client to verify user
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers }
      )
    }
    
    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again in 1 minute.' }),
        { status: 429, headers }
      )
    }
    
    // Parse and validate input
    const body = await req.json()
    const validation = validateInput(body.input)
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers }
      )
    }
    
    // Check user's usage quota (from subscription service)
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    const usageLimit = subscription?.tier === 'premium' ? Infinity : 3
    const currentUsage = subscription?.usage_count || 0
    
    if (currentUsage >= usageLimit) {
      return new Response(
        JSON.stringify({ 
          error: 'Usage limit reached',
          upgradeRequired: true 
        }),
        { status: 403, headers }
      )
    }
    
    // Call Gemini API (server-side, key is secure)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: body.prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      }
    )
    
    if (!geminiResponse.ok) {
      const error = await geminiResponse.text()
      console.error('Gemini API error:', error)
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers }
      )
    }
    
    const geminiData = await geminiResponse.json()
    
    // Increment usage count
    await supabase
      .from('user_subscriptions')
      .update({ 
        usage_count: currentUsage + 1,
        last_usage: new Date().toISOString()
      })
      .eq('user_id', user.id)
    
    // Return result
    return new Response(
      JSON.stringify({
        success: true,
        data: geminiData,
        usage: {
          current: currentUsage + 1,
          limit: usageLimit
        }
      }),
      { status: 200, headers }
    )
    
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    )
  }
})
