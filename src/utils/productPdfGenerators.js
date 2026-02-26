/**
 * Product PDF Generators
 * 
 * Generates paid product deliverables:
 * 1. Digital Privacy Audit (PDF)
 * 2. 30-Day Privacy Action Plan (PDF)
 * 3. Data Broker Removal Toolkit (ZIP with PDF, templates, checklist)
 */

import { calculateQuickPrivacyScore } from './quickPrivacyScore';
import { calculatePrivacyExposureIndex, getExposureLevel, getDetailedExposureBreakdown } from './privacyExposureIndex';
import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';
import { ActionPlanGenerator } from '../data/actionPlans';
import { PrivacyRegulations } from '../data/regulationsMapping';
import { privacyConcernCategories } from '../data/privacyConcerns';
import { calculateDigitalFootprintFromServices } from './digitalFootprintCalculator';

/**
 * Generate Digital Privacy Audit PDF
 * 
 * Creates a comprehensive privacy audit report with:
 * - Executive Summary (risk level, top concerns, impact)
 * - Privacy Concern Profile (based on selected concerns, no persona labels)
 * - Exposure Breakdown by category
 * - Digital Footprint Snapshot (aggregate only)
 * - Key Risk Drivers table (5 items max)
 * - Priority Actions (3 immediate / 3 short-term / 3 strategic)
 * - Regulatory & Rights Snapshot
 * - Methodology & Privacy Statement
 * 
 * @param {Object} userData - User data from localStorage
 * @param {Array<string>} userData.selectedServices - Selected service IDs
 * @param {Object} userData.assessmentResults - Assessment results
 * @param {Array<string>} userData.concerns - Selected privacy concerns
 * @param {string} userData.region - User's geographic region
 * @returns {Promise<string>} Generated filename
 */
