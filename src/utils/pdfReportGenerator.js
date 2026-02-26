import { calculateQuickPrivacyScore } from './quickPrivacyScore';
import { calculatePrivacyExposureIndex, getExposureLevel } from './privacyExposureIndex';
import { serviceCatalog } from '../data/serviceCatalog';
import { serviceRiskProfiles } from '../data/serviceRiskProfiles';

/**
 * Generate a polished PDF report for selected services
 * @param {Array<string>} selectedServiceIds - Array of selected service IDs
 * @param {Object} options - Additional options (persona data, etc.)
 * @returns {Promise<string>} - Generated filename
 */
export async function generateServicePrivacyReport(selectedServiceIds, options = {}) {
  // Dynamically import jsPDF to avoid build-time dependency issues
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Calculate score data
  const scoreData = calculateQuickPrivacyScore(selectedServiceIds);
  if (!scoreData) {
    throw new Error('Unable to generate report: No score data available');
  }

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ===== PAGE 1: HEADER & EXECUTIVE SUMMARY =====
  
  // Header with brand color
  doc.setFillColor(239, 68, 68); // SocialCaution red
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Privacy Exposure Report', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${reportDate}`, pageWidth - margin - 60, 25);
  doc.text('SocialCaution.com', pageWidth - margin - 60, 32);

  yPosition = 50;

  // Executive Summary Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 10;

  // Score Box
  const scoreBoxHeight = 50;
  const scoreBoxWidth = pageWidth - (margin * 2);
  
  // Determine score color
  const scoreColor = scoreData.overallScore >= 70 ? [220, 38, 38] :
                     scoreData.overallScore >= 50 ? [251, 146, 60] :
                     scoreData.overallScore >= 30 ? [234, 179, 8] :
                     [34, 197, 94];

  doc.setFillColor(...scoreColor);
  doc.roundedRect(margin, yPosition, scoreBoxWidth, scoreBoxHeight, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text(`${scoreData.overallScore}`, margin + 25, yPosition + 35);
  
  doc.setFontSize(12);
  doc.text('/100', margin + 60, yPosition + 35);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${scoreData.level.level} Privacy Exposure`, margin + 90, yPosition + 20);
  doc.setFontSize(10);
  doc.text(`Based on ${scoreData.totalServices} selected services`, margin + 90, yPosition + 32);

  yPosition += scoreBoxHeight + 15;

  // Risk Distribution
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Distribution', margin, yPosition);
  yPosition += 8;

  const riskData = [
    ['Risk Level', 'Count', 'Percentage'],
    ['Very High', scoreData.riskLevelCounts.veryHigh, 
     `${Math.round((scoreData.riskLevelCounts.veryHigh / scoreData.totalServices) * 100)}%`],
    ['High', scoreData.riskLevelCounts.high,
     `${Math.round((scoreData.riskLevelCounts.high / scoreData.totalServices) * 100)}%`],
    ['Medium', scoreData.riskLevelCounts.medium,
     `${Math.round((scoreData.riskLevelCounts.medium / scoreData.totalServices) * 100)}%`],
    ['Low', scoreData.riskLevelCounts.low,
     `${Math.round((scoreData.riskLevelCounts.low / scoreData.totalServices) * 100)}%`]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [riskData[0]],
    body: riskData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [55, 65, 81], textColor: 255 },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: margin, right: margin }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Top Concerns
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Privacy Concerns', margin, yPosition);
  yPosition += 8;

  const concernsData = [
    ['Rank', 'Service', 'Exposure Score', 'Level'],
    ...scoreData.topConcerns.map((concern, idx) => [
      `#${idx + 1}`,
      concern.name,
      concern.exposureIndex,
      concern.level.level
    ])
  ];

  doc.autoTable({
    startY: yPosition,
    head: [concernsData[0]],
    body: concernsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38], textColor: 255 },
    alternateRowStyles: { fillColor: [254, 242, 242] },
    margin: { left: margin, right: margin }
  });

  // ===== PAGE 2: QUICK WINS & RECOMMENDATIONS =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Actions', margin, yPosition);
  yPosition += 10;

  // Quick Wins section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  if (scoreData.potentialImprovement > 0) {
    doc.text(`Following these recommendations could reduce your score by up to ${scoreData.potentialImprovement} points.`, 
             margin, yPosition);
  }
  yPosition += 15;

  scoreData.quickWins.forEach((win, idx) => {
    // Check for page break
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // Recommendation box
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin, yPosition, pageWidth - (margin * 2), 25, 2, 2, 'F');

    // Icon emoji
    doc.setFontSize(16);
    doc.text(win.icon, margin + 5, yPosition + 12);

    // Title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(win.title, margin + 20, yPosition + 10);

    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(win.description, pageWidth - (margin * 2) - 80);
    doc.text(descLines, margin + 20, yPosition + 18);

    // Impact
    if (win.potentialReduction > 0) {
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(pageWidth - margin - 50, yPosition + 5, 45, 15, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${win.potentialReduction} pts`, pageWidth - margin - 45, yPosition + 15);
    }

    yPosition += 30;
  });

  // ===== PAGE 3+: DETAILED SERVICE ANALYSIS =====
  doc.addPage();
  yPosition = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Detailed Service Analysis', margin, yPosition);
  yPosition += 15;

  selectedServiceIds.forEach((serviceId, idx) => {
    const service = serviceCatalog.find(s => s.id === serviceId);
    const riskProfile = serviceRiskProfiles[serviceId];
    const exposureIndex = calculatePrivacyExposureIndex(serviceId);
    const exposureLevel = getExposureLevel(exposureIndex);

    if (!service) return;

    // Check for page break
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Service header
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPosition, pageWidth - (margin * 2), 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${idx + 1}. ${service.name}`, margin + 5, yPosition + 8);

    // Exposure badge
    const badgeColor = exposureIndex >= 70 ? [220, 38, 38] :
                       exposureIndex >= 50 ? [251, 146, 60] :
                       exposureIndex >= 30 ? [234, 179, 8] :
                       [34, 197, 94];
    doc.setFillColor(...badgeColor);
    doc.roundedRect(pageWidth - margin - 40, yPosition + 2, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`${exposureIndex}/100`, pageWidth - margin - 35, yPosition + 7.5);

    yPosition += 15;

    // Category
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Category: ${service.category.replace('-', ' ').toUpperCase()}`, margin + 5, yPosition);
    yPosition += 8;

    // Typical Risks
    if (riskProfile?.typicalRisks && riskProfile.typicalRisks.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Privacy Risks:', margin + 5, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      riskProfile.typicalRisks.slice(0, 3).forEach(risk => {
        const lines = doc.splitTextToSize(`• ${risk}`, pageWidth - (margin * 2) - 10);
        doc.text(lines, margin + 10, yPosition);
        yPosition += lines.length * 5;
      });
      yPosition += 3;
    }

    // Recommended Actions
    if (riskProfile?.recommendedActions && riskProfile.recommendedActions.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Recommended Actions:', margin + 5, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      riskProfile.recommendedActions.slice(0, 3).forEach(action => {
        const lines = doc.splitTextToSize(`☐ ${action}`, pageWidth - (margin * 2) - 15);
        doc.text(lines, margin + 10, yPosition);
        yPosition += lines.length * 5;
      });
      yPosition += 3;
    }

    // Regulations
    if (riskProfile?.regulations && riskProfile.regulations.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text(`Regulations: ${riskProfile.regulations.join(', ')}`, margin + 5, yPosition);
      yPosition += 8;
    }

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  });

  // ===== CATEGORY BREAKDOWN PAGE =====
  if (yPosition > pageHeight - 100) {
    doc.addPage();
    yPosition = margin;
  } else {
    yPosition += 10;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Category Exposure Breakdown', margin, yPosition);
  yPosition += 10;

  const categoryData = [
    ['Category', 'Services', 'Avg Exposure', 'Level'],
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
    margin: { left: margin, right: margin },
    didParseCell: function(data) {
      // Color code the level column
      if (data.column.index === 3 && data.section === 'body') {
        const level = data.cell.text[0];
        if (level === 'Very High') data.cell.styles.textColor = [220, 38, 38];
        else if (level === 'High') data.cell.styles.textColor = [251, 146, 60];
        else if (level === 'Medium') data.cell.styles.textColor = [234, 179, 8];
        else data.cell.styles.textColor = [34, 197, 94];
      }
    }
  });

  // Add page numbers and footer to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by SocialCaution - Your Privacy, Your Control', margin, pageHeight - 20);
    doc.text('Visit socialcaution.com for more information', margin, pageHeight - 15);
    doc.text('All data is processed locally. No personal information is collected.', margin, pageHeight - 10);
    
    // Page numbers
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `SocialCaution-Privacy-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);

  return fileName;
}

