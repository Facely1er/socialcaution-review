import React, { useState } from 'react';
import { CheckCircle, Clock, Target, X, AlertCircle } from 'lucide-react';

const WeeklyTaskView = ({ week, weekIndex, monthIndex, completedTasks, onTaskComplete, onClose }) => {
  if (!week) return null;

  const isTaskCompleted = (taskId) => {
    const key = `${monthIndex}-${weekIndex}-${taskId}`;
    return completedTasks[key]?.completed || false;
  };

  const handleTaskToggle = (taskId) => {
    if (!isTaskCompleted(taskId)) {
      onTaskComplete(taskId, monthIndex, weekIndex);
    }
  };

  const completedCount = week.tasks.filter(task => isTaskCompleted(task.id)).length;
  const totalTasks = week.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Week {week.weekNumber} Tasks</h2>
            <p className="text-gray-600 dark:text-gray-400">{week.focus}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label="Close">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress: {completedCount} / {totalTasks} tasks</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
            <div 
              className="bg-purple-500 h-3 rounded-full transition-all" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {week.tasks.map((task) => {
            const completed = isTaskCompleted(task.id);
            
            return (
              <div 
                key={task.id} 
                className={`bg-gray-50 dark:bg-slate-700 rounded-xl p-5 border-2 transition-all ${
                  completed 
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleTaskToggle(task.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-slate-500 rounded-full" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      completed ? 'text-gray-600 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${getDifficultyColor(task.difficulty)}`}>
                        <span>Difficulty:</span>
                        <span className="capitalize font-semibold">{task.difficulty}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${getImpactColor(task.impact)}`}>
                        <span>Impact:</span>
                        <span className="capitalize font-semibold">{task.impact}</span>
                      </div>
                    </div>

                    {task.relevantServices && task.relevantServices.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Relevant to:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {task.relevantServices.map((serviceId, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {serviceId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {completionPercentage === 100 && (
          <div className="bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 p-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-green-700 dark:text-green-300 font-semibold">
              Congratulations! You've completed all tasks for this week.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTaskView;

