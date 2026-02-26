/**
 * Lead Service - Handles lead capture and management
 * Stores leads locally and syncs with backend when available
 */

const LEAD_STORAGE_KEY = 'socialcaution_leads';
const LEAD_SYNC_KEY = 'socialcaution_leads_synced';

/**
 * Save a lead locally
 * @param {Object} leadData - Lead information
 * @returns {boolean} Success status
 */
export const saveLead = (leadData) => {
  try {
    const existingLeads = getLeads();
    const newLead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      synced: false
    };
    
    existingLeads.push(newLead);
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(existingLeads));
    
    // Try to sync immediately
    syncLeads();
    
    return true;
  } catch (error) {
    console.error('Failed to save lead:', error);
    return false;
  }
};

/**
 * Get all leads from localStorage
 * @returns {Array} Array of leads
 */
export const getLeads = () => {
  try {
    const leadsJson = localStorage.getItem(LEAD_STORAGE_KEY);
    return leadsJson ? JSON.parse(leadsJson) : [];
  } catch (error) {
    console.error('Failed to get leads:', error);
    return [];
  }
};

/**
 * Get unsynced leads
 * @returns {Array} Array of unsynced leads
 */
export const getUnsyncedLeads = () => {
  const leads = getLeads();
  return leads.filter(lead => !lead.synced);
};

/**
 * Sync leads with backend
 * @returns {Promise<boolean>} Success status
 */
export const syncLeads = async () => {
  const unsyncedLeads = getUnsyncedLeads();
  
  if (unsyncedLeads.length === 0) {
    return true;
  }

  const apiEndpoint = import.meta.env.VITE_LEAD_API_URL || '/api/leads';
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leads: unsyncedLeads,
        batch: true
      })
    });

    if (response.ok) {
      // Mark leads as synced
      const allLeads = getLeads();
      const syncedIds = unsyncedLeads.map(lead => lead.id);
      
      allLeads.forEach(lead => {
        if (syncedIds.includes(lead.id)) {
          lead.synced = true;
          lead.syncedAt = new Date().toISOString();
        }
      });
      
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(allLeads));
      localStorage.setItem(LEAD_SYNC_KEY, new Date().toISOString());
      
      return true;
    } else {
      console.warn('Failed to sync leads:', response.status);
      return false;
    }
  } catch (error) {
    // Network error - leads remain in localStorage for later sync
    console.warn('Lead sync failed, will retry later:', error);
    return false;
  }
};

/**
 * Export leads as CSV
 * @returns {string} CSV string
 */
export const exportLeadsCSV = () => {
  const leads = getLeads();
  
  if (leads.length === 0) {
    return '';
  }

  const headers = ['Email', 'Name', 'Context', 'Persona', 'Timestamp', 'Synced'];
  const rows = leads.map(lead => [
    lead.email || '',
    lead.name || '',
    lead.context || '',
    lead.persona || '',
    lead.timestamp || '',
    lead.synced ? 'Yes' : 'No'
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csv;
};

/**
 * Download leads as CSV file
 */
export const downloadLeadsCSV = () => {
  const csv = exportLeadsCSV();
  
  if (!csv) {
    alert('No leads to export');
    return;
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `socialcaution_leads_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Get lead statistics
 * @returns {Object} Statistics object
 */
export const getLeadStats = () => {
  const leads = getLeads();
  
  return {
    total: leads.length,
    synced: leads.filter(l => l.synced).length,
    unsynced: leads.filter(l => !l.synced).length,
    byContext: leads.reduce((acc, lead) => {
      acc[lead.context] = (acc[lead.context] || 0) + 1;
      return acc;
    }, {}),
    byPersona: leads.reduce((acc, lead) => {
      if (lead.persona) {
        acc[lead.persona] = (acc[lead.persona] || 0) + 1;
      }
      return acc;
    }, {})
  };
};

/**
 * Clear all leads (use with caution)
 */
export const clearLeads = () => {
  localStorage.removeItem(LEAD_STORAGE_KEY);
  localStorage.removeItem(LEAD_SYNC_KEY);
};

// Auto-sync leads periodically (every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    syncLeads();
  }, 5 * 60 * 1000); // 5 minutes
}

export default {
  saveLead,
  getLeads,
  getUnsyncedLeads,
  syncLeads,
  exportLeadsCSV,
  downloadLeadsCSV,
  getLeadStats,
  clearLeads
};

