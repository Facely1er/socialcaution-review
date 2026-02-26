import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileCheck, Search, BarChart3, Clock } from 'lucide-react';

const navItems = [
  {
    id: 'overview',
    title: 'Assessment Overview',
    path: '/assessment',
    icon: BarChart3,
    description: 'Choose your assessment type'
  },
  {
    id: 'exposure',
    title: 'Exposure Assessment',
    path: '/assessment/exposure',
    icon: Search,
    description: 'Analyze your digital footprint'
  },
  {
    id: 'rights',
    title: 'Privacy Rights Assessment',
    path: '/assessment/privacy-rights',
    icon: FileCheck,
    description: 'Understand your privacy rights'
  }
];

const AssessmentNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Privacy Assessments</h3>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-start p-3 rounded-lg transition-colors group ${
                isActive(item.path)
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Quick Tips</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Complete assessments in order for best results. Start with exposure assessment to understand your current privacy status.
        </p>
      </div>
    </div>
  );
};

export default AssessmentNav;

