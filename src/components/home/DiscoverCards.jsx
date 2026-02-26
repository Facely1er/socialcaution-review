import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, TrendingUp, ArrowRight, Radar } from 'lucide-react';

/**
 * DiscoverCards - The original "What You'll Discover" section
 * Moved here for potential future use under a new heading
 */
const DiscoverCards = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Database,
      title: 'Data Collection Awareness',
      description: 'Understand what services collect and how it increases exposure',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      link: '/service-catalog',
      linkLabel: 'Explore Services →'
    },
    {
      icon: Shield,
      title: 'Security Track Record',
      description: 'Review breach history and systemic security practices',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-700',
      link: '/service-catalog',
      linkLabel: 'View Track Record →'
    },
    {
      icon: TrendingUp,
      title: 'Privacy & AI Risk Ratings',
      description: 'See which services increase impersonation and fraud risk',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      link: '/service-catalog',
      linkLabel: 'See Ratings →'
    },
    {
      icon: Radar,
      title: 'Policy & Risk Updates',
      description: 'Stay informed when changes elevate exposure',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      borderColor: 'border-red-200 dark:border-red-700',
      link: '/privacy-radar',
      linkLabel: 'View Updates →'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Insights by Category
          </h2>
        </motion.div>

        {/* Value Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.button
                key={value.title}
                type="button"
                onClick={() => navigate(value.link)}
                className={`bg-gradient-to-br ${value.bgColor} rounded-2xl p-6 sm:p-8 border ${value.borderColor} hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`${value.title} - ${value.linkLabel}`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                  {value.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group-hover:text-accent dark:group-hover:text-accent transition-colors mt-auto">
                  <span className="text-sm font-medium">{value.linkLabel}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiscoverCards;
