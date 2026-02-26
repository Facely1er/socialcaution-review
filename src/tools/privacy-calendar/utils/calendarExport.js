/**
 * Calendar Export Utilities
 * Export privacy calendar to various formats (ICS, Google Calendar, etc.)
 */

/**
 * Export calendar to ICS format (iCalendar)
 */
export function exportToICS(calendarData, options = {}) {
  const { year, months, completedTasks, scoreHistory } = calendarData;
  const { completedTasks: userCompletedTasks } = options;
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SocialCaution//Privacy Calendar 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Privacy Calendar 2026',
    'X-WR-CALDESC:Your Year of Digital Security',
    ''
  ];

  // Add events for each week's tasks
  months.forEach((month, monthIndex) => {
    month.weeks.forEach((week, weekIndex) => {
      week.tasks.forEach((task, taskIndex) => {
        const startDate = formatICSDate(week.startDate);
        const endDate = formatICSDate(week.endDate);
        const taskKey = `${monthIndex}-${weekIndex}-${task.id}`;
        const isCompleted = userCompletedTasks?.[taskKey]?.completed || false;
        
        icsContent.push(
          'BEGIN:VEVENT',
          `UID:privacy-calendar-${year}-${monthIndex}-${weekIndex}-${taskIndex}@ermits.com`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          `SUMMARY:${task.title}`,
          `DESCRIPTION:${task.description}\\n\\nEstimated Time: ${task.estimatedTime}\\nDifficulty: ${task.difficulty}\\nImpact: ${task.impact}${isCompleted ? '\\n\\n✅ Completed' : ''}`,
          `LOCATION:${month.focus}`,
          `STATUS:${isCompleted ? 'CONFIRMED' : 'TENTATIVE'}`,
          `PRIORITY:${getPriorityFromImpact(task.impact)}`,
          'END:VEVENT',
          ''
        );
      });
    });
  });

  icsContent.push('END:VCALENDAR');

  // Download file
  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Privacy-Calendar-${year}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export to Google Calendar (opens Google Calendar with pre-filled data)
 */
export function exportToGoogleCalendar(calendarData, options = {}) {
  const { year, months } = calendarData;
  
  // Create a simplified ICS file and open Google Calendar
  const events = [];
  
  months.forEach((month, monthIndex) => {
    month.weeks.forEach((week, weekIndex) => {
      week.tasks.forEach((task) => {
        const startDate = formatGoogleCalendarDate(week.startDate);
        const endDate = formatGoogleCalendarDate(week.endDate);
        
        const eventUrl = new URL('https://calendar.google.com/calendar/render');
        eventUrl.searchParams.set('action', 'TEMPLATE');
        eventUrl.searchParams.set('text', task.title);
        eventUrl.searchParams.set('dates', `${startDate}/${endDate}`);
        eventUrl.searchParams.set('details', task.description);
        eventUrl.searchParams.set('location', month.focus);
        
        events.push(eventUrl.toString());
      });
    });
  });

  // For now, export ICS (Google Calendar can import ICS)
  exportToICS(calendarData, options);
}

/**
 * Export to JSON (for backup/restore)
 */
export function exportToJSON(calendarData, options = {}) {
  const exportData = {
    calendar: calendarData,
    exportDate: new Date().toISOString(),
    options
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Privacy-Calendar-${calendarData.year}-backup.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Format date for ICS
 */
function formatICSDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Format date for Google Calendar
 */
function formatGoogleCalendarDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return formatICSDate(date).replace(/[-:]/g, '');
}

/**
 * Get priority from impact level
 */
function getPriorityFromImpact(impact) {
  const priorityMap = {
    high: 1,
    medium: 5,
    low: 9
  };
  
  return priorityMap[impact] || 5;
}

/**
 * Main export function
 */
const CalendarExport = {
  exportCalendar: (calendarData, format, options = {}) => {
    switch (format.toLowerCase()) {
      case 'ics':
      case 'ical':
        exportToICS(calendarData, options);
        break;
      case 'google':
      case 'googlecalendar':
        exportToGoogleCalendar(calendarData, options);
        break;
      case 'json':
        exportToJSON(calendarData, options);
        break;
      default:
        console.warn(`Unknown export format: ${format}. Defaulting to ICS.`);
        exportToICS(calendarData, options);
    }
  }
};

export default CalendarExport;

