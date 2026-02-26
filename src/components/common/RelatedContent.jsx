import { Link } from 'react-router-dom';
import { BookOpen, Wrench, Target, ChevronRight } from 'lucide-react';
import { useInternalLinks } from '../../utils/internalLinking';
import { PersonaProfiles } from '../../data/personaProfiles';
import { getIconComponent } from '../../utils/iconMapping.js';
import { useTranslation } from '../../contexts/TranslationContext';

const RelatedContent = ({ 
  userPersona, 
  currentPage,
  assessmentResults = null,
  title = "Continue Your Privacy Journey",
  showPersonaSpecific = true,
  className = ""
}) => {
  const { t } = useTranslation();
  const { relatedContent, getAnchorText } = useInternalLinks(currentPage, userPersona, assessmentResults);

  if (!userPersona || !relatedContent[userPersona.primary]) {
    return null;
  }

  const persona = PersonaProfiles[userPersona.primary];
  const related = relatedContent[userPersona.primary];

  const contentSections = [
    {
      title: 'Recommended Resources',
      icon: BookOpen,
      items: (related.resources || []).map(resourceId => ({
        id: resourceId,
        title: resourceId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        url: `/adaptive-resources?filter=${resourceId}`,
        description: `Learn more about ${resourceId.replace('-', ' ')}`
      })),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Recommended Tools',
      icon: Wrench,
      items: (related.tools || []).map(toolId => ({
        id: toolId,
        title: toolId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        url: `/toolkit-access?tool=${toolId}`,
        description: `Use ${toolId.replace('-', ' ')} to improve your privacy`
      })),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  // Add assessment recommendations if not on assessment pages
  if (!currentPage.includes('assessment') && related.assessments && related.assessments.length > 0) {
    contentSections.push({
      title: 'Assessment Recommendations',
      icon: Target,
      items: related.assessments.map(assessmentType => ({
        id: assessmentType,
        title: assessmentType === 'exposure' ? 'Privacy Risk Exposure Assessment' : 
               assessmentType === 'rights' ? 'Privacy Rights Knowledge Checkup' : 
               'Complete Privacy Assessment',
        url: `/assessment/${assessmentType}`,
        description: assessmentType === 'exposure' ? 'Evaluate your privacy risks and social footprint' :
                    assessmentType === 'rights' ? 'Test your privacy rights knowledge' :
                    'Get comprehensive privacy evaluation'
      })),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    });
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          {(() => {
            const IconComponent = getIconComponent(persona.icon);
            return <IconComponent className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-300" />;
          })()}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            {showPersonaSpecific && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Curated for <span className="font-medium">{t(`personas.${userPersona.primary}.name`)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {contentSections.map((section) => (
            <div key={section.title}>
              <h4 className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <section.icon className={`w-4 h-4 mr-2 ${section.color}`} />
                {section.title}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {section.items.slice(0, 3).map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className={`p-3 rounded-lg ${section.bgColor} hover:shadow-sm transition-all group`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:underline">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to view all recommendations */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            View Full Dashboard
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedContent;