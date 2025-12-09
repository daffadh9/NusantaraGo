# 📧 HOSTINGER EMAIL SETUP - NUSANTARAGO

**Email:** daffa@nusantarago.id  
**Provider:** Hostinger

---

## STEP 1: LOGIN HOSTINGER

1. Go to: https://hpanel.hostinger.com
2. Login → **Email > Email Accounts**
3. Verify email `daffa@nusantarago.id` sudah aktif

---

## STEP 2: INTEGRATE KE GMAIL (RECOMMENDED)

### Get Credentials dari Hostinger:
1. Click **Manage** di email kamu
2. Catat ini:
```
IMAP: imap.hostinger.com | Port: 993
SMTP: smtp.hostinger.com | Port: 465
Username: daffa@nusantarago.id
Password: [Your Hostinger password]
```

### Add ke Gmail:
1. Gmail > Settings ⚙️ > **Accounts and Import**
2. **Add a mail account** → Enter daffa@nusantarago.id
3. Choose IMAP, masukkan credentials di atas
4. **Send mail as** → Yes, setup SMTP juga
5. Verify via email confirmation
6. Set as **default** sender

**Done!** Sekarang email kamu di Gmail tapi pakai @nusantarago.id

---

## STEP 3: CREATE EMAIL ALIASES

Di Hostinger panel > **Email > Forwarders**:

| Alias | Forward to |
|-------|------------|
| support@nusantarago.id | daffa@nusantarago.id |
| hello@nusantarago.id | daffa@nusantarago.id |
| beta@nusantarago.id | daffa@nusantarago.id |
| noreply@nusantarago.id | daffa@nusantarago.id |

---

## STEP 4: EMAIL SIGNATURE

Gmail Settings > Signature:

```
---
Daffa Dhiyaulhaq Khadafi
Founder & CEO, NusantaraGo

📧 daffa@nusantarago.id
🌐 nusantarago.id
📱 +62 [Your Phone]

🚀 Jelajah Nusantara, AI Temanmu
```

---

## MOBILE SETUP

**Android/iOS:**
- Use Gmail app (already synced)
- Or add manual: IMAP + SMTP settings di atas

---

## USAGE GUIDE

| Scenario | Use Email |
|----------|-----------|
| Founder communication | daffa@ |
| Customer support | support@ |
| Beta tester outreach | beta@ |
| General inquiries | hello@ |
| Automated emails | noreply@ |

---

## UNTUK SUPABASE AUTH

Update `.env`:
```
VITE_SUPPORT_EMAIL=support@nusantarago.id
VITE_NOREPLY_EMAIL=noreply@nusantarago.id
```

Nanti untuk email notifications, pakai SMTP Hostinger.

---

**Need help?** Hostinger support 24/7 via live chat!
