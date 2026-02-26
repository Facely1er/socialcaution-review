import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Facebook, Mail, Video, ShoppingCart, Music, MessageCircle, Camera, Twitter } from 'lucide-react';
import { getAllEnhancedServices } from '../../data/serviceCatalogEnhanced';
import { useTranslation } from '../../contexts/TranslationContext';

const ServicePreview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Popular services to showcase
  const popularServices = [
    { name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700' },
    { name: 'Gmail', icon: Mail, color: 'from-red-500 to-red-600' },
    { name: 'TikTok', icon: Video, color: 'from-black to-gray-800' },
    { name: 'Instagram', icon: Camera, color: 'from-pink-500 to-purple-600' },
    { name: 'Amazon', icon: ShoppingCart, color: 'from-orange-500 to-yellow-600' },
    { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-500 to-green-600' },
    { name: 'Spotify', icon: Music, color: 'from-green-600 to-green-700' },
    { name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' },
  ];

  // Calculate total service count dynamically
  const totalServices = useMemo(() => {
    try {
      const allServices = getAllEnhancedServices();
      return allServices.length;
    } catch (error) {
      console.warn('[ServicePreview] Error getting service count:', error);
      return 200; // Fallback to approximate count
    }
  }, []);

  const remainingServices = Math.max(0, totalServices - popularServices.length);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-800">
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
            {t('homePage.servicePreview.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('homePage.servicePreview.subtitle')}
          </p>
        </motion.div>

        {/* Service Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {popularServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 dark:border-slate-600"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate('/service-catalog')}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* More Services Indicator */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
            {t('homePage.servicePreview.moreServicesPrefix')} <strong className="text-red-600 dark:text-red-400">{t('homePage.servicePreview.moreServicesCount', { count: remainingServices })}</strong>
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate('/service-catalog')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-6 h-6" />
            {t('homePage.servicePreview.seeAllServices')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicePreview;
