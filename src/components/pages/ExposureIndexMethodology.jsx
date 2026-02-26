import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, Shield, TrendingUp, AlertTriangle, Info, 
  PieChart, BarChart3, Scale, FileText, ExternalLink,
  CheckCircle, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import SEOHead from '../common/SEOHead';
import EnhancedBreadcrumbs from '../common/EnhancedBreadcrumbs';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Exposure Index Methodology Page
 * Explains calculation methodology, risk factors, limitations, and legal disclaimers
 */
const ExposureIndexMethodology = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <SEOHead
        title="Exposure Index Methodology - How We Calculate Privacy Risk | SocialCaution"
        description="Understand how SocialCaution calculates your Privacy Exposure Index. Learn about risk factors, calculation methodology, weights, limitations, and disclaimers."
        keywords="exposure index, privacy risk calculation, methodology, risk factors, privacy assessment, limitations, disclaimers"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-12">
        <EnhancedBreadcrumbs className="mb-4 sm:mb-6" />
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4">
            <h1 className="page-title mb-0 flex items-center justify-center gap-3 sm:gap-4">
              <div className="p-1.5 sm:p-2 md:p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md flex-shrink-0 flex items-center justify-center">
                <Calculator className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="leading-tight">Exposure Index Methodology</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mt-1">
              Understanding how we calculate your privacy risk score
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Educational Platform:</strong> {t('exposureIndexMethodology.educationalDisclaimer')}
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">On This Page</h2>
          <nav className="space-y-2">
            <a href="#overview" className="block text-red-600 dark:text-red-400 hover:underline">1. Overview</a>
            <a href="#calculation" className="block text-red-600 dark:text-red-400 hover:underline">2. Calculation Formula</a>
            <a href="#components" className="block text-red-600 dark:text-red-400 hover:underline">3. Components & Weights</a>
            <a href="#data-sources" className="block text-red-600 dark:text-red-400 hover:underline">4. Data Sources</a>
            <a href="#risk-factors" className="block text-red-600 dark:text-red-400 hover:underline">5. Risk Factors & Categories</a>
            <a href="#scoring" className="block text-red-600 dark:text-red-400 hover:underline">6. Scoring Methodology</a>
            <a href="#limitations" className="block text-red-600 dark:text-red-400 hover:underline">7. Limitations</a>
            <a href="#disclaimers" className="block text-red-600 dark:text-red-400 hover:underline">8. Legal Disclaimers</a>
          </nav>
        </div>

        {/* 1. Overview */}
        <section id="overview" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              1. Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The <strong>Combined Privacy Exposure Index</strong> is a numerical score (0-100) that represents your overall personal privacy risk based on two key components:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Privacy Exposure Assessment</strong> (60% weight) - Based on your answers about privacy practices and behaviors (including passwords, device security, and data sharing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Your Digital Footprint Score</strong> (40% weight) - Calculated from the Service Exposure Indices of services you use</span>
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This combined approach provides a comprehensive view of your privacy exposure by considering both your behaviors and the services you trust with your data.
              </p>
            </div>
          </div>
        </section>

        {/* Terminology Clarification */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-sm border-2 border-blue-200 dark:border-blue-800 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Important: Understanding the Terminology
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">1. Service Exposure Index (0-100)</h3>
                <p className="text-sm mb-2">
                  <strong>What it is:</strong> A score calculated for each individual online service (e.g., Facebook, Gmail, TikTok)
                </p>
                <p className="text-sm mb-2">
                  <strong>What it measures:</strong> The privacy risk level of that specific service based on eight factors: typical privacy risks, known issues, breach history, regulatory oversight, parent/sibling network, data sensitivity by category, user control, and third-party data sharing (see Components & Weights below).
                </p>
                <p className="text-sm">
                  <strong>Where you see it:</strong> In Services Monitoring when viewing individual service details
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2">2. Digital Footprint Score (0-100)</h3>
                <p className="text-sm mb-2">
                  <strong>What it is:</strong> Your personal score calculated from the Service Exposure Indices of services you've selected
                </p>
                <p className="text-sm mb-2">
                  <strong>What it measures:</strong> Your overall privacy exposure based on which services you use and their individual risk levels
                </p>
                <p className="text-sm mb-2">
                  <strong>How it's calculated:</strong> Average of your selected services' Service Exposure Indices, multiplied by a service count multiplier (1 + number of services ÷ 20, capped at 1.2×).
                </p>
                <p className="text-sm">
                  <strong>Where you see it:</strong> In your Personalized Dashboard under "Digital Footprint"
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                <h3 className="font-bold text-red-900 dark:text-red-200 mb-2">3. Combined Privacy Exposure Index (0-100)</h3>
                <p className="text-sm mb-2">
                  <strong>What it is:</strong> Your final overall privacy risk score combining both your assessment and digital footprint
                </p>
                <p className="text-sm mb-2">
                  <strong>What it measures:</strong> Your complete privacy exposure considering both your behaviors (60%) and the services you use (40%)
                </p>
                <p className="text-sm mb-2">
                  <strong>Formula:</strong> (Privacy Exposure Assessment × 0.6) + (Digital Footprint Score × 0.4)
                </p>
                <p className="text-sm">
                  <strong>Where you see it:</strong> In your Personalized Dashboard as "Combined Risk Score"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Calculation Formula */}
        <section id="calculation" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-red-600 dark:text-red-400" />
              2. Calculation Formula
            </h2>
            
            {/* Main Formula */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 mb-6 border-2 border-red-200 dark:border-red-800">
              <div className="text-center mb-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">COMBINED PRIVACY EXPOSURE INDEX</div>
                <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                  (Privacy Exposure Assessment × 0.6) + (Digital Footprint Score × 0.4)
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                Result: Score from 0 to 100 (higher = greater exposure)
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                Only the Privacy Exposure Assessment score is used; no separate security or rights assessment is included in this formula.
              </div>
            </div>

            {/* Component Breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Assessment Score */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Assessment Score (60%)</h3>
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <div>• Privacy Exposure Assessment (0-100)</div>
                  <div>• Question-weighted: privacy awareness, passwords, data sharing, device security, public Wi‑Fi, social media, public sharing</div>
                </div>
              </div>

              {/* Digital Footprint */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2">Digital Footprint (40%)</h3>
                <div className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                  <div>• Average of selected services' Service Exposure Indices</div>
                  <div>• × service count multiplier (1 + n/20, max 1.2×)</div>
                </div>
              </div>
            </div>

            {/* Visual Representation */}
            <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight Distribution</span>
              </div>
              <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                <div className="bg-blue-600 flex items-center justify-center text-white text-xs font-bold" style={{width: '60%'}}>
                  Assessment 60%
                </div>
                <div className="bg-purple-600 flex items-center justify-center text-white text-xs font-bold" style={{width: '40%'}}>
                  Footprint 40%
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Components & Weights */}
        <section id="components" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
              3. Components & Weights
            </h2>

            {/* Component A: Assessment */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Component A: Privacy Exposure Assessment (60% weight)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The assessment score (0-100, higher = more exposure) comes from your answers to the Privacy Exposure Assessment. Each answer is assigned a risk value; the score is computed by a question-weighted formula covering:
              </p>
              <div className="space-y-3">
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>• Privacy law awareness</li>
                  <li>• Password management</li>
                  <li>• Data sharing review habits</li>
                  <li>• Device security</li>
                  <li>• Public Wi-Fi usage</li>
                  <li>• Social media use level</li>
                  <li>• Public sharing behavior</li>
                </ul>
              </div>
            </div>

            {/* Component B: Digital Footprint */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Component B: Digital Footprint Score (40% weight)</h3>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4 border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-purple-900 dark:text-purple-200 font-semibold mb-1">
                  ⚠️ Important Distinction:
                </p>
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  <strong>Digital Footprint Score</strong> is YOUR personal score calculated from the services you use. 
                  It is NOT the same as individual Service Exposure Indices shown in the catalog.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Calculated from the services you select:</p>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 mb-3">
                  <div className="text-sm font-mono text-gray-900 dark:text-white mb-2">
                    Digital Footprint Score = Average(Service Exposure Indices) × Service Count Multiplier
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Multiplier = 1 + (number of services ÷ 20), capped at 1.2×
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Service Exposure Index (0-100) — per service</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Each service has a <strong>Service Exposure Index</strong> from eight factors (raw points summed and capped at 100):
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4 mt-1">
                      <li>• Data Sensitivity by Category (0-8 pts)</li>
                      <li>• Typical Privacy Risks (0-25 pts)</li>
                      <li>• Third-Party Data Sharing (0-5 pts)</li>
                      <li>• User Control & Privacy (0-10 pts; zero for VPN/security-tools)</li>
                      <li>• Regulatory Oversight (0-12 pts; more regulation = lower exposure)</li>
                      <li>• Known Privacy Issues (0-30 pts)</li>
                      <li>• Known Breach History (0-16 pts; known = publicly reported)</li>
                      <li>• Parent Company & Siblings (0-8 pts)</li>
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                      Privacy-enhancing services (e.g. VPN, security-tools) with no breach or third-party sharing are capped at 49 (Medium).
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Service Count Multiplier</h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <div>• Formula: 1 + (number of selected services ÷ 20), maximum 1.2×</div>
                      <div>• Example: 5 services → 1.25 → capped to 1.2×; 10 services → 1.5 → capped to 1.2×</div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Rationale: More services increase exposure (larger attack surface and data spread).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Data Sources */}
        <section id="data-sources" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              4. Data Sources
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The Service Exposure Index calculation uses three primary data sources:
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Service catalog:</strong> Service metadata and categorization (e.g., category, name, type)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Service risk profiles:</strong> Privacy risks, known issues, regulations, and recommended actions per service</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Service relationships:</strong> Parent company and sibling service relationships used for the parent/sibling factor</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 border-l-4 border-blue-500 pl-4">
              Privacy assessments are based on publicly available information, privacy policies, regulatory filings, and established privacy frameworks (e.g., GDPR Article 13, CCPA Section 1798.100, PIPEDA Principle 4, LGPD Article 18, HIPAA, FERPA, GLBA, VCDPA). Service risk profiles and catalog data are maintained and updated from these sources.
            </p>
          </div>
        </section>

        {/* 5. Risk Factors & Categories */}
        <section id="risk-factors" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              5. Risk Factors & Categories
            </h2>

            <div className="space-y-6">
              {/* Risk Levels */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Risk Level Classification (Combined Score)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-16 font-bold text-green-700 dark:text-green-300">0-29</div>
                    <div className="flex-1">
                      <div className="font-semibold text-green-900 dark:text-green-200">Very Low Risk</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Good privacy practices, minimal exposure</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="w-16 font-bold text-yellow-700 dark:text-yellow-300">30-49</div>
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-900 dark:text-yellow-200">Low Risk</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">Some areas for improvement</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="w-16 font-bold text-orange-700 dark:text-orange-300">50-69</div>
                    <div className="flex-1">
                      <div className="font-semibold text-orange-900 dark:text-orange-200">Moderate Risk</div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Moderate exposure; consider reducing footprint and improving practices</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-16 font-bold text-red-700 dark:text-red-300">70-100</div>
                    <div className="flex-1">
                      <div className="font-semibold text-red-900 dark:text-red-200">High Risk</div>
                      <div className="text-sm text-red-700 dark:text-red-300">Significant exposure; immediate action recommended</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Primary Risk Categories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Collection</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      How much personal data is collected, stored, and analyzed
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Data Sharing</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Third-party access, advertising networks, data brokers
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security Hygiene</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Passwords, 2FA, device security, update practices
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User Control</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access, deletion, correction, and portability rights
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Behavioral Risk</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Public Wi-Fi, social media sharing, phishing susceptibility
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Trust</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Track record, transparency, compliance, breach history
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Scoring Methodology */}
        <section id="scoring" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-red-600 dark:text-red-400" />
              6. Scoring Methodology
            </h2>

            <div className="space-y-6">
              {/* Assessment Scoring */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Assessment Scoring Process</h3>
                <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <strong>Answer Collection:</strong> User completes assessment with multiple-choice questions
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <strong>Answer Weighting:</strong> Each answer assigned a risk value (0-100)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <strong>Category Aggregation:</strong> Scores averaged within each category
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <strong>Final Score:</strong> Question-weighted result gives assessment component (0-100, higher = more exposure)
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <strong>Final Assessment Score:</strong> Result is assessment component (0-100)
                    </div>
                  </li>
                </ol>
              </div>

              {/* Service Scoring */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Service Exposure Scoring (8 factors)</h3>
                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Each service's Exposure Index is calculated from eight factors (point ranges; total summed and capped at 100):
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Data Sensitivity by Category</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Typical Privacy Risks</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Third-Party Data Sharing</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">User Control & Privacy</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Regulatory Oversight</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Known Privacy Issues</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Known Breach History</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-16</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Parent Company & Siblings</span>
                      <span className="font-semibold text-gray-900 dark:text-white">0-8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Frequency */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Score Updates</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Assessment Score</div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">Updates when you retake assessments</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="font-semibold text-purple-900 dark:text-purple-200 mb-1">Service Scores</div>
                    <div className="text-sm text-purple-800 dark:text-purple-300">Updated quarterly or after major incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Limitations */}
        <section id="limitations" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              7. Limitations
            </h2>

            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-600 p-4 rounded-r-lg mb-6">
              <p className="text-sm text-orange-900 dark:text-orange-200 font-semibold mb-2">
                Important: Please read and understand these limitations
              </p>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                The Exposure Index is an educational tool with inherent limitations. It should not be your only source of privacy guidance.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Self-Reported Data",
                  desc: "Assessment relies on honest self-reporting. Accuracy depends on user's understanding and truthfulness."
                },
                {
                  title: "Simplified Model",
                  desc: "Privacy risk is complex and multifaceted. Our model simplifies reality for educational purposes."
                },
                {
                  title: "Static Service Scores",
                  desc: "Service scores are updated periodically but may not reflect the most recent policy changes."
                },
                {
                  title: "No Legal Audit",
                  desc: "This is not a professional security audit or legal compliance assessment."
                },
                {
                  title: "Generic Weights",
                  desc: "Weight assignments may not reflect individual circumstances, priorities, or threat models."
                },
                {
                  title: "Limited Scope",
                  desc: "Only considers services in our catalog. Doesn't account for all online activities."
                },
                {
                  title: "No Guarantee",
                  desc: "Low score doesn't guarantee safety. High score doesn't guarantee harm."
                },
                {
                  title: "Context Blind",
                  desc: "Doesn't consider your specific situation, jurisdiction, or personal threat model."
                },
                {
                  title: "Educational Purpose",
                  desc: "Designed for awareness and education, not professional risk assessment."
                },
                {
                  title: "Service Bias",
                  desc: "Scores may reflect general reputation more than actual technical privacy practices."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                  <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Recommendation:</strong> Use the Exposure Index as one tool among many. Combine it with professional advice, security tools, and your own judgment for comprehensive privacy protection.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Legal Disclaimers */}
        <section id="disclaimers" className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              8. Legal Disclaimers
            </h2>

            <div className="space-y-6">
              {/* Educational Purpose */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Educational Purpose Only</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Privacy Exposure Index and all related assessments are provided for <strong>educational purposes only</strong>. They are designed to raise awareness about privacy risks and encourage better privacy practices. This tool does not constitute:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                  <li>• Professional security advice or consulting</li>
                  <li>• Legal advice or compliance assessment</li>
                  <li>• Cybersecurity auditing or penetration testing</li>
                  <li>• Privacy impact assessment (PIA) or DPIA</li>
                  <li>• Risk management or threat modeling</li>
                </ul>
              </div>

              {/* No Warranty */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Warranty or Guarantee</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  SocialCaution provides the Exposure Index and all related tools on an <strong>"AS IS" and "AS AVAILABLE" basis</strong> without warranties of any kind, either express or implied. We do not warrant that:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                  <li>• The scores are accurate, complete, or up-to-date</li>
                  <li>• The methodology is suitable for your specific needs</li>
                  <li>• Use of this tool will prevent privacy breaches or harm</li>
                  <li>• Service scores reflect current privacy practices</li>
                  <li>• Results will meet your expectations or requirements</li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div className="border-l-4 border-red-600 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Limitation of Liability</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  To the maximum extent permitted by law, SocialCaution and its operators shall not be liable for any:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                  <li>• Direct, indirect, incidental, or consequential damages</li>
                  <li>• Loss of data, privacy breaches, or identity theft</li>
                  <li>• Financial losses or legal consequences</li>
                  <li>• Decisions made based on Exposure Index results</li>
                  <li>• Reliance on scores, assessments, or recommendations</li>
                </ul>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>You use this tool at your own risk.</strong> We are not responsible for any harm that results from using or relying on the Exposure Index.
                </p>
              </div>

              {/* Professional Advice */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Seek Professional Advice</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  For specific privacy concerns, security incidents, or compliance requirements, consult with qualified professionals:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                  <li>• Privacy lawyers for legal advice and compliance</li>
                  <li>• Cybersecurity experts for security audits</li>
                  <li>• Data protection officers (DPOs) for GDPR/CCPA compliance</li>
                  <li>• IT security professionals for threat assessment</li>
                  <li>• Insurance providers for cyber risk coverage</li>
                </ul>
              </div>

              {/* No Endorsement */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Endorsement</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Service scores and assessments do not constitute endorsements or recommendations. A low exposure score does not mean we recommend a service. A high score does not mean we discourage its use. Make informed decisions based on your own research and needs.
                </p>
              </div>

              {/* Changes to Methodology */}
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Changes to Methodology</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  The methodology is evolving and is regularly reviewed and improved based on feedback. We reserve the right to modify, update, or change the calculation methodology, weights, service scores, or assessment questions at any time without notice. Such changes may result in different scores for the same inputs.
                </p>
              </div>

              {/* Acceptance */}
              <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border-2 border-gray-300 dark:border-slate-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">By Using This Tool, You Acknowledge:</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ You have read and understood these limitations and disclaimers</li>
                  <li>✓ You understand this is an educational tool, not professional advice</li>
                  <li>✓ You will not rely solely on the Exposure Index for privacy decisions</li>
                  <li>✓ You accept full responsibility for your privacy and security</li>
                  <li>✓ You agree to the Terms of Service and Privacy Policy</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 border-2 border-red-200 dark:border-red-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Ready to Assess Your Privacy Exposure?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Now that you understand how we calculate your Privacy Exposure Index, take the assessment to discover your personalized score and recommendations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
            >
              Take Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/service-catalog')}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              Browse Services Monitoring
            </button>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Related Resources</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <a href="/privacy-policy" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
              <ExternalLink className="w-4 h-4" />
              Privacy Policy
            </a>
            <a href="/terms" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
              <ExternalLink className="w-4 h-4" />
              Terms of Service
            </a>
            <a href="/how-it-works" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
              <ExternalLink className="w-4 h-4" />
              How It Works
            </a>
            <a href="/pricing" className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline text-sm">
              <ExternalLink className="w-4 h-4" />
              Pricing & Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExposureIndexMethodology;

