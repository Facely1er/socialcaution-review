import React from 'react';

/**
 * Skip link component for accessibility
 * Allows keyboard users to skip to main content
 * @param {Object} props
 * @param {string} props.href - Target anchor ID (e.g., '#main-content')
 * @param {React.ReactNode} props.children - Link text
 */
const SkipLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-all"
    >
      {children}
    </a>
  );
};

export default SkipLink;

