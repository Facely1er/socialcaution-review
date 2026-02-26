import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Lightbulb, Lock, CheckCircle, ArrowRight, Eye, Database, Bell } from 'lucide-react';
import EnhancedCard from '../common/EnhancedCard';
import { useNavigate } from 'react-router-dom';

// Helper component for progress bars
const ProgressBar: React.FC<{ width: number; className: string; cssVarName: string }> = ({ width, className, cssVarName }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(cssVarName, `${width}%`);
    }
  }, [width, cssVarName]);

  return <div ref={ref} className={className} />;
};

const PrivacyJourneyDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 'discover',
      title: 'Discover',
      description: 'Identify your privacy vulnerabilities and understand your digital footprint',
      icon: Search,
      color: 'bg-blue-500',
      metrics: [
        { label: 'Data Exposure', value: 75, color: 'bg-red-500' },
        { label: 'Privacy Exposure Score', value: 45, color: 'bg-orange-500' },
        { label: 'Security Level', value: 30, color: 'bg-red-500' }
      ],
      insights: [
        'Your data is exposed on 12 data broker sites',
        'Social media privacy settings need attention',
        'Password security is at high risk'
      ]
    },
    {
      id: 'learn',
      title: 'Learn',
      description: 'Understand your privacy rights and available protection options',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      resources: [
        { title: 'Privacy Rights Guide', icon: Eye },
        { title: 'Data Broker Removal', icon: Database },
        { title: 'Security Best Practices', icon: Lock }
      ]
    },
    {
      id: 'protect',
      title: 'Protect',
      description: 'Follow a structured 30-day plan with daily privacy tasks',
      icon: Shield,
      color: 'bg-green-500',
      actions: [
        { title: 'Week 1: Foundation Security', status: 'completed' },
        { title: 'Week 2: Social Media Privacy', status: 'completed' },
        { title: 'Week 3: Advanced Protection', status: 'in-progress' },
        { title: 'Week 4: Data Control & Monitoring', status: 'pending' }
      ],
      roadmap: {
        totalDays: 30,
        completedDays: 14,
        currentWeek: 3,
        nextTask: "Enable encryption on your devices"
      }
    },
    {
      id: 'monitor',
      title: 'Monitor',
      description: 'Stay protected with continuous monitoring and alerts',
      icon: Bell,
      color: 'bg-purple-500',
      improvements: [
        { metric: 'Privacy Exposure Score', before: 45, after: 82 },
        { metric: 'Data Exposure', before: 75, after: 15 },
        { metric: 'Security Level', before: 30, after: 90 }
      ]
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(current => (current + 1) % steps.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Reset progress when step changes
  useEffect(() => {
    if (currentStep > 0) {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setProgress(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Update CSS variables for progress line
  useEffect(() => {
    if (progressLineRef.current) {
      const progressWidth = (currentStep / (steps.length - 1)) * 100;
      progressLineRef.current.style.setProperty('--progress-width', `${progressWidth}%`);
    }
  }, [currentStep, steps.length]);

  // Update CSS variables for progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty('--progress-bar-width', `${progress}%`);
    }
  }, [progress]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div
        className="pt-8 mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
          Your Privacy Journey
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience how our platform guides you through each step of your privacy protection journey
        </p>
      </motion.div>

      {/* Journey Steps Navigation */}
      <div className="flex justify-between mb-6 relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0 rounded-full">
          <div 
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-accent via-warning to-success transition-all duration-300 rounded-full"
            style={{ width: `var(--progress-width, 0%)` }}
          ></div>
        </div>

        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            className="relative z-10 flex flex-col items-center"
            onClick={() => handleStepClick(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index <= currentStep ? step.color : 'bg-gray-300 dark:bg-gray-600'
              } text-white mb-2 transition-colors duration-300 shadow-lg`}
              whileHover={{ scale: 1.1 }}
            >
              <step.icon className="h-6 w-6" />
            </motion.div>
            <span className={`text-sm font-medium ${
              index === currentStep ? 'text-accent' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {step.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Current Step Content */}
      <EnhancedCard
        variant="elevated"
        padding="lg"
        className="mb-6 overflow-hidden relative"
      >
        {/* Accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/2 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="flex items-center">
              <motion.div
                className={`p-3 ${currentStepData.color} rounded-full mr-4 text-white shadow-lg`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <currentStepData.icon className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-primary dark:text-white">{currentStepData.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{currentStepData.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </motion.button>
              <motion.button
                onClick={() => handleStepClick((currentStep + 1) % steps.length)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
            <motion.div
              ref={progressBarRef}
              className={`h-full ${currentStepData.color} rounded-full`}
              style={{ width: `var(--progress-bar-width, 0%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Step-specific content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary dark:text-white mb-4">Privacy Metrics</h4>
                  <div className="space-y-4">
                    {currentStepData.metrics?.map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <ProgressBar
                            width={metric.value}
                            className={`h-full ${metric.color} rounded-full`}
                            cssVarName="--metric-width"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary dark:text-white mb-4">Key Insights</h4>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                    <ul className="space-y-2">
                      {currentStepData.insights?.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <Eye className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800 dark:text-gray-200">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">Available Resources</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentStepData.resources?.map((resource, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-lg border border-accent/20 hover:border-accent/50 transition-all cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      <resource.icon className="h-8 w-8 text-accent mb-2" />
                      <h5 className="font-semibold text-primary dark:text-white">{resource.title}</h5>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">30-Day Protection Plan</h4>
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-sm font-bold text-accent">
                      {currentStepData.roadmap?.completedDays} / {currentStepData.roadmap?.totalDays} days
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-success rounded-full"
                      style={{ width: `${(currentStepData.roadmap?.completedDays || 0) / (currentStepData.roadmap?.totalDays || 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {currentStepData.actions?.map((action, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        action.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : action.status === 'in-progress'
                          ? 'bg-accent/10 border-accent/30'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {action.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h4 className="font-semibold text-primary dark:text-white mb-4">Privacy Improvements</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentStepData.improvements?.map((improvement, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-gradient-to-br from-accent/10 to-success/10 rounded-lg border border-accent/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{improvement.metric}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-400 line-through">{improvement.before}%</span>
                        <ArrowRight className="h-4 w-4 text-accent" />
                        <span className="text-2xl font-bold text-success">{improvement.after}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-success rounded-full"
                          style={{ width: `${improvement.after}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </EnhancedCard>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={() => navigate('/assessment/full')}
          className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-bold rounded-xl hover:from-accent-dark hover:to-accent transition-all transform hover:scale-105 shadow-lg hover:shadow-accent/40 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Privacy Journey
          <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PrivacyJourneyDemo;

