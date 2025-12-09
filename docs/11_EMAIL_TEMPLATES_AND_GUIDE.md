# 📧 NUSANTARAGO EMAIL TEMPLATES & BRAND GUIDE

**Owner:** Daffa Dhiyaulhaq Khadafi  
**Domain:** nusantarago.id  
**Last Updated:** December 2025

---

## 1. EMAIL ADDRESSES & PERAN

| Alamat | Peran Utama | Siapa yang pakai |
|--------|------------|-------------------|
| `daffa@nusantarago.id` | Founder, komunikasi penting, investor, partner kunci | Daffa |
| `support@nusantarago.id` | Customer support, bug, komplain | Tim support (saat ini Daffa) |
| `hello@nusantarago.id` | Kontak umum, website/press | Daffa / tim ops |
| `beta@nusantarago.id` | Beta tester, komunitas awal, eksperimen fitur | Daffa / tim produk |
| `noreply@nusantarago.id` | Notifikasi otomatis (password reset custom, dsb.) | Sistem |

Semua alias saat ini diarahkan ke mailbox utama: `daffa@nusantarago.id`.

---

## 2. PANDUAN SETUP DI GMAIL (RINGKAS)

1. Login ke Gmail utama (akun Google personal kamu).  
2. **Terima email Hostinger via POP3**  
   - Settings → Akun dan Impor → *Periksa email dari akun lain* → Tambahkan akun email.  
   - Email: `daffa@nusantarago.id`  
   - Metode: POP3  
   - Server: `pop.hostinger.com`, Port: `995`, SSL aktif.  
3. **Kirim email sebagai (SMTP)**  
   - Settings → Akun dan Impor → *Kirim email sebagai* → Tambahkan alamat email lainnya.  
   - Email: `daffa@nusantarago.id` (dan juga `support@`, `beta@` jika ingin).  
   - Server: `smtp.hostinger.com`, Port: `465` (SSL) atau `587` (TLS).  
4. Jadikan `daffa@nusantarago.id` sebagai default "Kirim email sebagai".  
5. Aktifkan **Template** di Settings → Lanjutan.

---

## 3. TEMPLATE – BETA TESTER INVITATION

**From:** `beta@nusantarago.id` atau `daffa@nusantarago.id`  
**Subject options:**
- `Bantu saya uji NusantaraGo? 🎒`
- `Undangan eksklusif beta test NusantaraGo (AI Travel Planner Indonesia)`

**Template:**

```text
Halo [Nama],

Perkenalkan, saya Daffa – founder NusantaraGo, aplikasi AI travel planner yang fokus khusus untuk perjalanan di Indonesia.

Saya lagi cari beberapa early tester yang mau coba versi awal NusantaraGo dan kasih feedback jujur, supaya kita bisa bikin produk yang benar-benar kepake buat traveler Indonesia.

Dengan NusantaraGo, kamu bisa:
• Generate itinerary lengkap pakai AI (destinasi, durasi, budget)
• Dapet rekomendasi hidden gems & tempat lokal
• Simpan & kelola rencana trip kamu di satu tempat

🎁 Sebagai apresiasi:
• Akses awal ke fitur baru
• 3 bulan akses Premium gratis saat official launch

Kalau kamu tertarik:
1. Balas email ini dengan: “Mau ikut beta”
2. Nanti saya kirim link + panduan install dan pakainya

Terima kasih banget kalau kamu mau bantu saya di fase awal ini 🙏

Salam,
Daffa Dhiyaulhaq Khadafi
Founder & CEO, NusantaraGo
daffa@nusantarago.id
```

**Guideline penggunaan:**
- Kirim ke teman, komunitas, dan kontak yang potensial sebagai beta tester.  
- Personalize `[Nama]`.  
- Bisa disimpan sebagai Gmail Template: *Nusa – Beta Invitation*.

---

## 4. TEMPLATE – BETA WELCOME & ONBOARDING

**From:** `beta@nusantarago.id`  
**Subject:**
- `Welcome ke NusantaraGo Beta 👋`
- `Terima kasih sudah join beta NusantaraGo!`

