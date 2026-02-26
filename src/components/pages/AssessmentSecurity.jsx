import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Info } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const AssessmentSecurity = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Security Awareness Assessment - SocialCaution"
        description="Educational security evaluation including ransomware awareness"
        keywords="security assessment, cybersecurity, security awareness"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton to="/" label="Home" variant="button" />
          
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="page-title">
                  Security Awareness Assessment
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Educational security evaluation including ransomware awareness
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Assessment Available in Standard Version
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    The full Security Awareness Assessment is available in our Standard version. 
                    In the Basic version, you can explore our Services Monitoring to understand privacy risks 
                    for 200+ online services.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/service-catalog')}
                className="w-full px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-lg hover:from-accent-dark hover:to-accent transition-all"
              >
                Explore Services Monitoring
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentSecurity;

