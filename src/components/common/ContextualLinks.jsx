import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useInternalLinks } from '../../utils/internalLinking';
import { useTranslation } from '../../contexts/TranslationContext';

const ContextualLinks = ({
  currentPage,
  userPersona = null,
  assessmentResults = null,
  className = '',
  showAsCards = false,
  maxLinks = 3,
  includeKeywords = false
}) => {
  const { t } = useTranslation();
  const { contextualLinks, generateKeywordRichAnchor } = useInternalLinks(currentPage, userPersona, assessmentResults);
  const displayLinks = contextualLinks.slice(0, maxLinks);

  if (displayLinks.length === 0) return null;

  if (showAsCards) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {displayLinks.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            title={`${link.text} - ${link.keywords ? link.keywords.join(', ') : 'Privacy-focused navigation'}`}
            aria-label={`${link.text}${link.keywords ? ` - Related topics: ${link.keywords.join(', ')}` : ''}`}
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all group ${
              link.priority === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : 
              'bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                link.priority === 'high' ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-white'
              }`}>
                {includeKeywords && link.keywords ? generateKeywordRichAnchor(link.text, link.keywords, userPersona?.primary) : link.text}
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                link.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
              }`} />
            </div>
            {link.priority === 'high' && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                {t('contextualLinks.recommendedNextStep')}
              </div>
            )}
            {link.keywords && link.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {link.keywords.slice(0, 2).map((keyword, kidx) => (
                  <span key={kidx} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t('contextualLinks.suggestedNextSteps')}
      </h3>
      {displayLinks.map((link, index) => (
        <Link
          key={index}
          to={link.url}
          title={`${link.text} - ${link.keywords ? link.keywords.join(', ') : 'Navigation link'}`}
          aria-label={link.text}
          className={`flex items-center text-sm transition-colors group ${
            link.priority === 'high' ? 'text-red-600 dark:text-red-400 font-medium' : 
            'text-blue-600 dark:text-blue-400'
          }`}
        >
          <ChevronRight className="w-3 h-3 mr-1 transition-transform group-hover:translate-x-1" />
          <span className="hover:underline">{includeKeywords && link.keywords ? generateKeywordRichAnchor(link.text, link.keywords, userPersona?.primary) : link.text}</span>
          {link.priority === 'high' && (
            <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
              {t('contextualLinks.priority')}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ContextualLinks;