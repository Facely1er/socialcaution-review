# Standalone Privacy Calendar - Demo Test Guide

## ✅ Build Status

**Build Successful!**
- StandaloneCalendarApp compiled: `8.73 kB` (gzipped: `3.04 kB`)
- CSS compiled: `5.41 kB` (gzipped: `1.45 kB`)
- No build errors

## 🧪 Testing Checklist

### 1. Route Access
- [ ] Navigate to `/privacy-calendar-standalone`
- [ ] Page loads without errors
- [ ] No console errors

### 2. Landing Page
- [ ] Hero section displays correctly
- [ ] "New Year Gift 2026" badge visible
- [ ] Title: "Your Personalized Privacy Calendar"
- [ ] Feature list shows 4 items
- [ ] "Get Your Free Calendar" button works
- [ ] "100% Free • No sign-up required • Works offline" text visible
- [ ] SocialCaution upsell section at bottom

### 3. Persona Selection
- [ ] Clicking "Get Your Free Calendar" navigates to persona selection
- [ ] All 9 personas display in grid
- [ ] Persona cards are clickable
- [ ] Selected persona shows badge
- [ ] "Generate My Calendar" button appears when persona selected
- [ ] Back button works

### 4. Calendar Generation
- [ ] Clicking "Generate My Calendar" shows loading state
- [ ] Calendar generates successfully
- [ ] Calendar view displays after generation
- [ ] Current month shows correctly
- [ ] Monthly theme displays
- [ ] Calendar grid shows weeks

### 5. Calendar Functionality
- [ ] Month navigation (prev/next) works
- [ ] Clicking on a week opens task view
- [ ] Tasks display correctly
- [ ] Can mark tasks as complete
- [ ] Progress tracking updates
- [ ] Score history displays
- [ ] Export button works

### 6. Data Persistence
- [ ] Refresh page - persona persists
- [ ] Refresh page - calendar persists
- [ ] Refresh page - completed tasks persist
- [ ] Refresh page - score history persists

### 7. Standalone Verification
- [ ] No dependency on main app routes
- [ ] Works without being logged in
- [ ] Uses separate localStorage keys
- [ ] No errors when main app data missing

## 🚀 Quick Test Commands

### Start Dev Server
```bash
npm run dev
```

### Access Standalone Calendar
```
http://localhost:5173/privacy-calendar-standalone
```

### Clear Test Data
```javascript
// In browser console:
localStorage.removeItem('standalone-persona');
localStorage.removeItem('standalone-calendar-2026');
localStorage.removeItem('standalone-completed-tasks');
localStorage.removeItem('standalone-score-history');
```

## 📊 Expected Behavior

### First Visit
1. User sees landing page
2. Clicks "Get Your Free Calendar"
3. Sees persona selection
4. Selects persona
5. Calendar generates
6. User can interact with calendar

### Return Visit
1. User sees landing page briefly
2. Automatically redirects to calendar (if persona exists)
3. All data persists

## 🐛 Known Issues to Check

- [ ] No console errors
- [ ] No React warnings
- [ ] All imports resolve correctly
- [ ] CSS loads properly
- [ ] Icons display correctly
- [ ] Responsive on mobile
- [ ] Dark mode works (if applicable)

## 📝 Demo Script

### For LinkedIn Audience Demo:

1. **Landing Page**
   - "Start 2026 with a personalized privacy journey"
   - "100% Free • No sign-up required"
   - Show features: 12 themes, weekly tasks, score tracking, export

2. **Persona Selection**
   - "Choose from 9 privacy personas"
   - "Each gets a unique calendar"
   - Select a persona (e.g., "Privacy Advocate")

3. **Calendar Generation**
   - "Generating your personalized calendar..."
   - Show loading state

4. **Calendar View**
   - Navigate through months
   - Show monthly themes
   - Click on a week to show tasks
   - Mark a task complete
   - Show progress tracking

5. **Upsell**
   - "Want more privacy protection?"
   - "Explore SocialCaution for full platform"

## ✅ Success Criteria

- ✅ Builds without errors
- ✅ Loads without errors
- ✅ All features functional
- ✅ Data persists
- ✅ No dependencies on main app
- ✅ Ready for demo

