import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostAssessmentFeedbackModal from './PostAssessmentFeedbackModal';

/**
 * Feedback Button Component
 * 
 * Provides a floating button to open the feedback modal
 * Replaces the tutorial button since tutorials are available in the footer
 * Only appears after user scrolls down
 */
const FeedbackButton = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px from top
      const scrollThreshold = 300;
      setHasScrolled(window.scrollY > scrollThreshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenFeedback = () => {
    setShowFeedbackModal(true);
  };

  return (
    <>
      {/* Floating Feedback Button - Only visible after scrolling */}
      <AnimatePresence>
        {hasScrolled && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-32 right-4 z-[9997] lg:bottom-32 hover:opacity-100 transition-opacity"
          >
        <button
          onClick={handleOpenFeedback}
          className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
          aria-label="Provide feedback"
        >
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <PostAssessmentFeedbackModal
        assessmentType="general"
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        assessmentResults={{}}
      />
    </>
  );
};

export default FeedbackButton;

