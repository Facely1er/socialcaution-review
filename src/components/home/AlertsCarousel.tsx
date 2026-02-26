import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeAlert } from '../../features/alerts/types';

interface AlertsCarouselProps {
  items: HomeAlert[];
  lastUpdate?: string | null;
  /** Short line linking alerts to adding services (e.g. "Add the services you use to get alerts when their policies or risks change.") */
  introLine?: string;
}

const AlertsCarousel: React.FC<AlertsCarouselProps> = ({
  items,
  introLine,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Use default alerts if no items provided
  const displayItems = items.length > 0 ? items : [
    {
      id: 'default-1',
      title: 'Privacy Protection Best Practices',
      description: 'Regularly review your privacy settings across all services. Enable two-factor authentication where available, use strong unique passwords, and limit data sharing permissions. Consider using privacy-focused alternatives for services that collect excessive data.',
      severity: 'med' as const,
      scopeTag: 'General Privacy',
      statusTag: 'Ongoing',
      href: '/privacy-radar'
    },
    {
      id: 'default-2',
      title: 'Data Minimization Strategy',
      description: 'Reduce your digital footprint by minimizing the amount of personal information you share online. Only provide necessary data when signing up for services, and regularly audit which services have access to your information.',
      severity: 'low' as const,
      scopeTag: 'Data Protection',
      statusTag: 'Recommended',
      href: '/service-catalog'
    },
    {
      id: 'default-3',
      title: 'Stay Informed About Privacy Regulations',
      description: 'Privacy laws like GDPR, CCPA, and others continue to evolve. Understanding your rights under these regulations helps you make informed decisions about your data. Check our Trends Tracker for the latest regulatory updates.',
      severity: 'med' as const,
      scopeTag: 'Regulatory',
      statusTag: 'Active',
      href: '/trends-tracker'
    }
  ];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
  }, [displayItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1));
  }, [displayItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    const el = carouselRef.current;
    if (el) {
      el.addEventListener('keydown', handleKeyDown);
      return () => el.removeEventListener('keydown', handleKeyDown);
    }
  }, [goToPrevious, goToNext]);

  // Get severity color classes
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'med':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // Get severity badge text
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'High';
      case 'med':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  const currentItem = displayItems[currentIndex];

  return (
    <section id="privacy-risk-alerts" className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Current Privacy & Security Alerts
          </h2>
          {introLine && (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-3">
              {introLine}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div 
          ref={carouselRef}
          className="relative"
          role="region"
          aria-label="Privacy and security alerts carousel"
          tabIndex={0}
        >
          {/* Carousel Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <div className={`border-l-4 ${getSeverityColor(currentItem.severity)} rounded-lg p-6`}>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {currentItem.severity && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        currentItem.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        currentItem.severity === 'med' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {getSeverityBadge(currentItem.severity)}
                      </span>
                    )}
                    {currentItem.scopeTag && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {currentItem.scopeTag}
                      </span>
                    )}
                    {currentItem.statusTag && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        {currentItem.statusTag}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {currentItem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {currentItem.description}
                  </p>

                  {/* View Details Link */}
                  {currentItem.href && (
                    <a
                      href={currentItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      View details
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {displayItems.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
                  aria-label="Previous signal"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
                  aria-label="Next signal"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {displayItems.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5" role="tablist" aria-label="Signal indicators">
              {displayItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-red-600 dark:bg-red-500'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to signal ${index + 1}`}
                  {...(index === currentIndex ? { 'aria-selected': 'true' as const } : { 'aria-selected': 'false' as const })}
                  role="tab"
                />
              ))}
            </div>
          )}

          {/* Progress Indicator */}
          {displayItems.length > 1 && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} of {displayItems.length}
            </div>
          )}
          
          {/* Info badge when showing default content */}
          {items.length === 0 && (
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                <Info className="w-3 h-3" />
                Showing general privacy insights. Real-time alerts will appear here when available.
              </span>
            </div>
          )}
        </div>

        {/* Methodology Disclaimer */}
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Signals are derived from public reporting and platform risk-pattern monitoring. No personal data is collected.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AlertsCarousel;
