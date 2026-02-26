import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Target, ArrowRight } from 'lucide-react';
import EnhancedSection from '../common/EnhancedSection';
import EnhancedCard from '../common/EnhancedCard';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  const steps = [
    {
      id: 1,
      title: 'Browse Services',
      subtitle: 'Services Monitoring',
      description: 'Explore our catalog of 200+ services. Search for Facebook, Gmail, TikTok, or any service you use. See privacy exposure indices and risk levels instantly.',
      microCopy: 'No signup required',
      icon: Search,
      color: "bg-blue-600",
      timeline: '1-2 minutes'
    },
    {
      id: 2,
      title: 'Set Privacy Concerns',
      subtitle: 'Required Step',
      description: 'Select your privacy concerns from 4 focus areas. This is REQUIRED and drives your personalization.',
      microCopy: 'Required for personalization',
      icon: Shield,
      color: "bg-purple-600",
      timeline: '1-2 minutes'
    },
    {
      id: 3,
      title: 'Take Assessment',
      subtitle: 'Complete Evaluation',
      description: 'Take our privacy assessment to get a privacy strategy and access your personalized dashboard with actionable insights.',
      microCopy: 'Get full access',
      icon: Target,
      color: "bg-green-600",
      timeline: '10-15 minutes'
    }
  ];

  return (
    <EnhancedSection
      title="How It Works"
      subtitle={
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">Get privacy insights in minutes</p>
        </div>
      }
      centered
      className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Arrow between steps (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-30">
                  <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                </div>
              )}

              {/* Content */}
              <EnhancedCard
                variant="elevated"
                padding="lg"
                hover
                className="h-full relative overflow-hidden flex flex-col"
              >
                {/* Step Number Badge - Top right corner */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 text-lg font-bold border-2 border-red-600 dark:border-red-400 shadow-md z-20">
                  {step.id}
                </div>
                
                {/* Icon Circle - Top center, properly contained within card */}
                <div className="flex justify-center mb-4 mt-1 flex-shrink-0">
                  <motion.div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg relative z-10`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </motion.div>
                </div>
                
                <div className="text-center relative z-10 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 font-medium">{step.subtitle}</p>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-grow">
                    {step.description}
                  </p>
                  
                  <div className="mt-auto">
                    {step.timeline && (
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium mb-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full inline-block">
                        {step.timeline}
                      </div>
                    )}
                    {step.microCopy && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{step.microCopy}</p>
                    )}
                  </div>
                </div>
              </EnhancedCard>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => navigate('/service-catalog')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/40 text-lg group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Browsing Services
            <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
          
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Step 1: Browse services • Step 2: Set privacy concerns (required) • Step 3: Take assessment
          </p>
        </motion.div>
      </div>
    </EnhancedSection>
  );
};

export default HowItWorks;