```text
Halo [Nama],

Terima kasih sudah mau join sebagai beta tester NusantaraGo 🙌

Berikut detail singkat supaya kamu bisa langsung coba:

1. Download & Akses
   • Link: [link app / web]
   • Login pakai email ini: [email mereka]

2. Yang bisa kamu coba dulu:
   • AI Itinerary Generator → coba buat rencana trip ke kota yang kamu minati
   • Simpan itinerary → cek di halaman “Trip Saya”
   • Kasih catatan kalau ada yang membingungkan

3. Cara kasih feedback:
   • Balas email ini dengan format:
     - Device yang dipakai:
     - Yang kamu suka:
     - Yang bikin bingung / error:
   • Atau isi form singkat: [link Google Form]

🎁 Nanti saat kita resmi launch, kamu akan dapat:
• Badge “Early Explorer”
• 3 bulan Premium gratis

Terima kasih sekali lagi, bantuanmu sangat berarti untuk masa depan NusantaraGo 🙏

Salam,
Daffa
Founder, NusantaraGo
beta@nusantarago.id
```

---

## 5. TEMPLATE – BETA FEEDBACK / NPS

**From:** `beta@nusantarago.id` atau `support@nusantarago.id`  
**Subject:**
- `Boleh minta 2 menit untuk feedback NusantaraGo? 🙂`

```text
Halo [Nama],

Terima kasih sudah mencoba NusantaraGo 🙏
Saya ingin minta waktu 2 menit untuk feedback singkat.

1. Seberapa mungkin kamu merekomendasikan NusantaraGo ke teman? (0–10)
2. Apa yang paling kamu suka?
3. Apa yang paling bikin kamu terganggu / bingung?

Kamu bisa:
• Balas langsung email ini, atau
• Isi form singkat: [link form]

Feedback dari kamu akan sangat membantu kami memprioritaskan fitur dan perbaikan sebelum public launch.

Terima kasih banyak 🙌

Daffa
Founder, NusantaraGo
```

---

## 6. TEMPLATE – PARTNER / KOMUNITAS OUTREACH

**From:** `daffa@nusantarago.id`  
**Subject:**
- `Kolaborasi NusantaraGo x [Nama Partner]?`
- `Potensi kerja sama promosi destinasi [Kota/Daerah]`

```text
Halo [Nama PIC],

Perkenalkan, saya Daffa – founder NusantaraGo, AI travel companion untuk traveler Indonesia.

Kami sedang membangun ekosistem perjalanan yang fokus ke:
• Rekomendasi itinerary yang relevan untuk wisatawan domestik
• Promosi hidden gems & bisnis lokal
• Fitur komunitas untuk sharing pengalaman trip

Saya melihat [bisnis/komunitas Anda] di [konteks: Instagram, event, rekomendasi teman] dan merasa ada potensi kolaborasi, misalnya:
• Menampilkan [hotel/tour/komunitas] Anda di rekomendasi NusantaraGo
• Memberi voucher khusus untuk user kami
• Mengajak komunitas Anda untuk jadi early adopter

Kalau berkenan, saya ingin ajak ngobrol 20–30 menit via Zoom/Google Meet minggu ini atau depan.

Waktu yang fleksibel untuk saya:
• [Hari, jam]
• [Hari, jam]

Bisa share waktu yang cocok untuk Anda?

Terima kasih sebelumnya 🙏

Salam,
Daffa Dhiyaulhaq Khadafi
Founder & CEO, NusantaraGo
daffa@nusantarago.id
```

---

## 7. TEMPLATE – INVESTOR INTRO (LIGHT)

**From:** `daffa@nusantarago.id`  
**Subject:**
- `Introducing NusantaraGo – AI Travel Companion for Indonesia`

```text
Hi [Nama Investor],

Perkenalkan, saya Daffa, founder NusantaraGo – AI-powered travel companion khusus untuk pasar Indonesia.

📌 Problem:
• Planning trip masih manual, makan waktu, dan sering berujung ke tourist trap.
• Traveler Indonesia belum punya “superapp” travel yang fokus ke local insight + komunitas.

🚀 Solusi:
NusantaraGo menggabungkan:
• AI itinerary generator (hidden gems + local tips)
• Trip management (itinerary, tiket, budget)
• Social & gamification untuk komunitas traveler

📊 Status Saat Ini:
• Prototype web sudah berjalan (AI itinerary, trip saving)
• Sedang menyusun roadmap menuju mobile app & beta launch (2025)
• Sedang validasi dengan early users & komunitas

🎯 Ask:
Saat ini saya belum dalam mode fundraising formal, tapi sangat terbuka untuk:
• Feedback terhadap product & strategi
• Masukan tentang apa yang dicari investor di TravelTech Indonesia
• Potensi hubungan jangka panjang untuk next round

Jika berkenan, saya sangat senang bisa dapat 20–30 menit waktu Anda.

Terima kasih sebelumnya 🙏

Best,
Daffa Dhiyaulhaq Khadafi
Founder & CEO, NusantaraGo
 daffa@nusantarago.id
```

