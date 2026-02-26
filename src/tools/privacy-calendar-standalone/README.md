# Privacy Calendar 2026 - Standalone Version

## Overview

This is a **completely standalone** version of the Privacy Calendar designed as a **freemium New Year gift** for LinkedIn audience. It can be embedded, deployed separately, or used as a demo tool.

## Key Features

✅ **Fully Standalone**
- No dependency on SocialCaution routing
- Built-in persona selection
- Self-contained localStorage utilities
- Can work independently

✅ **Freemium Model**
- 100% free calendar generation
- No sign-up required
- Works offline
- Subtle upsell to SocialCaution

✅ **Three Views**
- **Landing Page**: Hero section with value proposition
- **Persona Selection**: Built-in persona picker
- **Calendar View**: Full calendar functionality

## Route

Access at: `/privacy-calendar-standalone`

## File Structure

```
src/tools/privacy-calendar-standalone/
├── StandaloneCalendarApp.jsx    # Main app (no router)
├── components/
│   └── PersonaSelector.jsx      # Built-in persona selection
├── data/
│   └── personas.js               # Simplified persona data
├── utils/
│   └── localStorage.js           # Standalone localStorage hook
└── styles/
    └── StandaloneCalendar.css    # Standalone styles
```

## Differences from Integrated Version

| Feature | Integrated | Standalone |
|---------|-----------|------------|
| Routing | Uses React Router | Internal state navigation |
| Persona Selection | Links to `/persona-selection` | Built-in component |
| localStorage Hook | Uses main app hook | Own standalone hook |
| Data Keys | `privacy-calendar-2026` | `standalone-calendar-2026` |
| Purpose | Landing page for main app | Freemium demo/gift |

## Usage

### For Users

1. Visit `/privacy-calendar-standalone`
2. Click "Get Your Free Calendar"
3. Select your privacy persona
4. Calendar auto-generates
5. Browse months, complete tasks, track progress
6. Export to calendar apps

### For Developers

- **Completely isolated** from main app
- Uses shared calendar components from integrated version
- Can be removed without impacting main app
- Can be embedded in other sites
- Can be deployed as separate app

## Data Storage

Uses separate localStorage keys:
- `standalone-persona` - Selected persona
- `standalone-calendar-2026` - Calendar data
- `standalone-completed-tasks` - Task completion
- `standalone-score-history` - Score tracking

## Integration with Main App

- **Reads**: Nothing from main app
- **Writes**: Only to standalone localStorage keys
- **Links**: External link to socialcaution.com (upsell)

## Deployment Options

1. **As Route**: Already configured in App.tsx
2. **As Embed**: Can be embedded via iframe
3. **As Standalone**: Can be extracted to separate app
4. **As Demo**: Perfect for demos and presentations

## Notes

- Designed as freemium New Year gift
- No dependencies on main SocialCaution app
- Perfect for LinkedIn audience engagement
- Can coexist with integrated version

