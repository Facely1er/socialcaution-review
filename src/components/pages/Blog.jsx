import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Info } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const Blog = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Privacy Blog - SocialCaution"
        description="Privacy news, tips, and insights"
        keywords="privacy blog, privacy news, privacy tips"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton to="/" label="Home" variant="button" />
          
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <div>
                <h1 className="page-title">
                  Privacy Blog
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Privacy news, tips, and insights
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Blog Coming Soon
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Our privacy blog with news, tips, and insights is coming soon. 
                    In the meantime, you can explore our Services Monitoring to understand privacy risks 
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

export default Blog;

