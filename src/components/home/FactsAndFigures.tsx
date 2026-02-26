import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Database, TrendingUp } from 'lucide-react';
import EnhancedSection from '../common/EnhancedSection';

const FactsAndFigures: React.FC = () => {
  const stats = [
    {
      value: '$10.5T',
      label: 'Annual Cybercrime Cost',
      description: 'Global cost of cybercrime expected to reach $10.5 trillion annually by 2025',
      source: 'Cybersecurity Ventures',
      icon: Shield,
      color: 'bg-accent/10 text-accent'
    },
    {
      value: '$4.88M',
      label: 'Average Data Breach Cost',
      description: 'Average cost of a data breach for organizations worldwide',
      source: 'IBM Security Report 2023',
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning'
    },
    {
      value: '353M+',
      label: 'People Affected',
      description: 'Over 353 million people affected by data breaches in 2023 alone',
      source: 'Statista',
      icon: Database,
      color: 'bg-danger/10 text-danger'
    },
    {
      value: '75%',
      label: 'Privacy Laws Coverage',
      description: '75% of the world\'s population will be covered by modern privacy regulations by 2024',
      source: 'Gartner',
      icon: TrendingUp,
      color: 'bg-success/10 text-success'
    }
  ];

  return (
    <EnhancedSection
      title="The State of Privacy Today"
      subtitle={
        <div className="space-y-3 max-w-3xl mx-auto">
          <p className="text-xl text-accent font-semibold">The Numbers Don't Lie</p>
          <p className="text-gray-600 dark:text-gray-300">Privacy threats are growing at an unprecedented rate. Here's what the data tells us:</p>
        </div>
      }
      centered
      className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className="relative modern-card bg-white dark:bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <motion.div
                className={`absolute top-0 left-0 w-2 h-full ${
                  index === 0 ? 'bg-accent' :
                  index === 1 ? 'bg-warning' :
                  index === 2 ? 'bg-danger' :
                  'bg-success'
                } rounded-l-xl`}
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              />
              
              <div className="flex items-start mb-4">
                <motion.div
                  className={`p-3 rounded-full ${stat.color}`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
              </div>

              <motion.div
                className="text-3xl font-bold text-primary dark:text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {stat.label}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed">
                {stat.description}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                {stat.source}
              </p>

              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-accent/50"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
              />
            </motion.div>
          );
        })}
      </div>
    </EnhancedSection>
  );
};

export default FactsAndFigures;

