import React from 'react';
import { useState } from 'react';
import { Shield, Eye, Database, UserCheck, Globe, Mail, X, CheckCircle, Info, AlertTriangle, Lock as LockIcon, FileText, ArrowRight, ExternalLink, Server, Key, Users, Building2, Flag } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const lastUpdated = 'December 13, 2025';
  const effectiveDate = 'October 31, 2025';

  const sections = [
    { id: 'scope', title: 'Scope and Applicability', icon: Shield },
    { id: 'overview', title: 'Privacy-First Architecture', icon: Shield },
    { id: 'information', title: 'Information We Collect', icon: Database },
    { id: 'usage', title: 'How We Use Information', icon: UserCheck },
    { id: 'sharing', title: 'Information Sharing', icon: Users },
    { id: 'security', title: 'Data Security', icon: LockIcon },
    { id: 'retention', title: 'Data Retention', icon: Server },
    { id: 'rights', title: 'Your Privacy Rights', icon: Globe },
    { id: 'transfers', title: 'International Transfers', icon: Globe },
    { id: 'children', title: 'Children\'s Privacy', icon: Users },
    { id: 'product-specific', title: 'Product-Specific Privacy', icon: Database },
    { id: 'special', title: 'Special Considerations', icon: Building2 },
    { id: 'updates', title: 'Policy Updates', icon: FileText },
    { id: 'contact', title: 'Contact Information', icon: Mail },
    { id: 'effective-date', title: 'Effective Date', icon: FileText }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8 pt-16">
      <SEOHead
        title="Master Privacy Policy - ERMITS"
        description="ERMITS Master Privacy Policy. Learn how we protect your privacy through Privacy-First Architecture, zero-knowledge encryption, and data minimization."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/privacy-policy` : ''}
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Contents
                </h3>
                <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center ${
                        activeSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
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
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-12 h-12 mr-4" />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Master Privacy Policy</h1>
                      <p className="text-green-100">Privacy-First Architecture: Your data, your control</p>
                    </div>
                  </div>
                  <BackButton
                    to="/"
                    label=""
                    showIcon={true}
                    icon={X}
                    className="p-2 text-green-100 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                    aria-label="Close privacy policy"
                    title="Close"
                  />
                </div>
                <div className="mt-4 text-green-100 text-sm">
                  <div>Effective Date: {effectiveDate}</div>
                  <div>Last Updated: {lastUpdated}</div>
                </div>
                <div className="mt-4 text-green-100 text-sm">
                  <p className="text-base leading-relaxed">
                    ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services across all ERMITS product lines.
                  </p>
                  <p className="text-base leading-relaxed mt-2">
                    By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
                  </p>
                </div>
              </div>

              {/* Privacy Principles Summary */}
              <div className="p-8 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Privacy-First Architecture Principles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    <Database className="w-8 h-8 text-green-600 dark:text-green-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-green-900 dark:text-green-100 text-sm mb-1">Client-Side Processing</h3>
                    <p className="text-xs text-green-700 dark:text-green-300">Local computation</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                    <Server className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">Data Sovereignty</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">You choose storage</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                    <Key className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">Zero-Knowledge</h3>
                    <p className="text-xs text-purple-700 dark:text-purple-300">E2EE encryption</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                    <Eye className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-orange-900 dark:text-orange-100 text-sm mb-1">Data Minimization</h3>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Minimal collection</p>
                  </div>
                  <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800 text-center">
                    <Globe className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-cyan-900 dark:text-cyan-100 text-sm mb-1">Transparency</h3>
                    <p className="text-xs text-cyan-700 dark:text-cyan-300">Full control</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 space-y-8">
                {/* Scope and Applicability */}
                <section id="scope" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Scope and Applicability</h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.1 Services Covered</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      This Privacy Policy applies to all ERMITS products and services, including:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">SocialCaution:</h4>
                        <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
                          <li>Personalized privacy platform</li>
                          <li>Privacy exposure index and risk scoring</li>
                          <li>Service catalog with privacy risk profiles</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">TechnoSoluce™:</h4>
                        <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                          <li>SBOM (Software Bill of Materials) Analyzer</li>
                          <li>Software supply chain security and vulnerability analysis</li>
                          <li>Client-side SBOM processing</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">CyberCertitude™:</h4>
                        <ul className="list-disc list-inside space-y-1 text-orange-800 dark:text-orange-200 text-sm">
                          <li>CMMC 2.0 Level 1 Implementation Suite</li>
                          <li>CMMC 2.0 Level 2 Compliance Platform</li>
                          <li>NIST SP 800-171 assessment and compliance tools</li>
                          <li>Original Toolkit (localStorage-based compliance management)</li>
                        </ul>
                      </div>
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                        <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">VendorSoluce™:</h4>
                        <ul className="list-disc list-inside space-y-1 text-cyan-800 dark:text-cyan-200 text-sm">
                          <li>Supply Chain Risk Management Platform</li>
                          <li>Vendor assessment and monitoring</li>
                          <li>Third-party risk evaluation</li>
                        </ul>
                      </div>
                      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                        <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">CyberCorrect™:</h4>
                        <ul className="list-disc list-inside space-y-1 text-pink-800 dark:text-pink-200 text-sm">
                          <li>Privacy Portal (workplace privacy compliance)</li>
                          <li>Privacy Platform (multi-regulation privacy management)</li>
                          <li>Data subject rights management</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">CyberCaution™:</h4>
                        <ul className="list-disc list-inside space-y-1 text-indigo-800 dark:text-indigo-200 text-sm">
                          <li>RansomCheck (ransomware readiness assessment)</li>
                          <li>Security Toolkit (comprehensive cybersecurity assessments)</li>
                          <li>RiskProfessional (CISA-aligned security assessments)</li>
                        </ul>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">1.2 Geographic Scope</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      This Privacy Policy applies to users worldwide and complies with:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                      <li>General Data Protection Regulation (GDPR) - European Union, United Kingdom, Switzerland</li>
                      <li>California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)</li>
                      <li>Personal Information Protection and Electronic Documents Act (PIPEDA) - Canada</li>
                      <li>Lei Geral de Proteção de Dados (LGPD) - Brazil</li>
                      <li>Other applicable privacy and data protection laws</li>
                    </ul>
                  </div>
                </section>

                {/* Privacy-First Architecture Overview */}
                <section id="overview" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Privacy-First Architecture Overview</h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      ERMITS implements Privacy-First Architecture across all products, built on five fundamental principles:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                          <Database className="w-5 h-5 mr-2" />
                          1. Client-Side Processing
                        </h3>
                        <p className="text-green-800 dark:text-green-200">
                          All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible.
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                          <Server className="w-5 h-5 mr-2" />
                          2. Data Sovereignty Options
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 mb-3">
                          You choose where your data resides:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                          <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
                          <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
                          <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
                          <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                          <Key className="w-5 h-5 mr-2" />
                          3. Zero-Knowledge Encryption
                        </h3>
                        <p className="text-purple-800 dark:text-purple-200">
                          When using ERMITS-managed cloud features with encryption enabled, data is encrypted client-side using AES-256-GCM before transmission. Encryption keys are derived from your credentials and never transmitted to ERMITS. ERMITS cannot decrypt, access, or view your encrypted data.
                        </p>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          4. Data Minimization
                        </h3>
                        <p className="text-orange-800 dark:text-orange-200 mb-3">
                          We collect only the minimum data necessary:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-orange-800 dark:text-orange-200 text-sm">
                          <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
                          <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
                          <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
                        </ul>
                      </div>

                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-xl border border-cyan-200 dark:border-cyan-800">
                        <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3 flex items-center">
                          <Globe className="w-5 h-5 mr-2" />
                          5. Transparency and Control
                        </h3>
                        <p className="text-cyan-800 dark:text-cyan-200">
                          You have complete control over your data: export all data at any time in standard formats (JSON, CSV, PDF), delete all data permanently with one click, opt in or opt out of telemetry collection, choose your deployment and storage model, and review detailed data flow documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Information We Collect */}
                <section id="information" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Database className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Information We Collect</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.1 Information You Provide Directly</h3>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>Account Information (Optional):</strong></p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                          <li>Name</li>
                          <li>Email address</li>
                          <li>Company name and job title (optional)</li>
                          <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
                          <li>Password (cryptographically hashed, never stored in plaintext)</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.2 Information We Do NOT Collect</h3>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-red-800 dark:text-red-200 mb-2 font-semibold">ERMITS explicitly does NOT collect, access, store, or transmit:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {[
                            'SBOM Data (files, component lists, dependency graphs)',
                            'Assessment Content (security assessments, compliance evaluations)',
                            'Vulnerability Data (scan results, CVE findings)',
                            'Compliance Data (CMMC documentation, POAMs, SSPs)',
                            'Proprietary Business Data (trade secrets, confidential information)',
                            'CUI/FCI (Controlled Unclassified Information)',
                            'PHI (Protected Health Information under HIPAA)',
                            'Financial Records (except via Stripe for payments)'
                          ].map((item, index) => (
                            <div key={index} className="flex items-start">
                              <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-red-800 dark:text-red-200">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.3 Automatically Collected Information</h3>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-purple-800 dark:text-purple-200 mb-2"><strong>Pseudonymized Telemetry (Optional):</strong></p>
                        <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                          With your consent, we collect anonymous, aggregated performance data:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm mb-3">
                          <li>Feature usage statistics (which tools are used, how often)</li>
                          <li>Performance metrics (page load times, API response times)</li>
                          <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
                          <li>Browser and device information (browser type, OS version, screen resolution)</li>
                          <li>Session metadata (session duration, navigation paths)</li>
                        </ul>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-purple-800 dark:text-purple-200"><strong>Irreversible Pseudonymization:</strong> User identifiers are cryptographically hashed and cannot be reverse-engineered</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-purple-800 dark:text-purple-200"><strong>No Content Data:</strong> Telemetry never includes file contents, assessment results, or user inputs</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-purple-800 dark:text-purple-200"><strong>Opt-Out Available:</strong> You can disable telemetry at any time in account settings</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-purple-800 dark:text-purple-200"><strong>Differential Privacy:</strong> PostHog analytics use differential privacy techniques to prevent individual identification</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-purple-800 dark:text-purple-200 mb-2"><strong>Technical Data:</strong></p>
                          <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                            <li>IP address (used for security, rate limiting, and geolocation for service delivery; not linked to user accounts)</li>
                            <li>Log data (server logs for security monitoring and debugging; retained for 90 days)</li>
                            <li>Cookies and similar technologies (see Cookie Policy)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.4 Information from Third Parties</h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>Authentication Providers:</strong></p>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">If you use OAuth (Google, Microsoft, GitHub) for authentication, we receive:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                            <li>Name and email address from the provider</li>
                            <li>Profile information you choose to share</li>
                            <li>Provider's unique identifier for your account</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-green-800 dark:text-green-200 mb-2"><strong>Payment Processor:</strong></p>
                          <p className="text-sm text-green-800 dark:text-green-200 mb-2">Stripe provides us with:</p>
                          <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
                            <li>Payment success/failure status</li>
                            <li>Subscription status and billing cycle</li>
                            <li>Last 4 digits of payment method (for your reference)</li>
                            <li>Billing address (for tax compliance)</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-purple-800 dark:text-purple-200 mb-2"><strong>Vulnerability Databases:</strong></p>
                          <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                            When you use SBOM analysis or security assessment tools, your browser makes anonymous, client-side queries to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                            <li>OSV.dev (Google Open Source Vulnerabilities)</li>
                            <li>NIST National Vulnerability Database</li>
                            <li>CISA Known Exploited Vulnerabilities catalog</li>
                          </ul>
                          <p className="text-sm text-purple-800 dark:text-purple-200 mt-2">
                            These queries are performed client-side and do not transit ERMITS servers. We do not track or log your queries to these services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How We Use Information */}
                <section id="usage" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <UserCheck className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. How We Use Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">4.1 Service Delivery and Operation</h3>
                      <ul className="space-y-2 text-green-800 dark:text-green-200 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Provide, maintain, and improve the Services</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Process transactions and send transaction confirmations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Authenticate users and maintain account security</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enable features like cloud synchronization and multi-device access</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Provide customer support and respond to inquiries</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">4.2 Service Improvement and Analytics</h3>
                      <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Analyze pseudonymized usage patterns to improve features</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Identify and fix bugs, errors, and performance issues</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Develop new features and services</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Conduct research and analysis (using only aggregated, anonymous data)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">4.3 Communication</h3>
                      <ul className="space-y-2 text-purple-800 dark:text-purple-200 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Send service-related announcements and updates</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Respond to support requests and feedback</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Send security alerts and critical notifications</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Deliver marketing communications (with your consent; opt-out available)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Conduct user surveys and request feedback</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">4.4 Security and Fraud Prevention</h3>
                      <ul className="space-y-2 text-orange-800 dark:text-orange-200 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Detect and prevent security threats and abuse</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Monitor for unauthorized access or account compromise</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enforce Terms of Service and Acceptable Use Policy</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Protect ERMITS, users, and third parties from harm</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3">4.5 Legal and Compliance</h3>
                      <ul className="space-y-2 text-cyan-800 dark:text-cyan-200 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Comply with legal obligations and respond to lawful requests</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enforce our legal rights and agreements</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Protect against legal liability</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Conduct audits and maintain business records</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        4.6 What We Do NOT Do
                      </h3>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">ERMITS does NOT:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Sell or rent your personal information to third parties</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Use your data for advertising or marketing to others</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Share your User Data with third parties (except as disclosed in Section 5)</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Train AI models on your User Data</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Analyze your assessment results or SBOM data for any purpose</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">Profile users for behavioral targeting</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Information Sharing */}
                <section id="sharing" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Information Sharing and Disclosure</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">5.1 Service Providers (Sub-Processors)</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                        We share limited data with trusted third-party service providers who assist in delivering the Services:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-purple-800 dark:text-purple-200">
                          <thead>
                            <tr className="border-b border-purple-300 dark:border-purple-700">
                              <th className="text-left p-2">Service Provider</th>
                              <th className="text-left p-2">Purpose</th>
                              <th className="text-left p-2">Data Shared</th>
                              <th className="text-left p-2">Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-purple-200 dark:border-purple-800">
                              <td className="p-2"><strong>Supabase</strong></td>
                              <td className="p-2">Database and authentication</td>
                              <td className="p-2">Email, encrypted user data (if cloud sync enabled)</td>
                              <td className="p-2">United States</td>
                            </tr>
                            <tr className="border-b border-purple-200 dark:border-purple-800">
                              <td className="p-2"><strong>Stripe</strong></td>
                              <td className="p-2">Payment processing</td>
                              <td className="p-2">Email, billing information</td>
                              <td className="p-2">United States</td>
                            </tr>
                            <tr className="border-b border-purple-200 dark:border-purple-800">
                              <td className="p-2"><strong>Sentry</strong></td>
                              <td className="p-2">Error monitoring</td>
                              <td className="p-2">Error logs with PII automatically scrubbed</td>
                              <td className="p-2">United States</td>
                            </tr>
                            <tr className="border-b border-purple-200 dark:border-purple-800">
                              <td className="p-2"><strong>PostHog</strong></td>
                              <td className="p-2">Analytics</td>
                              <td className="p-2">Pseudonymized usage metrics with differential privacy</td>
                              <td className="p-2">United States / EU</td>
                            </tr>
                            <tr>
                              <td className="p-2"><strong>Vercel</strong></td>
                              <td className="p-2">Hosting and CDN</td>
                              <td className="p-2">IP address, HTTP headers (standard web traffic)</td>
                              <td className="p-2">Global CDN</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <p className="text-purple-800 dark:text-purple-200 mb-2 text-sm"><strong>Sub-Processor Requirements:</strong></p>
                        <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">All sub-processors are contractually required to:</p>
                        <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                          <li>Use data only for specified purposes</li>
                          <li>Implement appropriate security measures</li>
                          <li>Comply with applicable privacy laws</li>
                          <li>Not use data for their own purposes</li>
                          <li>Delete data when no longer needed</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">5.2 Legal Requirements</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">We may disclose information if required by law or in response to:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm mb-3">
                        <li>Court orders, subpoenas, or legal process</li>
                        <li>Government or regulatory investigations</li>
                        <li>Law enforcement requests (where legally required)</li>
                        <li>National security or public safety threats</li>
                      </ul>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">When legally permitted, we will:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                        <li>Notify affected users of legal requests</li>
                        <li>Challenge overly broad or improper requests</li>
                        <li>Provide only the minimum information required</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">5.3 Business Transfers</h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-2">If ERMITS is involved in a merger, acquisition, asset sale, or bankruptcy:</p>
                      <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
                        <li>User information may be transferred as part of the business assets</li>
                        <li>We will provide notice before information is transferred</li>
                        <li>The successor entity will be bound by this Privacy Policy</li>
                        <li>You will have the option to delete your data before transfer</li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">5.4 Consent-Based Sharing</h3>
                      <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-2">We may share information with your explicit consent for purposes such as:</p>
                      <ul className="list-disc list-inside space-y-1 text-cyan-800 dark:text-cyan-200 text-sm">
                        <li>Integration with third-party tools you authorize</li>
                        <li>Sharing data with your organization's administrators</li>
                        <li>Public testimonials or case studies (with identifying information only if you approve)</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">5.5 Aggregated and Anonymous Data</h3>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">We may share aggregated, anonymous data that cannot identify you:</p>
                      <ul className="list-disc list-inside space-y-1 text-indigo-800 dark:text-indigo-200 text-sm">
                        <li>Industry benchmarks and statistics</li>
                        <li>Research publications and presentations</li>
                        <li>Public reports on security trends</li>
                        <li>Product improvement insights</li>
                      </ul>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200 mt-2">
                        This data is derived from pseudonymized telemetry and cannot be reverse-engineered to identify users or organizations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section id="security" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <LockIcon className="w-6 h-6 text-orange-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Data Security Measures</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">6.1 Encryption</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <h4 className="font-medium text-orange-900 dark:text-orange-100 text-sm mb-1">Data in Transit</h4>
                          <p className="text-xs text-orange-800 dark:text-orange-200">TLS 1.3 encryption, HTTPS required, Perfect Forward Secrecy</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-900 dark:text-orange-100 text-sm mb-1">Data at Rest</h4>
                          <p className="text-xs text-orange-800 dark:text-orange-200">AES-256-GCM encryption, client-side encryption with user-controlled keys</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-900 dark:text-orange-100 text-sm mb-1">Data in Use</h4>
                          <p className="text-xs text-orange-800 dark:text-orange-200">Local processing minimizes exposure, secure coding practices</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">6.2 Access Controls</h3>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                        <li><strong>Multi-Factor Authentication (MFA):</strong> Available for all accounts, required for administrators</li>
                        <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions based on user roles</li>
                        <li><strong>Row-Level Security (RLS):</strong> Database-level isolation ensuring users can only access their own data</li>
                        <li><strong>Principle of Least Privilege:</strong> Internal access limited to minimum necessary</li>
                        <li><strong>Access Logging:</strong> All data access logged for audit and security monitoring</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">6.3 Infrastructure Security</h3>
                      <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
                        <li><strong>Secure Cloud Hosting:</strong> Enterprise-grade infrastructure (Supabase, Vercel)</li>
                        <li><strong>Network Segmentation:</strong> Isolated production, staging, and development environments</li>
                        <li><strong>DDoS Protection:</strong> Distributed denial-of-service attack mitigation</li>
                        <li><strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious activity</li>
                        <li><strong>Regular Security Audits:</strong> Penetration testing and vulnerability assessments</li>
                        <li><strong>Incident Response Plan:</strong> Documented procedures for security incidents</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">6.4 Application Security</h3>
                      <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                        <li><strong>Secure Coding Practices:</strong> Following OWASP Top 10 guidelines</li>
                        <li><strong>Input Validation:</strong> Comprehensive sanitization of all user inputs</li>
                        <li><strong>SQL Injection Prevention:</strong> Parameterized queries and prepared statements</li>
                        <li><strong>XSS Protection:</strong> Content Security Policy (CSP) and output encoding</li>
                        <li><strong>CSRF Protection:</strong> Anti-CSRF tokens for state-changing operations</li>
                        <li><strong>Dependency Management:</strong> Regular updates and vulnerability scanning</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">6.5 Employee and Contractor Access</h3>
                      <ul className="list-disc list-inside space-y-1 text-orange-800 dark:text-orange-200 text-sm">
                        <li>Background checks for employees with data access</li>
                        <li>Confidentiality agreements and security training</li>
                        <li>Access granted only on need-to-know basis</li>
                        <li>Regular access reviews and revocations</li>
                        <li>Monitoring and logging of all employee data access</li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">6.6 Security Incident Response</h3>
                      <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-2">In the event of a data breach or security incident:</p>
                      <ul className="list-disc list-inside space-y-1 text-cyan-800 dark:text-cyan-200 text-sm">
                        <li><strong>Detection:</strong> 24/7 monitoring and alerting systems</li>
                        <li><strong>Containment:</strong> Immediate action to isolate affected systems</li>
                        <li><strong>Investigation:</strong> Forensic analysis to determine scope and impact</li>
                        <li><strong>Notification:</strong> Timely notification to affected users and regulators as required by law</li>
                        <li><strong>Remediation:</strong> Fixes to prevent recurrence</li>
                        <li><strong>Documentation:</strong> Comprehensive incident reporting and lessons learned</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Data Retention */}
                <section id="retention" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Server className="w-6 h-6 text-cyan-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Data Retention</h2>
                  </div>
                  
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-cyan-800 dark:text-cyan-200">
                        <thead>
                          <tr className="border-b border-cyan-300 dark:border-cyan-700">
                            <th className="text-left p-2">Data Type</th>
                            <th className="text-left p-2">Retention Period</th>
                            <th className="text-left p-2">Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-cyan-200 dark:border-cyan-800">
                            <td className="p-2"><strong>Account Information</strong></td>
                            <td className="p-2">Duration of account + 30 days</td>
                            <td className="p-2">Service delivery, support</td>
                          </tr>
                          <tr className="border-b border-cyan-200 dark:border-cyan-800">
                            <td className="p-2"><strong>User-Generated Content</strong></td>
                            <td className="p-2">User-controlled (can delete anytime)</td>
                            <td className="p-2">Service functionality</td>
                          </tr>
                          <tr className="border-b border-cyan-200 dark:border-cyan-800">
                            <td className="p-2"><strong>Encrypted Cloud Data</strong></td>
                            <td className="p-2">User-controlled (can delete anytime)</td>
                            <td className="p-2">Cloud synchronization</td>
                          </tr>
                          <tr className="border-b border-cyan-200 dark:border-cyan-800">
                            <td className="p-2"><strong>Support Communications</strong></td>
                            <td className="p-2">3 years</td>
                            <td className="p-2">Customer support, quality improvement</td>
                          </tr>
                          <tr>
                            <td className="p-2"><strong>Pseudonymized Telemetry</strong></td>
                            <td className="p-2">Indefinite (anonymous, cannot be deleted)</td>
                            <td className="p-2">Service improvement, analytics</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Your Privacy Rights */}
                <section id="rights" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Globe className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Your Privacy Rights</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">7.1 Universal Rights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { right: 'Right to Access', desc: 'Request a copy of all personal data we hold about you' },
                          { right: 'Right to Rectification', desc: 'Correct inaccurate or incomplete personal data' },
                          { right: 'Right to Deletion', desc: 'Request deletion of your personal data' },
                          { right: 'Right to Data Portability', desc: 'Export your data in machine-readable formats' },
                          { right: 'Right to Restriction', desc: 'Request limitation of processing in certain circumstances' },
                          { right: 'Right to Object', desc: 'Object to processing based on legitimate interests' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm">{item.right}</h4>
                              <p className="text-xs text-blue-800 dark:text-blue-200">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">7.2 Additional Rights for EU/UK/Swiss Users (GDPR)</h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                        If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights including the right to withdraw consent, lodge a complaint with your data protection authority, and protection from automated decision-making.
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">7.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                        California residents have additional rights including the right to know what personal information is collected, the right to delete personal information, the right to opt-out of sale (ERMITS does not sell personal information), and the right to non-discrimination.
                      </p>
                    </div>
                  </div>
                </section>

                {/* International Transfers */}
                <section id="transfers" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Globe className="w-6 h-6 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. International Data Transfers</h2>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <p className="text-indigo-800 dark:text-indigo-200 mb-3">
                      ERMITS is based in the United States. For data transfers from the EEA, UK, or Switzerland to the United States, we use European Commission-approved Standard Contractual Clauses (SCCs) with additional safeguards including encryption, access controls, and transparency about government access requests.
                    </p>
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                      Enterprise customers can request EU-only data storage, self-managed infrastructure in preferred jurisdictions, or on-premises deployment for complete data control.
                    </p>
                  </div>
                </section>

                {/* Children's Privacy */}
                <section id="children" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-pink-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Children's Privacy</h2>
                  </div>
                  
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <p className="text-pink-800 dark:text-pink-200 mb-2">
                      The Services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a child under 18, we will delete the information as quickly as possible.
                    </p>
                  </div>
                </section>

                {/* Product-Specific Privacy Considerations */}
                <section id="product-specific" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Database className="w-6 h-6 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">11. Product-Specific Privacy Considerations</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">TechnoSoluce™ (SBOM Analyzer):</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li>SBOM files: Never transmitted to or stored on ERMITS servers</li>
                        <li>Analysis results: Stored locally in user's browser only</li>
                        <li>No retention on ERMITS infrastructure</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">SocialCaution:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>Privacy assessment responses: Processed 100% client-side</li>
                        <li>All assessment data stored locally in browser (IndexedDB, localStorage)</li>
                        <li>Zero data transmission to ERMITS servers during assessments</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">CyberCertitude™ (CMMC Compliance):</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                        <li>Toolkit (localStorage-based): 100% local storage, no data collected</li>
                        <li>Level 1 & 2 Platform: Encrypted compliance data with zero-knowledge E2EE</li>
                        <li>ERMITS cannot decrypt your compliance data</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Special Considerations */}
                <section id="special" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Building2 className="w-6 h-6 text-red-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12. Special Considerations</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">12.1 Federal Contractor Privacy</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                        For users handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI), Privacy-First Architecture ensures that CUI/FCI is processed client-side and never transmitted to ERMITS. Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI, and local storage options eliminate cloud transmission of sensitive data.
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Users are responsible for properly marking and handling CUI/FCI according to NIST SP 800-171, using encryption features, implementing appropriate access controls, and maintaining audit logs. You are solely responsible for detecting and reporting cyber incidents involving CUI/FCI to DoD via https://dibnet.dod.mil within 72 hours.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">12.2 Healthcare Privacy (HIPAA)</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Business Associate Agreement (BAA) available for healthcare customers processing PHI. Contact privacy@ermits.com to execute BAA. We collect account information and encrypted PHI (with zero-knowledge encryption). We do NOT collect unencrypted PHI, medical records, clinical data, or patient names or identifiers.
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Recommended configuration: Use local-only storage for all PHI, use self-managed cloud infrastructure, enable client-side encryption for any cloud-stored data, implement access controls per HIPAA Security Rule.
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">12.3 Financial Services Privacy</h3>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        For financial institutions subject to GLBA, SOX, or PCI-DSS: SOC 2 Type II certification (in progress), encryption and access controls exceed industry standards, audit logging for compliance monitoring. Do not process payment card information (PCI data) through Services; use Stripe integration for payment processing only.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Policy Updates */}
                <section id="updates" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-gray-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">13. Updates to This Privacy Policy</h2>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-800 dark:text-gray-200 mb-2">
                      We may update this Privacy Policy periodically to reflect changes in data practices, new product launches, legal or regulatory developments, technological improvements, and user feedback. For material changes, we will provide 30 days' advance notice via email and in-app notification. For non-material changes, we will update the "Last Updated" date and changes are effective immediately upon posting.
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
                      Previous versions of this Privacy Policy are available upon request: privacy@ermits.com. Current Version: 2.0 (January 2025).
                    </p>
                  </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">14. Contact Information</h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">General Privacy Questions</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> Privacy Inquiry
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          Website: <a href="https://www.ermits.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">www.ermits.com/privacy</a>
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Data Rights Requests</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> Privacy Rights Request - [Type]
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          Online Form: <a href="https://www.ermits.com/privacy-request" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">www.ermits.com/privacy-request</a>
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Data Protection Officer (EU/UK/Swiss)</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> GDPR Inquiry - DPO
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          Handles: GDPR, UK GDPR, Swiss FADP matters
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">California Privacy Requests (CCPA/CPRA)</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> CCPA Request
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          Handles: California consumer privacy rights
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">HIPAA Privacy Officer (Healthcare)</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> HIPAA Privacy Matter
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          Handles: BAA requests, PHI concerns
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Security Concerns</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:contact@ermits.com" className="underline hover:no-underline">contact@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> Security Issue - [Urgent/Non-Urgent]
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">
                          For vulnerabilities: contact@ermits.com (responsible disclosure)
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-300 dark:border-blue-700">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>ERMITS LLC</strong><br />
                        [Physical Address to be inserted]<br />
                        Attn: Privacy Team
                      </p>
                    </div>
                  </div>
                </section>

                {/* Effective Date and Acceptance */}
                <section id="effective-date" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-gray-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">15. Effective Date and Acceptance</h2>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="space-y-3 text-gray-800 dark:text-gray-200">
                      <p><strong>Effective Date:</strong> {effectiveDate}</p>
                      <p><strong>Last Updated:</strong> {lastUpdated}</p>
                      <p className="mt-4">
                        <strong>By using ERMITS Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</strong>
                      </p>
                      <p>
                        If you do not agree with this Privacy Policy, you must discontinue use of all ERMITS Services immediately.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Privacy Promise */}
                <section className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl mt-8">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Privacy Promise</h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    <strong>We promise:</strong> Your privacy is protected by design, not just by promise. Through Privacy-First Architecture, zero-knowledge encryption, and data minimization, we ensure you maintain complete control over your data. Your assessment data, SBOM files, compliance information, and proprietary business data never leave your device unless you explicitly choose cloud synchronization with end-to-end encryption.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