export async function generatePrivacyAuditPDF(userData = {}) {
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  const { selectedServices = [], assessmentResults = null, concerns = [], region = 'US' } = userData;
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate exposure data
  const scoreData = selectedServices.length > 0 
    ? calculateQuickPrivacyScore(selectedServices)
    : null;
  
  const exposureScore = assessmentResults?.exposureScore || 
                       assessmentResults?.data?.exposure?.score || 
                       (scoreData ? scoreData.overallScore : null);
  
  const rightsScore = assessmentResults?.rightsScore || 
                     assessmentResults?.data?.rights?.score || 
                     null;

  // ===== COVER PAGE =====
  doc.setFillColor(239, 68, 68); // SocialCaution red
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Privacy Audit', pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('SocialCaution', pageWidth / 2, pageHeight / 2, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generated: ${reportDate}`, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  doc.text('Confidential - For Your Use Only', pageWidth / 2, pageHeight / 2 + 35, { align: 'center' });

  // ===== PAGE 2: EXECUTIVE SUMMARY =====
  doc.addPage();
  yPosition = margin;

  // Header
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${reportDate}`, pageWidth - margin - 60, 25);
  doc.text('SocialCaution.com', pageWidth - margin - 60, 32);

  yPosition = 50;
  doc.setTextColor(0, 0, 0);

  // Risk Level Assessment
  if (exposureScore !== null) {
    const riskLevel = exposureScore >= 70 ? 'Very High' :
                     exposureScore >= 50 ? 'High' :
                     exposureScore >= 30 ? 'Medium' : 'Low';
    
    const riskColor = exposureScore >= 70 ? [220, 38, 38] :
                     exposureScore >= 50 ? [251, 146, 60] :
                     exposureScore >= 30 ? [234, 179, 8] :
                     [34, 197, 94];

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Risk Level', margin, yPosition);
    yPosition += 10;

    doc.setFillColor(...riskColor);
    doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(riskLevel, margin + 10, yPosition + 20);
    
    doc.setFontSize(14);
    doc.text(`Privacy Exposure Score: ${exposureScore}/100`, margin + 10, yPosition + 35);
    
    yPosition += 45;
    doc.setTextColor(0, 0, 0);
  }

  // Top Concerns
  if (concerns.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top Privacy Concerns', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    concerns.slice(0, 5).forEach((concernId, idx) => {
      const concern = privacyConcernCategories
        .flatMap(cat => cat.concerns)
        .find(c => c.id === concernId);
      if (concern) {
        doc.text(`${idx + 1}. ${concern.label}`, margin + 5, yPosition);
        yPosition += 6;
      }
    });
    yPosition += 5;
  }

  // Impact Summary
  if (scoreData) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Impact Summary', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Services Analyzed: ${scoreData.totalServices}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Very High Risk Services: ${scoreData.riskLevelCounts.veryHigh}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`High Risk Services: ${scoreData.riskLevelCounts.high}`, margin + 5, yPosition);
    yPosition += 10;
  }

  // ===== PAGE 3: PRIVACY CONCERN PROFILE =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Privacy Concern Profile', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Based on your selected privacy concerns and exposure analysis', margin, yPosition);
  yPosition += 10;

  if (concerns.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const concernGroups = privacyConcernCategories.map(category => ({
      category: category.label,
      concerns: concerns
        .map(id => category.concerns.find(c => c.id === id))
        .filter(Boolean)
    })).filter(group => group.concerns.length > 0);

    concernGroups.forEach(group => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(group.category, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      group.concerns.forEach(concern => {
        doc.text(`• ${concern.label}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No specific privacy concerns selected. This audit is based on general exposure analysis.', margin, yPosition);
  }

  // ===== PAGE 4: EXPOSURE BREAKDOWN BY CATEGORY =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Exposure Breakdown by Category', margin, yPosition);
  yPosition += 10;

  if (scoreData && scoreData.categoryBreakdown) {
    const categoryData = [
      ['Category', 'Services', 'Avg Exposure', 'Risk Level'],
      ...Object.entries(scoreData.categoryBreakdown)
        .sort((a, b) => b[1].avgExposure - a[1].avgExposure)
        .map(([category, data]) => [
          category.replace('-', ' ').toUpperCase(),
          data.count,
          data.avgExposure,
          data.avgExposure >= 70 ? 'Very High' :
          data.avgExposure >= 50 ? 'High' :
          data.avgExposure >= 30 ? 'Medium' : 'Low'
        ])
    ];

    doc.autoTable({
      startY: yPosition,
      head: [categoryData[0]],
      body: categoryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [55, 65, 81], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: margin, right: margin }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No service data available for category breakdown.', margin, yPosition);
    yPosition += 10;
  }

  // ===== PAGE 5: DIGITAL FOOTPRINT SNAPSHOT (AGGREGATE ONLY) =====
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Digital Footprint Snapshot', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (scoreData) {
    doc.text(`Total Services Tracked: ${scoreData.totalServices}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Average Exposure Index: ${scoreData.overallScore}/100`, margin, yPosition);
    yPosition += 7;
    doc.text(`Risk Distribution:`, margin, yPosition);
    yPosition += 7;
    doc.text(`  • Very High: ${scoreData.riskLevelCounts.veryHigh} services`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`  • High: ${scoreData.riskLevelCounts.high} services`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`  • Medium: ${scoreData.riskLevelCounts.medium} services`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`  • Low: ${scoreData.riskLevelCounts.low} services`, margin + 5, yPosition);
    yPosition += 10;
  } else {
    doc.text('No digital footprint data available.', margin, yPosition);
    yPosition += 10;
  }

  // ===== PAGE 6: KEY RISK DRIVERS (5 ITEMS MAX) =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Risk Drivers', margin, yPosition);
  yPosition += 10;

  if (scoreData && scoreData.topConcerns) {
    const riskDrivers = scoreData.topConcerns.slice(0, 5).map((concern, idx) => ({
      rank: idx + 1,
      service: concern.name,
      exposure: concern.exposureIndex,
      level: concern.level.label
    }));

    const driversData = [
      ['Rank', 'Service', 'Exposure Index', 'Risk Level'],
      ...riskDrivers.map(d => [d.rank, d.service, d.exposure, d.level])
    ];

    doc.autoTable({
      startY: yPosition,
      head: [driversData[0]],
      body: driversData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      margin: { left: margin, right: margin }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No risk driver data available.', margin, yPosition);
    yPosition += 10;
  }

  // ===== PAGE 7: PRIORITY ACTIONS =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Priority Actions', margin, yPosition);
  yPosition += 10;

  // Generate actions from ActionPlanGenerator
  const criticalActions = assessmentResults 
    ? ActionPlanGenerator.generateCriticalActions(assessmentResults, assessmentResults, null)
    : [];
  const importantActions = assessmentResults
    ? ActionPlanGenerator.generateImportantActions(assessmentResults, assessmentResults, null)
    : [];

  // Immediate Actions (3)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Immediate Actions (Next 7 Days)', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const immediateActions = criticalActions.slice(0, 3);
  immediateActions.forEach((action, idx) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${action.title}`, margin, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description, pageWidth - (margin * 2));
    doc.text(descLines, margin + 5, yPosition);
    yPosition += descLines.length * 5 + 3;
  });

  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Short-term Actions (3)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Short-term Actions (Next 30 Days)', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const shortTermActions = importantActions.slice(0, 3);
  shortTermActions.forEach((action, idx) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${action.title}`, margin, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description, pageWidth - (margin * 2));
    doc.text(descLines, margin + 5, yPosition);
    yPosition += descLines.length * 5 + 3;
  });

  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = margin;
  }

  // Strategic Actions (3)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Strategic Actions (Next 90 Days)', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const strategicActions = [
    { title: 'Establish Privacy-First Habits', description: 'Regularly review and update privacy settings across all services. Set calendar reminders for quarterly privacy audits.' },
    { title: 'Implement Data Minimization Strategy', description: 'Reduce the amount of personal data you share online. Use pseudonyms where possible and limit profile information.' },
    { title: 'Build Long-term Privacy Infrastructure', description: 'Consider privacy-focused alternatives for key services. Invest in tools like VPN, encrypted messaging, and privacy-respecting browsers.' }
  ];

  strategicActions.forEach((action, idx) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${idx + 1}. ${action.title}`, margin, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description, pageWidth - (margin * 2));
    doc.text(descLines, margin + 5, yPosition);
    yPosition += descLines.length * 5 + 3;
  });

  // ===== PAGE 8: REGULATORY & RIGHTS SNAPSHOT =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Regulatory & Rights Snapshot', margin, yPosition);
  yPosition += 10;

  // Get applicable regulations based on region
  const applicableRegulations = [];
  if (region === 'EU' || region.includes('Europe')) {
    applicableRegulations.push(PrivacyRegulations.gdpr);
  }
  if (region === 'US' || region === 'CA' || region.includes('California')) {
    applicableRegulations.push(PrivacyRegulations.ccpa);
  }
  if (region === 'CA' || region.includes('Canada')) {
    applicableRegulations.push(PrivacyRegulations.pipeda);
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (applicableRegulations.length > 0) {
    applicableRegulations.forEach(regulation => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(regulation.name, margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(`Region: ${regulation.region}`, margin + 5, yPosition);
      yPosition += 6;
      const descLines = doc.splitTextToSize(regulation.description, pageWidth - (margin * 2) - 10);
      doc.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 5 + 5;
    });
  } else {
    doc.text('No specific regional regulations identified. General privacy rights apply.', margin, yPosition);
    yPosition += 10;
  }

  // Rights Score
  if (rightsScore !== null) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Privacy Rights Knowledge Score', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Your Score: ${rightsScore}/100`, margin, yPosition);
    yPosition += 6;
    
    if (rightsScore < 60) {
      doc.text('Recommendation: Review privacy rights resources to better understand your legal protections.', margin, yPosition);
    } else {
      doc.text('You have good knowledge of privacy rights. Continue staying informed about new regulations.', margin, yPosition);
    }
  }

  // ===== PAGE 9: METHODOLOGY & PRIVACY STATEMENT =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Methodology & Privacy Statement', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const methodologyText = [
    'METHODOLOGY:',
    '',
    'This privacy audit is based on:',
    '• Your selected services and their privacy exposure indices',
    '• Your privacy concerns and priorities',
    '• Assessment results (if completed)',
    '• Industry-standard privacy risk factors',
    '',
    'The Privacy Exposure Index (0-100) evaluates eight factors:',
    '1. Typical Privacy Risks (0-25 pts)',
    '2. Known Privacy Issues (0-30 pts; excludes breach/sharing)',
    '3. Data Breach History (0-16 pts)',
    '4. Regulatory Oversight (0-12 pts; more regs = lower exposure)',
    '5. Parent Company Network (0-8 pts)',
    '6. Data Sensitivity (0-8 pts)',
    '7. User Control (0-10 pts)',
    '8. Third-Party Data Sharing (0-5 pts)',
    '',
    'PRIVACY STATEMENT:',
    '',
    'This audit is generated locally on your device. No personal data',
    'is transmitted to SocialCaution servers. All analysis is performed',
    'using publicly available information about services and privacy',
    'regulations. This report is for your personal use only.',
    '',
    'For more information, visit: socialcaution.com'
  ];

  methodologyText.forEach(line => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  // Add page numbers and footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by SocialCaution - Your Privacy, Your Control', margin, pageHeight - 20);
    doc.text('Confidential - For Your Use Only', margin, pageHeight - 15);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  // Save the PDF
  const fileName = 'SocialCaution_Personal_Privacy_Audit.pdf';
  doc.save(fileName);

  return fileName;
}

