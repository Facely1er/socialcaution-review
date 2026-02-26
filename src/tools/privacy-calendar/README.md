# Privacy Calendar 2026 - Standalone Tool

## Overview

The Privacy Calendar 2026 is a **standalone tool** designed for LinkedIn audience engagement. It provides a personalized 12-month privacy improvement journey with monthly themes, weekly tasks, and progress tracking.

## Location

This tool is completely isolated in: `src/tools/privacy-calendar/`

## Features

✅ **12-Month Calendar Structure**
- Monthly themes (January: Banking, February: Social Media, etc.)
- Weekly task breakdown
- Calendar grid view
- Month navigation

✅ **Personalized Content**
- Generates calendar based on user's persona, services, and assessment results
- Risk-based task prioritization
- Service-specific recommendations

✅ **Progress Tracking**
- Task completion tracking
- Privacy score history
- Monthly score improvements
- Visual progress indicators

✅ **Calendar Export**
- Export to ICS format (iCalendar)
- Compatible with Google Calendar, Outlook, Apple Calendar
- JSON backup/restore

## Route

Access the tool at: `/privacy-calendar`

## File Structure

```
src/tools/privacy-calendar/
├── PrivacyCalendarPage.jsx      # Main page component
├── components/
│   ├── CalendarView.jsx          # Calendar grid display
│   ├── MonthlyThemeView.jsx     # Monthly theme display
│   ├── WeeklyTaskView.jsx        # Weekly task details
│   └── ScoreHistoryTracker.jsx   # Score progress visualization
├── data/
│   ├── monthlyThemes.js          # Monthly theme definitions
│   └── weeklyTasks.js            # Task templates
├── utils/
│   ├── calendarGenerator.js      # Calendar generation logic
│   └── calendarExport.js         # Export functionality
└── styles/
    └── PrivacyCalendar.css       # Component styles
```

## Usage

### For Users

1. Navigate to `/privacy-calendar`
2. Calendar auto-generates based on your:
   - Selected persona
   - Selected services
   - Assessment results (if available)
3. Browse months using navigation arrows
4. Click on weeks to view tasks
5. Mark tasks as complete
6. Track privacy score improvements
7. Export calendar to your preferred calendar app

### For Developers

The tool is **completely isolated** from the main codebase:
- Uses existing hooks (`useLocalStorage`) but doesn't modify core components
- Stores data in separate localStorage keys:
  - `privacy-calendar-2026` - Calendar data
  - `privacy-calendar-completed` - Completed tasks
  - `privacy-score-history` - Score history
- Can be removed without impacting main app

## Data Flow

1. **Generation**: Reads user data from main app's localStorage
2. **Personalization**: Generates calendar based on user context
3. **Storage**: Saves to isolated localStorage keys
4. **Updates**: Updates scores and progress as tasks are completed

## Integration Points

The tool reads (but doesn't modify) these main app data:
- `socialcaution_persona` - User's privacy persona
- `socialcaution_services` - Selected services
- `socialcaution_results` - Assessment results

## Future Enhancements

- [ ] Reminder notifications
- [ ] Achievement badges
- [ ] Year-end review dashboard
- [ ] Family calendar coordination
- [ ] Corporate/team calendars

## Notes

- This is a **standalone tool** for LinkedIn audience
- Does not impact main codebase functionality
- Can be safely removed or modified independently
- Designed for 2026, but can be extended for future years

