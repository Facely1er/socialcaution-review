import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Shield, AlertTriangle, BarChart3, ArrowRight } from 'lucide-react';
import EnhancedSection from '../common/EnhancedSection';
import EnhancedCard from '../common/EnhancedCard';

export const PrivacyAssessmentPreview: React.FC = () => {
  const navigate = useNavigate();
  const concerns = [
    { id: 1, text: 'Social Media Privacy Settings', checked: true },
    { id: 2, text: 'Password Security', checked: true },
    { id: 3, text: 'Data Broker Exposure', checked: false },
    { id: 4, text: 'Device Security', checked: true },
    { id: 5, text: 'Location Tracking', checked: false },
    { id: 6, text: 'Browser Privacy', checked: true }
  ];

  return (
    <EnhancedSection
      title="Get Your Personalized Privacy Exposure Score"
      subtitle="Discover your digital footprint and get actionable recommendations"
      centered
      className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 dark:bg-accent/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-200/30 dark:bg-yellow-500/15 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Assessment Form Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <EnhancedCard
              variant="elevated"
              padding="lg"
              className="h-full"
            >
              <h3 className="text-xl font-bold text-primary dark:text-white mb-4">
                Privacy Assessment Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Answer a few questions about your digital habits to get your personalized Privacy Exposure Score.
              </p>
              
              <div className="space-y-3">
                {concerns.map((concern, index) => (
                  <motion.div
                    key={concern.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all ${
                      concern.checked 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {concern.checked && <CheckSquare className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{concern.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Assessment takes approximately 3-5 minutes
                </p>
              </div>
            </EnhancedCard>
          </motion.div>

          {/* Privacy Score Gauge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <EnhancedCard
              variant="elevated"
              padding="lg"
            >
              <h3 className="text-xl font-bold text-primary dark:text-white mb-6">
                Your Privacy Exposure Score
              </h3>
              
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    whileInView={{ strokeDashoffset: 75.36 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                  >
                    <div className="text-4xl font-bold text-green-500">70</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">out of 100</div>
                  </motion.div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                {[
                  { icon: Shield, label: 'Security', value: 'Good', color: 'text-green-500' },
                  { icon: AlertTriangle, label: 'Exposure', value: 'Moderate', color: 'text-yellow-500' },
                  { icon: BarChart3, label: 'Control', value: 'Strong', color: 'text-blue-500' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <item.icon className={`h-4 w-4 ${item.color} mr-2`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </EnhancedCard>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => navigate('/assessment/full')}
            className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 shadow-lg hover:shadow-accent/40 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Assessment
            <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </EnhancedSection>
  );
};

export default PrivacyAssessmentPreview;

