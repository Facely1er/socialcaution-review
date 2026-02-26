import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Wrench } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const Breadcrumbs = ({ personaColor = null, customBreadcrumbs = null }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const getBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [{ name: t('common.navigation.privacyToolkit'), href: '/toolkit-access', current: false }];

    if (pathnames.length === 0) {
      breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    // Toolkit root only: single crumb
    if ((pathnames[0] === 'toolkit' || pathnames[0] === 'toolkit-access') && pathnames.length === 1) {
      breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    // Generate breadcrumbs based on route (2-3 levels from Privacy Toolkit)
    if (pathnames[0] === 'assessment') {
      breadcrumbs.push({
        name: t('common.breadcrumbs.assessment'),
        href: '/assessment',
        current: false
      });
      
      if (pathnames[1] === 'exposure') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.digitalPrivacyRisk'),
          href: '/assessment/exposure',
          current: true
        });
      } else if (pathnames[1] === 'rights' || pathnames[1] === 'privacy-rights') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.privacyRights'),
          href: '/assessment/privacy-rights',
          current: true
        });
      } else if (pathnames[1] === 'full') {
        breadcrumbs.push({
          name: t('common.breadcrumbs.completePrivacy'),
          href: '/assessment/full',
          current: true
        });
      }
    } else if (pathnames[0] === 'dashboard') {
      breadcrumbs.push({
        name: t('common.navigation.dashboard'),
        href: '/dashboard',
        current: true
      });
    } else if (pathnames[0] === 'resources') {
      breadcrumbs.push({
        name: t('common.navigation.dashboard'),
        href: '/dashboard',
        current: false
      });
      breadcrumbs.push({
        name: t('common.toolkit.privacyResources'),
        href: '/adaptive-resources',
        current: true
      });
    } else if (pathnames[0] === 'results') {
      breadcrumbs.push({
        name: t('assessments.results'),
        href: '/assessment',
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const accentColor = personaColor?.accent || 'text-red-600 dark:text-red-400';
  const hoverColor = personaColor?.button || 'hover:text-red-500';

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.name} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
            {breadcrumb.current ? (
              <span className={`font-medium ${accentColor} flex items-center`}>
                {breadcrumb.href === '/toolkit-access' ? (
                  <>
                    <Wrench className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                    {breadcrumb.name}
                  </>
                ) : (
                  breadcrumb.name
                )}
              </span>
            ) : (
              <Link
                to={breadcrumb.href}
                className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${hoverColor} transition-colors flex items-center`}
              >
                {breadcrumb.href === '/toolkit-access' ? (
                  <>
                    <Wrench className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
                    {breadcrumb.name}
                  </>
                ) : (
                  breadcrumb.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;