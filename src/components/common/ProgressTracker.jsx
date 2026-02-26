import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Target, Zap } from 'lucide-react';

const ProgressTracker = ({ 
  tasks = [], 
  onTaskComplete, 
  title = "Your Progress",
  showCelebration = true 
}) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const completedCount = completedTasks.size;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleTaskToggle = (taskId) => {
    const newCompletedTasks = new Set(completedTasks);
    
    if (newCompletedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
      
      // Show celebration for milestone achievements
      if (showCelebration && newCompletedTasks.size % 3 === 0 && newCompletedTasks.size > completedTasks.size) {
        setShowCelebrationModal(true);
        setTimeout(() => setShowCelebrationModal(false), 3000);
      }
    }
    
    setCompletedTasks(newCompletedTasks);
    onTaskComplete?.(taskId, newCompletedTasks.has(taskId));
  };

  const getProgressColor = () => {
    if (progressPercentage >= 80) return 'from-green-500 to-emerald-500';
    if (progressPercentage >= 60) return 'from-blue-500 to-cyan-500';
    if (progressPercentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getTaskPriority = (task) => {
    if (task.priority === 'high') return { icon: Zap, color: 'text-red-500', bg: 'bg-red-100' };
    if (task.priority === 'medium') return { icon: Target, color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { icon: Circle, color: 'text-blue-500', bg: 'bg-blue-100' };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-500">completed</div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
              className="progress-ring transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-gray-500">complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const isCompleted = completedTasks.has(task.id);
          const { icon: PriorityIcon, color, bg } = getTaskPriority(task);
          
          return (
            <div
              key={task.id}
              className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
              }`}
              onClick={() => handleTaskToggle(task.id)}
            >
              <div className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${bg} ${color}`}>
                  <PriorityIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${isCompleted ? 'text-green-900 dark:text-green-100 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                  <p className={`text-sm ${isCompleted ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    {task.description}
                  </p>
                  {task.timeEstimate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Est. {task.timeEstimate}
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 animate-pulse" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievement Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center animate-bounce max-w-sm">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Milestone Reached! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You've completed {completedCount} privacy improvements!
            </p>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-center text-white">
          <Trophy className="w-8 h-8 mx-auto mb-2 animate-bounce" />
          <h4 className="font-bold">Congratulations!</h4>
          <p className="text-sm opacity-90">You've completed all privacy improvements!</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;