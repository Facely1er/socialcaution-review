/**
 * Export utilities for assessment data
 * Provides PDF, CSV, and JSON export functionality
 */

/**
 * Exportable data structure
 * @typedef {Object} ExportableData
 * @property {Object} assessmentResults - Assessment results
 * @property {number} assessmentResults.score - Overall score
 * @property {number} assessmentResults.maxScore - Maximum possible score
 * @property {number} assessmentResults.percentage - Score percentage
 * @property {string} userLevel - User privacy level (e.g., 'beginner', 'intermediate', 'advanced')
 * @property {string} timestamp - ISO timestamp
 * @property {Array<Object>} actionPlan - Action plan items
 * @property {string} actionPlan[].title - Action title
 * @property {string} actionPlan[].description - Action description
 * @property {string} actionPlan[].priority - Priority level ('high', 'medium', 'low')
 * @property {boolean} actionPlan[].completed - Whether action is completed
 * @property {string} [actionPlan[].dueDate] - Due date (ISO string)
 * @property {string} actionPlan[].category - Action category
 * @property {Array<Object>} categoryScores - Category score breakdown
 * @property {string} categoryScores[].category - Category name
 * @property {number} categoryScores[].score - Category score
 * @property {number} categoryScores[].maxScore - Maximum score for category
 * @property {number} categoryScores[].percentage - Category percentage
 */

/**
 * Export assessment data to PDF
 * Note: Requires jspdf and jspdf-autotable packages
 * @param {ExportableData} data - Data to export
 */
export const exportToPDF = async (data) => {
  try {
    // Dynamic import to avoid errors if packages not installed
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Privacy Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date(data.timestamp).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Overall Score Section
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Privacy Score', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Score: ${data.assessmentResults.score}/${data.assessmentResults.maxScore} (${data.assessmentResults.percentage}%)`, 20, yPosition);
    yPosition += 8;

    if (data.userLevel) {
      doc.text(`User Level: ${data.userLevel.charAt(0).toUpperCase() + data.userLevel.slice(1)}`, 20, yPosition);
      yPosition += 20;
    }

    // Category Scores Table
    if (data.categoryScores && data.categoryScores.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Category Breakdown', 20, yPosition);
      yPosition += 10;

      const tableData = data.categoryScores.map(category => [
        category.category,
        `${category.score}/${category.maxScore}`,
        `${category.percentage}%`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Category', 'Score', 'Percentage']],
        body: tableData,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 139, 202] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 20;
    }

    // Action Plan Section
    if (data.actionPlan && data.actionPlan.length > 0) {
      // Check if we need a new page
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Action Plan', 20, yPosition);
      yPosition += 10;

      data.actionPlan.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.title}`, 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const description = doc.splitTextToSize(item.description, pageWidth - 40);
        doc.text(description, 20, yPosition);
        yPosition += description.length * 4 + 2;

        doc.text(`Priority: ${item.priority.toUpperCase()}`, 20, yPosition);
        yPosition += 4;
        doc.text(`Status: ${item.completed ? 'Completed' : 'Pending'}`, 20, yPosition);
        yPosition += 4;
        doc.text(`Category: ${item.category}`, 20, yPosition);
        yPosition += 8;

        if (item.dueDate) {
          doc.text(`Due Date: ${new Date(item.dueDate).toLocaleDateString()}`, 20, yPosition);
          yPosition += 4;
        }

        yPosition += 5;
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      doc.text('Generated by Social Caution Privacy Platform', 20, pageHeight - 10);
    }

    // Save the PDF
    doc.save(`privacy-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    alert('PDF export requires jspdf and jspdf-autotable packages. Please install them or use CSV/JSON export.');
  }
};

/**
 * Export assessment data to CSV
 * @param {ExportableData} data - Data to export
 */
export const exportToCSV = (data) => {
  let csvContent = '';

  // Header
  csvContent += 'Privacy Assessment Report\n';
  csvContent += `Generated on: ${new Date(data.timestamp).toLocaleDateString()}\n\n`;

  // Overall Score
  csvContent += 'Overall Score\n';
  csvContent += `Score,${data.assessmentResults.score}\n`;
  csvContent += `Max Score,${data.assessmentResults.maxScore}\n`;
  csvContent += `Percentage,${data.assessmentResults.percentage}%\n`;
  if (data.userLevel) {
    csvContent += `User Level,${data.userLevel}\n`;
  }
  csvContent += '\n';

  // Category Scores
  if (data.categoryScores && data.categoryScores.length > 0) {
    csvContent += 'Category Scores\n';
    csvContent += 'Category,Score,Max Score,Percentage\n';
    data.categoryScores.forEach(category => {
      csvContent += `${category.category},${category.score},${category.maxScore},${category.percentage}%\n`;
    });
    csvContent += '\n';
  }

  // Action Plan
  if (data.actionPlan && data.actionPlan.length > 0) {
    csvContent += 'Action Plan\n';
    csvContent += 'Title,Description,Priority,Status,Category,Due Date\n';
    data.actionPlan.forEach(item => {
      const description = item.description.replace(/"/g, '""'); // Escape quotes
      const dueDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '';
      csvContent += `"${item.title}","${description}",${item.priority},${item.completed ? 'Completed' : 'Pending'},${item.category},"${dueDate}"\n`;
    });
  }

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `privacy-assessment-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export assessment data to JSON
 * @param {ExportableData} data - Data to export
 */
export const exportToJSON = (data) => {
  const jsonData = {
    ...data,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `privacy-assessment-data-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

