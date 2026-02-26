import React from 'react';
import { Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';

const CalendarView = ({ month, year, monthData, completedTasks, onWeekSelect }) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();
  
  // Create calendar grid
  const weeks = [];
  let currentWeek = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Fill remaining week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(null);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getWeekCompletion = (weekIndex) => {
    if (!monthData?.weeks?.[weekIndex]) return 0;
    
    const week = monthData.weeks[weekIndex];
    const totalTasks = week.tasks.length;
    if (totalTasks === 0) return 0;
    
    const completed = week.tasks.filter(task => {
      const key = `${month}-${weekIndex}-${task.id}`;
      return completedTasks[key]?.completed;
    }).length;
    
    return Math.round((completed / totalTasks) * 100);
  };

  const handleWeekClick = (weekIndex) => {
    if (monthData?.weeks?.[weekIndex]) {
      onWeekSelect(weekIndex);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8 mb-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Calendar View</h3>
        <p className="text-gray-600 dark:text-gray-400">Click on a week to view tasks</p>
      </div>
      
      <div className="mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar weeks */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => {
            const completion = getWeekCompletion(weekIndex);
            const hasTasks = monthData?.weeks?.[weekIndex]?.tasks?.length > 0;
            
            return (
              <div 
                key={weekIndex} 
                className={`grid grid-cols-7 gap-2 p-2 rounded-lg transition-all ${
                  hasTasks ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700' : ''
                } ${
                  completion === 100 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700' : 
                  hasTasks ? 'border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600' : ''
                }`}
                onClick={() => hasTasks && handleWeekClick(weekIndex)}
              >
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`aspect-square flex items-center justify-center rounded-lg ${
                      day ? 'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white' : ''
                    }`}
                  >
                    {day && <span className="text-sm font-medium">{day}</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Week summary */}
      {monthData?.weeks && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Week Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthData.weeks.map((week, weekIndex) => {
              const completion = getWeekCompletion(weekIndex);
              return (
                <div 
                  key={weekIndex}
                  className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    completion === 100 
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                  onClick={() => handleWeekClick(weekIndex)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white">Week {weekIndex + 1}</span>
                    <span className={`text-sm font-semibold ${
                      completion === 100 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        completion === 100 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{week.tasks.length} tasks</span>
                    <span>{week.estimatedTime} min</span>
                  </div>
                  {completion === 100 && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Complete</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;

