import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Shield, Database, AlertTriangle, CheckCircle, X, Download, Upload, FileDown, Sparkles, Info, Settings, Zap, Loader2, Heart, MapPin, Fingerprint, CreditCard, User, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { localStorageService } from '../../services/localStorageService';
import { exportPersonalDataInventoryToPDF, exportPersonalDataInventoryToCSV, exportPersonalDataInventoryToJSON } from '../../utils/personalDataInventoryExport';
import { 
  shouldShowAutoPopulate, 
  previewInventoryFromServices, 
  addServicesToInventory,
  dismissAutoPopulate,
  getSelectedServices
} from '../../services/inventoryAutoPopulateService';
import { serviceCatalog } from '../../data/serviceCatalog';
import SEOHead from '../common/SEOHead';
import { useTranslation } from '../../contexts/TranslationContext';
import { useNotifications } from '../common/NotificationSystem';

const PersonalDataInventory = () => {
  const { t } = useTranslation();
  const { showSuccess, showError, showInfo } = useNotifications();
  const [dataItems, setDataItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAutoPopulateBanner, setShowAutoPopulateBanner] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isPopulating, setIsPopulating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedServicesInPreview, setSelectedServicesInPreview] = useState([]);
  const hasAutoPopulatedRef = useRef(false);
  const [userId] = useState(() => {
    // Get or create a user ID for localStorage
    let id = localStorage.getItem('socialcaution_user_id');
    if (!id) {
      id = `user_${Date.now()}`;
      localStorage.setItem('socialcaution_user_id', id);
    }
    return id;
  });

  // Load automated auto-populate setting
  const [isAutomated, setIsAutomated] = useState(() => {
    try {
      const saved = localStorage.getItem('socialcaution_auto_populate_automated');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const categories = [
    {
      id: 'personal_info',
      name: t('personalDataInventory.categories.personal_info.name'),
      description: t('personalDataInventory.categories.personal_info.description'),
      icon: User,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'financial',
      name: t('personalDataInventory.categories.financial.name'),
      description: t('personalDataInventory.categories.financial.description'),
      icon: CreditCard,
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'health',
      name: t('personalDataInventory.categories.health.name'),
      description: t('personalDataInventory.categories.health.description'),
      icon: Heart,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      id: 'social',
      name: t('personalDataInventory.categories.social.name'),
      description: t('personalDataInventory.categories.social.description'),
      icon: Share2,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'location',
      name: t('personalDataInventory.categories.location.name'),
      description: t('personalDataInventory.categories.location.description'),
      icon: MapPin,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
    {
      id: 'biometric',
      name: t('personalDataInventory.categories.biometric.name'),
      description: t('personalDataInventory.categories.biometric.description'),
      icon: Fingerprint,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    }
  ];

  // Save automated setting
  useEffect(() => {
    try {
      localStorage.setItem('socialcaution_auto_populate_automated', isAutomated.toString());
    } catch (error) {
      console.error('Error saving automated setting:', error);
    }
  }, [isAutomated]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = localStorageService.getPersonalDataInventory(userId);
        if (data && Array.isArray(data)) {
          setDataItems(data);
          
          // Check if should show auto-populate banner (only if not automated)
          if (!isAutomated && shouldShowAutoPopulate(data)) {
            setShowAutoPopulateBanner(true);
            // Load preview data
            const preview = previewInventoryFromServices();
            setPreviewData(preview);
          }
        } else {
          // Empty inventory - check for auto-populate
          if (!isAutomated && shouldShowAutoPopulate([])) {
            setShowAutoPopulateBanner(true);
            const preview = previewInventoryFromServices();
            setPreviewData(preview);
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, [userId, isAutomated]);

  // Save data to localStorage whenever dataItems changes
  useEffect(() => {
    if (dataItems.length > 0) {
      try {
        localStorageService.savePersonalDataInventory(userId, dataItems);
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [dataItems, userId]);

  // Check for new services and auto-populate if automated mode is enabled
  useEffect(() => {
    const checkForNewServices = () => {
      const selectedServices = getSelectedServices();
      if (selectedServices.length === 0) {
        hasAutoPopulatedRef.current = false;
        return;
      }

      // Get services that are already in inventory
      const servicesInInventory = new Set(
        (dataItems || [])
          .filter(item => item?.sourceService)
          .map(item => item.sourceService)
      );

      // Find new services not yet in inventory
      const newServices = selectedServices.filter(
        serviceId => !servicesInInventory.has(serviceId)
      );

      // Reset ref if there are new services (allowing re-population)
      if (newServices.length > 0) {
        hasAutoPopulatedRef.current = false;
      }

      // Auto-populate if automated mode is enabled and there are new services
      if (isAutomated && newServices.length > 0 && !hasAutoPopulatedRef.current) {
        const preview = previewInventoryFromServices(newServices);
        if (preview.totalEntries > 0) {
          hasAutoPopulatedRef.current = true;
          setTimeout(() => {
            handleAutoPopulate(newServices, true); // true = silent mode
          }, 500); // Small delay for better UX
        }
      }
    };

    // Only check if we have data items loaded
    if (dataItems.length >= 0) {
      checkForNewServices();
    }
  }, [dataItems, isAutomated]);

  const getSensitivityColor = (sensitivity) => {
    switch (sensitivity) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSensitivityIcon = (sensitivity) => {
    switch (sensitivity) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return null;
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? dataItems 
    : dataItems.filter(item => item.category === selectedCategory);

  const getCategoryStats = () => {
    return categories.map(category => {
      const count = dataItems.filter(item => item.category === category.id).length;
      const highSensitivity = dataItems.filter(item => 
        item.category === category.id && item.sensitivity === 'high'
      ).length;
      return { ...category, count, highSensitivity };
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal_info',
    sensitivity: 'medium',
    storedBy: [],
    purpose: '',
    retention: '',
    sharedWith: []
  });

  const [storedByInput, setStoredByInput] = useState('');
  const [sharedWithInput, setSharedWithInput] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [purposeSuggestions, setPurposeSuggestions] = useState([]);
  const [showPurposeSuggestions, setShowPurposeSuggestions] = useState(false);
  const [storedBySuggestions, setStoredBySuggestions] = useState([]);
  const [showStoredBySuggestions, setShowStoredBySuggestions] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setStoredByInput(editingItem.storedBy?.join(', ') || '');
      setSharedWithInput(editingItem.sharedWith?.join(', ') || '');
      setShowAddForm(true);
    } else if (showAddForm) {
      setFormData({
        name: '',
        description: '',
        category: 'personal_info',
        sensitivity: 'medium',
        storedBy: [],
        purpose: '',
        retention: '',
        sharedWith: []
      });
      setStoredByInput('');
      setSharedWithInput('');
      setNameSuggestions([]);
      setShowNameSuggestions(false);
      setPurposeSuggestions([]);
      setShowPurposeSuggestions(false);
      setStoredBySuggestions([]);
      setShowStoredBySuggestions(false);
    }
  }, [editingItem, showAddForm]);

  // Update name suggestions when category changes
  useEffect(() => {
    if (showAddForm && formData.category) {
      const suggestions = commonDataTypes[formData.category] || [];
      if (formData.name.length > 0) {
        const filtered = suggestions.filter(item => 
          item.toLowerCase().includes(formData.name.toLowerCase())
        );
        setNameSuggestions(filtered.slice(0, 5));
        setShowNameSuggestions(filtered.length > 0);
      }
    }
  }, [formData.category, showAddForm]);

  // Common data type suggestions
  const commonDataTypes = {
    personal_info: ['Full Name', 'Email Address', 'Phone Number', 'Date of Birth', 'Home Address', 'Mailing Address', 'National ID', 'Passport Number', 'Driver License'],
    financial: ['Credit Card Number', 'Bank Account Number', 'Payment History', 'Transaction Records', 'Tax Information', 'Salary Information', 'Investment Details'],
    health: ['Medical Records', 'Prescription History', 'Health Insurance Info', 'Blood Type', 'Allergies', 'Vaccination Records', 'Doctor Visits'],
    social: ['Social Media Posts', 'Profile Information', 'Friends List', 'Photos', 'Videos', 'Messages', 'Comments', 'Likes'],
    location: ['GPS Coordinates', 'IP Address', 'WiFi Location', 'Travel History', 'Check-ins', 'Location History'],
    biometric: ['Fingerprint', 'Face Recognition Data', 'Voice Print', 'Iris Scan', 'DNA Information']
  };

  // Common purposes
  const commonPurposes = [
    'Account Management',
    'Service Delivery',
    'Marketing',
    'Analytics',
    'Customer Support',
    'Legal Compliance',
    'Fraud Prevention',
    'Personalization',
    'Payment Processing',
    'Security',
    'Research',
    'Advertising'
  ];

  // Common retention periods
  const commonRetentionPeriods = [
    'Until account deletion',
    '1 year',
    '2 years',
    '3 years',
    '5 years',
    '7 years',
    '10 years',
    'Indefinitely',
    'As required by law'
  ];

  // Get service suggestions for "Stored By"
  const getServiceSuggestions = () => {
    const selectedServices = getSelectedServices();
    return selectedServices.map(id => {
      const service = serviceCatalog.find(s => s.id === id);
      return service?.name || id;
    });
  };

  // Handle name input with autocomplete
  const handleNameChange = (value) => {
    setFormData({ ...formData, name: value });
    if (value.length > 0) {
      const suggestions = commonDataTypes[formData.category] || [];
      const filtered = suggestions.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setNameSuggestions(filtered.slice(0, 5));
      setShowNameSuggestions(filtered.length > 0);
    } else {
      setNameSuggestions([]);
      setShowNameSuggestions(false);
    }
  };

  // Handle purpose input with autocomplete
  const handlePurposeChange = (value) => {
    setFormData({ ...formData, purpose: value });
    if (value.length > 0) {
      const filtered = commonPurposes.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setPurposeSuggestions(filtered.slice(0, 5));
      setShowPurposeSuggestions(filtered.length > 0);
    } else {
      setPurposeSuggestions([]);
      setShowPurposeSuggestions(false);
    }
  };

  // Handle stored by input with autocomplete
  const handleStoredByChange = (value) => {
    setStoredByInput(value);
    if (value.length > 0) {
      const serviceNames = getServiceSuggestions();
      const filtered = serviceNames.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      );
      setStoredBySuggestions(filtered.slice(0, 5));
      setShowStoredBySuggestions(filtered.length > 0);
    } else {
      setStoredBySuggestions([]);
      setShowStoredBySuggestions(false);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'personal_info',
      sensitivity: 'medium',
      storedBy: [],
      purpose: '',
      retention: '',
      sharedWith: []
    });
    setStoredByInput('');
    setSharedWithInput('');
    setNameSuggestions([]);
    setShowNameSuggestions(false);
    setPurposeSuggestions([]);
    setShowPurposeSuggestions(false);
    setStoredBySuggestions([]);
    setShowStoredBySuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const storedByArray = storedByInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const sharedWithArray = sharedWithInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    // Auto-generate name if empty - use category name or default
    const categoryName = categories.find(c => c.id === (formData.category || 'personal_info'))?.name || 'Data Item';
    const autoName = formData.name?.trim() || `${categoryName} ${Date.now().toString().slice(-4)}`;

    const newItem = {
      id: editingItem?.id || Date.now().toString(),
      name: autoName,
      description: formData.description || '',
      category: formData.category || 'personal_info',
      sensitivity: formData.sensitivity || 'medium',
      storedBy: storedByArray,
      purpose: formData.purpose || '',
      retention: formData.retention || '',
      sharedWith: sharedWithArray,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (editingItem) {
      setDataItems(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setDataItems(prev => [...prev, newItem]);
    }

    handleCloseForm();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result);
          if (json.items && Array.isArray(json.items)) {
            setDataItems(json.items);
            alert(t('personalDataInventory.messages.importSuccess'));
          } else {
            alert(t('personalDataInventory.messages.importError'));
          }
        } catch (error) {
          alert(t('personalDataInventory.messages.importFileError'));
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePreviewAutoPopulate = (serviceIds = null) => {
    const preview = previewInventoryFromServices(serviceIds);
    setPreviewData(preview);
    // Initialize with all services selected if none provided
    if (serviceIds && serviceIds.length > 0) {
      setSelectedServicesInPreview(serviceIds);
    } else {
      setSelectedServicesInPreview(preview.services.map(s => s.id));
    }
    setShowPreviewModal(true);
  };

  const toggleServiceInPreview = (serviceId) => {
    setSelectedServicesInPreview(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleAutoPopulate = (serviceIds = null, silent = false) => {
    setIsPopulating(true);
    try {
      const result = addServicesToInventory(dataItems, serviceIds);
      
      if (result.success) {
        setDataItems(result.merged);
        setShowAutoPopulateBanner(false);
        setShowPreviewModal(false);
        setSelectedServicesInPreview([]);
        
        if (!silent) {
          const message = result.added > 0 
            ? `Successfully added ${result.added} new inventory item${result.added !== 1 ? 's' : ''} from your selected services.${result.duplicates > 0 ? ` ${result.duplicates} duplicate${result.duplicates !== 1 ? 's' : ''} were skipped.` : ''}`
            : `All entries from selected services are already in your inventory.`;
          
          showSuccess(message, {
            title: 'Inventory Updated',
            duration: 6000
          });
        } else {
          // Silent mode - just show a brief info notification
          showInfo(`Automatically added ${result.added} inventory item${result.added !== 1 ? 's' : ''} from new services.`, {
            title: 'Auto-Populated',
            duration: 4000
          });
        }
      } else {
        if (!silent) {
          showError(result.error || 'Failed to add services to inventory', {
            title: 'Error'
          });
        }
      }
    } catch (error) {
      console.error('Error auto-populating inventory:', error);
      if (!silent) {
        showError('An error occurred while auto-populating. Please try again.', {
          title: 'Error'
        });
      }
    } finally {
      setIsPopulating(false);
    }
  };

  const handleDismissAutoPopulate = () => {
    dismissAutoPopulate();
    setShowAutoPopulateBanner(false);
  };

  return (
    <>
      <SEOHead
        title={`${t('personalDataInventory.title')} - SocialCaution Privacy Platform`}
        description={t('personalDataInventory.description')}
        keywords="personal data inventory, data tracking, privacy management, data protection"
        canonicalUrl={`${window.location.origin}/tools/personal-data-inventory`}
      />
      
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50 dark:from-slate-900 dark:via-red-950/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t('personalDataInventory.title')}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('personalDataInventory.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Export + Settings - top right of content area */}
          <div className="flex justify-end items-center gap-1 mb-4 mt-4">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={t('personalDataInventory.actions.export') || 'Export'}
                title={t('personalDataInventory.actions.export') || 'Export'}
              >
                <Download className="h-5 w-5" />
              </button>
              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[150px]">
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToPDF(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {t('personalDataInventory.actions.exportPDF')}
                    </button>
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToCSV(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {t('personalDataInventory.actions.exportCSV')}
                    </button>
                    <button
                      onClick={() => {
                        exportPersonalDataInventoryToJSON(dataItems);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center text-sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {t('personalDataInventory.actions.exportJSON')}
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Settings"
              title="Auto-populate settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Automated Auto-Populate
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isAutomated 
                    ? 'Automatically add inventory entries when you select new services in Services Monitoring.'
                    : 'Manually review and add inventory entries when new services are detected.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={isAutomated}
                  onChange={(e) => {
                    setIsAutomated(e.target.checked);
                    if (e.target.checked) {
                      showInfo('Automated auto-populate enabled. New services will be added automatically.', {
                        title: 'Automated Mode Enabled',
                        duration: 5000
                      });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {isAutomated && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    When enabled, inventory entries are automatically created from your selected services. 
                    You can still manually edit or delete any entries at any time.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Real Tool Indicator */}
        <div className="mb-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                  {t('personalDataInventory.realTool.title')}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('personalDataInventory.realTool.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Services Button (if services selected but not in inventory) */}
        {(() => {
          const selectedServices = getSelectedServices();
          const servicesInInventory = new Set(
            dataItems.filter(item => item.sourceService).map(item => item.sourceService)
          );
          const newServices = selectedServices.filter(id => !servicesInInventory.has(id));
          
          if (newServices.length > 0 && dataItems.length > 0) {
            const preview = previewInventoryFromServices(newServices);
            if (preview.totalEntries > 0) {
              return (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">
                          New Services Detected
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You've added {newServices.length} new service{newServices.length !== 1 ? 's' : ''} to your catalog. 
                        Add {preview.totalEntries} inventory entries for these services?
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const preview = previewInventoryFromServices(newServices);
                        setPreviewData(preview);
                        setSelectedServicesInPreview(newServices);
                        setShowPreviewModal(true);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium ml-4 flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Add Services
                    </button>
                  </div>
                </div>
              );
            }
          }
          return null;
        })()}

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-start">
          {getCategoryStats().map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="category-card bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedCategory(category.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCategory(category.id);
                  }
                }}
              >
                <div className="flex items-center mb-2">
                  <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded flex-shrink-0 ${category.color}`}>
                    {category.count}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>
                {category.highSensitivity > 0 && (
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{category.highSensitivity} {t('personalDataInventory.labels.sensitiveData')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filter, Add Button, and Export/Import */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="flex flex-wrap gap-2 items-stretch">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-normal text-left min-h-[2.5rem] ${
                  selectedCategory === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {t('personalDataInventory.actions.all')}
              </button>
              {categories.slice(0, 3).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-normal text-left min-h-[2.5rem] max-w-[10rem] ${
                    selectedCategory === category.id
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-stretch">
              {categories.slice(3, 6).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-normal text-left min-h-[2.5rem] max-w-[10rem] ${
                    selectedCategory === category.id
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dataItems.length > 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center px-4 py-2 min-h-[40px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                {t('personalDataInventory.actions.addData')}
              </button>
            )}
          </div>
        </div>

        {/* Data Items List */}
        <div className="space-y-4 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {item.source === 'auto-populated' && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded font-medium flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Auto-populated
                        </span>
                      )}
                      {isAutomated && item.source === 'auto-populated' && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded font-medium flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Automated
                        </span>
                      )}
                      <div className="flex items-center">
                        {getSensitivityIcon(item.sensitivity)}
                        <span className={`ml-1 text-sm font-medium ${getSensitivityColor(item.sensitivity)}`}>
                          {item.sensitivity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {item.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Edit item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDataItems(prev => prev.filter(i => i.id !== item.id))}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('personalDataInventory.labels.storedBy')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.storedBy?.map((entity, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded">
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('personalDataInventory.labels.purpose')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.purpose}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('personalDataInventory.labels.retention')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.retention}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('personalDataInventory.labels.sharedWith')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.sharedWith?.map((entity, idx) => {
                      const isDataBroker = entity.toLowerCase().includes('data broker') || 
                                          entity.toLowerCase().includes('broker');
                      return (
                        <span 
                          key={idx} 
                          className={`px-2 py-1 text-xs rounded ${
                            isDataBroker 
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 font-medium' 
                              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                          }`}
                        >
                          {entity}
                        </span>
                      );
                    })}
                  </div>
                  {item.sharedWith?.some(entity => 
                    entity.toLowerCase().includes('data broker') || 
                    entity.toLowerCase().includes('broker')
                  ) && (
                    <Link
                      to="/tools/data-broker-removal"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      Remove from data brokers
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('personalDataInventory.labels.lastUpdated')} {item.lastUpdated}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('personalDataInventory.empty.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('personalDataInventory.empty.message')}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              {t('personalDataInventory.actions.addData')}
            </button>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-red-500/20 rounded-lg p-6 mt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            {t('personalDataInventory.stats.inventorySummary')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">
                {dataItems.length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {t('personalDataInventory.stats.totalItems')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {dataItems.filter(item => item.sensitivity === 'high').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {t('personalDataInventory.stats.sensitiveData')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {dataItems.filter(item => item.sensitivity === 'medium').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {t('personalDataInventory.stats.mediumData')}
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {dataItems.filter(item => item.sensitivity === 'low').length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {t('personalDataInventory.stats.lowData')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingItem ? t('personalDataInventory.actions.editItem') : t('personalDataInventory.actions.addItem')}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="data-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('personalDataInventory.form.name')} <span className="text-gray-400 dark:text-gray-500 text-xs">(auto-generated if empty)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="data-name"
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => {
                        if (formData.name && formData.name.length > 0) {
                          const suggestions = commonDataTypes[formData.category] || [];
                          const filtered = suggestions.filter(item => 
                            item.toLowerCase().includes(formData.name.toLowerCase())
                          );
                          setNameSuggestions(filtered.slice(0, 5));
                          setShowNameSuggestions(filtered.length > 0);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowNameSuggestions(false), 200)}
                      placeholder="Leave empty to auto-generate, or type a name..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    {showNameSuggestions && nameSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {nameSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, name: suggestion });
                              setNameSuggestions([]);
                              setShowNameSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs text-gray-900 dark:text-white"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Quick select buttons for common data types */}
                  {(commonDataTypes[formData.category] || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {(commonDataTypes[formData.category] || []).slice(0, 4).map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, name: item })}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="data-category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('personalDataInventory.form.category')}
                    </label>
                    <select
                      id="data-category"
                      value={formData.category || 'personal_info'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-2.5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="data-sensitivity" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('personalDataInventory.form.sensitivity')}
                    </label>
                    <select
                      id="data-sensitivity"
                      value={formData.sensitivity || 'medium'}
                      onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value })}
                      className="w-full px-2.5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">{t('personalDataInventory.sensitivity.low')}</option>
                      <option value="medium">{t('personalDataInventory.sensitivity.medium')}</option>
                      <option value="high">{t('personalDataInventory.sensitivity.high')}</option>
                    </select>
                  </div>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-2">
                    Additional Details (Optional)
                  </summary>
                  <div className="space-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                    <div>
                      <label htmlFor="data-description" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('personalDataInventory.form.description')}
                      </label>
                      <textarea
                        id="data-description"
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="data-stored-by" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('personalDataInventory.form.storedBy')}
                      </label>
                      <div className="relative">
                        <input
                          id="data-stored-by"
                          type="text"
                          value={storedByInput}
                          onChange={(e) => handleStoredByChange(e.target.value)}
                          onFocus={() => {
                            if (storedByInput.length > 0) {
                              const serviceNames = getServiceSuggestions();
                              const filtered = serviceNames.filter(name => 
                                name.toLowerCase().includes(storedByInput.toLowerCase())
                              );
                              setStoredBySuggestions(filtered.slice(0, 5));
                              setShowStoredBySuggestions(filtered.length > 0);
                            }
                          }}
                          onBlur={() => setTimeout(() => setShowStoredBySuggestions(false), 200)}
                          placeholder={t('personalDataInventory.form.storedByPlaceholder')}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        {showStoredBySuggestions && storedBySuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {storedBySuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const current = storedByInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
                                  if (!current.includes(suggestion)) {
                                    setStoredByInput(current.length > 0 ? `${storedByInput}, ${suggestion}` : suggestion);
                                  }
                                  setStoredBySuggestions([]);
                                  setShowStoredBySuggestions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs text-gray-900 dark:text-white"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {getServiceSuggestions().length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {getServiceSuggestions().slice(0, 5).map((serviceName, idx) => {
                            const current = storedByInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            const isSelected = current.includes(serviceName);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setStoredByInput(current.filter(s => s !== serviceName).join(', '));
                                  } else {
                                    setStoredByInput(current.length > 0 ? `${storedByInput}, ${serviceName}` : serviceName);
                                  }
                                }}
                                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                                  isSelected
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                                }`}
                              >
                                {serviceName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="data-purpose" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('personalDataInventory.form.purpose')}
                      </label>
                      <div className="relative">
                        <input
                          id="data-purpose"
                          type="text"
                          value={formData.purpose || ''}
                          onChange={(e) => handlePurposeChange(e.target.value)}
                          onFocus={() => {
                            if (formData.purpose.length > 0) {
                              const filtered = commonPurposes.filter(item => 
                                item.toLowerCase().includes(formData.purpose.toLowerCase())
                              );
                              setPurposeSuggestions(filtered.slice(0, 5));
                              setShowPurposeSuggestions(filtered.length > 0);
                            }
                          }}
                          onBlur={() => setTimeout(() => setShowPurposeSuggestions(false), 200)}
                          placeholder="e.g., Service delivery, Marketing"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        {showPurposeSuggestions && purposeSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {purposeSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, purpose: suggestion });
                                  setPurposeSuggestions([]);
                                  setShowPurposeSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs text-gray-900 dark:text-white"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {commonPurposes.slice(0, 4).map((purpose, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, purpose })}
                            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            {purpose}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="data-retention" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('personalDataInventory.form.retention')}
                        </label>
                        <select
                          id="data-retention"
                          value={formData.retention || ''}
                          onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Any period</option>
                          {commonRetentionPeriods.map((period, idx) => (
                            <option key={idx} value={period}>{period}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="data-shared-with" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('personalDataInventory.form.sharedWith')}
                        </label>
                        <input
                          id="data-shared-with"
                          type="text"
                          value={sharedWithInput}
                          onChange={(e) => setSharedWithInput(e.target.value)}
                          placeholder={t('personalDataInventory.form.sharedWithPlaceholder')}
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </details>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t('personalDataInventory.actions.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    {editingItem ? t('personalDataInventory.actions.updateData') : t('personalDataInventory.actions.addData')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Preview: Auto-Populate Inventory
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Select which services to add to your inventory
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedServicesInPreview([]);
                  }}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      Summary
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {(() => {
                      const selectedCount = selectedServicesInPreview.length || previewData.services.length;
                      const selectedEntries = selectedServicesInPreview.length > 0
                        ? selectedServicesInPreview.reduce((sum, id) => {
                            return sum + (previewData?.entriesByService?.[id]?.count || 0);
                          }, 0)
                        : previewData.totalEntries;
                      
                      return (
                        <>
                          <strong>{selectedEntries} inventory entries</strong> will be created from{' '}
                          <strong>{selectedCount} service{selectedCount !== 1 ? 's' : ''}</strong>.
                          You can edit or delete any entry after adding.
                        </>
                      );
                    })()}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Select Services ({selectedServicesInPreview.length || previewData.services.length} of {previewData.services.length})
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedServicesInPreview(previewData.services.map(s => s.id));
                        }}
                        className="text-xs px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => {
                          setSelectedServicesInPreview([]);
                        }}
                        className="text-xs px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {previewData.services.map(service => {
                      const serviceData = previewData?.entriesByService?.[service.id];
                      const isSelected = selectedServicesInPreview.length === 0 || selectedServicesInPreview.includes(service.id);
                      const entryCount = serviceData?.count || 0;
                      
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleServiceInPreview(service.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleServiceInPreview(service.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {service.name}
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300 ml-6">
                                {entryCount} {entryCount === 1 ? 'entry' : 'entries'} will be added
                              </div>
                            </div>
                            {entryCount > 0 && (
                              <span className={`px-2 py-1 text-xs rounded font-medium ${
                                isSelected
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                              }`}>
                                {entryCount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Sample Entries (First 3)
                  </h4>
                  <div className="space-y-2">
                    {previewData.sampleEntries.slice(0, 3).map((entry, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {entry.name}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                            {entry.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            entry.sensitivity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                            entry.sensitivity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          }`}>
                            {entry.sensitivity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {entry.storedBy.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {previewData.totalEntries > 3 && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                      ... and {previewData.totalEntries - 3} more entries
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    const serviceIds = selectedServicesInPreview.length > 0 
                      ? selectedServicesInPreview 
                      : previewData.services.map(s => s.id);
                    handleAutoPopulate(serviceIds);
                  }}
                  disabled={isPopulating || (selectedServicesInPreview.length === 0 && previewData.services.length > 0)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPopulating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding Entries...
                    </>
                  ) : (
                    (() => {
                      const selectedCount = selectedServicesInPreview.length || previewData.services.length;
                      const selectedEntries = selectedServicesInPreview.length > 0
                        ? selectedServicesInPreview.reduce((sum, id) => {
                            return sum + (previewData?.entriesByService?.[id]?.count || 0);
                          }, 0)
                        : previewData.totalEntries;
                      return `Add ${selectedEntries} Entries from ${selectedCount} Service${selectedCount !== 1 ? 's' : ''}`;
                    })()
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedServicesInPreview([]);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default PersonalDataInventory;
