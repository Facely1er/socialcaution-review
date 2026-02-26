import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ScoreHistoryTracker = ({ scoreHistory, currentMonth, currentYear }) => {
  if (!scoreHistory || scoreHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Privacy Score Progress</h3>
        <p className="text-gray-600 dark:text-gray-400">Complete tasks to see your privacy score improve over time.</p>
      </div>
    );
  }

  // Sort by year and month
  const sortedHistory = [...scoreHistory].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const currentEntry = sortedHistory.find(entry => 
    entry.month === currentMonth && entry.year === currentYear
  );

  const getScoreChange = (index) => {
    if (index === 0) return null;
    const prev = sortedHistory[index - 1];
    const current = sortedHistory[index];
    return current.score - prev.score;
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="trend-icon up" />;
    if (change < 0) return <TrendingDown className="trend-icon down" />;
    return <Minus className="trend-icon neutral" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Score Progress</h3>
        {currentEntry && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current Score:</span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentEntry.score}/100</span>
          </div>
        )}
      </div>

      <div className="flex items-end gap-4 mb-6 overflow-x-auto pb-4">
        {sortedHistory.map((entry, index) => {
          const change = getScoreChange(index);
          const isCurrent = entry.month === currentMonth && entry.year === currentYear;
          
          return (
            <div 
              key={`${entry.year}-${entry.month}`}
              className={`flex flex-col items-center gap-2 min-w-[80px] ${isCurrent ? 'opacity-100' : 'opacity-80'}`}
            >
              <div className="relative w-full h-32 flex items-end justify-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 dark:from-purple-600 dark:to-purple-500 rounded-t-lg transition-all"
                  style={{ height: `${entry.score}%` }}
                />
                <span className="absolute -top-6 text-sm font-bold text-gray-900 dark:text-white">{entry.score}</span>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{entry.monthName}</div>
                {change !== null && (
                  <div className={`flex items-center justify-center gap-1 text-xs ${
                    change > 0 ? 'text-green-600 dark:text-green-400' : 
                    change < 0 ? 'text-red-600 dark:text-red-400' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    {getTrendIcon(change)}
                    <span>{change > 0 ? '+' : ''}{change}</span>
                  </div>
                )}
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {entry.completedTasks}/{entry.totalTasks} tasks
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedHistory.length > 1 && (
        <div className="flex justify-around items-center pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting Score</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{sortedHistory[0].score}/100</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Latest Score</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{sortedHistory[sortedHistory.length - 1].score}/100</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Improvement</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              +{sortedHistory[sortedHistory.length - 1].score - sortedHistory[0].score} points
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreHistoryTracker;

