import React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Shield, Users, Zap, Globe, Lock as LockIcon, ArrowRight, DollarSign } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';

const FAQPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const faqCategories = useMemo(() => [
    {
      category: t('faq.categories.gettingStarted'),
      icon: HelpCircle,
      color: 'from-blue-500 to-blue-600',
      faqs: [
        {
          question: t('faq.gettingStarted.personaQuestion'),
          answer: t('faq.gettingStarted.personaAnswer')
        },
        {
          question: t('faq.gettingStarted.assessmentTimeQuestion'),
          answer: t('faq.gettingStarted.assessmentTimeAnswer')
        },
        {
          question: t('faq.gettingStarted.accountQuestion'),
          answer: t('faq.gettingStarted.accountAnswer')
        },
        {
          question: t('faq.gettingStarted.freePlanQuestion'),
          answer: t('faq.gettingStarted.freePlanAnswer')
        }
      ]
    },
    {
      category: t('faq.categories.pricingPlans'),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      faqs: [
        {
          question: t('faq.pricingPlans.freePlanQuestion'),
          answer: t('faq.pricingPlans.freePlanAnswer')
        },
        {
          question: t('faq.pricingPlans.planDifferenceQuestion'),
          answer: t('faq.pricingPlans.planDifferenceAnswer')
        },
        {
          question: t('faq.pricingPlans.cancelQuestion'),
          answer: t('faq.pricingPlans.cancelAnswer')
        },
        {
          question: t('faq.pricingPlans.oneTimePurchaseQuestion'),
          answer: t('faq.pricingPlans.oneTimePurchaseAnswer')
        },
        {
          question: t('faq.pricingPlans.annualBillingQuestion'),
          answer: t('faq.pricingPlans.annualBillingAnswer')
        },
        {
          question: t('faq.pricingPlans.paymentRequiredQuestion'),
          answer: t('faq.pricingPlans.paymentRequiredAnswer')
        }
      ]
    },
    {
      category: t('faq.categories.privacySecurity'),
      icon: Shield,
      color: 'from-green-500 to-green-600',
      faqs: [
        {
          question: t('faq.privacySecurity.protectPrivacyQuestion'),
          answer: t('faq.privacySecurity.protectPrivacyAnswer')
        },
        {
          question: t('faq.privacySecurity.dataCollectionQuestion'),
          answer: t('faq.privacySecurity.dataCollectionAnswer')
        },
        {
          question: t('faq.privacySecurity.dataPrivateQuestion'),
          answer: t('faq.privacySecurity.dataPrivateAnswer')
        },
        {
          question: t('faq.privacySecurity.gdprCompliantQuestion'),
          answer: t('faq.privacySecurity.gdprCompliantAnswer')
        }
      ]
    },
    {
      category: t('faq.categories.howItWorks'),
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      faqs: [
        {
          question: t('faq.howItWorks.personaAccuracyQuestion'),
          answer: t('faq.howItWorks.personaAccuracyAnswer')
        },
        {
          question: t('faq.howItWorks.changePersonaQuestion'),
          answer: t('faq.howItWorks.changePersonaAnswer')
        },
        {
          question: t('faq.howItWorks.personalizedQuestion'),
          answer: t('faq.howItWorks.personalizedAnswer')
        },
        {
          question: t('faq.howItWorks.retakeQuestion'),
          answer: t('faq.howItWorks.retakeAnswer')
        }
      ]
    },
    {
      category: t('faq.categories.technicalQuestions'),
      icon: LockIcon,
      color: 'from-orange-500 to-orange-600',
      faqs: [
        {
          question: t('faq.technicalQuestions.technologyQuestion'),
          answer: t('faq.technicalQuestions.technologyAnswer')
        },
        {
          question: t('faq.technicalQuestions.offlineQuestion'),
          answer: t('faq.technicalQuestions.offlineAnswer')
        },
        {
          question: t('faq.technicalQuestions.browsersQuestion'),
          answer: t('faq.technicalQuestions.browsersAnswer')
        },
        {
          question: t('faq.technicalQuestions.exportQuestion'),
          answer: t('faq.technicalQuestions.exportAnswer')
        },
        {
          question: t('faq.technicalQuestions.limitsQuestion'),
          answer: t('faq.technicalQuestions.limitsAnswer')
        }
      ]
    }
  ], [t]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEOHead
        title={t('faq.seoTitle')}
        description={t('faq.seoDescription')}
        keywords={t('faq.seoKeywords')}
        canonicalUrl={`${window.location.origin}/faq`}
      />

      {/* Header – on page background */}
      <section className="pt-8 sm:pt-10 pb-8 sm:pb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="page-title mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4">
            <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="leading-tight">{t('faq.title')}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t('faq.subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Category Header */}
                <div className={`p-6 bg-gradient-to-r ${category.color} text-white`}>
                  <div className="flex items-center">
                    <category.icon className="w-6 h-6 mr-3" />
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {category.category}
                    </h2>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="p-6">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            {t('faq.stillHaveQuestions')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {t('faq.contactDescription')}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center mx-auto"
          >
            {t('faq.contactSupport')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;