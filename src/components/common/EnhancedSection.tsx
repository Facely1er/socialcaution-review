import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string | React.ReactNode;
  centered?: boolean;
  animate?: boolean;
}

const EnhancedSection: React.FC<EnhancedSectionProps> = ({
  children,
  className = '',
  title,
  subtitle,
  centered = false,
  animate = true,
}) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    },
  };

  const textAlignClass = centered ? 'text-center' : 'text-left';

  return (
    <section className={`py-4 md:py-6 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {animate ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {(title || subtitle) && (
              <div className={`mb-4 md:mb-5 ${textAlignClass}`}>
                {title && (
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-text dark:text-white mb-2 leading-tight"
                  >
                    {title}
                  </motion.h2>
                )}
                {subtitle && (
                  <motion.div
                    variants={itemVariants}
                    className="text-lg md:text-xl text-text-secondary dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
                  >
                    {subtitle}
                  </motion.div>
                )}
              </div>
            )}
            <motion.div variants={itemVariants} className="flex-grow flex flex-col">{children}</motion.div>
          </motion.div>
        ) : (
          <div className="flex-grow flex flex-col">
            {(title || subtitle) && (
              <div className={`mb-4 md:mb-5 ${textAlignClass}`}>
                {title && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text dark:text-white mb-2 leading-tight">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <div className="text-lg md:text-xl text-text-secondary dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    {subtitle}
                  </div>
                )}
              </div>
            )}
            <div className="flex-grow flex flex-col">{children}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedSection;

