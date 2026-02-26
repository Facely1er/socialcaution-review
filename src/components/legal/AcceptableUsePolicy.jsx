import React from 'react';
import { useState } from 'react';
import { Shield, AlertTriangle, X, CheckCircle, Ban, Mail, FileText, Lock as LockIcon, Users, Building2, Scale, Gavel, Bug, Server } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const AcceptableUsePolicy = () => {
  const [activeSection, setActiveSection] = useState('purpose');
  const lastUpdated = 'December 13, 2025';
  const effectiveDate = 'October 31, 2025';

  const sections = [
    { id: 'purpose', title: 'Purpose and Scope', icon: FileText },
    { id: 'prohibited', title: 'Prohibited Activities', icon: Ban },
    { id: 'security-research', title: 'Security Research', icon: Bug },
    { id: 'federal', title: 'Federal Contractor Terms', icon: Building2 },
    { id: 'resource-limits', title: 'Resource Limits', icon: Server },
    { id: 'reporting', title: 'Reporting Violations', icon: Mail },
    { id: 'enforcement', title: 'Enforcement', icon: Gavel },
    { id: 'law-enforcement', title: 'Law Enforcement', icon: Shield },
    { id: 'third-party', title: 'Third-Party Services', icon: Users },
    { id: 'updates', title: 'Policy Updates', icon: FileText },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8 pt-16">
      <SEOHead
        title="Acceptable Use Policy - ERMITS"
        description="ERMITS Acceptable Use Policy. Learn about prohibited activities, security research guidelines, resource limits, and enforcement procedures."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/acceptable-use-policy` : ''}
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
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-12 h-12 mr-4" />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Acceptable Use Policy</h1>
                      <p className="text-red-100">Prohibited activities and behavioral standards</p>
                    </div>
                  </div>
                  <BackButton
                    to="/"
                    label=""
                    showIcon={true}
                    icon={X}
                    className="p-2 text-red-100 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                    aria-label="Close acceptable use policy"
                    title="Close"
                  />
                </div>
                <div className="mt-4 text-red-100 text-sm">
                  <div>Effective Date: {effectiveDate}</div>
                  <div>Last Updated: {lastUpdated}</div>
                </div>
              </div>

              {/* Key Points Summary */}
              <div className="p-8 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Policy Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    <Ban className="w-8 h-8 text-red-600 dark:text-red-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-red-900 dark:text-red-100 text-sm mb-1">Prohibited Activities</h3>
                    <p className="text-xs text-red-700 dark:text-red-300">Illegal, harmful, or abusive use</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    <Bug className="w-8 h-8 text-green-600 dark:text-green-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-green-900 dark:text-green-100 text-sm mb-1">Security Research</h3>
                    <p className="text-xs text-green-700 dark:text-green-300">Responsible disclosure encouraged</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                    <Gavel className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-orange-900 dark:text-orange-100 text-sm mb-1">Enforcement</h3>
                    <p className="text-xs text-orange-700 dark:text-orange-300">Violations may result in suspension</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 space-y-8">
                {/* Purpose and Scope */}
                <section id="purpose" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Purpose and Scope</h2>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    This Acceptable Use Policy ("AUP") governs your use of ERMITS LLC ("ERMITS") Services and supplements the Master Terms of Service. By using the Services, you agree to comply with this AUP. Violation of this AUP may result in immediate suspension or termination of your access to the Services.
                  </p>
                </section>

                {/* Prohibited Activities */}
                <section id="prohibited" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Ban className="w-6 h-6 text-red-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Prohibited Activities</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.1 Illegal Activities</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not use the Services to:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Violate any applicable laws, regulations, or ordinances</li>
                        <li>Engage in, promote, or facilitate illegal activities</li>
                        <li>Violate intellectual property rights, privacy rights, or other third-party rights</li>
                        <li>Engage in fraud, money laundering, or financial crimes</li>
                        <li>Facilitate human trafficking, child exploitation, or other serious crimes</li>
                        <li>Violate export control or economic sanctions laws</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.2 Security Violations</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Attempt to gain unauthorized access to Services, user accounts, or computer systems</li>
                        <li>Interfere with or disrupt Services, servers, or networks</li>
                        <li>Introduce malware, viruses, worms, Trojan horses, or other harmful code</li>
                        <li>Conduct vulnerability scanning, penetration testing, or security assessments without prior written authorization</li>
                        <li>Circumvent or attempt to circumvent authentication mechanisms or security controls</li>
                        <li>Participate in denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks</li>
                        <li>Engage in password cracking, network sniffing, or packet manipulation</li>
                        <li>Exploit security vulnerabilities for any purpose</li>
                        <li>Use automated tools to bypass rate limits or access restrictions</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.3 Data and Privacy Violations</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Collect, store, or process personal data in violation of applicable privacy laws (GDPR, CCPA, etc.)</li>
                        <li>Scrape, harvest, or collect user information without authorization</li>
                        <li>Upload or transmit data containing personally identifiable information (PII) without appropriate safeguards</li>
                        <li>Process special categories of personal data without appropriate legal basis</li>
                        <li>Transmit unsolicited communications (spam, phishing, etc.)</li>
                        <li>Use Services to process data you do not have the right to process</li>
                        <li>Process special categories of personal data (health, biometric, genetic, racial/ethnic origin, religious beliefs, etc.) without appropriate legal basis</li>
                        <li>Violate data subject rights or ignore data deletion requests</li>
                        <li>Engage in identity theft, impersonation, or social engineering attacks</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.4 Abusive Behavior</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Harass, threaten, intimidate, or harm others</li>
                        <li>Engage in hate speech, discrimination, or incitement of violence</li>
                        <li>Impersonate any person or entity or misrepresent your affiliation</li>
                        <li>Engage in cyberbullying or coordinated harassment campaigns</li>
                        <li>Stalk or otherwise harass individuals</li>
                        <li>Post or transmit sexually explicit, violent, or disturbing content (unless specifically authorized for security research purposes)</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.5 System Abuse</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Exceed rate limits, quotas, or resource allocations</li>
                        <li>Use Services for cryptocurrency mining without authorization</li>
                        <li>Consume excessive bandwidth, storage, or computational resources</li>
                        <li>Create or use multiple accounts to circumvent restrictions or abuse free trials</li>
                        <li>Interfere with other users' use of Services</li>
                        <li>Attempt to reverse engineer, decompile, or disassemble Services (except as permitted by law)</li>
                        <li>Share accounts or credentials with unauthorized users</li>
                        <li>Resell, rent, or lease Services without authorization</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.6 Content Violations</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not upload, transmit, or distribute:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Pirated software, copyrighted materials, or illegally obtained content</li>
                        <li>Malware, exploit code, or hacking tools (except for authorized security research)</li>
                        <li>Content that violates export control laws</li>
                        <li>Misleading, deceptive, or fraudulent content</li>
                        <li>Content promoting dangerous or illegal activities</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">2.7 Competitive Activities</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">You may not:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Use Services to develop competing products or services</li>
                        <li>Conduct competitive benchmarking or analysis without consent</li>
                        <li>Copy, reproduce, or reverse engineer Services for competitive purposes</li>
                        <li>Publicly disclose performance or benchmark data without authorization</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Security Research */}
                <section id="security-research" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Bug className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Acceptable Security Research</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">3.1 Bug Bounty and Responsible Disclosure</h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                        ERMITS encourages responsible security research. If you discover a security vulnerability:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <strong className="text-green-900 dark:text-green-100 text-sm">Permitted Activities:</strong>
                          <ul className="list-disc list-inside space-y-1 text-xs text-green-800 dark:text-green-200 mt-2">
                            <li>Responsibly report vulnerabilities to legal@ermits.com</li>
                            <li>Conduct good-faith security research on your own accounts</li>
                            <li>Test security features within scope of your own data</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-900 dark:text-green-100 text-sm">Required Practices:</strong>
                          <ul className="list-disc list-inside space-y-1 text-xs text-green-800 dark:text-green-200 mt-2">
                            <li>Do not access or modify data belonging to other users</li>
                            <li>Do not perform testing that degrades service performance</li>
                            <li>Do not publicly disclose vulnerabilities before ERMITS has had reasonable time to remediate (90 days recommended)</li>
                            <li>Provide detailed vulnerability reports with reproduction steps</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-green-900 dark:text-green-100 text-sm">Prohibited Activities:</strong>
                          <ul className="list-disc list-inside space-y-1 text-xs text-green-800 dark:text-green-200 mt-2">
                            <li>Social engineering of ERMITS employees or users</li>
                            <li>Denial-of-service testing or performance degradation</li>
                            <li>Physical attacks on ERMITS facilities</li>
                            <li>Testing on production systems without authorization</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">3.2 Security Tool Use</h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-2">Authorized use of security tools and malware samples:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>Security professionals may use Services to analyze malware samples and vulnerabilities</li>
                        <li>Analysis must be conducted in isolated environments</li>
                        <li>Malicious code must not be executed against ERMITS infrastructure or other users</li>
                        <li>Results of security research may not be used for illegal purposes</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Federal Contractor Terms */}
                <section id="federal" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Building2 className="w-6 h-6 text-orange-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Federal Contractor and CUI/FCI Handling</h2>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">4.1 CUI Marking and Handling</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                      Users processing CUI or FCI must:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                      <li>Properly mark CUI according to NIST SP 800-171 and 32 CFR Part 2002</li>
                      <li>Use encryption features and self-managed deployment options</li>
                      <li>Implement appropriate access controls and authentication</li>
                      <li>Maintain audit logs of CUI access</li>
                      <li>Report cyber incidents as required by DFARS 252.204-7012</li>
                    </ul>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 mt-4">4.2 Prohibited CUI Activities</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">You may not:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                      <li>Process CUI without appropriate safeguards</li>
                      <li>Share CUI with unauthorized users or countries</li>
                      <li>Export CUI in violation of export control laws</li>
                      <li>Fail to report cyber incidents involving CUI within required timeframes (72 hours to DoD)</li>
                      <li>Store CUI on unauthorized systems or in unauthorized locations</li>
                      <li>Transmit CUI over unsecured channels without encryption</li>
                    </ul>
                  </div>
                </section>

                {/* Resource Limits */}
                <section id="resource-limits" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Server className="w-6 h-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Resource Limits and Fair Use</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">5.1 Resource Quotas</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                        Services include resource limits based on your subscription tier:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li><strong>API Rate Limits:</strong> Requests per minute/hour/day</li>
                        <li><strong>Storage Limits:</strong> Total data storage allocation</li>
                        <li><strong>Concurrent Users:</strong> Maximum simultaneous users</li>
                        <li><strong>File Upload Limits:</strong> Maximum file size and quantity</li>
                        <li><strong>Bandwidth Limits:</strong> Data transfer quotas</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">5.2 Fair Use</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                        You agree to use resources reasonably and not to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li>Significantly exceed your allocated resource quotas</li>
                        <li>Use automated tools to generate excessive requests</li>
                        <li>Store unnecessary or redundant data</li>
                        <li>Hoard resources to the detriment of other users</li>
                        <li>Circumvent usage tracking or metering</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">5.3 Consequences of Excessive Use</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">ERMITS may, at its discretion:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li>Throttle or rate-limit excessive usage</li>
                        <li>Suspend access until usage returns to normal levels</li>
                        <li>Request upgrade to higher-tier subscription</li>
                        <li>Charge overage fees for excessive usage (with prior notice)</li>
                        <li>Terminate accounts engaging in persistent abuse</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Reporting Violations */}
                <section id="reporting" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Reporting Violations</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">6.1 How to Report</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        If you become aware of violations of this AUP:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li><strong>Email:</strong> legal@ermits.com (Subject: "AUP Violation Report")</li>
                        <li><strong>Include:</strong> Detailed description, evidence, affected accounts/systems</li>
                        <li><strong>Confidential:</strong> Reports are treated confidentially</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">6.2 Good Faith Reporting</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        ERMITS will not take adverse action against users who:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Report violations in good faith</li>
                        <li>Discover violations in the course of authorized security research</li>
                        <li>Report their own accidental violations and take corrective action</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">6.3 False Reports</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Making false or malicious reports is prohibited and may result in:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Account suspension or termination</li>
                        <li>Legal action for damages</li>
                        <li>Reporting to law enforcement if appropriate</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Enforcement */}
                <section id="enforcement" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Gavel className="w-6 h-6 text-red-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Enforcement and Consequences</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">7.1 Investigation</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">ERMITS may investigate suspected violations by:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Reviewing account activity and usage patterns</li>
                        <li>Examining audit logs and system logs (pseudonymized)</li>
                        <li>Requesting information from the user</li>
                        <li>Cooperating with law enforcement or regulatory authorities</li>
                      </ul>
                      <p className="text-sm text-red-800 dark:text-red-200 mt-3 italic">
                        <strong>Privacy Note:</strong> Due to Privacy-First Architecture, ERMITS cannot access encrypted User Data. Investigations rely on metadata, logs, and user cooperation.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">7.2 Enforcement Actions</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                        Depending on violation severity, ERMITS may:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">Warning:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-red-800 dark:text-red-200">
                            <li>Email notification of violation</li>
                            <li>Request for corrective action</li>
                            <li>Monitoring of future compliance</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">Temporary Suspension:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-red-800 dark:text-red-200">
                            <li>Immediate suspension of account access</li>
                            <li>Opportunity to respond and remediate</li>
                            <li>Reinstatement upon resolution</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">Permanent Termination:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-red-800 dark:text-red-200">
                            <li>Immediate and permanent account closure</li>
                            <li>No refund of fees</li>
                            <li>Ban from future use of Services</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">Legal Action:</h4>
                          <ul className="list-disc list-inside space-y-1 text-xs text-red-800 dark:text-red-200">
                            <li>Pursuit of damages for harm caused</li>
                            <li>Injunctive relief to prevent ongoing violations</li>
                            <li>Cooperation with law enforcement</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">7.3 Appeals</h3>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        If you believe an enforcement action was made in error, contact legal@ermits.com (Subject: "AUP Enforcement Appeal"). Provide detailed explanation and evidence. ERMITS will review and respond within 10 business days. Decision is final and at ERMITS' sole discretion.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Law Enforcement */}
                <section id="law-enforcement" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Cooperation with Law Enforcement</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">8.1 Legal Requests</h3>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">ERMITS will cooperate with lawful requests from:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>Law enforcement agencies</li>
                        <li>Regulatory authorities</li>
                        <li>Court orders and subpoenas</li>
                        <li>National security investigations</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">8.2 User Notification</h3>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">When legally permitted, ERMITS will:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>Notify affected users of legal requests</li>
                        <li>Provide reasonable time to challenge requests</li>
                        <li>Disclose only information required by law</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">8.3 Emergency Situations</h3>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">
                        In emergencies involving imminent threat to life or serious bodily harm:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>ERMITS may disclose information without prior notice</li>
                        <li>Users will be notified after emergency resolution</li>
                        <li>Disclosure limited to minimum necessary</li>
                      </ul>
                    </div>
                  </div>
                </section>


                {/* Third-Party Services */}
                <section id="third-party" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Users className="w-6 h-6 text-cyan-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Third-Party Services and Integrations</h2>
                  </div>
                  
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    <p className="text-sm text-cyan-800 dark:text-cyan-200">
                      When using third-party integrations through ERMITS Services, you are subject to third-party acceptable use policies. ERMITS is not responsible for third-party service violations. Violations of third-party policies may result in integration termination. You must comply with all applicable third-party terms.
                    </p>
                  </div>
                </section>

                {/* Policy Updates */}
                <section id="updates" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-gray-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Updates to This Policy</h2>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">ERMITS may update this AUP to reflect:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
                      <li>Evolving security threats and abuse patterns</li>
                      <li>Legal and regulatory changes</li>
                      <li>New Services or features</li>
                      <li>Industry best practices</li>
                    </ul>
                    <div className="mt-4">
                      <strong className="text-gray-900 dark:text-gray-100 text-sm">Notification:</strong>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200 mt-2">
                        <li>Material changes: 30 days' advance notice</li>
                        <li>Non-material changes: Effective immediately upon posting</li>
                        <li>Continued use constitutes acceptance</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">11. Contact Information</h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AUP Violation Reports</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:legal@ermits.com" className="underline hover:no-underline">legal@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> AUP Violation Report
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">AUP Questions</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:legal@ermits.com" className="underline hover:no-underline">legal@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> AUP Inquiry
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Appeals</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:legal@ermits.com" className="underline hover:no-underline">legal@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> AUP Enforcement Appeal
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Policy Promise */}
                <section className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <Shield className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Policy Promise</h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    <strong>We promise:</strong> This Acceptable Use Policy is designed to protect all users and maintain the integrity of our Services. We enforce these policies fairly and consistently, and we encourage responsible security research and good-faith reporting of violations. Together, we can maintain a safe and secure environment for everyone.
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

export default AcceptableUsePolicy;

