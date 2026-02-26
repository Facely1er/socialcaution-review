import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import EnhancedSection from '../common/EnhancedSection';
import EnhancedCard from '../common/EnhancedCard';

export const FAQSection: React.FC = () => {
  const navigate = useNavigate();
  const [openItem, setOpenItem] = useState<number | null>(null);
  
  const faqs = [
    {
      id: 1,
      question: 'How does the privacy assessment work?',
      answer: 'Our assessment analyzes your digital footprint by checking your social media settings, password security, data broker exposure, and device security. The process takes about 3-5 minutes and provides you with a comprehensive Privacy Exposure Score and personalized recommendations. Free plan includes 3 assessments per month; Premium and Family plans offer unlimited assessments.'
    },
    {
      id: 2,
      question: 'Is my data safe during the assessment?',
      answer: 'Absolutely. We don\'t store any of your personal data. The assessment runs locally in your browser, and we only collect anonymized analytics to improve our service. Your privacy is our top priority.'
    },
    {
      id: 3,
      question: 'What if I get a low privacy score?',
      answer: 'Don\'t worry! A low Privacy Exposure Score just means there are opportunities to improve your privacy. We provide step-by-step guidance to help you address each vulnerability, and you can retake the assessment anytime to track your progress.'
    },
    {
      id: 4,
      question: 'How often should I reassess my privacy?',
      answer: 'We recommend reassessing your privacy every 3-6 months, or whenever you make significant changes to your digital habits, add new accounts, or install new apps. Our monitoring features will also alert you to new risks.'
    },
    {
      id: 5,
      question: 'Do I need to create an account?',
      answer: 'No account required for the free plan! All assessments run locally in your browser and your data stays on your device. Premium and Family plans offer optional encrypted cloud sync if you want to access your data across multiple devices, but even then, account creation is optional.'
    },
    {
      id: 6,
      question: 'What makes SocialCaution different?',
      answer: 'SocialCaution uses persona-based personalization to provide tailored recommendations. We don\'t collect your personal data, everything runs client-side, and we offer comprehensive tools including assessments, resources, and monitoring - all in one platform.'
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <EnhancedSection
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about privacy protection"
      centered
      className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EnhancedCard
                variant="elevated"
                padding="none"
                className="overflow-hidden border-2 border-transparent hover:border-accent/30 transition-all"
              >
                <motion.button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors group"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-primary dark:text-white pr-4 group-hover:text-accent transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: openItem === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openItem === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-accent" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-accent transition-colors" />
                      )}
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {openItem === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-600 dark:text-gray-300 pt-4 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </EnhancedCard>
            </motion.div>
          ))}
        </div>

        {/* Get All Answers Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={() => navigate('/faq')}
            className="px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all font-medium group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Questions
            <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </EnhancedSection>
  );
};

export default FAQSection;