/**
 * Generate Quick Score PDF (compact single-page version)
 * @param {Array<string>} selectedServiceIds - Array of selected service IDs
 * @returns {Promise<string>} - Generated filename
 */
export async function generateQuickScorePDF(selectedServiceIds) {
  // Dynamically import jsPDF to avoid build-time dependency issues
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  const scoreData = calculateQuickPrivacyScore(selectedServiceIds);
  if (!scoreData) {
    throw new Error('Unable to generate quick score: No data available');
  }

  // Header
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Privacy Score Summary', margin, 20);

  yPosition = 40;

  // Score display
  const scoreColor = scoreData.overallScore >= 70 ? [220, 38, 38] :
                     scoreData.overallScore >= 50 ? [251, 146, 60] :
                     scoreData.overallScore >= 30 ? [234, 179, 8] :
                     [34, 197, 94];

  doc.setFillColor(...scoreColor);
  doc.roundedRect(margin, yPosition, 60, 40, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(`${scoreData.overallScore}`, margin + 15, yPosition + 28);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`${scoreData.level.level} Exposure`, margin + 70, yPosition + 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${scoreData.totalServices} services analyzed`, margin + 70, yPosition + 30);

  yPosition += 50;

  // Quick stats
  const statsData = [
    ['Risk Level', 'Count'],
    ['Very High', scoreData.riskLevelCounts.veryHigh],
    ['High', scoreData.riskLevelCounts.high],
    ['Medium', scoreData.riskLevelCounts.medium],
    ['Low', scoreData.riskLevelCounts.low]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [statsData[0]],
    body: statsData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [55, 65, 81], textColor: 255 },
    margin: { left: margin, right: pageWidth / 2 }
  });

  // Top concerns on the right
  const concernsData = [
    ['Top Concerns', 'Score'],
    ...scoreData.topConcerns.map(c => [c.name, c.exposureIndex])
  ];

  doc.autoTable({
    startY: yPosition,
    head: [concernsData[0]],
    body: concernsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [220, 38, 38], textColor: 255 },
    margin: { left: pageWidth / 2 + 10, right: margin }
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Generated by SocialCaution.com', margin, pageHeight - 15);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);

  const fileName = `Privacy-Score-${scoreData.overallScore}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);

  return fileName;
}