---

## 8. TEMPLATE – SUPPORT FIRST RESPONSE

**From:** `support@nusantarago.id`  
**Subject:** (reply ke user)

```text
Halo [Nama],

Terima kasih sudah menghubungi NusantaraGo dan melaporkan masalah ini 🙏

Saya sudah membaca pesan kamu dan saat ini kami:
• [Sedang menginvestigasi / sudah mengetahui bug-nya]
• Perkiraan waktu perbaikan: [estimasi kalau ada]

Sambil menunggu, kamu bisa coba:
• [Workaround singkat jika ada]
• Atau kirimkan detail tambahan:
  - Tipe perangkat (Android/iOS + versi)
  - Screenshot / screen recording (jika memungkinkan)

Kami akan update lagi lewat email ini begitu ada progres.

Terima kasih sudah bantu kami membuat NusantaraGo jadi lebih baik 🙌

Salam,
[Nama]
NusantaraGo Support
support@nusantarago.id
```

---

## 9. TEMPLATE – UPDATE / RELEASE NOTE KE BETA LIST

**From:** `beta@nusantarago.id` atau `hello@nusantarago.id`  
**Subject:**
- `NusantaraGo v0.x – Fitur baru berdasarkan feedback kamu 🚀`

```text
Halo [Nama],

Mau update singkat soal progres NusantaraGo – dan mengucapkan terima kasih 🎉

Berkat feedback dari kamu dan beta tester lain, kami baru saja merilis:
• [Fitur 1] – [penjelasan singkat]
• [Fitur 2] – [penjelasan singkat]
• [Perbaikan penting] – [bug/UX yang sudah fixed]

Apa yang bisa kamu coba hari ini:
1. [Langkah 1]
2. [Langkah 2]

Roadmap berikutnya:
• [Hal besar yang lagi dikerjakan]
• [Target waktu kira-kira]

Kalau sempat, sangat berharga kalau kamu bisa:
• Coba fitur baru ini
• Balas email ini dengan feedback / kendala yang kamu temui

Terima kasih sudah jadi bagian awal perjalanan NusantaraGo 🙏

Daffa
Founder, NusantaraGo
```

---

## 10. SIGNATURE STANDAR

### 10.1 Founder (Daffa)

```text
Daffa Dhiyaulhaq Khadafi
Founder & CEO, NusantaraGo

📧 daffa@nusantarago.id
🌐 nusantarago.id
📱 +62 [Nomor HP]

🚀 Jelajah Nusantara, AI Temanmu
```

### 10.2 Support

```text
NusantaraGo Support Team
support@nusantarago.id

Kami siap membantu Anda 🤝
Jam operasional: Senin–Jumat, 09:00–18:00 WIB
```

---

## 11. CARA SIMPAN SEBAGAI GMAIL TEMPLATE

1. Buka Gmail di browser.  
2. Settings → Lanjutan → aktifkan **Template** → Simpan.  
3. Compose email baru, paste salah satu template dari dokumen ini.  
4. Klik `⋮` (More) → Template → *Save draft as template* → *Save as new template*.  
5. Beri nama jelas, contoh: `Nusa – Beta Invite`, `Nusa – Support First Response`.  
6. Saat ingin pakai, klik Compose → `⋮` → Template → pilih template yang diinginkan.

---

## 12. BRAND CONSISTENCY RULES

- Selalu gunakan alamat pengirim yang sesuai konteks:
  - Investor/partner: `daffa@nusantarago.id`.
  - Pengguna / masalah teknis: `support@nusantarago.id`.
  - Beta tester: `beta@nusantarago.id`.
  - Kontak umum / media: `hello@nusantarago.id`.
- Gunakan bahasa yang:
  - Ramah, jelas, tidak terlalu formal.
  - Selalu ada ucapan terima kasih.
  - Menjaga identitas brand: *Jelajah Nusantara, AI Temanmu*.
