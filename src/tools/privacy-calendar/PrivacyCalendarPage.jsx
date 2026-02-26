import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  Download,
  Bell,
  Award,
  ArrowLeft
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CalendarView from './components/CalendarView';
import MonthlyThemeView from './components/MonthlyThemeView';
import WeeklyTaskView from './components/WeeklyTaskView';
import ScoreHistoryTracker from './components/ScoreHistoryTracker';
import CalendarExport from './utils/calendarExport';
import { generatePersonalizedCalendar } from './utils/calendarGenerator';
import { monthlyThemes } from './data/monthlyThemes';
import './styles/PrivacyCalendar.css';

const PrivacyCalendarPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [calendarData, setCalendarData] = useLocalStorage('privacy-calendar-2026', null);
  const [scoreHistory, setScoreHistory] = useLocalStorage('privacy-score-history', []);
  const [completedTasks, setCompletedTasks] = useLocalStorage('privacy-calendar-completed', {});
  const [isGenerating, setIsGenerating] = useState(false);

  // Get user data for personalization
  const [userPersona] = useLocalStorage('socialcaution_persona', null);
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [assessmentResults] = useLocalStorage('socialcaution_results', null);

  useEffect(() => {
    // Generate calendar if it doesn't exist
    if (!calendarData) {
      generateCalendar();
    }
  }, []);

  const generateCalendar = async () => {
    setIsGenerating(true);
    
    // Generate personalized calendar based on user data
    const generated = generatePersonalizedCalendar({
      persona: userPersona,
      selectedServices,
      assessmentResults,
      year: 2026
    });
    
    setCalendarData(generated);
    setIsGenerating(false);
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

    // Update privacy score if applicable
    updatePrivacyScore(monthIndex);
  };

  const updatePrivacyScore = (monthIndex) => {
    // Calculate new privacy score based on completed tasks
    const monthData = calendarData?.months[monthIndex];
    if (!monthData) return;

    const completedCount = Object.keys(completedTasks).filter(key => 
      key.startsWith(`${monthIndex}-`)
    ).length;
    
    const totalTasks = monthData.weeks.reduce((sum, week) => sum + week.tasks.length, 0);
    const completionRate = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    
    // Estimate score improvement (simplified calculation)
    const baseScore = assessmentResults?.exposureScore ? 100 - assessmentResults.exposureScore : 50;
    const improvement = Math.round(completionRate * (monthData.expectedImpact / 100));
    const newScore = Math.min(100, baseScore + improvement);

    // Save score history
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

  const currentMonthData = calendarData?.months?.[currentMonth];
  const currentTheme = monthlyThemes[currentMonth];

  if (isGenerating) {
    return (
      <div className="privacy-calendar-page">
        <div className="calendar-loading">
          <CalendarIcon className="loading-icon" />
          <h2>Generating Your Personalized Privacy Calendar...</h2>
          <p>This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="privacy-calendar-page">
        <div className="calendar-empty">
          <CalendarIcon className="empty-icon" />
          <h2>Privacy Calendar 2026</h2>
          <p>Get started with your personalized privacy journey</p>
          <button onClick={generateCalendar} className="btn-primary">
            Generate My Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="privacy-calendar-page">
      {/* Header */}
      <div className="calendar-header">
        <button 
          onClick={() => navigate('/')}
          className="btn-back"
          aria-label="Back to home"
        >
          <ArrowLeft className="icon" />
          <span>Back</span>
        </button>
        
        <div className="header-content">
          <h1 className="calendar-title">
            <CalendarIcon className="title-icon" />
            Privacy Calendar 2026
          </h1>
          <p className="calendar-subtitle">
            Your Year of Digital Security
          </p>
        </div>

        <div className="header-actions">
          <button 
            onClick={() => handleExportCalendar('ics')}
            className="btn-export"
            title="Export to Calendar"
          >
            <Download className="icon" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="calendar-main">
        {/* Month Navigation */}
        <div className="month-navigation">
          <button 
            onClick={handlePreviousMonth}
            className="btn-nav"
            aria-label="Previous month"
          >
            <ChevronLeft className="icon" />
          </button>
          
          <h2 className="current-month-year">
            {new Date(currentYear, currentMonth, 1).toLocaleString('default', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          
          <button 
            onClick={handleNextMonth}
            className="btn-nav"
            aria-label="Next month"
          >
            <ChevronRight className="icon" />
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

export default PrivacyCalendarPage;

