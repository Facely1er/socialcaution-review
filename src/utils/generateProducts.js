/**
 * Product Generation Utility
 * 
 * Helper functions to generate product deliverables and save them to public/products/
 * 
 * Usage:
 *   import { generateAllProducts } from './utils/generateProducts';
 *   const userData = {
 *     selectedServices: [...],
 *     assessmentResults: {...},
 *     concerns: [...],
 *     region: 'US'
 *   };
 *   await generateAllProducts(userData);
 */

import { generatePrivacyAuditPDF, generate30DayActionPlanPDF, generateDataBrokerRemovalKit, generatePersonalDataExposureReportPDF } from './productPdfGenerators';

/**
 * Get user data from localStorage
 * @returns {Object} User data object
 */
export function getUserData() {
  try {
    const selectedServices = JSON.parse(localStorage.getItem('socialcaution_services') || '[]');
    const assessmentResults = JSON.parse(localStorage.getItem('socialcaution_results') || 'null');
    const concerns = JSON.parse(localStorage.getItem('socialcaution_concerns') || '[]');
    const region = localStorage.getItem('socialcaution_region') || 'US';

    return {
      selectedServices,
      assessmentResults: assessmentResults === 'null' ? null : assessmentResults,
      concerns,
      region
    };
  } catch (error) {
    console.error('Error reading user data:', error);
    return {
      selectedServices: [],
      assessmentResults: null,
      concerns: [],
      region: 'US'
    };
  }
}

/**
 * Generate Privacy Audit PDF and save to public folder
 * Note: Browser security prevents direct file system writes.
 * This function generates the PDF for download, which you can then
 * manually copy to public/products/privacy-audit/
 * 
 * @param {Object} userData - Optional user data, otherwise reads from localStorage
 * @returns {Promise<string>} Generated filename
 */
export async function generatePrivacyAudit(userData = null) {
  const data = userData || getUserData();
  const filename = await generatePrivacyAuditPDF(data);
  console.log(`Generated: ${filename}`);
  console.log('Please copy this file to: public/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf');
  return filename;
}

/**
 * Generate 30-Day Action Plan PDF
 * @param {Object} userData - Optional user data
 * @returns {Promise<string>} Generated filename
 */
export async function generateActionPlan(userData = null) {
  const data = userData || getUserData();
  const filename = await generate30DayActionPlanPDF(data);
  console.log(`Generated: ${filename}`);
  console.log('Please copy this file to: public/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf');
  return filename;
}

/**
 * Generate Data Broker Removal Kit
 * @param {Object} userData - Optional user data
 * @returns {Promise<string>} Generated filename
 */
export async function generateBrokerRemovalKit(userData = null) {
  const data = userData || getUserData();
  const filename = await generateDataBrokerRemovalKit(data);
  console.log(`Generated: ${filename}`);
  console.log('Please copy this file to: public/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip');
  console.log('Note: Currently generates PDF. For ZIP with multiple files, use JSZip library.');
  return filename;
}

/**
 * Generate Personal Data Exposure Report PDF
 * @param {Object} userData - Optional user data
 * @param {boolean} isUnlocked - Whether paid sections should be included
 * @returns {Promise<string>} Generated filename
 */
export async function generateExposureReport(userData = null, isUnlocked = false) {
  const data = userData || getUserData();
  const isUnlockedFlag = isUnlocked || localStorage.getItem('personal_data_exposure_report_unlocked') === 'true';
  const filename = await generatePersonalDataExposureReportPDF({
    ...data,
    isUnlocked: isUnlockedFlag
  });
  console.log(`Generated: ${filename}`);
  return filename;
}

/**
 * Generate all products
 * @param {Object} userData - Optional user data
 * @returns {Promise<Object>} Object with generated filenames
 */
export async function generateAllProducts(userData = null) {
  const data = userData || getUserData();
  
  console.log('Generating all products...');
  console.log('User data:', {
    services: data.selectedServices.length,
    hasAssessments: !!data.assessmentResults,
    concerns: data.concerns.length,
    region: data.region
  });

  const results = {
    privacyAudit: null,
    actionPlan: null,
    brokerRemovalKit: null
  };

  try {
    results.privacyAudit = await generatePrivacyAudit(data);
  } catch (error) {
    console.error('Error generating Privacy Audit:', error);
  }

  try {
    results.actionPlan = await generateActionPlan(data);
  } catch (error) {
    console.error('Error generating Action Plan:', error);
  }

  try {
    results.brokerRemovalKit = await generateBrokerRemovalKit(data);
  } catch (error) {
    console.error('Error generating Broker Removal Kit:', error);
  }

  console.log('Generation complete!');
  console.log('Next steps:');
  console.log('1. Copy generated PDFs to public/products/ folders');
  console.log('2. Rename files to match expected filenames');
  console.log('3. Test download URLs');

  return results;
}

// Export for use in browser console or scripts
if (typeof window !== 'undefined') {
  window.generateProducts = {
    generatePrivacyAudit,
    generateActionPlan,
    generateBrokerRemovalKit,
    generateExposureReport,
    generateAllProducts,
    getUserData
  };
}
