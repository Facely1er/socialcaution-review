# 🚀 Quick Start: Android Screenshots

**Status:** ✅ App built and synced - Ready for Android Studio

---

## 📋 What's Done

- [x] Web app built
- [x] Capacitor assets synced to Android
- [x] Android project ready

---

## 🎯 Next Steps (5 minutes)

### 1. Open Android Studio

**Option A: Auto-open (if available)**
- Android Studio should open automatically
- If not, continue with Option B

**Option B: Manual open**
1. Open Android Studio
2. **File → Open**
3. Navigate to: `C:\Users\facel\Downloads\GitHub\ERMITS_PRODUCTION\08-SocialCaution\android`
4. Click **OK**
5. Wait for Gradle sync (may take 1-2 minutes)

---

### 2. Create/Select Emulator

1. **Open Device Manager:**
   - Click **Device Manager** icon in toolbar
   - Or: **Tools → Device Manager**

2. **Create Emulator (if needed):**
   - Click **Create Device**
   - Select: **Pixel 5** (or Pixel 6/7)
   - System Image: **API 33+** (Android 13+)
   - Click **Next** → **Finish**

3. **Start Emulator:**
   - Click **Play** button next to your emulator
   - Wait for emulator to boot (30-60 seconds)

---

### 3. Run Your App

1. **Select emulator** from device dropdown (top toolbar)

2. **Run app:**
   - Click **Run** button (green play icon ▶️)
   - Or press **Shift+F10**
   - Wait for app to build and launch

3. **Verify app opens:**
   - You should see SocialCaution app on emulator

---

### 4. Capture Screenshots

For each screen:

1. **Navigate to screen** (see list below)
2. **Wait 2-3 seconds** for content to load
3. **Take screenshot:**
   - Click **camera icon** in emulator toolbar (right side)
   - Or: Click **"..."** (three dots) → **Screenshot**
4. **Screenshot saves automatically**

**Screens to capture (minimum 2, recommended 4-6):**

1. ✅ **Home Page** - Landing page (default screen)
2. ✅ **Dashboard** - Main dashboard (`/dashboard`)
3. ✅ **Service Catalog** - Service cards (`/service-catalog`)
4. ✅ **Assessment** - Assessment interface (`/assessment/exposure`)
5. ✅ **Privacy Radar** - Alerts (`/privacy-radar`)
6. ✅ **Results** - Assessment results (complete assessment first)

---

### 5. Organize Screenshots

1. **Find screenshots:**
   - Usually saved to: `C:\Users\facel\Pictures` or Desktop
   - Filename: `Screenshot_[timestamp].png`

2. **Move to project folder:**
   ```
   assets/android-screenshots/phone/
   ```

3. **Rename screenshots:**
   - `1-home-android.png`
   - `2-dashboard-android.png`
   - `3-service-catalog-android.png`
   - `4-assessment-android.png`
   - `5-privacy-radar-android.png`
   - `6-results-android.png`

---

## ✅ Verification

Check each screenshot:

- [ ] Dimensions: 1080x1920 or similar (9:16 portrait)
- [ ] Format: PNG
- [ ] File size: Under 8 MB
- [ ] Content: Shows correct app screen
- [ ] Quality: Text is readable

**If dimensions are wrong:**
- Use resize script: `.\scripts\resize-ios-to-android.ps1`

---

## 📤 Upload to Play Console

1. Go to: **Play Console → Store listing → Phone screenshots**
2. Upload 4-6 screenshots
3. Arrange in order: Home → Dashboard → Catalog → Assessment → Radar → Results

---

## ⏱️ Estimated Time

- **Setup:** 5 minutes
- **Capture:** 10-15 minutes
- **Organize:** 5 minutes
- **Total:** 20-30 minutes

---

## 🆘 Need Help?

- **Full guide:** `ANDROID_STUDIO_SCREENSHOTS_STEPS.md`
- **Troubleshooting:** See guide for common issues
- **Resize script:** `.\scripts\resize-ios-to-android.ps1`

---

**Status:** ✅ Ready to capture screenshots in Android Studio!

Good luck! 🎉
