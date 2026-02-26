import React from 'react';

/**
 * Uniform page header used across Settings, Dashboard, Service Catalog, etc.
 * Renders on the page background (no box/container): same padding, page-title, subtitle.
 * Same structure: max-w-7xl, pt-8 sm:pt-10 pb-8 sm:pb-10, page-title h1 with icon + title, subtitle text-base sm:text-lg.
 */
const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  iconGradient = 'red',
  children,
}) => {
  const iconGradientClass =
    iconGradient === 'indigo'
      ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
      : 'bg-gradient-to-br from-red-500 to-red-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="page-title mb-1 flex items-center gap-3 sm:gap-4">
            {Icon && (
              <div
                className={`p-1.5 sm:p-2 md:p-2.5 ${iconGradientClass} rounded-lg shadow-md flex-shrink-0 flex items-center justify-center`}
              >
                <Icon className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
            )}
            <span className="leading-tight">{title}</span>
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {children && <div className="flex-shrink-0 flex items-center gap-4">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
