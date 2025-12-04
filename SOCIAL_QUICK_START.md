# 🚀 SOCIAL FEATURES - QUICK START

## ⚡ 5-MINUTE SETUP:

### Step 1: Run SQL (2 minutes)

```bash
1. Open: https://app.supabase.com/project/_/sql
2. Copy content from: database/SOCIAL_FEATURES_SCHEMA.sql
3. Paste & Run
4. ✅ Wait for "Success" message
```

### Step 2: Create Storage Buckets (2 minutes)

```bash
1. Open: https://app.supabase.com/project/_/storage
2. Click: "Create bucket" → Name: "posts" → Public: Yes → Save
3. Repeat for: "stories", "avatars", "community-media"
4. ✅ 4 buckets created
```

### Step 3: Set Bucket Policies (1 minute)

For EACH bucket, run this SQL:

```sql
-- Public Read
CREATE POLICY "Public Read" ON storage.objects FOR SELECT
USING (bucket_id = 'BUCKET_NAME');

-- Authenticated Upload
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'BUCKET_NAME' AND auth.role() = 'authenticated');

-- Own Delete
CREATE POLICY "Own Delete" ON storage.objects FOR DELETE
USING (bucket_id = 'BUCKET_NAME' AND auth.uid() = owner);

-- Replace 'BUCKET_NAME' with: posts, stories, avatars, community-media
```

### Step 4: Enable Real-time

```bash
1. Open: https://app.supabase.com/project/_/database/replication
2. Enable for: posts, stories, comments, communities
3. ✅ Save
```

### Step 5: Test

```bash
npm run dev
# Then in browser:
1. Login
2. Click "Social Feed"
3. Upload story
4. Create post
5. ✅ DONE!
```

---

## 📦 FILES CREATED:

```
✅ database/SOCIAL_FEATURES_SCHEMA.sql (complete SQL)
✅ services/socialService.ts (all API functions)
✅ components/SocialFeed.tsx (Instagram-like feed)
✅ components/Communities.tsx (Reddit-like communities)
✅ SOCIAL_FEATURES_SETUP.md (detailed docs)
```

---

## 🎯 FEATURES:

### Social Feed:
- ✅ Story upload (image/video, 24h expiry)
- ✅ Post creation (text, image, video)
- ✅ Like & Comment
- ✅ Real-time updates
- ✅ Real avatars (DiceBear API)

### Communities:
- ✅ 6 pre-seeded travel communities
- ✅ Join/Leave
- ✅ Community posts
- ✅ Verified badges
- ✅ Member count

---

## 🐛 QUICK TROUBLESHOOTING:

### Upload fails?
```
✅ Check bucket exists
✅ Check file size < 50MB
✅ Check user logged in
```

### Posts not showing?
```
✅ Check SQL ran successfully
✅ Check RLS policies active
✅ Hard refresh (Ctrl+Shift+R)
```

### Real-time not working?
```
✅ Enable Replication
✅ Check WebSocket in Network tab
✅ Refresh page
```

---

## 💡 NEXT STEPS:

1. **Test thoroughly** in dev mode
2. **Check storage usage** in Supabase dashboard
3. **Monitor real-time** connections
4. **Customize communities** (edit seed data)
5. **Add more features** (see SOCIAL_FEATURES_SETUP.md)

---

## 📞 NEED HELP?

- 📖 Full docs: `SOCIAL_FEATURES_SETUP.md`
- 💾 Database schema: `database/SOCIAL_FEATURES_SCHEMA.sql`
- 🔧 Service functions: `services/socialService.ts`
- 🎨 Components: `components/SocialFeed.tsx`, `components/Communities.tsx`

---

**READY TO GO!** 🎉

All code is complete. Just run the SQL and create buckets!