/**
 * Generate 30-Day Privacy Action Plan PDF
 * 
 * Creates a week-by-week action plan with:
 * - Week 1–4 action checklist
 * - Effort / impact / dependency markers
 * - Tool references (no links required v1)
 * 
 * @param {Object} userData - User data from localStorage
 * @returns {Promise<string>} Generated filename
 */
export async function generate30DayActionPlanPDF(userData = {}) {
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  const { assessmentResults = null, selectedServices = [] } = userData;
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ===== COVER PAGE =====
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('30-Day Privacy', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  doc.text('Action Plan', pageWidth / 2, pageHeight / 2, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('SocialCaution', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Generated: ${reportDate}`, pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });

  // Generate actions
  const criticalActions = assessmentResults 
    ? ActionPlanGenerator.generateCriticalActions(assessmentResults, assessmentResults, null)
    : [];
  const importantActions = assessmentResults
    ? ActionPlanGenerator.generateImportantActions(assessmentResults, assessmentResults, null)
    : [];

  // Distribute actions across 4 weeks
  const week1Actions = criticalActions.slice(0, 3);
  const week2Actions = importantActions.slice(0, 3);
  const week3Actions = importantActions.slice(3, 6);
  const week4Actions = [
    { title: 'Review and Update Privacy Settings', description: 'Go through all your services and update privacy settings. Focus on data sharing and visibility options.', effort: 'Medium', impact: 'High', tools: 'Service privacy settings' },
    { title: 'Enable Two-Factor Authentication', description: 'Add 2FA to all critical accounts (email, banking, social media).', effort: 'Low', impact: 'High', tools: 'Authenticator apps' },
    { title: 'Review and Clean Up Old Accounts', description: 'Delete or deactivate accounts you no longer use.', effort: 'Medium', impact: 'Medium', tools: 'Account deletion tools' }
  ];

  // ===== WEEK 1 =====
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Week 1: Critical Actions', margin, 20);
  
  yPosition = 40;
  doc.setTextColor(0, 0, 0);

  week1Actions.forEach((action, idx) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Action ${idx + 1}: ${action.title}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description || '', pageWidth - (margin * 2));
    doc.text(descLines, margin, yPosition);
    yPosition += descLines.length * 5 + 5;

    // Markers
    doc.setFontSize(9);
    doc.text(`Effort: ${action.timeEstimate || 'Medium'} | Impact: ${action.estimatedImpact || 'High'}`, margin, yPosition);
    yPosition += 6;
    if (action.steps) {
      doc.text('Steps:', margin, yPosition);
      yPosition += 6;
      action.steps.slice(0, 3).forEach(step => {
        doc.text(`☐ ${step}`, margin + 5, yPosition);
        yPosition += 5;
      });
    }
    yPosition += 5;
  });

  // ===== WEEK 2 =====
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(251, 146, 60);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Week 2: Important Actions', margin, 20);
  
  yPosition = 40;
  doc.setTextColor(0, 0, 0);

  week2Actions.forEach((action, idx) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Action ${idx + 1}: ${action.title}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description || '', pageWidth - (margin * 2));
    doc.text(descLines, margin, yPosition);
    yPosition += descLines.length * 5 + 5;

    doc.setFontSize(9);
    doc.text(`Effort: ${action.timeEstimate || 'Medium'} | Impact: ${action.estimatedImpact || 'Medium'}`, margin, yPosition);
    yPosition += 6;
    if (action.steps) {
      doc.text('Steps:', margin, yPosition);
      yPosition += 6;
      action.steps.slice(0, 3).forEach(step => {
        doc.text(`☐ ${step}`, margin + 5, yPosition);
        yPosition += 5;
      });
    }
    yPosition += 5;
  });

  // ===== WEEK 3 =====
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(234, 179, 8);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Week 3: Continued Improvements', margin, 20);
  
  yPosition = 40;
  doc.setTextColor(0, 0, 0);

  week3Actions.forEach((action, idx) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Action ${idx + 1}: ${action.title}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description || '', pageWidth - (margin * 2));
    doc.text(descLines, margin, yPosition);
    yPosition += descLines.length * 5 + 5;

    doc.setFontSize(9);
    doc.text(`Effort: ${action.timeEstimate || 'Medium'} | Impact: ${action.estimatedImpact || 'Medium'}`, margin, yPosition);
    yPosition += 5;
  });

  // ===== WEEK 4 =====
  doc.addPage();
  yPosition = margin;

  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Week 4: Maintenance & Review', margin, 20);
  
  yPosition = 40;
  doc.setTextColor(0, 0, 0);

  week4Actions.forEach((action, idx) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Action ${idx + 1}: ${action.title}`, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(action.description || '', pageWidth - (margin * 2));
    doc.text(descLines, margin, yPosition);
    yPosition += descLines.length * 5 + 5;

    doc.setFontSize(9);
    doc.text(`Effort: ${action.effort || 'Medium'} | Impact: ${action.impact || 'Medium'}`, margin, yPosition);
    yPosition += 6;
    if (action.tools) {
      doc.text(`Tools: ${action.tools}`, margin, yPosition);
      yPosition += 5;
    }
    yPosition += 5;
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  const fileName = 'SocialCaution_30-Day_Privacy_Action_Plan.pdf';
  doc.save(fileName);

  return fileName;
}

/**
 * Generate Data Broker Removal Toolkit
 * 
 * Creates a ZIP file containing:
 * - Removal Guide PDF
 * - Broker Removal Request Templates (PDF format)
 * - Tracking Checklist (PDF format)
 * 
 * Note: Since we can't easily generate DOCX/XLSX in browser,
 * we'll create PDF versions of templates and checklist.
 * 
 * @param {Object} userData - User data from localStorage
 * @returns {Promise<string>} Generated filename
 */
export async function generateDataBrokerRemovalKit(userData = {}) {
  // For now, generate a comprehensive PDF guide
  // In production, you'd use JSZip to create a ZIP with multiple files
  
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // ===== COVER PAGE =====
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Data Broker Removal', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  doc.text('Toolkit', pageWidth / 2, pageHeight / 2, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('SocialCaution', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

  // ===== REMOVAL GUIDE =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Data Broker Removal Guide', margin, yPosition);
  yPosition += 10;

  const guideText = [
    'WHAT ARE DATA BROKERS?',
    '',
    'Data brokers collect, aggregate, and sell your personal information',
    'without your direct consent. They gather data from public records,',
    'online activity, and other sources to create detailed profiles.',
    '',
    'WHY REMOVE YOUR DATA?',
    '',
    '• Reduce identity theft risk',
    '• Limit targeted advertising',
    '• Protect your privacy',
    '• Control your digital footprint',
    '',
    'HOW TO REMOVE YOUR DATA:',
    '',
    '1. Identify which brokers have your data',
    '2. Visit each broker\'s opt-out page',
    '3. Submit removal requests',
    '4. Verify removal (may take 30-90 days)',
    '5. Repeat periodically (data can reappear)',
    '',
    'IMPORTANT NOTES:',
    '',
    '• Removal is not always permanent',
    '• Some brokers may require verification',
    '• Keep records of your requests',
    '• Consider using a removal service for ongoing protection'
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  guideText.forEach(line => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    if (line.startsWith('•')) {
      doc.text(line, margin + 5, yPosition);
    } else if (line.match(/^\d+\./)) {
      doc.text(line, margin + 5, yPosition);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.text(line, margin, yPosition);
      doc.setFont('helvetica', 'normal');
    }
    yPosition += 5;
  });

  // ===== REMOVAL REQUEST TEMPLATE =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Data Removal Request Template', margin, yPosition);
  yPosition += 10;

  const templateText = [
    'Subject: Request for Removal of Personal Information',
    '',
    'To: [Data Broker Name]',
    'Date: [Your Date]',
    '',
    'Dear [Data Broker Name],',
    '',
    'I am writing to request the removal of my personal information',
    'from your database in accordance with my privacy rights under',
    '[GDPR/CCPA/Applicable Law].',
    '',
    'Please remove the following information:',
    '',
    '• Full name: [Your Name]',
    '• Date of birth: [Your DOB]',
    '• Address: [Your Address]',
    '• Phone number: [Your Phone]',
    '• Email address: [Your Email]',
    '',
    'I understand that this request may take up to 30-90 days to',
    'process. Please confirm receipt of this request and notify me',
    'when the removal is complete.',
    '',
    'Thank you for your attention to this matter.',
    '',
    'Sincerely,',
    '[Your Name]',
    '[Your Email]',
    '[Your Address]'
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  templateText.forEach(line => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  // ===== TRACKING CHECKLIST =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Removal Tracking Checklist', margin, yPosition);
  yPosition += 10;

  const brokers = [
    'Whitepages', 'Spokeo', 'BeenVerified', 'TruthFinder', 'PeopleFinder',
    'Intelius', 'MyLife', 'PeopleSmart', 'US Search', 'Instant Checkmate'
  ];

  const checklistData = [
    ['Broker', 'Date Requested', 'Status', 'Follow-up Date', 'Notes'],
    ...brokers.map(broker => [broker, '', '☐ Pending', '', ''])
  ];

  doc.autoTable({
    startY: yPosition,
    head: [checklistData[0]],
    body: checklistData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [55, 65, 81], textColor: 255 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: margin, right: margin }
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  const fileName = 'SocialCaution_Data_Broker_Removal_Kit.pdf';
  doc.save(fileName);

  return fileName;
}

/**
 * Generate Personal Data Exposure Report PDF
 * 
 * Creates a clear, user-friendly report with:
 * - Summary (exposure level, findings) - FREE
 * - Where Your Data Is Exposed (categories) - FREE
 * - High-Risk Exposure Sources - PAID
 * - Data Types Involved - PAID
 * - What This Means - PAID
 * - What You Can Do Next - PAID
 * 
 * @param {Object} userData - User data from localStorage
 * @param {Array<string>} userData.selectedServices - Selected service IDs
 * @param {Object} userData.assessmentResults - Assessment results (optional)
 * @param {boolean} userData.isUnlocked - Whether paid sections should be included
 * @returns {Promise<string>} Generated filename
 */
export async function generatePersonalDataExposureReportPDF(userData = {}) {
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  const { selectedServices = [], assessmentResults = null, isUnlocked = false } = userData;
  
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate exposure data using the same calculator as ExposureReport component
  if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
    throw new Error('No services selected. Please select services to generate report.');
  }

  const footprintData = calculateDigitalFootprintFromServices(selectedServices, assessmentResults);

  if (!footprintData || !footprintData.services || footprintData.services.length === 0) {
    throw new Error('No rated services selected. Please select rated services to generate report.');
  }

  const averageExposureIndex = footprintData.averageExposureIndex;
  const exposureLevel = averageExposureIndex >= 70 ? 'High' :
                       averageExposureIndex >= 50 ? 'Medium' : 'Low';

  // Get high-risk sources (top 3-5 services with highest exposure)
  const serviceExposures = footprintData.services
    .filter(s => s.exposureIndex >= 50)
    .sort((a, b) => b.exposureIndex - a.exposureIndex)
    .slice(0, 5)
    .map(service => ({
      name: service.serviceName,
      exposureIndex: service.exposureIndex,
      riskLevel: service.riskLevel || 'medium'
    }));

  // Extract data types
  const dataTypesSet = new Set(['Name', 'Email']);
  selectedServices.forEach(serviceId => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    if (service) {
      if (service.category === 'social-media' || service.category === 'messaging') {
        dataTypesSet.add('Phone');
        dataTypesSet.add('Profile Information');
      }
      if (service.category === 'shopping' || service.category === 'financial') {
        dataTypesSet.add('Payment Information');
        dataTypesSet.add('Address');
      }
      if (service.category === 'search-email') {
        dataTypesSet.add('Search History');
      }
      if (service.category === 'cloud-storage') {
        dataTypesSet.add('Files & Documents');
      }
    }
  });
  const dataTypes = Array.from(dataTypesSet).sort();

  const formatCategoryLabel = (category) => {
    const labels = {
      'social-media': 'Social Media',
      'shopping': 'Shopping & E-commerce',
      'messaging': 'Messaging & Communication',
      'streaming': 'Streaming & Entertainment',
      'search-email': 'Search & Email',
      'cloud-storage': 'Cloud Storage',
      'financial': 'Financial Services'
    };
    return labels[category] || category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Helper function to add footer and page numbers
  const addPageFooter = (pageNum, totalPages) => {
    doc.setPage(pageNum);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    
    // Footer line
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    
    // Footer text
    doc.text('Generated by SocialCaution - Your Privacy, Your Control', margin, pageHeight - 12);
    doc.text('Confidential - For Your Use Only', margin, pageHeight - 6);
    
    // Page number
    if (totalPages > 1) {
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
    }
  };

  // ===== COVER PAGE =====
  doc.setFillColor(239, 68, 68); // SocialCaution red
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Personal Data', pageWidth / 2, pageHeight / 2 - 50, { align: 'center' });
  doc.text('Exposure Report', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 60, pageHeight / 2 + 5, pageWidth / 2 + 60, pageHeight / 2 + 5);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text('SocialCaution', pageWidth / 2, pageHeight / 2 + 25, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text(`Generated: ${reportDate}`, pageWidth / 2, pageHeight / 2 + 45, { align: 'center' });
  doc.text('Confidential - For Your Use Only', pageWidth / 2, pageHeight / 2 + 58, { align: 'center' });

  // ===== PAGE 2: SUMMARY (FREE) =====
  doc.addPage();
  yPosition = margin;

  // Header with enhanced styling
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, 30);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Date: ${reportDate}`, pageWidth - margin, 30, { align: 'right' });

  yPosition = 55;
  doc.setTextColor(0, 0, 0);

  // Exposure Level with enhanced visual design
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Exposure Level', margin, yPosition);
  yPosition += 12;

  const exposureColor = exposureLevel === 'High' ? [239, 68, 68] :
                       exposureLevel === 'Medium' ? [234, 179, 8] : [34, 197, 94];
  
  // Enhanced badge design
  doc.setFillColor(...exposureColor);
  doc.roundedRect(margin, yPosition, 50, 16, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(exposureLevel, margin + 25, yPosition + 11, { align: 'center' });
  
  yPosition += 22;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (averageExposureIndex !== null) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Average Exposure Index:`, margin, yPosition);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...exposureColor);
    doc.text(`${averageExposureIndex}/100`, margin + 70, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Your personal data appears across multiple third-party exposure categories.', margin, yPosition);
  yPosition += 18;

  // ===== PAGE 3: WHERE YOUR DATA IS EXPOSED (FREE) =====
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('Where Your Data Is Exposed', margin, 30);

  yPosition = 55;
  doc.setTextColor(0, 0, 0);

  const categoryData = [
    ['Category', 'Services'],
    ...footprintData.categoryBreakdown.map(({ category, count }) => [
      formatCategoryLabel(category),
      count.toString()
    ])
  ];

  doc.autoTable({
    startY: yPosition,
    head: [categoryData[0]],
    body: categoryData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [55, 65, 81], 
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: margin, right: margin },
    styles: {
      cellPadding: { top: 8, right: 5, bottom: 8, left: 5 }
    }
  });

  yPosition = doc.lastAutoTable.finalY + 20;

  // ===== PAID SECTIONS (only if unlocked) =====
  if (isUnlocked) {
    // ===== PAGE 4: HIGH-RISK EXPOSURE SOURCES (PAID) =====
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('High-Risk Exposure Sources', margin, 30);

    yPosition = 55;
    doc.setTextColor(0, 0, 0);

    if (serviceExposures.length > 0) {
      const riskData = [
        ['Source', 'Exposure Index', 'Risk Level'],
        ...serviceExposures.map(service => [
          service.name,
          service.exposureIndex.toString(),
          service.riskLevel
        ])
      ];

      doc.autoTable({
        startY: yPosition,
        head: [riskData[0]],
        body: riskData.slice(1),
        theme: 'grid',
        headStyles: { 
          fillColor: [239, 68, 68], 
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        bodyStyles: {
          fontSize: 10
        },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        margin: { left: margin, right: margin },
        styles: {
          cellPadding: { top: 8, right: 5, bottom: 8, left: 5 }
        }
      });

      yPosition = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('No high-risk sources detected from your selected services.', margin, yPosition);
      yPosition += 18;
    }

    // ===== PAGE 5: DATA TYPES INVOLVED (PAID) =====
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Types Involved', margin, 30);

    yPosition = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    dataTypes.forEach((type, index) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
        // Re-add header for continuation pages
        doc.setFillColor(239, 68, 68);
        doc.rect(0, 0, pageWidth, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text('Data Types Involved (continued)', margin, 30);
        doc.setTextColor(0, 0, 0);
        yPosition = 55;
      }
      doc.setFontSize(11);
      doc.text(`• ${type}`, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 12;

    // ===== PAGE 6: WHAT THIS MEANS (PAID) =====
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('What This Means', margin, 30);

    yPosition = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const implications = [
      'Increased profiling: Your data may be used to build detailed profiles about you',
      'Increased unwanted contact: Higher likelihood of spam, marketing, and unsolicited communications',
      'Increased misuse risk: Greater potential for identity theft, fraud, or data breaches'
    ];

    implications.forEach((implication) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFontSize(11);
      doc.text(`• ${implication}`, margin + 5, yPosition);
      yPosition += 10;
    });

    yPosition += 12;

    // ===== PAGE 7: WHAT YOU CAN DO NEXT (PAID) =====
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(239, 68, 68);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('What You Can Do Next', margin, 30);

    yPosition = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Guided steps to reduce these exposures are available inside the app.', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Visit the SocialCaution app for personalized recommendations and action plans.', margin, yPosition);
  } else {
    // Free version - show locked sections notice
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Enhanced locked content box
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 60, 5, 5, 'FD');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Unlock Full Report', margin + 15, yPosition + 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Purchase the full report to see:', margin + 15, yPosition + 30);
    doc.text('• High-Risk Exposure Sources', margin + 20, yPosition + 38);
    doc.text('• Data Types Involved', margin + 20, yPosition + 46);
    doc.text('• What This Means', margin + 20, yPosition + 54);
    doc.text('• What You Can Do Next', margin + 20, yPosition + 62);
  }

  // Add footer and page numbers to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    addPageFooter(i, pageCount);
  }

  // Save PDF
  const fileName = `SocialCaution_Personal_Data_Exposure_Report_${Date.now()}.pdf`;
  doc.save(fileName);
  
  return fileName;
}
