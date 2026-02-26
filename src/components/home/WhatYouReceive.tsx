import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import EnhancedSection from '../common/EnhancedSection';
import EnhancedCard from '../common/EnhancedCard';

export const WhatYouReceive: React.FC = () => {
  const navigate = useNavigate();
  const deliverables = [
    {
      id: 1,
      title: 'Personal Privacy Exposure Score',
      description: 'Get a comprehensive score from 0-100 that shows your privacy exposure level (higher = more risk).',
      icon: BarChart3,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      details: [
        'Overall privacy rating',
        'Risk level assessment',
        'Comparison to benchmarks',
        'Improvement tracking'
      ]
    },
    {
      id: 2,
      title: 'Risk Assessment Report',
      description: 'Detailed analysis of your privacy vulnerabilities with specific recommendations for improvement.',
      icon: FileText,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      details: [
        'Vulnerability identification',
        'Risk prioritization',
        'Impact analysis',
        'Compliance check'
      ]
    },
    {
      id: 3,
      title: 'Customized Action Plan',
      description: 'Step-by-step guidance tailored to your specific privacy needs and risk profile.',
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      details: [
        'Personalized recommendations',
        'Priority-based actions',
        'Progress tracking',
        'Ongoing support'
      ]
    }
  ];

  return (
    <EnhancedSection
      title="What You'll Receive"
      subtitle="Comprehensive privacy insights and actionable recommendations"
      centered
      className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deliverables.map((deliverable, index) => {
            const Icon = deliverable.icon;
            return (
              <motion.div
                key={deliverable.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="text-center"
              >
                <EnhancedCard
                  variant="elevated"
                  padding="lg"
                  hover
                  className="h-full"
                >
                  {/* Icon */}
                  <motion.div
                    className="mb-6"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${deliverable.color} shadow-lg`}>
                      <Icon className="h-10 w-10" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="px-4">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                      {deliverable.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {deliverable.description}
                    </p>

                    {/* Details List */}
                    <ul className="space-y-2 text-left">
                      {deliverable.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>
                          <motion.div
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 + detailIndex * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{detail}</span>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </EnhancedCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <EnhancedCard
            variant="elevated"
            padding="lg"
            className="max-w-2xl mx-auto bg-gradient-to-r from-accent/10 via-accent/5 to-blue-500/10 border-accent/30"
          >
            <h4 className="text-lg font-semibold text-primary dark:text-white mb-2">
              Ready to Get Started?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Join thousands of users who have already improved their privacy protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate('/assessment/full')}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all font-medium shadow-lg hover:shadow-accent/40 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Assessment
                <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Sample Report
              </motion.button>
            </div>
          </EnhancedCard>
        </motion.div>
      </div>
    </EnhancedSection>
  );
};

export default WhatYouReceive;

