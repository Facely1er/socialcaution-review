import { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { getCategoryIcon, getCategoryDisplayName, getCategoryColor } from '../../utils/categoryHelpers';

/**
 * Enhanced Category Filter Component
 * Provides visual category cards, quick filters, and active filter management
 */
const EnhancedCategoryFilter = ({ 
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  serviceCounts = {},
  getPrivacyExposureIndex,
  allServices = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Expanded by default for better UX
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    return categories.reduce((acc, category) => {
      const categoryServices = allServices.filter(s => s.category === category);
      const avgExposure = categoryServices.length > 0
        ? Math.round(
            categoryServices.reduce((sum, s) => sum + (getPrivacyExposureIndex(s.id) || 0), 0) / categoryServices.length
          )
        : 0;
      
      acc[category] = {
        count: serviceCounts[category] || 0,
        avgExposure
      };
      return acc;
    }, {});
  }, [categories, serviceCounts, allServices, getPrivacyExposureIndex]);

  // Sort categories by count
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const countA = categoryStats[a]?.count || 0;
      const countB = categoryStats[b]?.count || 0;
      return countB - countA;
    });
  }, [categories, categoryStats]);

  // Show only top categories initially
  const displayedCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 6);

  const toggleCategory = (category, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
  };

  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="space-y-2.5">
      {/* Category Filters */}
      <div>
        <div className="w-full flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Filter by Category
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[10px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
              type="button"
            >
              <X className="w-2.5 h-2.5" />
              Clear All
            </button>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-end gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          type="button"
        >
          <span>{isExpanded ? 'Hide Categories' : 'Show Categories'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 mb-2 relative z-10">
              {displayedCategories.map(category => {
                if (category === 'all') return null;
                
                const Icon = getCategoryIcon(category);
                const colors = getCategoryColor(category);
                const displayName = getCategoryDisplayName(category);
                const isSelected = selectedCategories.includes(category);
                const stats = categoryStats[category] || { count: 0, avgExposure: 0 };

                return (
                  <button
                    key={category}
                    onClick={(e) => toggleCategory(category, e)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all text-center cursor-pointer
                      ${isSelected 
                        ? `${colors.bg} ${colors.border} ${colors.text} font-semibold shadow-sm` 
                        : `bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 ${colors.hover}`
                      }
                    `}
                    type="button"
                    aria-label={`Filter by ${displayName}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`w-5 h-5 ${isSelected ? colors.text : 'text-gray-500 dark:text-gray-400'}`} />
                      <div className="flex flex-col items-center gap-0.5">
                        <div className={`text-xs font-medium ${isSelected ? colors.text : 'text-gray-900 dark:text-white'}`}>
                          {displayName}
                        </div>
                        <div className={`text-[10px] ${isSelected ? colors.text : 'text-gray-500 dark:text-gray-400'}`}>
                          {stats.count} {stats.count === 1 ? 'service' : 'services'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className={`absolute top-1 right-1 w-4 h-4 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <X className={`w-2.5 h-2.5 ${colors.text}`} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Show More/Less Button */}
            {sortedCategories.length > 6 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                type="button"
              >
                {showAllCategories 
                  ? `Show Less` 
                  : `Show ${sortedCategories.length - 6} More`
                }
              </button>
            )}
          </>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
            Active:
          </span>
          
          {selectedCategories.map(category => {
            const colors = getCategoryColor(category);
            const displayName = getCategoryDisplayName(category);
            
            return (
              <span 
                key={category}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 ${colors.bg} ${colors.text} rounded text-[10px] font-medium`}
              >
                {displayName}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCategory(category, e);
                  }}
                  className={`${colors.hover} rounded-full p-0.5 cursor-pointer`}
                  type="button"
                  aria-label={`Remove ${displayName} filter`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnhancedCategoryFilter;

