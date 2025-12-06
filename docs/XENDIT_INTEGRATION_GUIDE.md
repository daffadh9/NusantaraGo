# 🏦 Panduan Integrasi Xendit untuk NusantaraGo

## Overview

Xendit adalah payment gateway Indonesia yang mendukung:
- Virtual Account (BCA, BNI, BRI, Mandiri, Permata)
- E-Wallet (OVO, DANA, GoPay, ShopeePay, LinkAja)
- Kartu Kredit/Debit
- QR Code (QRIS)
- Retail Outlets (Alfamart, Indomaret)

---

## 📋 STEP 1: Daftar Akun Xendit

1. Buka https://dashboard.xendit.co/register
2. Pilih "Indonesia" sebagai negara
3. Isi data bisnis:
   - Nama bisnis: NusantaraGo
   - Jenis bisnis: Teknologi / Travel
   - Website: nusantarago.app
4. Verifikasi email dan nomor HP
5. Upload dokumen:
   - KTP pemilik
   - NPWP bisnis (jika ada)
   - Rekening bank untuk settlement

**Waktu approval: 1-3 hari kerja**

---

## 🔑 STEP 2: Dapatkan API Keys

Setelah akun disetujui:

1. Login ke [Xendit Dashboard](https://dashboard.xendit.co)
2. Pergi ke **Settings > API Keys**
3. Copy **Secret API Key** (mulai dengan `xnd_development_...` atau `xnd_production_...`)
4. Simpan di `.env`:

```env
# Xendit API Keys
XENDIT_SECRET_KEY=xnd_development_xxxxxxxxxxxxx
XENDIT_PUBLIC_KEY=xnd_public_development_xxxxxxxxxxxxx
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token

# Untuk production, ganti dengan:
# XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxx
```

⚠️ **PENTING**: Jangan pernah expose Secret Key di frontend!

---

## 🛠️ STEP 3: Setup Backend (Serverless Function)

Karena NusantaraGo adalah SPA dengan Vite, kamu perlu backend untuk handle Xendit API calls.

### Option A: Supabase Edge Functions (Recommended)

Buat file `supabase/functions/create-invoice/index.ts`:

```typescript
// supabase/functions/create-invoice/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const XENDIT_SECRET_KEY = Deno.env.get("XENDIT_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateInvoiceRequest {
  userId: string;
  plan: "premium" | "business";
  billingCycle: "monthly" | "yearly";
  email: string;
  name: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, plan, billingCycle, email, name }: CreateInvoiceRequest = await req.json();

    // Calculate amount
    const prices = {
      premium: { monthly: 49000, yearly: 399000 },
      business: { monthly: 199000, yearly: 1599000 },
    };
    const amount = prices[plan][billingCycle];

    // Generate unique external ID
    const externalId = `NUSGO-${plan.toUpperCase()}-${Date.now()}-${userId.slice(0, 8)}`;

    // Create invoice via Xendit API
    const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(XENDIT_SECRET_KEY + ":")}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: amount,
        currency: "IDR",
        payer_email: email,
        description: `NusantaraGo ${plan === "premium" ? "Traveler Pro" : "Travel Agent"} - ${billingCycle === "yearly" ? "1 Tahun" : "1 Bulan"}`,
        invoice_duration: 86400, // 24 hours
        customer: {
          given_names: name,
          email: email,
        },
        success_redirect_url: `${req.headers.get("origin")}/payment/success?external_id=${externalId}`,
        failure_redirect_url: `${req.headers.get("origin")}/payment/failed?external_id=${externalId}`,
        payment_methods: ["CREDIT_CARD", "BCA", "BNI", "BRI", "MANDIRI", "OVO", "DANA", "SHOPEEPAY", "QRIS"],
        items: [
          {
            name: `NusantaraGo ${plan === "premium" ? "Traveler Pro" : "Travel Agent"}`,
            quantity: 1,
            price: amount,
          },
        ],
      }),
    });

    if (!xenditResponse.ok) {
      const error = await xenditResponse.json();
      throw new Error(error.message || "Failed to create invoice");
    }

    const invoice = await xenditResponse.json();

    // Save transaction to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    await supabase.from("payment_transactions").insert({
      user_id: userId,
      external_id: externalId,
      invoice_id: invoice.id,
      invoice_url: invoice.invoice_url,
      amount: amount,
      status: "pending",
      plan: plan,
      billing_cycle: billingCycle,
      expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours
    });

    return new Response(
      JSON.stringify({
        success: true,
        invoice_url: invoice.invoice_url,
        external_id: externalId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

### Deploy Edge Function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set XENDIT_SECRET_KEY=xnd_development_xxxxx

# Deploy
supabase functions deploy create-invoice
```

---

### Option B: Vercel Serverless (Alternative)

Buat file `api/payment/create-invoice.ts`:

```typescript
// api/payment/create-invoice.ts (for Vercel)
import type { VercelRequest, VercelResponse } from "@vercel/node";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, plan, billingCycle, email, name } = req.body;

    const prices = {
      premium: { monthly: 49000, yearly: 399000 },
      business: { monthly: 199000, yearly: 1599000 },
    };
    const amount = prices[plan][billingCycle];
    const externalId = `NUSGO-${plan.toUpperCase()}-${Date.now()}-${userId.slice(0, 8)}`;

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        amount,
        currency: "IDR",
        payer_email: email,
        description: `NusantaraGo Subscription`,
        invoice_duration: 86400,
        success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
      }),
    });

    const invoice = await response.json();

    return res.status(200).json({
      success: true,
      invoice_url: invoice.invoice_url,
      external_id: externalId,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
```

---

## 🔔 STEP 4: Setup Webhook Handler

Xendit akan mengirim notifikasi saat pembayaran berhasil.

### Supabase Edge Function untuk Webhook:

```typescript
// supabase/functions/xendit-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const XENDIT_WEBHOOK_TOKEN = Deno.env.get("XENDIT_WEBHOOK_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Verify webhook token
  const callbackToken = req.headers.get("x-callback-token");
  if (callbackToken !== XENDIT_WEBHOOK_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    if (payload.status === "PAID") {
      // Update transaction status
      const { data: transaction } = await supabase
        .from("payment_transactions")
        .update({
          status: "paid",
          payment_method: payload.payment_method,
          payment_channel: payload.payment_channel,
          paid_at: new Date().toISOString(),
        })
        .eq("external_id", payload.external_id)
        .select()
        .single();

      if (transaction) {
        // Upgrade user subscription
        const expiresAt = new Date();
        if (transaction.billing_cycle === "yearly") {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        await supabase
          .from("user_subscriptions")
          .update({
            plan: transaction.plan,
            premium_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", transaction.user_id);

        // Update profiles table
        await supabase
          .from("profiles")
          .update({
            is_premium: true,
            subscription_plan: transaction.plan,
          })
          .eq("id", transaction.user_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
});
```

### Setup Webhook di Xendit Dashboard:

1. Buka **Settings > Callbacks**
2. Tambah callback URL: `https://YOUR_PROJECT.supabase.co/functions/v1/xendit-webhook`
3. Copy **Verification Token** dan simpan di environment variables

---

## 🎨 STEP 5: Frontend Integration

### Payment Service:

```typescript
// services/paymentService.ts
import { supabase } from '../lib/supabaseClient';

export interface CreateInvoiceParams {
  plan: 'premium' | 'business';
  billingCycle: 'monthly' | 'yearly';
}

export const createPaymentInvoice = async (params: CreateInvoiceParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const response = await supabase.functions.invoke('create-invoice', {
    body: {
      userId: user.id,
      plan: params.plan,
      billingCycle: params.billingCycle,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
    },
  });

  if (response.error) throw response.error;
  return response.data;
};

export const redirectToPayment = async (params: CreateInvoiceParams) => {
  const result = await createPaymentInvoice(params);
  if (result.success && result.invoice_url) {
    window.location.href = result.invoice_url;
  } else {
    throw new Error(result.error || 'Failed to create invoice');
  }
};
```

### Upgrade Button Component:

```tsx
// components/UpgradeButton.tsx
import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { redirectToPayment } from '../services/paymentService';

interface UpgradeButtonProps {
  plan: 'premium' | 'business';
  billingCycle: 'monthly' | 'yearly';
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ plan, billingCycle }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await redirectToPayment({ plan, billingCycle });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Gagal memproses pembayaran. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Memproses...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          Bayar Sekarang
        </>
      )}
    </button>
  );
};

export default UpgradeButton;
```

---

## 💰 MODEL MONETISASI RECOMMENDED

### Pricing Strategy:

| Plan | Harga Bulanan | Harga Tahunan | Target User |
|------|---------------|---------------|-------------|
| **Free** | Rp 0 | Rp 0 | Traveler casual |
| **Traveler Pro** | Rp 49.000 | Rp 399.000 (Hemat 32%) | Traveler serius |
| **Travel Agent** | Rp 199.000 | Rp 1.599.000 (Hemat 33%) | Bisnis travel |

### Revenue Streams:

1. **Subscription Revenue**
   - Target: 5% konversi dari free ke paid
   - Estimasi: 1000 user × 5% × Rp 49.000 = Rp 2.450.000/bulan

2. **Affiliate Commission**
   - Hotel booking: 4-6% commission
   - Flight booking: 1-2% commission
   - Activity booking: 3-5% commission
   - Estimasi: Rp 50.000.000 GMV × 4% = Rp 2.000.000/bulan

3. **Premium Features Upsell**
   - PDF Export: Rp 5.000/download (one-time)
   - Priority Support: Included in Business plan

### Conversion Funnel:

```
Landing Page → Sign Up → Use Free Features → Hit Limit → Paywall → Upgrade
                 ↓
              3x AI Generate → Show Upgrade Modal → Convert 5-10%
```

---

## 🧪 TESTING

### Test Mode:

1. Gunakan `xnd_development_...` API key
2. Test card: `4000000000000002` (Visa success)
3. Test VA: Akan auto-complete setelah 10 detik

### Test Flow:

1. Pilih plan Premium di PricingPage
2. Klik "Bayar Sekarang"
3. Redirect ke Xendit checkout
4. Pilih metode pembayaran
5. Complete payment
6. Redirect kembali ke app
7. Check subscription status updated

---

## 📊 Monitoring

1. **Xendit Dashboard** - Real-time transaction monitoring
2. **Supabase Dashboard** - Database transactions
3. **Custom Analytics** - Track conversion rates

---

## 🚀 Go-Live Checklist

- [ ] Ganti API key dari development ke production
- [ ] Test semua payment methods
- [ ] Setup webhook dengan URL production
- [ ] Verify redirect URLs
- [ ] Test refund flow
- [ ] Setup email notifications
- [ ] Configure settlement to bank account

---

## 📞 Support

- Xendit Support: support@xendit.co
- Xendit Docs: https://docs.xendit.co
- Discord Community: https://discord.gg/xendit
