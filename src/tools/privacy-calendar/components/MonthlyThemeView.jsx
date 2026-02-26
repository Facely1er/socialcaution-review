import React from 'react';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';

const MonthlyThemeView = ({ theme, monthData, monthIndex, year }) => {
  if (!theme || !monthData) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-l-4 p-6 sm:p-8 mb-6" style={{ borderLeftColor: theme.color }}>
      {/* Theme Header */}
      <div className="flex items-start gap-4 sm:gap-6 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: `${theme.color}20` }}>
          {theme.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {theme.name}
          </h2>
          <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {theme.focus}
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {theme.description}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Goal</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{monthData.monthlyGoal}</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Expected Impact</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">+{monthData.expectedImpact} points</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(monthData.estimatedTotalTime / 60)} hours</p>
        </div>

        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{monthData.difficulty}</p>
        </div>
      </div>

      {/* Weeks Overview */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">This Month's Plan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monthData.weeks?.map((week, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">Week {week.weekNumber}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{week.tasks.length} tasks</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{week.focus}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{week.estimatedTime} minutes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyThemeView;

