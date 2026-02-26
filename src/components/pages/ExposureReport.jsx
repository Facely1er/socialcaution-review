/**
 * Personal Data Exposure Report
 * 
 * Repackaged DFA output as a clear, user-friendly report
 * Input: existing DFA output from calculateDigitalFootprintFromServices
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertTriangle, Download, Loader2
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { serviceCatalog } from '../../data/serviceCatalog';
import { calculateDigitalFootprintFromServices } from '../../utils/digitalFootprintCalculator';
import { getExposureLevel } from '../../utils/privacyExposureIndex';
import { generatePersonalDataExposureReportPDF } from '../../utils/productPdfGenerators';
import SEOHead from '../common/SEOHead';
import Paywall from '../common/Paywall';

const ExposureReport = () => {
  const navigate = useNavigate();
  const [selectedServices] = useLocalStorage('socialcaution_services', []);
  const [assessmentResults] = useLocalStorage('assessment-results', null);
  const [isUnlocked, setIsUnlocked] = useLocalStorage('personal_data_exposure_report_unlocked', false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get DFA baseline data using the same calculator
  const footprintData = useMemo(() => {
    return calculateDigitalFootprintFromServices(selectedServices || [], assessmentResults);
  }, [selectedServices, assessmentResults]);

  // Get high-risk exposure sources (top 3-5 services with highest exposure)
  const highRiskSources = useMemo(() => {
    if (!footprintData || !footprintData.services || footprintData.services.length === 0) return [];
    
    return footprintData.services
      .filter(s => s.exposureIndex >= 50)
      .sort((a, b) => b.exposureIndex - a.exposureIndex)
      .slice(0, 5)
      .map(service => ({
        name: service.serviceName,
        riskLevel: service.riskLevel || 'medium',
        exposureIndex: service.exposureIndex
      }));
  }, [footprintData]);

  // Extract data types from services (common data types based on categories)
  const dataTypes = useMemo(() => {
    if (!selectedServices || selectedServices.length === 0) return [];
    
    const typesSet = new Set();
    selectedServices.forEach(serviceId => {
      const service = serviceCatalog.find(s => s.id === serviceId);
      if (service) {
        // Common data types by category
        typesSet.add('Name');
        typesSet.add('Email');
        
        if (service.category === 'social-media' || service.category === 'messaging') {
          typesSet.add('Phone');
          typesSet.add('Profile Information');
        }
        if (service.category === 'shopping' || service.category === 'financial') {
          typesSet.add('Payment Information');
          typesSet.add('Address');
        }
        if (service.category === 'search-email') {
          typesSet.add('Search History');
        }
        if (service.category === 'cloud-storage') {
          typesSet.add('Files & Documents');
        }
      }
    });
    
    return Array.from(typesSet).sort();
  }, [selectedServices]);

  // Calculate exposure level
  const exposureLevel = useMemo(() => {
    if (!footprintData || !footprintData.averageExposureIndex) return 'Low';
    
    const index = footprintData.averageExposureIndex;
    if (index >= 70) return 'High';
    if (index >= 50) return 'Medium';
    return 'Low';
  }, [footprintData]);

  const formatCategoryLabel = (category) => {
    const labels = {
      'social-media': 'Social Media',
      'shopping': 'Shopping & E-commerce',
      'messaging': 'Messaging & Communication',
      'streaming': 'Streaming & Entertainment',
      'search-email': 'Search & Email',
      'cloud-storage': 'Cloud Storage',
      'financial': 'Financial Services'
    };
    return labels[category] || category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generatePersonalDataExposureReportPDF({
        selectedServices: selectedServices || [],
        assessmentResults: assessmentResults,
        isUnlocked: isUnlocked
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle purchase success (for web - Stripe redirect)
  React.useEffect(() => {
    const checkUnlock = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('unlocked') === 'true') {
        setIsUnlocked(true);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    checkUnlock();
  }, [setIsUnlocked]);

  // Empty state
  if (!footprintData || !footprintData.services || footprintData.services.length === 0) {
    return (
      <>
        <SEOHead
          title="Personal Data Exposure Report - SocialCaution"
          description="Check where your personal data is exposed online"
          keywords="data exposure, privacy report, personal data"
        />
        <div className="bg-gradient-to-b from-slate-50 via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pb-nav-safe">
          <div className="max-w-6xl md:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-6 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No services selected yet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Select services to check your personal data exposure.
              </p>
              <button
                onClick={() => navigate('/service-catalog')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Shield className="w-5 h-5" />
                Check My Data Exposure
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Free preview sections
  const freePreview = (
    <>
      {/* Section 1: Summary */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Summary
          </h2>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Exposure Level</span>
              <span className={`text-sm font-bold px-3 py-1 rounded ${
                exposureLevel === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                exposureLevel === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}>
                {exposureLevel}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Your personal data appears across multiple third-party exposure categories.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Where Your Data Is Exposed */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Where Your Data Is Exposed
          </h2>
          <div className="space-y-2">
            {footprintData.categoryBreakdown.map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">{formatCategoryLabel(category)}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{count} service{count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Locked content sections (3-6)
  const lockedContent = (
    <>
      {/* Section 3: High-Risk Exposure Sources */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            High-Risk Exposure Sources
          </h2>
          {highRiskSources.length > 0 ? (
            <div className="space-y-2">
              {highRiskSources.map((source, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white">{source.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No high-risk sources detected from your selected services.
            </p>
          )}
        </div>
      </div>

      {/* Section 4: Data Types Involved */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Data Types Involved
          </h2>
          <ul className="space-y-1">
            {dataTypes.map((type, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 5: What This Means */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            What This Means
          </h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Increased profiling</span>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Increased unwanted contact</span>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Increased misuse risk</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Section 6: What You Can Do Next */}
      <div className="mb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            What You Can Do Next
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Guided steps to reduce these exposures are available inside the app.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <SEOHead
        title="Personal Data Exposure Report - SocialCaution"
        description="Check where your personal data is exposed online and get a clear summary"
        keywords="data exposure, privacy report, personal data"
      />
      <div className="bg-gradient-to-b from-slate-50 via-gray-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pb-nav-safe">
        <div className="max-w-6xl md:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4">
          {/* Page Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="page-title mb-2">
                Personal Data Exposure Report
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on your selected services
              </p>
            </div>
            {isUnlocked && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </button>
            )}
          </div>

          {/* Free Preview */}
          {freePreview}

          {/* Locked Content with Paywall */}
          {!isUnlocked ? (
            <Paywall
              productId="personal_data_exposure_report"
              freePreview={null}
              lockedContent={lockedContent}
              ctaText="Unlock Full Report"
              compact={false}
              showBlur={true}
              customTitle="Unlock Your Personal Data Exposure Report"
              customBody="Get a clear, personalized report showing where your personal data is exposed and what matters most."
            />
          ) : (
            <>
              {lockedContent}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ExposureReport;
