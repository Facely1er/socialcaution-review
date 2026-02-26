import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  heroBackground = true,
  backgroundType = 'default',
  breadcrumbs = []
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {heroBackground && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
            {breadcrumbs.length > 0 && (
              <nav className="mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-white font-medium">{crumb.label}</span>
                      ) : (
                        <a href={crumb.path} className="text-white/80 hover:text-white">
                          {crumb.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
          {backgroundType === 'blog' && (
            <canvas 
              className="absolute inset-0 w-full h-full opacity-20"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

