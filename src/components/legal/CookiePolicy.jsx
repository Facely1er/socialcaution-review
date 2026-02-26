import React from 'react';
import { useState } from 'react';
import { Cookie, Shield, Eye, Settings, Globe, Mail, X, CheckCircle, Info, AlertTriangle, Lock as LockIcon, FileText, Smartphone, Ban } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState('what-are-cookies');
  const lastUpdated = 'December 13, 2025';
  const effectiveDate = 'October 31, 2025';

  const sections = [
    { id: 'what-are-cookies', title: 'What Are Cookies?', icon: Cookie },
    { id: 'how-we-use', title: 'How We Use Cookies', icon: Eye },
    { id: 'specific-cookies', title: 'Specific Cookies', icon: FileText },
    { id: 'third-party', title: 'Third-Party Cookies', icon: Globe },
    { id: 'privacy-first', title: 'Cookies & Privacy-First', icon: Shield },
    { id: 'your-choices', title: 'Your Cookie Choices', icon: Settings },
    { id: 'dnt', title: 'Do Not Track', icon: Ban },
    { id: 'mobile', title: 'Mobile Applications', icon: Smartphone },
    { id: 'international', title: 'International Privacy Laws', icon: Globe },
    { id: 'security', title: 'Cookies and Security', icon: LockIcon },
    { id: 'local-storage', title: 'Local Storage', icon: FileText },
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
        title="Cookie Policy - ERMITS"
        description="ERMITS Cookie Policy. Learn how we use cookies and similar technologies, your choices, and our Privacy-First approach to cookie management."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/cookie-policy` : ''}
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
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cookie className="w-12 h-12 mr-4" />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
                      <p className="text-orange-100">Transparent cookie usage with Privacy-First principles</p>
                    </div>
                  </div>
                  <BackButton
                    to="/"
                    label=""
                    showIcon={true}
                    icon={X}
                    className="p-2 text-orange-100 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                    aria-label="Close cookie policy"
                    title="Close"
                  />
                </div>
                <div className="mt-4 text-orange-100 text-sm">
                  <div>Effective Date: {effectiveDate}</div>
                  <div>Last Updated: {lastUpdated}</div>
                </div>
              </div>

              {/* Cookie Categories Summary */}
              <div className="p-8 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Cookie Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    <Shield className="w-8 h-8 text-red-600 dark:text-red-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-red-900 dark:text-red-100 text-sm mb-1">Essential</h3>
                    <p className="text-xs text-red-700 dark:text-red-300">Always active</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                    <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">Performance</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Optional</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                    <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">Analytics</h3>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Optional</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    <Cookie className="w-8 h-8 text-green-600 dark:text-green-400 mb-3 mx-auto" />
                    <h3 className="font-bold text-green-900 dark:text-green-100 text-sm mb-1">Functional</h3>
                    <p className="text-xs text-green-700 dark:text-green-300">Optional</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 space-y-8">
                {/* What Are Cookies */}
                <section id="what-are-cookies" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Cookie className="w-6 h-6 text-orange-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. What Are Cookies?</h2>
                  </div>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
                    </p>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">1.2 Similar Technologies</h3>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">This policy also covers:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                        <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
                        <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
                        <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
                        <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
                        <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Cookies */}
                <section id="how-we-use" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Eye className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. How We Use Cookies</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Essential Cookies (Always Active)
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">Required for basic service functionality:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li>Authentication and session management</li>
                        <li>Security and fraud prevention</li>
                        <li>Load balancing and performance</li>
                        <li>User preference storage (language, theme)</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Performance Cookies (Optional)</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">Help us improve service performance:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Page load time measurement</li>
                        <li>Error tracking and debugging (Sentry)</li>
                        <li>Feature usage analytics</li>
                        <li>Service optimization</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Analytics Cookies (Optional)</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">Help us understand how Services are used:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li>User behavior patterns (PostHog with differential privacy)</li>
                        <li>Popular features and pages</li>
                        <li>User journey analysis</li>
                        <li>Conversion tracking</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Functional Cookies (Optional)</h3>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-2">Enable enhanced functionality:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>Remember settings and preferences</li>
                        <li>Personalize user experience</li>
                        <li>Enable integrations with third-party services</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Specific Cookies */}
                <section id="specific-cookies" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Specific Cookies We Use</h2>
                  </div>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-indigo-800 dark:text-indigo-200">
                        <thead>
                          <tr className="border-b border-indigo-300 dark:border-indigo-700">
                            <th className="text-left p-2">Cookie Name</th>
                            <th className="text-left p-2">Provider</th>
                            <th className="text-left p-2">Purpose</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-indigo-200 dark:border-indigo-800">
                            <td className="p-2"><strong>sb-access-token</strong></td>
                            <td className="p-2">Supabase</td>
                            <td className="p-2">Authentication</td>
                            <td className="p-2">Essential</td>
                            <td className="p-2">1 hour</td>
                          </tr>
                          <tr className="border-b border-indigo-200 dark:border-indigo-800">
                            <td className="p-2"><strong>sb-refresh-token</strong></td>
                            <td className="p-2">Supabase</td>
                            <td className="p-2">Session renewal</td>
                            <td className="p-2">Essential</td>
                            <td className="p-2">30 days</td>
                          </tr>
                          <tr className="border-b border-indigo-200 dark:border-indigo-800">
                            <td className="p-2"><strong>theme</strong></td>
                            <td className="p-2">ERMITS</td>
                            <td className="p-2">UI theme preference</td>
                            <td className="p-2">Functional</td>
                            <td className="p-2">1 year</td>
                          </tr>
                          <tr className="border-b border-indigo-200 dark:border-indigo-800">
                            <td className="p-2"><strong>consent</strong></td>
                            <td className="p-2">ERMITS</td>
                            <td className="p-2">Cookie consent preferences</td>
                            <td className="p-2">Essential</td>
                            <td className="p-2">1 year</td>
                          </tr>
                          <tr className="border-b border-indigo-200 dark:border-indigo-800">
                            <td className="p-2"><strong>phc_***</strong></td>
                            <td className="p-2">PostHog</td>
                            <td className="p-2">Anonymous analytics</td>
                            <td className="p-2">Analytics</td>
                            <td className="p-2">1 year</td>
                          </tr>
                          <tr>
                            <td className="p-2"><strong>sentry-session</strong></td>
                            <td className="p-2">Sentry</td>
                            <td className="p-2">Error tracking session</td>
                            <td className="p-2">Performance</td>
                            <td className="p-2">Session</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-3">
                      <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
                    </p>
                  </div>
                </section>

                {/* Third-Party Cookies */}
                <section id="third-party" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Globe className="w-6 h-6 text-cyan-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Third-Party Cookies</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">4.1 Third-Party Service Providers</h3>
                      <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-3">We use third-party services that may set cookies:</p>
                      
                      <div className="space-y-4">
                        <div>
                          <strong className="text-cyan-900 dark:text-cyan-100">Supabase (Authentication & Database):</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                            <li>Purpose: User authentication and session management</li>
                            <li>Privacy: Essential for service functionality</li>
                            <li>Control: Required for service use; cannot be disabled</li>
                            <li>More info: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://supabase.com/privacy</a></li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong className="text-cyan-900 dark:text-cyan-100">Sentry (Error Tracking):</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                            <li>Purpose: Monitor application errors and performance</li>
                            <li>Privacy: Automatically scrubs PII from error reports</li>
                            <li>Control: Can be disabled in privacy settings</li>
                            <li>More info: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://sentry.io/privacy/</a></li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong className="text-cyan-900 dark:text-cyan-100">PostHog (Analytics):</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                            <li>Purpose: Anonymous usage analytics with differential privacy</li>
                            <li>Privacy: Cannot identify individual users</li>
                            <li>Control: Can be disabled in privacy settings (opt-out)</li>
                            <li>More info: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://posthog.com/privacy</a></li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong className="text-cyan-900 dark:text-cyan-100">Stripe (Payment Processing):</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                            <li>Purpose: Payment processing and fraud prevention</li>
                            <li>Privacy: Handles payment information securely</li>
                            <li>Control: Required for payment functionality</li>
                            <li>More info: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://stripe.com/privacy</a></li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong className="text-cyan-900 dark:text-cyan-100">Vercel (Hosting & CDN):</strong>
                          <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                            <li>Purpose: Content delivery and performance optimization</li>
                            <li>Privacy: Standard web server logs</li>
                            <li>Control: Required for service delivery</li>
                            <li>More info: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://vercel.com/legal/privacy-policy</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">4.2 Third-Party Privacy</h3>
                      <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-2">
                        ERMITS is not responsible for third-party cookie practices. We encourage you to review third-party privacy policies. We contractually require third parties to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200">
                        <li>Use data only for specified purposes</li>
                        <li>Comply with applicable privacy laws</li>
                        <li>Implement appropriate security measures</li>
                        <li>Respect user privacy choices</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Cookies and Privacy-First Architecture */}
                <section id="privacy-first" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Cookies and Privacy-First Architecture</h2>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">5.1 Minimal Cookie Use</h3>
                    <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                      Due to Privacy-First Architecture:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                      <li><strong>No tracking cookies</strong> for advertising or marketing</li>
                      <li><strong>No cross-site tracking</strong> or profiling</li>
                      <li><strong>Minimal essential cookies</strong> only for functionality</li>
                      <li><strong>Local processing</strong> reduces need for server-side cookies</li>
                      <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
                    </ul>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 mt-4">5.2 Data Minimization</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                      <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
                      <li><strong>Session tokens only</strong> for authentication</li>
                      <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
                      <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
                    </ul>
                  </div>
                </section>

                {/* Your Cookie Choices */}
                <section id="your-choices" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Settings className="w-6 h-6 text-purple-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Your Cookie Choices</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">6.1 Cookie Consent</h3>
                      <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">When you first visit ERMITS Services:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                        <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
                        <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
                        <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
                        <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">6.2 Managing Cookie Preferences</h3>
                      <div className="mb-4">
                        <strong className="text-purple-900 dark:text-purple-100 text-sm">Within ERMITS Services:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200 mt-2">
                          <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
                          <li>Toggle categories on/off (except essential cookies)</li>
                          <li>Save preferences (stored in essential consent cookie)</li>
                        </ul>
                      </div>
                      <div className="mb-4">
                        <strong className="text-purple-900 dark:text-purple-100 text-sm">Browser Controls:</strong>
                        <p className="text-sm text-purple-800 dark:text-purple-200 mb-2 mt-1">Most browsers allow cookie management:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200">
                          <li><strong>Block all cookies:</strong> May prevent service functionality</li>
                          <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
                          <li><strong>Delete cookies:</strong> Clear existing cookies</li>
                          <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-purple-900 dark:text-purple-100 text-sm">Browser-Specific Instructions:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200 mt-2">
                          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                          <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                          <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Cookies</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">6.3 Opt-Out Tools</h3>
                      <div className="mb-4">
                        <strong className="text-purple-900 dark:text-purple-100 text-sm">Analytics Opt-Out:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200 mt-2">
                          <li>Disable analytics cookies in Account Settings</li>
                          <li>Use browser Do Not Track (DNT) signal (we honor DNT)</li>
                          <li>PostHog opt-out: <a href="https://posthog.com/opt-out" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">https://posthog.com/opt-out</a></li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-purple-900 dark:text-purple-100 text-sm">Error Tracking Opt-Out:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-200 mt-2">
                          <li>Disable performance cookies in Account Settings</li>
                          <li>Sentry respects privacy settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Do Not Track */}
                <section id="dnt" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Ban className="w-6 h-6 text-red-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Do Not Track (DNT)</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">7.1 DNT Support</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">ERMITS respects browser Do Not Track signals:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
                        <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
                        <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">7.2 Enabling DNT</h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-2">To enable Do Not Track in your browser:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        <li><strong>Chrome:</strong> Not supported (use cookie controls instead)</li>
                        <li><strong>Firefox:</strong> Settings → Privacy & Security → Send websites a "Do Not Track" signal</li>
                        <li><strong>Safari:</strong> Preferences → Privacy → Website Tracking → Prevent cross-site tracking</li>
                        <li><strong>Edge:</strong> Settings → Privacy, Search, and Services → Send "Do Not Track" requests</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Mobile Applications */}
                <section id="mobile" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Smartphone className="w-6 h-6 text-pink-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Mobile Applications</h2>
                  </div>
                  
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                    <p className="text-sm text-pink-800 dark:text-pink-200">
                      For ERMITS mobile applications (if applicable), mobile SDKs provide similar functionality to cookies. Device identifiers may be collected, and opt-out is available in app settings. Note: ERMITS current products are web-based. Mobile-specific policies will be added if mobile apps are released.
                    </p>
                  </div>
                </section>

                {/* International Privacy Laws */}
                <section id="international" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Globe className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Cookies and International Privacy Laws</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">9.1 GDPR Compliance (EU/UK/Swiss)</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">For users in the European Economic Area, United Kingdom, or Switzerland:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</li>
                        <li><strong>Granular Control:</strong> You can accept/reject specific cookie categories</li>
                        <li><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</li>
                        <li><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">9.2 CCPA Compliance (California)</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">For California residents:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</li>
                        <li><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</li>
                        <li><strong>Disclosure:</strong> This policy discloses all cookies used</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">9.3 Other Jurisdictions</h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">We comply with cookie laws in all jurisdictions where we operate, including:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>Canada's PIPEDA</li>
                        <li>Brazil's LGPD</li>
                        <li>Australia's Privacy Act</li>
                        <li>Other applicable data protection laws</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Cookies and Security */}
                <section id="security" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <LockIcon className="w-6 h-6 text-orange-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Cookies and Security</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">10.1 Secure Cookie Practices</h3>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">ERMITS implements secure cookie handling:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                        <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
                        <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
                        <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
                        <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
                        <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">10.2 Cookie Security Risks</h3>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">Be aware of cookie-related security risks:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                        <li><strong>Session Hijacking:</strong> Attackers stealing session cookies</li>
                        <li><strong>XSS Attacks:</strong> Malicious scripts accessing cookies</li>
                        <li><strong>CSRF Attacks:</strong> Unauthorized actions using your cookies</li>
                      </ul>
                      <div className="mt-4">
                        <strong className="text-orange-900 dark:text-orange-100 text-sm">Protect Yourself:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200 mt-2">
                          <li>Use strong, unique passwords</li>
                          <li>Enable multi-factor authentication</li>
                          <li>Log out when finished (especially on shared devices)</li>
                          <li>Clear cookies on shared/public computers</li>
                          <li>Keep browser and OS updated</li>
                          <li>Use antivirus and security software</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Local Storage and IndexedDB */}
                <section id="local-storage" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-cyan-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">11. Local Storage and IndexedDB</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">11.1 Privacy-First Local Storage</h3>
                      <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-3">
                        ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:
                      </p>
                      <div className="mb-4">
                        <strong className="text-cyan-900 dark:text-cyan-100 text-sm">Purpose:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                          <li>Store assessment data locally (never transmitted to servers)</li>
                          <li>Enable offline functionality</li>
                          <li>Reduce server data storage</li>
                          <li>Provide faster performance</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-cyan-900 dark:text-cyan-100 text-sm">Privacy Benefits:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                          <li><strong>Data stays local:</strong> Your data remains on your device</li>
                          <li><strong>No server transmission:</strong> ERMITS doesn't access local storage data</li>
                          <li><strong>User control:</strong> You can clear local storage anytime</li>
                          <li><strong>Encryption option:</strong> Sensitive data can be encrypted locally</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">11.2 Managing Local Storage</h3>
                      <div className="mb-4">
                        <strong className="text-cyan-900 dark:text-cyan-100 text-sm">Clear Local Storage:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                          <li><strong>Within Services:</strong> Account Settings → Data → Clear Local Data</li>
                          <li><strong>Browser Settings:</strong> Developer Tools → Application → Storage → Clear</li>
                          <li><strong>Warning:</strong> Clearing local storage deletes locally-stored assessments and data</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-cyan-900 dark:text-cyan-100 text-sm">Backup Local Data:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-cyan-800 dark:text-cyan-200 mt-2">
                          <li>Export data before clearing: Account Settings → Export Data</li>
                          <li>Download JSON/CSV backups</li>
                          <li>Store backups securely</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Policy Updates */}
                <section id="updates" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-gray-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12. Updates to This Cookie Policy</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">12.1 Policy Changes</h3>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">We may update this Cookie Policy to reflect:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
                        <li>New cookies or technologies</li>
                        <li>Changes in legal requirements</li>
                        <li>Service updates or new features</li>
                        <li>User feedback</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">12.2 Notification</h3>
                      <div className="mb-4">
                        <strong className="text-gray-900 dark:text-gray-100 text-sm">Material Changes:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200 mt-2">
                          <li>30 days' advance notice via email</li>
                          <li>Updated cookie consent banner on first visit</li>
                          <li>Opportunity to review and adjust preferences</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100 text-sm">Non-Material Changes:</strong>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200 mt-2">
                          <li>Update "Last Updated" date</li>
                          <li>Effective immediately upon posting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <section id="contact" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <Mail className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">13. Contact Information</h2>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cookie Policy Questions</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> Cookie Policy Inquiry
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cookie Preferences</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          Account Settings → Privacy → Cookie Preferences
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Data Protection Officer (EU/UK/Swiss)</h4>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Email:</strong> <a href="mailto:privacy@ermits.com" className="underline hover:no-underline">privacy@ermits.com</a>
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Subject:</strong> Cookie GDPR Inquiry
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Cookie Promise */}
                <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-2xl">
                  <div className="flex items-center mb-4">
                    <Cookie className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">Cookie Promise</h2>
                  </div>
                  <p className="text-lg leading-relaxed">
                    <strong>We promise:</strong> Minimal cookie usage with maximum transparency. We use only essential cookies by default, provide granular control over optional cookies, respect Do Not Track signals, and never use cookies for advertising or cross-site tracking. Your privacy choices are always respected.
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

export default CookiePolicy;

