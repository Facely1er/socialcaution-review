import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Export button component for exporting assessment data
 * Note: Requires exportUtils to be implemented
 * @param {Object} props
 * @param {Object} props.data - Data to export (must match ExportableData interface)
 * @param {string} [props.className=''] - Additional CSS classes
 */
const ExportButton = ({ data, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleExport = async (format) => {
    try {
      // Dynamic import to avoid errors if exportUtils not yet implemented
      const { exportToPDF, exportToCSV, exportToJSON } = await import('../../utils/exportUtils');
      
      switch (format) {
        case 'pdf':
          exportToPDF(data);
          break;
        case 'csv':
          exportToCSV(data);
          break;
        case 'json':
          exportToJSON(data);
          break;
        default:
          console.error('Unknown export format:', format);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      // Fallback: show alert if export utilities not available
      alert(t('errors.export.setupInProgress'));
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'Export as PDF',
      icon: FileText,
      action: () => handleExport('pdf'),
      description: 'Download as PDF report'
    },
    {
      id: 'csv',
      label: 'Export as CSV',
      icon: FileSpreadsheet,
      action: () => handleExport('csv'),
      description: 'Download as CSV spreadsheet'
    },
    {
      id: 'json',
      label: 'Export as JSON',
      icon: FileJson,
      action: () => handleExport('json'),
      description: 'Download raw data as JSON'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
            <div className="p-2">
              {exportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;

