import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Info, Shield, Scale, X, CheckCircle, Book, Calculator, Eye, Database, Mail, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Index Methodology & Disclaimers — single consolidated page (merged from Exposure Index Methodology + Privacy Exposure Disclaimer).
 */
const PrivacyExposureDisclaimer = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');
  const lastUpdated = 'January 27, 2025';
  const effectiveDate = 'January 27, 2025';

  const sections = [
    { id: 'overview', title: 'Overview', icon: Info },
    { id: 'terminology', title: 'Terminology', icon: Info },
    { id: 'combined-formula', title: 'Combined Index & Formula', icon: Calculator },
    { id: 'purpose', title: 'Purpose and Intent', icon: Eye },
    { id: 'methodology', title: 'Methodology', icon: Calculator },
    { id: 'limitations', title: 'Limitations and Disclaimers', icon: AlertTriangle },
    { id: 'not-judgment', title: 'Not a Judgment or Assessment', icon: Shield },
    { id: 'no-wrongdoing', title: 'No Implication of Wrongdoing', icon: CheckCircle },
    { id: 'compliance', title: 'Compliance Disclaimer', icon: Scale },
    { id: 'liability', title: 'Limitation of Liability', icon: Shield },
    { id: 'data-sources', title: 'Data Sources and Accuracy', icon: Database },
    { id: 'updates', title: 'Methodology Updates', icon: FileText },
    { id: 'contact', title: 'Contact Information', icon: Mail }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 pb-8 pt-0">
      <SEOHead
        title="Privacy Exposure Index Disclaimer - SocialCaution"
        description="Disclaimer and methodology for the Privacy Exposure Index. Learn about how scores are calculated, limitations, and important legal disclaimers."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/privacy-exposure-disclaimer` : ''}
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Book className="w-5 h-5 mr-2 text-orange-500" />
                  Contents
                </h3>
                <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center min-w-0 ${
                        activeSection === section.id
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium break-words min-w-0 flex-1">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start min-w-0 flex-1">
                    <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0 mt-1" />
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">Privacy Exposure Index Disclaimer</h1>
                      <p className="text-orange-100 text-sm sm:text-base break-words">Methodology, Limitations, and Legal Disclaimers</p>
                    </div>
                  </div>
                  <BackButton
                    to="/"
                    label=""
                    showIcon={true}
                    icon={X}
                    className="p-2 text-orange-100 hover:text-white hover:bg-white/20 rounded-xl transition-all flex-shrink-0"
                    aria-label="Close disclaimer"
                    title="Close"
                  />
                </div>
                <div className="mt-4 text-orange-100 text-xs sm:text-sm">
                  <div className="break-words">Effective Date: {effectiveDate}</div>
                  <div className="break-words">Last Updated: {lastUpdated}</div>
                </div>
                <div className="mt-4 text-orange-100 text-sm sm:text-base">
                  <p className="leading-relaxed break-words">
                    This disclaimer describes the methodology used to calculate Privacy Exposure Index scores and sets forth important limitations and legal disclaimers. Please read this document carefully before using Privacy Exposure Index scores.
                  </p>
                </div>
              </div>

              {/* Educational Platform Banner */}
              <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Educational Platform:</strong> {t('exposureIndexMethodology.educationalDisclaimer') || 'This methodology is designed for educational purposes to help you understand privacy risks. It is not a professional security audit or legal compliance assessment.'}
                  </div>
                </div>
              </div>

              {/* Important Notice Banner */}
              <div className="p-4 sm:p-6 bg-yellow-50 dark:bg-yellow-900/20 border-b-4 border-yellow-400 dark:border-yellow-600">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2 break-words">Important Notice</h3>
                    <p className="text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm leading-relaxed break-words overflow-wrap-anywhere">
                      The Privacy Exposure Index is an informational tool designed to help users understand potential privacy risks associated with online services. <strong>It is NOT a judgment, assessment, or evaluation of any service company's practices, compliance, or business operations.</strong> Higher scores do NOT imply wrongdoing, non-compliance, or any negative assessment of the service company. The scores are calculated based on publicly available information and are intended for educational and informational purposes only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 sm:p-8 space-y-8">
                {/* Overview */}
                <section id="overview" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Info className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">1. Overview</h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
                      The Privacy Exposure Index is a scoring system (0-100) that quantifies potential privacy exposure and risk levels associated with using online services. This index is calculated using a weighted multi-factor analysis that evaluates multiple privacy-related factors based on publicly available information.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
                      <strong>This index is provided for informational and educational purposes only.</strong> It is designed to help users make informed decisions about their privacy when using online services. The index does not constitute legal, financial, or professional advice.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
                      The <strong>Combined Privacy Exposure Index</strong> (0–100) combines your <strong>Privacy Exposure Assessment</strong> (60% weight) and your <strong>Digital Footprint Score</strong> (40% weight) from the services you use. See Terminology and Combined Index & Formula below for details.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4 overflow-hidden">
                      <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                        <strong>Key Points:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm mt-2 break-words">
                        <li>The index is based on publicly available information and data sources</li>
                        <li>Scores are calculated using an automated methodology</li>
                        <li>Higher scores indicate greater potential privacy exposure, not wrongdoing</li>
                        <li>The index is not a compliance assessment or legal judgment</li>
                        <li>Service companies are not evaluated, judged, or assessed by this index</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Terminology */}
                <section id="terminology" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Info className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">2. Terminology</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 break-words">2.1 Service Exposure Index (0–100)</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>What it is:</strong> A score calculated for each individual online service (e.g., Facebook, Gmail, TikTok).</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>What it measures:</strong> The privacy risk level of that specific service based on eight factors (see Methodology).</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words"><strong>Where you see it:</strong> In Services Monitoring when viewing individual service details.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2 break-words">2.2 Digital Footprint Score (0–100)</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>What it is:</strong> Your personal score from the Service Exposure Indices of services you have selected.</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>How it is calculated:</strong> Average of your selected services&apos; Service Exposure Indices × service count multiplier (1 + number of services ÷ 20, capped at 1.2×).</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words"><strong>Where you see it:</strong> In your Personalized Dashboard under &quot;Digital Footprint&quot;.</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                      <h3 className="font-bold text-red-900 dark:text-red-200 mb-2 break-words">2.3 Combined Privacy Exposure Index (0–100)</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>What it is:</strong> Your overall privacy risk score combining your assessment and digital footprint.</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 break-words"><strong>Formula:</strong> (Privacy Exposure Assessment × 0.6) + (Digital Footprint Score × 0.4).</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words"><strong>Where you see it:</strong> In your Personalized Dashboard as &quot;Combined Risk Score&quot;.</p>
                    </div>
                  </div>
                </section>

                {/* Combined Index & Formula */}
                <section id="combined-formula" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Calculator className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">3. Combined Index & Formula</h2>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 mb-6 border-2 border-red-200 dark:border-red-800">
                    <div className="text-center mb-4">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">COMBINED PRIVACY EXPOSURE INDEX</div>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-gray-900 dark:text-white break-words">(Assessment × 0.6) + (Digital Footprint × 0.4)</div>
                    </div>
                    <div className="flex gap-2 h-8 rounded-lg overflow-hidden mt-4">
                      <div className="bg-blue-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '60%' }}>Assessment 60%</div>
                      <div className="bg-purple-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '40%' }}>Footprint 40%</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2 break-words">Assessment (60%)</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300 break-words">Privacy Exposure Assessment (0–100) from your answers: privacy awareness, passwords, data sharing, device security, public Wi‑Fi, social media, public sharing.</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2 break-words">Digital Footprint (40%)</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-300 break-words">Average of selected services&apos; Service Exposure Indices × service count multiplier (1 + n/20, max 1.2×).</p>
                    </div>
                  </div>
                </section>

                {/* Purpose and Intent */}
                <section id="purpose" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Eye className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">4. Purpose and Intent</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 break-words">4.1 Intended Purpose</h3>
                      <p className="text-green-800 dark:text-green-200 text-sm mb-3 break-words">
                        The Privacy Exposure Index is intended to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm break-words">
                        <li>Provide users with information about potential privacy risks</li>
                        <li>Help users make informed decisions about online services</li>
                        <li>Educate users about privacy-related factors and considerations</li>
                        <li>Offer a comparative tool for understanding privacy exposure levels</li>
                        <li>Support privacy awareness and digital literacy</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 break-words">4.2 NOT Intended For</h3>
                      <p className="text-red-800 dark:text-red-200 text-sm mb-3 break-words">
                        The Privacy Exposure Index is <strong>NOT</strong> intended to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm break-words">
                        <li>Judge, evaluate, or assess service companies</li>
                        <li>Determine compliance with privacy laws or regulations</li>
                        <li>Imply wrongdoing, negligence, or improper practices</li>
                        <li>Accuse companies of non-compliance or violations</li>
                        <li>Serve as a legal, financial, or professional assessment</li>
                        <li>Replace professional legal or compliance advice</li>
                        <li>Be used as evidence in legal proceedings</li>
                        <li>Make definitive statements about a company's privacy practices</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Methodology */}
                <section id="methodology" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Calculator className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">5. Methodology</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
                    The Privacy Exposure Index methodology is evolving: it is regularly reviewed and improved based on feedback, new data, and best practices. The description below reflects the current version at the date of this disclaimer.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 break-words">3.1 Calculation Method</h3>
                      <p className="text-purple-800 dark:text-purple-200 text-sm mb-3 break-words leading-relaxed">
                        The Privacy Exposure Index is calculated using a weighted multi-factor analysis that evaluates eight distinct privacy risk factors. Each factor contributes points to a total score, which is normalized to a 0-100 scale.
                      </p>
                      <div className="mt-4 space-y-3">
                        <div>
                          <h4 className="font-medium text-purple-900 dark:text-purple-100 text-sm mb-2 break-words">The Eight Factors:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm ml-2 break-words">
                            <li><strong>Typical Privacy Risks</strong> (0-25 points): Potential privacy exposure patterns based on service characteristics</li>
                            <li><strong>Known Privacy Issues</strong> (0-30 points): Verified problems or concerns; excludes breach- and sharing-related issues (counted in Data Breach and Third-Party factors to avoid double-counting)</li>
                            <li><strong>Data Breach History</strong> (0-16 points): Historical data breach incidents (breachCount×4 max 10 + severity×2 max 6)</li>
                            <li><strong>Regulatory Oversight</strong> (0-12 points): More applicable regulations = more oversight = lower exposure (12 − count×3, min 0)</li>
                            <li><strong>Parent Company & Data Sharing Network</strong> (0-8 points): Corporate structure and data sharing relationships</li>
                            <li><strong>Data Sensitivity by Category</strong> (0-8 points): Inherent sensitivity of data types handled by the service</li>
                            <li><strong>User Control & Privacy by Default</strong> (0-10 points): Level of user control and default privacy settings; zero for privacy-enhancing services (VPN, security-tools)—recommended actions there are best practices, not lack of control</li>
                            <li><strong>Third-Party Data Sharing</strong> (0-5 points): Sharing of data with third parties</li>
                          </ol>
                          <p className="text-purple-800 dark:text-purple-200 text-xs mt-3 break-words">
                            <strong>Note:</strong> Privacy-enhancing services (VPN, security-tools) are capped at 49 (Medium) when they have no breach or third-party sharing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 break-words">3.2 Data Sources</h3>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mb-3 break-words">
                        The calculation uses publicly available information from:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm break-words">
                        <li>Public privacy policies and terms of service</li>
                        <li>Publicly reported data breach incidents</li>
                        <li>Regulatory filings and public disclosures</li>
                        <li>Publicly available service documentation</li>
                        <li>Publicly reported privacy-related news and incidents</li>
                        <li>Corporate structure information from public sources</li>
                      </ul>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mt-3 break-words">
                        <strong>Important:</strong> We do not have access to internal company data, compliance audits, or non-public information. All calculations are based solely on publicly available information.
                      </p>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800 overflow-hidden">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 break-words">3.3 Score Interpretation</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-cyan-800 dark:text-cyan-200">
                          <thead>
                            <tr className="border-b border-cyan-300 dark:border-cyan-700">
                              <th className="text-left p-2 break-words">Score Range</th>
                              <th className="text-left p-2 break-words">Level</th>
                              <th className="text-left p-2 break-words">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-cyan-200 dark:border-cyan-800">
                              <td className="p-2 break-words">0-29</td>
                              <td className="p-2 break-words">Low</td>
                              <td className="p-2 break-words">Minimal privacy exposure based on available information</td>
                            </tr>
                            <tr className="border-b border-cyan-200 dark:border-cyan-800">
                              <td className="p-2 break-words">30-49</td>
                              <td className="p-2 break-words">Medium</td>
                              <td className="p-2 break-words">Moderate privacy exposure based on available information</td>
                            </tr>
                            <tr className="border-b border-cyan-200 dark:border-cyan-800">
                              <td className="p-2 break-words">50-69</td>
                              <td className="p-2 break-words">High</td>
                              <td className="p-2 break-words">Significant privacy exposure based on available information</td>
                            </tr>
                            <tr>
                              <td className="p-2 break-words">70-100</td>
                              <td className="p-2 break-words">Very High</td>
                              <td className="p-2 break-words">Critical privacy exposure based on available information</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-cyan-800 dark:text-cyan-200 text-sm mt-3 break-words">
                        <strong>Note:</strong> These levels describe potential privacy exposure based on available information. They do NOT indicate wrongdoing, non-compliance, or any negative assessment of the service company.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Limitations and Disclaimers */}
                <section id="limitations" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">6. Limitations and Disclaimers</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 break-words">4.1 General Limitations</h3>
                      <ul className="list-disc list-inside space-y-2 text-red-800 dark:text-red-200 text-sm break-words">
                        <li><strong>Public Information Only:</strong> The index is based solely on publicly available information. We do not have access to internal company data, compliance audits, security assessments, or non-public information.</li>
                        <li><strong>Automated Calculation:</strong> Scores are calculated using an automated methodology. The methodology may not capture all nuances, context, or mitigating factors.</li>
                        <li><strong>Time-Sensitive:</strong> Privacy practices and regulations change over time. Scores may not reflect the most current state of a service's privacy practices.</li>
                        <li><strong>Incomplete Information:</strong> Publicly available information may be incomplete, outdated, or inaccurate. We cannot verify the accuracy or completeness of all source data.</li>
                        <li><strong>No Direct Assessment:</strong> We do not directly assess, audit, or evaluate service companies. We do not contact companies for verification or clarification.</li>
                        <li><strong>Methodology Limitations:</strong> The scoring methodology is a model that attempts to quantify privacy exposure. Like all models, it has limitations and may not perfectly reflect reality.</li>
                        <li><strong>Context-Dependent:</strong> Privacy exposure levels may vary based on individual use cases, geographic location, and other contextual factors not captured in the index.</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 overflow-hidden">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 break-words">4.2 Accuracy Disclaimer</h3>
                      <p className="text-orange-800 dark:text-orange-200 text-sm mb-3 break-words">
                        While we strive to provide accurate information, we make no representations or warranties regarding:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-orange-800 dark:text-orange-200 text-sm break-words">
                        <li>The accuracy, completeness, or timeliness of the information used in calculations</li>
                        <li>The accuracy or reliability of the calculated scores</li>
                        <li>The applicability of scores to specific use cases or situations</li>
                        <li>The current state of any service's privacy practices</li>
                        <li>The compliance status of any service with applicable laws or regulations</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Not a Judgment or Assessment */}
                <section id="not-judgment" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">7. Not a Judgment or Assessment</h2>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6 rounded-xl border-2 border-green-300 dark:border-green-700 overflow-hidden">
                    <div className="flex items-start mb-4">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-green-900 dark:text-green-100 text-base sm:text-lg mb-2 break-words">
                          The Privacy Exposure Index is NOT a judgment, evaluation, or assessment of service companies.
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm break-words">5.1 What the Index Does NOT Do</h4>
                        <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200 text-sm break-words">
                          <li><strong>Does NOT judge companies:</strong> The index does not make judgments about the quality, ethics, or business practices of service companies.</li>
                          <li><strong>Does NOT evaluate practices:</strong> The index does not evaluate, assess, or rate a company's privacy practices, security measures, or compliance efforts.</li>
                          <li><strong>Does NOT provide professional assessment:</strong> The index is not a professional audit, assessment, or evaluation conducted by privacy experts, legal professionals, or compliance specialists.</li>
                          <li><strong>Does NOT make definitive statements:</strong> The index does not make definitive statements about a company's privacy posture, security posture, or compliance status.</li>
                          <li><strong>Does NOT replace expert analysis:</strong> The index cannot and should not replace professional legal, compliance, or security assessments.</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm break-words">5.2 What the Index Does</h4>
                        <ul className="list-disc list-inside space-y-2 text-green-800 dark:text-green-200 text-sm break-words">
                          <li><strong>Provides information:</strong> The index provides information about potential privacy exposure based on publicly available data.</li>
                          <li><strong>Quantifies factors:</strong> The index quantifies various privacy-related factors into a numerical score for comparison purposes.</li>
                          <li><strong>Supports decision-making:</strong> The index helps users understand potential privacy considerations when choosing online services.</li>
                          <li><strong>Educates users:</strong> The index educates users about privacy-related factors and considerations.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* No Implication of Wrongdoing */}
                <section id="no-wrongdoing" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">8. No Implication of Wrongdoing</h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-xl border-2 border-blue-300 dark:border-blue-700 overflow-hidden">
                    <div className="flex items-start mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 text-base sm:text-lg mb-2 break-words">
                          Higher Privacy Exposure Index scores do NOT imply wrongdoing, negligence, or improper practices.
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm break-words">6.1 Understanding Higher Scores</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3 break-words">
                          A higher Privacy Exposure Index score indicates greater potential privacy exposure based on the factors evaluated. This does NOT mean:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200 text-sm break-words">
                          <li>The company has done something wrong or improper</li>
                          <li>The company is negligent in its privacy practices</li>
                          <li>The company has violated any laws or regulations</li>
                          <li>The company is acting unethically or irresponsibly</li>
                          <li>The company is not committed to user privacy</li>
                        </ul>
                        <p className="text-blue-800 dark:text-blue-200 text-sm mt-3 break-words">
                          Higher scores may result from factors such as:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm mt-2 break-words">
                          <li>The nature of the service (e.g., services handling sensitive data may have higher exposure)</li>
                          <li>Business model requirements (e.g., advertising-supported services may have different privacy considerations)</li>
                          <li>Regulatory oversight (e.g., services subject to more or fewer applicable regulations)</li>
                          <li>Historical incidents (e.g., past data breaches, even if properly addressed)</li>
                          <li>Corporate structure (e.g., being part of a larger data-sharing network)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm break-words">6.2 No Accusation or Allegation</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          The Privacy Exposure Index does NOT accuse, allege, or suggest that any service company:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm mt-2 break-words">
                          <li>Has engaged in wrongdoing or improper conduct</li>
                          <li>Has violated privacy laws or regulations</li>
                          <li>Has been negligent in protecting user privacy</li>
                          <li>Has acted unethically or irresponsibly</li>
                          <li>Has failed to meet industry standards or best practices</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Compliance Disclaimer */}
                <section id="compliance" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Scale className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">9. Compliance Disclaimer</h2>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-xl border-2 border-purple-300 dark:border-purple-700 overflow-hidden">
                    <div className="flex items-start mb-4">
                      <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-purple-900 dark:text-purple-100 text-base sm:text-lg mb-2 break-words">
                          The Privacy Exposure Index does NOT assess, determine, or imply compliance or non-compliance with privacy laws or regulations.
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm break-words">7.1 Not a Compliance Assessment</h4>
                        <ul className="list-disc list-inside space-y-2 text-purple-800 dark:text-purple-200 text-sm break-words">
                          <li><strong>Not a legal assessment:</strong> The index is not a legal assessment of compliance with GDPR, CCPA, HIPAA, or any other privacy or data protection laws.</li>
                          <li><strong>Not a compliance audit:</strong> The index is not a compliance audit, certification, or verification of a company's compliance status.</li>
                          <li><strong>Not a regulatory evaluation:</strong> The index does not evaluate whether a company meets regulatory requirements or industry standards.</li>
                          <li><strong>No compliance determination:</strong> The index does not determine, state, or imply whether a company is compliant or non-compliant with any laws or regulations.</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm break-words">7.2 No Accusation of Non-Compliance</h4>
                        <p className="text-purple-800 dark:text-purple-200 text-sm mb-2 break-words">
                          The Privacy Exposure Index does NOT accuse, allege, or suggest that any service company:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm break-words">
                          <li>Is non-compliant with privacy laws or regulations</li>
                          <li>Has violated privacy laws or regulations</li>
                          <li>Is subject to regulatory enforcement actions</li>
                          <li>Has failed to meet compliance requirements</li>
                          <li>Is at risk of regulatory penalties or sanctions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm break-words">7.3 Compliance is Complex</h4>
                        <p className="text-purple-800 dark:text-purple-200 text-sm break-words leading-relaxed">
                          Compliance with privacy laws and regulations is complex and context-dependent. A company may be fully compliant with applicable laws while still having a higher privacy exposure index score due to the nature of its service, business model, or other factors. The index does not and cannot assess legal compliance.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="liability" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">10. Limitation of Liability</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-xl border-2 border-red-300 dark:border-red-700 overflow-hidden">
                      <h3 className="font-bold text-red-900 dark:text-red-100 text-base sm:text-lg mb-4 break-words">8.1 No Warranties</h3>
                      <p className="text-red-800 dark:text-red-200 text-sm mb-3 break-words">
                        THE PRIVACY EXPOSURE INDEX IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-200 text-sm break-words">
                        <li>Warranties of accuracy, completeness, or reliability</li>
                        <li>Warranties of merchantability or fitness for a particular purpose</li>
                        <li>Warranties that the index is error-free or will meet your requirements</li>
                        <li>Warranties regarding the current state of any service's privacy practices</li>
                        <li>Warranties regarding compliance with laws or regulations</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-xl border-2 border-orange-300 dark:border-orange-700 overflow-hidden">
                      <h3 className="font-bold text-orange-900 dark:text-orange-100 text-base sm:text-lg mb-4 break-words">8.2 Limitation of Liability</h3>
                      <p className="text-orange-800 dark:text-orange-200 text-sm mb-3 break-words">
                        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE SHALL NOT BE LIABLE FOR:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-orange-800 dark:text-orange-200 text-sm break-words">
                        <li><strong>Direct damages:</strong> Any direct, indirect, incidental, special, consequential, or punitive damages arising from or related to the use of the Privacy Exposure Index</li>
                        <li><strong>Decisions based on index:</strong> Any losses, damages, or harm resulting from decisions made based on Privacy Exposure Index scores</li>
                        <li><strong>Inaccurate information:</strong> Any losses, damages, or harm resulting from inaccurate, incomplete, or outdated information used in calculations</li>
                        <li><strong>Methodology limitations:</strong> Any losses, damages, or harm resulting from limitations in the scoring methodology</li>
                        <li><strong>Third-party actions:</strong> Any losses, damages, or harm resulting from actions taken by service companies or third parties in response to Privacy Exposure Index scores</li>
                        <li><strong>Legal proceedings:</strong> Any costs, expenses, or damages arising from legal proceedings, disputes, or claims related to the use of Privacy Exposure Index scores</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 sm:p-6 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 overflow-hidden">
                      <h3 className="font-bold text-yellow-900 dark:text-yellow-100 text-base sm:text-lg mb-4 break-words">8.3 Use at Your Own Risk</h3>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm break-words">
                        You acknowledge and agree that:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-200 text-sm mt-2 break-words">
                        <li>You use the Privacy Exposure Index at your own risk</li>
                        <li>You are solely responsible for decisions made based on Privacy Exposure Index scores</li>
                        <li>You should not rely solely on Privacy Exposure Index scores when making important decisions</li>
                        <li>You should consult with qualified professionals (legal, compliance, security) for professional advice</li>
                        <li>We are not responsible for any consequences of your use of the Privacy Exposure Index</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mt-4">
                      <h3 className="font-bold text-green-900 dark:text-green-100 text-sm mb-2 break-words">10.4 Seek Professional Advice</h3>
                      <p className="text-green-800 dark:text-green-200 text-sm break-words">For specific privacy concerns, security incidents, or compliance requirements, consult qualified professionals: privacy lawyers, cybersecurity experts, DPOs, IT security professionals, or insurance providers.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 break-words">10.5 No Endorsement</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm break-words">Service scores do not constitute endorsements or recommendations. A low score does not mean we recommend a service; a high score does not mean we discourage its use. Make informed decisions based on your own research and needs.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 break-words">10.6 Changes to Methodology</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm break-words">We may modify the calculation methodology, weights, or assessment questions at any time. Such changes may result in different scores for the same inputs.</p>
                    </div>
                  </div>
                </section>

                {/* Data Sources and Accuracy */}
                <section id="data-sources" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Database className="w-6 h-6 text-cyan-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">11. Data Sources and Accuracy</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800 overflow-hidden">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 break-words">9.1 Public Information Only</h3>
                      <p className="text-cyan-800 dark:text-cyan-200 text-sm mb-3 break-words">
                        The Privacy Exposure Index is calculated using only publicly available information. We do not:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-cyan-800 dark:text-cyan-200 text-sm break-words">
                        <li>Have access to internal company data or confidential information</li>
                        <li>Conduct audits, assessments, or evaluations of service companies</li>
                        <li>Contact companies for verification or clarification</li>
                        <li>Have access to compliance reports, security assessments, or internal documentation</li>
                        <li>Verify the accuracy or completeness of publicly available information</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 break-words">9.2 Information Accuracy</h3>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mb-3 break-words">
                        While we strive to use accurate and up-to-date information, we cannot guarantee:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm break-words">
                        <li>The accuracy, completeness, or timeliness of source information</li>
                        <li>That all relevant information has been identified or included</li>
                        <li>That information has not changed since it was collected</li>
                        <li>That information is free from errors or omissions</li>
                      </ul>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mt-3 break-words">
                        If you believe that information used in calculations is inaccurate or outdated, please contact us using the information provided in Section 11.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Methodology Updates */}
                <section id="updates" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">12. Methodology Updates</h2>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <p className="text-gray-800 dark:text-gray-200 text-sm mb-3 break-words">
                      The Privacy Exposure Index methodology is evolving and is regularly reviewed and improved based on feedback. It may be updated, refined, or modified from time to time based on:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200 text-sm break-words">
                      <li>New privacy regulations and legal developments</li>
                      <li>Emerging privacy risks and concerns</li>
                      <li>User feedback and suggestions</li>
                      <li>Industry best practices and standards</li>
                      <li>Improvements to the calculation methodology</li>
                    </ul>
                    <p className="text-gray-800 dark:text-gray-200 text-sm mt-3 break-words">
                      When material changes are made to the methodology, we will update this disclaimer and the "Last Updated" date. Previous versions of this disclaimer are available upon request.
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 text-sm mt-3 break-words">
                      <strong>Current Version:</strong> 1.0 (January 27, 2025)
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">13. Contact Information</h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-4 break-words">
                      If you have questions about this disclaimer, the Privacy Exposure Index methodology, or if you believe that information used in calculations is inaccurate, please contact us:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 break-words">General Inquiries</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Email:</strong> <a href="mailto:support@ermits.com" className="underline hover:no-underline break-all">support@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Subject:</strong> Privacy Exposure Index Inquiry
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 break-words">Methodology Questions</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Email:</strong> <a href="mailto:support@ermits.com" className="underline hover:no-underline break-all">support@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Subject:</strong> Methodology Question
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 break-words">Information Accuracy Concerns</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Email:</strong> <a href="mailto:support@ermits.com" className="underline hover:no-underline break-all">support@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-sm break-words">
                          <strong>Subject:</strong> Information Accuracy - [Service Name]
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Final Notice */}
                <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-8 rounded-2xl mt-8 overflow-hidden">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 mr-3 flex-shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-bold break-words">Final Notice</h2>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed break-words">
                    <strong>By using the Privacy Exposure Index, you acknowledge that you have read, understood, and agree to this disclaimer.</strong> The Privacy Exposure Index is provided for informational and educational purposes only. It is NOT a judgment, assessment, or evaluation of service companies. Higher scores do NOT imply wrongdoing, non-compliance, or any negative assessment. You use the index at your own risk and are solely responsible for decisions made based on index scores.
                  </p>
                </section>

                {/* CTA */}
                <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ready to Assess Your Privacy Exposure?</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Take the assessment to discover your personalized score and recommendations.</p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/assessment" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                      Take Assessment <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/service-catalog" className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-semibold">
                      Browse Services Monitoring
                    </Link>
                  </div>
                </div>

                {/* Related Resources */}
                <div className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Related Resources</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Link to="/privacy-policy" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
                      <ExternalLink className="w-4 h-4" /> Privacy Policy
                    </Link>
                    <Link to="/terms" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
                      <ExternalLink className="w-4 h-4" /> Terms of Service
                    </Link>
                    <Link to="/how-it-works" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
                      <ExternalLink className="w-4 h-4" /> How It Works
                    </Link>
                    <Link to="/pricing" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
                      <ExternalLink className="w-4 h-4" /> Pricing & Plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyExposureDisclaimer;

