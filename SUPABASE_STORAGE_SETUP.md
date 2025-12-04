# 🗄️ SUPABASE STORAGE SETUP - Profile Pictures

## 📋 QUICK SETUP GUIDE

### **STEP 1: Create Storage Bucket**

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/hjmgoppcbqnxciqyixdf
   ```

2. **Navigate to Storage:**
   ```
   Sidebar → Storage
   ```

3. **Create New Bucket:**
   ```
   Click "New bucket"
   
   Bucket name: profile-pictures
   Public bucket: ✅ YES (checked)
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/*
   
   Click "Create bucket"
   ```

---

### **STEP 2: Configure Bucket Policies**

Bucket should be public by default, but verify:

1. **Click on `profile-pictures` bucket**

2. **Go to Policies tab**

3. **Should have these policies:**
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'profile-pictures' );
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'profile-pictures' 
     AND auth.role() = 'authenticated'
   );
   
   -- Allow users to update their own files
   CREATE POLICY "Users can update own files"
   ON storage.objects FOR UPDATE
   USING ( auth.uid()::text = (storage.foldername(name))[1] );
   
   -- Allow users to delete their own files
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   USING ( auth.uid()::text = (storage.foldername(name))[1] );
   ```

---

### **STEP 3: Test Upload**

1. **Go to bucket**
2. **Click "Upload file"**
3. **Select an image**
4. **Should upload successfully**
5. **Click on file → Get public URL**
6. **URL should work in browser**

---

## ✅ VERIFICATION CHECKLIST:

- [ ] Bucket `profile-pictures` created
- [ ] Public access enabled
- [ ] File size limit: 5MB
- [ ] MIME types: image/*
- [ ] Policies configured
- [ ] Test upload works
- [ ] Public URL accessible

---

## 🔒 SECURITY NOTES:

**Public Bucket = Safe!**
- ✅ Anyone can VIEW uploaded images (that's the point!)
- ✅ Only authenticated users can UPLOAD
- ✅ Users can only DELETE their own files
- ✅ File size limited to 5MB
- ✅ Only images allowed

**This is standard for profile pictures!**

---

## 🐛 TROUBLESHOOTING:

### **Issue: Upload fails with "Bucket not found"**
**Solution:** Create the bucket first!

### **Issue: Upload fails with "Permission denied"**
**Solution:** Check policies are configured correctly

### **Issue: Image not loading**
**Solution:** Verify bucket is set to PUBLIC

### **Issue: File too large**
**Solution:** Increase file size limit or compress image

---

## 📝 DONE!

After setup, profile picture upload will work automatically! ✅

**Time needed:** ~5 minutes
