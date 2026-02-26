# ⚡ Quick Asset Creation Reference

**Quick start guide for creating App Store assets**

---

## 🚀 3-Step Process

### 1️⃣ Prepare & Open
```bash
./scripts/prepare-for-screenshots.sh
```
Opens Xcode ready for screenshots.

### 2️⃣ Capture in Xcode
- Select device (start with "iPhone 15 Pro Max")
- Run app (`Cmd + R`)
- Navigate to screen
- Capture (`Cmd + S`)
- Repeat for all 5 screens × 5 device sizes

### 3️⃣ Organize & Verify
```bash
./scripts/organize-screenshots.sh
./scripts/verify-screenshots.sh
```

---

## 📱 Device Quick Reference

| Size | Simulator | Dimensions |
|------|-----------|------------|
| 6.7" | iPhone 15 Pro Max | 1290 × 2796 |
| 6.5" | iPhone 13 Pro Max | 1284 × 2778 |
| 5.5" | iPhone 8 Plus | 1242 × 2208 |
| 12.9" | iPad Pro (12.9") | 2048 × 2732 |
| 11" | iPad Pro (11") | 1668 × 2388 |

---

## 📸 5 Screens to Capture

1. **Dashboard** - Main home screen
2. **Service Catalog** - Services with privacy scores
3. **Assessment** - Assessment in progress
4. **Exposure Index** - Risk scores display
5. **Recommendations** - Personalized recommendations

---

## ✅ Checklist

- [ ] All 5 screens captured
- [ ] All 5 device sizes completed
- [ ] Screenshots organized
- [ ] Dimensions verified
- [ ] Ready for App Store Connect upload

---

**Full Guide:** See `APP_STORE_ASSETS_GUIDE.md`

