import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Download,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import PersonaSelector from './components/PersonaSelector';
import CalendarView from '../privacy-calendar/components/CalendarView';
import MonthlyThemeView from '../privacy-calendar/components/MonthlyThemeView';
import WeeklyTaskView from '../privacy-calendar/components/WeeklyTaskView';
import ScoreHistoryTracker from '../privacy-calendar/components/ScoreHistoryTracker';
import { generatePersonalizedCalendar } from '../privacy-calendar/utils/calendarGenerator';
import { monthlyThemes } from '../privacy-calendar/data/monthlyThemes';
import { useLocalStorage } from './utils/localStorage';
import CalendarExport from '../privacy-calendar/utils/calendarExport';
import './styles/StandaloneCalendar.css';

const StandaloneCalendarApp = () => {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'persona' | 'calendar'
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [calendarData, setCalendarData] = useLocalStorage('standalone-calendar-2026', null);
  const [scoreHistory, setScoreHistory] = useLocalStorage('standalone-score-history', []);
  const [completedTasks, setCompletedTasks] = useLocalStorage('standalone-completed-tasks', {});
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if user already has persona/calendar
  useEffect(() => {
    const savedPersona = localStorage.getItem('standalone-persona');
    const savedCalendar = localStorage.getItem('standalone-calendar-2026');
    
    if (savedPersona) {
      setSelectedPersona(JSON.parse(savedPersona));
      if (savedCalendar) {
        const parsed = JSON.parse(savedCalendar);
        setCalendarData(parsed);
        setCurrentView('calendar');
      } else {
        setCurrentView('persona');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    localStorage.setItem('standalone-persona', JSON.stringify(persona));
    generateCalendar(persona);
  };

  const generateCalendar = async (persona) => {
    setIsGenerating(true);
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const generated = generatePersonalizedCalendar({
      persona: { primary: persona.id },
      selectedServices: [],
      assessmentResults: null,
      year: 2026
    });
    
    setCalendarData(generated);
    localStorage.setItem('standalone-calendar-2026', JSON.stringify(generated));
    setIsGenerating(false);
    setCurrentView('calendar');
  };

  const handleTaskComplete = (taskId, monthIndex, weekIndex) => {
    const key = `${monthIndex}-${weekIndex}-${taskId}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: {
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));
    updatePrivacyScore(monthIndex);
  };

  const updatePrivacyScore = (monthIndex) => {
    const monthData = calendarData?.months[monthIndex];
    if (!monthData) return;

    const completedCount = Object.keys(completedTasks).filter(key => 
      key.startsWith(`${monthIndex}-`)
    ).length;
    
    const totalTasks = monthData.weeks.reduce((sum, week) => sum + week.tasks.length, 0);
    const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    
    const baseScore = 50; // Default starting score
    const improvement = Math.round(completionRate * (monthData.expectedImpact / 100));
    const newScore = Math.min(100, baseScore + improvement);

    const monthName = new Date(2026, monthIndex, 1).toLocaleString('default', { month: 'long' });
    setScoreHistory(prev => {
      const existing = prev.find(entry => entry.month === monthIndex && entry.year === 2026);
      if (existing) {
        return prev.map(entry => 
          entry.month === monthIndex && entry.year === 2026
            ? { ...entry, score: newScore, updatedAt: new Date().toISOString() }
            : entry
        );
      }
      return [...prev, {
        month: monthIndex,
        monthName,
        year: 2026,
        score: newScore,
        completedTasks: completedCount,
        totalTasks,
        createdAt: new Date().toISOString()
      }];
    });
  };

  const handleExportCalendar = (format) => {
    CalendarExport.exportCalendar(calendarData, format, {
      year: 2026,
      completedTasks,
      scoreHistory
    });
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // LANDING PAGE
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-20 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="hidden sm:block absolute top-0 left-0 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="hidden sm:block absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6 border border-gray-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>New Year Gift 2026</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Your Personalized Privacy Calendar
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 leading-relaxed">
                Start 2026 with a 12-month privacy journey. Get weekly tasks, track your progress, and improve your digital security—completely free.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300">12 monthly privacy themes</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300">Weekly actionable tasks</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300">Privacy score tracking</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-base sm:text-lg text-gray-700 dark:text-gray-300">Export to calendar apps</span>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => setCurrentView('persona')}
                className="btn-interactive group px-8 sm:px-10 md:px-12 py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white text-base sm:text-lg font-bold rounded-xl hover:from-red-700 hover:via-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-red-500/40 min-h-[48px] touch-manipulation mb-4"
              >
                <span className="flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Get Your Free Calendar
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                100% Free • No sign-up required • Works offline
              </p>
            </div>
          </div>
        </section>

        {/* Freemium Upsell */}
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Want More Privacy Protection?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              This calendar is a free gift from <strong className="text-gray-900 dark:text-white">SocialCaution</strong>. 
              Explore our full privacy platform with assessments, service monitoring, and personalized recommendations.
            </p>
            <a 
              href="https://socialcaution.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              Explore SocialCaution
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>
    );
  }

  // PERSONA SELECTION
  if (currentView === 'persona') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('landing')}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Select Your Privacy Persona
              </h1>
            </div>
          </div>
        </div>

        {/* Persona Selection */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PersonaSelector 
              onSelect={handlePersonaSelect}
              selectedPersona={selectedPersona}
            />
          </div>
        </section>
      </div>
    );
  }

  // CALENDAR VIEW
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl mb-6 animate-pulse">
            <CalendarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Generating Your Calendar...
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Creating a personalized privacy journey for {selectedPersona?.name}
          </p>
        </div>
      </div>
    );
  }

  const currentMonthData = calendarData?.months?.[currentMonth];
  const currentTheme = monthlyThemes[currentMonth];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={() => setCurrentView('landing')}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              ← Home
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Privacy Calendar 2026
              </h1>
              {selectedPersona && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                  {selectedPersona.name} Persona
                </span>
              )}
            </div>
            <button 
              onClick={() => handleExportCalendar('ics')}
              className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
          <button 
            onClick={handlePreviousMonth}
            className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {new Date(currentYear, currentMonth, 1).toLocaleString('default', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          
          <button 
            onClick={handleNextMonth}
            className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Monthly Theme View */}
        {currentMonthData && (
          <MonthlyThemeView
            theme={currentTheme}
            monthData={currentMonthData}
            monthIndex={currentMonth}
            year={currentYear}
          />
        )}

        {/* Calendar Grid View */}
        <CalendarView
          month={currentMonth}
          year={currentYear}
          monthData={currentMonthData}
          completedTasks={completedTasks}
          onWeekSelect={setSelectedWeek}
        />

        {/* Weekly Task View */}
        {selectedWeek !== null && currentMonthData && (
          <WeeklyTaskView
            week={currentMonthData.weeks[selectedWeek]}
            weekIndex={selectedWeek}
            monthIndex={currentMonth}
            completedTasks={completedTasks}
            onTaskComplete={handleTaskComplete}
            onClose={() => setSelectedWeek(null)}
          />
        )}

        {/* Score History Tracker */}
        <ScoreHistoryTracker
          scoreHistory={scoreHistory}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    </div>
  );
};

export default StandaloneCalendarApp;

