import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, HelpCircle, MessageCircle, Search, 
  ChevronDown, ChevronUp, ExternalLink, Mail, 
  ArrowRight, Shield, Play, CheckCircle, RotateCcw
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { getAllTutorials, getTutorialDefinition } from '../../data/tutorialSteps';
import { TutorialService } from '../../services/tutorialService';
import InteractiveTutorial from '../common/InteractiveTutorial';
import SEOHead from '../common/SEOHead';
import { triggerButtonHaptic } from '../../utils/haptics';

/**
 * SupportPage - Consolidated Support Page
 * Includes: Tutorials, FAQ (accordion), and Feedback & Contact
 */
const SupportPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [tutorialSteps, setTutorialSteps] = useState([]);
  const [activeSection, setActiveSection] = useState('tutorials'); // tutorials, faq, feedback

  // Get FAQ data from translations and convert to flat list
  const faqData = t('faq') || {};
  const categories = faqData.categories || {};
  
  // Convert nested FAQ structure to flat list
  const allQuestions = useMemo(() => {
    const questions = [];
    const categoryKeys = ['gettingStarted', 'pricingPlans', 'privacySecurity', 'howItWorks', 'technicalQuestions'];
    
    categoryKeys.forEach(categoryKey => {
      const categoryData = faqData[categoryKey] || {};
      Object.keys(categoryData).forEach(key => {
        if (key.endsWith('Question')) {
          const questionKey = `faq.${categoryKey}.${key}`;
          const answerKey = `faq.${categoryKey}.${key.replace('Question', 'Answer')}`;
          const categoryName = categories[categoryKey] || categoryKey;
          
          questions.push({
            questionKey,
            answerKey,
            category: categoryKey,
            categoryName
          });
        }
      });
    });
    
    return questions;
  }, [faqData, categories]);

  // Filter questions based on search and category
  const filteredQuestions = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? allQuestions 
      : allQuestions.filter(q => q.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => {
        const question = t(q.questionKey) || '';
        const answer = t(q.answerKey) || '';
        return question.toLowerCase().includes(query) || 
               answer.toLowerCase().includes(query);
      });
    }

    return filtered;
  }, [allQuestions, searchQuery, selectedCategory, t]);

  // Reset expanded items when filter changes (start collapsed)
  useEffect(() => {
    setExpandedItems(new Set());
  }, [filteredQuestions]);

  // Check for hash in URL to set active section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#tutorials') {
      setActiveSection('tutorials');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (hash === '#faq') {
      setActiveSection('faq');
      // Scroll to FAQ section after a brief delay
      setTimeout(() => {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (hash === '#feedback') {
      setActiveSection('feedback');
      setTimeout(() => {
        document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleTutorialClick = (tutorialId) => {
    triggerButtonHaptic();
    const tutorial = getTutorialDefinition(tutorialId);
    if (tutorial) {
      setTutorialSteps(tutorial.steps);
      setActiveTutorial(tutorialId);
    }
  };

  const handleTutorialComplete = () => {
    setActiveTutorial(null);
    setTutorialSteps([]);
  };

  const handleTutorialSkip = () => {
    setActiveTutorial(null);
    setTutorialSteps([]);
  };

  const handleResetTutorial = (tutorialId, e) => {
    e.stopPropagation();
    triggerButtonHaptic();
    TutorialService.resetTutorial(tutorialId);
    // Force re-render by updating state
    window.location.reload();
  };

  const allTutorials = getAllTutorials();
  const completedTutorials = TutorialService.getCompletedTutorials();
  const isTutorialCompleted = (tutorialId) => {
    return completedTutorials.includes(tutorialId);
  };

  const categoryList = [
    { key: 'all', label: 'All Questions' },
    { key: 'gettingStarted', label: categories.gettingStarted || 'Getting Started' },
    { key: 'pricingPlans', label: categories.pricingPlans || 'Pricing & Plans' },
    { key: 'privacySecurity', label: categories.privacySecurity || 'Privacy & Security' },
    { key: 'howItWorks', label: categories.howItWorks || 'How It Works' },
    { key: 'technicalQuestions', label: categories.technicalQuestions || 'Technical Questions' }
  ];

  // Tutorial cards with routes - these are quick access cards, not interactive tutorials
  const tutorialCards = [
    {
      id: null, // No interactive tutorial for this, just a route
      title: 'Getting Started with Setup',
      description: 'Learn how to set up your services and configure your privacy preferences.',
      route: '/service-catalog',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'dashboard-tutorial',
      title: 'Understanding Your Dashboard',
      description: 'Navigate your privacy dashboard and understand your exposure scores.',
      route: '/dashboard',
      icon: BookOpen,
      color: 'purple'
    },
    {
      id: null, // No interactive tutorial for this, just a route
      title: 'Using the Privacy Toolkit',
      description: 'Master the tools to manage your digital footprint and remove data from brokers.',
      route: '/toolkit',
      icon: Shield,
      color: 'green'
    },
    {
      id: null, // No interactive tutorial for this, just a route
      title: 'How SocialCaution Works Without Collecting Your Data',
      description: 'Learn how SocialCaution protects your privacy by keeping all data on your device.',
      route: '/how-it-works',
      icon: Shield,
      color: 'indigo'
    }
  ];

  const handleTutorialCardClick = (route) => {
    triggerButtonHaptic();
    navigate(route);
  };

  return (
    <>
      <SEOHead
        title={t('support.title') || 'Support - SocialCaution'}
        description={t('support.description') || 'Get help and support for SocialCaution. Find answers, tutorials, and contact information.'}
        keywords="help, tutorials, faq, support, feedback"
        canonicalUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/support`}
      />
      
      <div className="bg-gradient-to-b from-slate-50 via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pb-12 sm:pb-16">
        <div className="max-w-6xl md:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="page-title mb-2">
              {t('support.title') || 'Support'}
            </h1>
            <p className="text-base text-left text-gray-700 dark:text-gray-300">
              Learn how to use SocialCaution and get answers to common questions.
            </p>
          </div>

          {/* Ask questions & request support - visible by default for App Store compliance */}
          <div className="mb-6 p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm" role="region" aria-label={t('support.contactBlock.heading') || 'Ask questions and request support'}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-left">
              {t('support.contactBlock.heading') || 'Ask questions & request support'}
            </h2>
            <p className="text-sm text-left text-gray-700 dark:text-gray-300 mb-4">
              {t('support.contactBlock.description') || 'Email us at support@ermits.com or use our contact form for help with your account, technical issues, or any questions.'}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 text-left">
                {t('support.contactBlock.emailLabel') || 'Support email:'}
              </span>
              <a
                href="mailto:support@ermits.com?subject=SocialCaution%20Support"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={triggerButtonHaptic}
              >
                support@ermits.com
              </a>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <Link
                to="/contact"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                onClick={triggerButtonHaptic}
              >
                {t('support.contactBlock.contactFormLink') || 'Contact form'}
              </Link>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700 pb-4">
            <button
              onClick={() => {
                setActiveSection('tutorials');
                triggerButtonHaptic();
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                activeSection === 'tutorials'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              Tutorials
            </button>
            <button
              onClick={() => {
                setActiveSection('faq');
                triggerButtonHaptic();
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                activeSection === 'faq'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setActiveSection('feedback');
                triggerButtonHaptic();
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${
                activeSection === 'feedback'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              Feedback
            </button>
          </div>

          {/* Tutorials Section */}
          {activeSection === 'tutorials' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-left">
                  Step-by-step guides to get the most out of the app
                </h2>
                <p className="text-base mb-3 text-left text-gray-700 dark:text-gray-300">
                  Follow these interactive tutorials to learn how to use SocialCaution effectively.
                </p>
              </div>

              {/* Tutorial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {tutorialCards.map((card, index) => {
                  const Icon = card.icon;
                  const tutorial = card.id ? allTutorials.find(t => t.id === card.id) : null;
                  const completed = tutorial ? isTutorialCompleted(tutorial.id) : false;

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center ${
                            card.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            card.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            card.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-indigo-100 dark:bg-indigo-900/30'
                          }`} style={{ marginTop: '2px' }}>
                            <Icon className={`w-4 h-4 ${
                              card.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                              card.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                              card.color === 'green' ? 'text-green-600 dark:text-green-400' :
                              'text-indigo-600 dark:text-indigo-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-left flex-1 min-w-0 leading-tight">
                                {card.title}
                              </h3>
                              <button
                                onClick={() => handleTutorialCardClick(card.route)}
                                className="px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 flex-shrink-0"
                              >
                                Open
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-left line-clamp-1 leading-tight">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Tutorials List */}
              {allTutorials.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-left">
                    Interactive Tutorials
                  </h3>
                  <div className="space-y-2">
                    {allTutorials.map((tutorial) => {
                      const Icon = tutorial.icon;
                      const completed = isTutorialCompleted(tutorial.id);

                      return (
                        <div
                          key={tutorial.id}
                          className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center ${
                              completed 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            }`} style={{ marginTop: '2px' }}>
                              <Icon className={`w-4 h-4 ${
                                completed 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-blue-600 dark:text-blue-400'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-left leading-tight">
                                    {tutorial.title}
                                  </h4>
                                  {completed && (
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={() => handleTutorialClick(tutorial.id)}
                                    className="px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3" />
                                    Start
                                  </button>
                                  {completed && (
                                    <button
                                      onClick={(e) => handleResetTutorial(tutorial.id, e)}
                                      className="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 text-left line-clamp-1 leading-tight">
                                {tutorial.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div id="faq-section" className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-left">
                  Frequently Asked Questions
                </h2>
                <p className="text-base mb-3 text-left text-gray-700 dark:text-gray-300">
                  Quick answers to common questions about SocialCaution.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('faq.searchPlaceholder') || 'Search FAQ...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-left"
                  />
                </div>
              </div>

              {/* Category Filter */}
              {categoryList.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categoryList.map(category => (
                    <button
                      key={category.key}
                      onClick={() => {
                        setSelectedCategory(category.key);
                        triggerButtonHaptic();
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}

              {/* FAQ Items - Accordion */}
              <div className="space-y-2 mb-8">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('faq.noResults') || 'No questions found. Try a different search term.'}
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((item, index) => {
                    const isExpanded = expandedItems.has(index);
                    const question = t(item.questionKey) || 'Question';
                    const answer = t(item.answerKey) || 'Answer';

                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => {
                            toggleItem(index);
                            triggerButtonHaptic();
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                          aria-expanded={isExpanded}
                          aria-controls={`faq-answer-${index}`}
                        >
                          <span className="font-semibold text-sm text-gray-900 dark:text-white pr-4 flex-1 text-left block">
                            {question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        <div
                          id={`faq-answer-${index}`}
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-4 pb-3 pt-0 text-left">
                            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-left">
                              {answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Feedback & Contact Section */}
          {activeSection === 'feedback' && (
            <div id="feedback-section" className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-left">
                  Feedback & Contact
                </h2>
                <p className="text-base mb-3 text-left text-gray-700 dark:text-gray-300">
                  Tell us what works and what doesn't. We value your input.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 text-left">
                      Send Feedback
                    </h3>
                    <p className="text-xs text-left text-gray-600 dark:text-gray-400 mb-4">
                      Have a suggestion or found a bug? We'd love to hear from you.
                    </p>
                    <a
                      href="mailto:support@ermits.com?subject=SocialCaution Feedback"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm min-h-[44px]"
                      onClick={triggerButtonHaptic}
                      style={{ justifyContent: 'center', textAlign: 'center' }}
                    >
                      <Mail className="w-4 h-4" />
                      Send Feedback Email
                    </a>
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 text-left">
                      Contact Support
                    </h3>
                    <p className="text-xs text-left text-gray-600 dark:text-gray-400 mb-4">
                      Need help with your account or have a question? Reach out to our support team.
                    </p>
                    <button
                      onClick={() => {
                        triggerButtonHaptic();
                        navigate('/contact');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-sm min-h-[44px]"
                      style={{ justifyContent: 'center', textAlign: 'center' }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Support
                    </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mt-4">
                    <p className="text-xs text-blue-800 dark:text-blue-200 text-left">
                      <strong>Privacy Note:</strong> All feedback and support requests are handled with the same privacy-first approach. We don't track your usage or share your information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Tutorial */}
      {activeTutorial && tutorialSteps.length > 0 && (
        <InteractiveTutorial
          tutorialId={activeTutorial}
          steps={tutorialSteps}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
          isVisible={true}
        />
      )}
    </>
  );
};

export default SupportPage;
