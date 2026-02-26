import React from 'react';
import { useState } from 'react';
import { CreditCard, DollarSign, RefreshCw, Ban, X, CheckCircle, Info, AlertTriangle, FileText, Mail, ShoppingCart, Calendar, Receipt, TrendingUp, Users, Building2, Globe, Shield } from 'lucide-react';
import SEOHead from '../common/SEOHead';
import BackButton from '../common/BackButton';

const ECommercePolicies = () => {
  const [activeSection, setActiveSection] = useState('subscription-payment');
  const lastUpdated = 'January 27, 2025';
  const effectiveDate = 'November 19, 2025';

  const sections = [
    { id: 'subscription-payment', title: 'Subscription & Payment Terms', icon: CreditCard },
    { id: 'refund-cancellation', title: 'Refund & Cancellation Policy', icon: RefreshCw }
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
        title="E-Commerce Policies - ERMITS"
        description="ERMITS E-Commerce Policies including Subscription & Payment Terms and Refund & Cancellation Policy."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/e-commerce-policies` : ''}
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="w-12 h-12 mr-4" />
                    <div>
                      <h1 className="text-3xl font-bold mb-2">E-Commerce Policies</h1>
                      <p className="text-blue-100">Subscription, Payment, Refund & Cancellation Terms</p>
                    </div>
                  </div>
                  <BackButton
                    to="/"
                    label=""
                    showIcon={true}
                    icon={X}
                    className="p-2 text-blue-100 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                    aria-label="Close e-commerce policies"
                    title="Close"
                  />
                </div>
                <div className="mt-4 text-blue-100 text-sm">
                  <div>Version: 1.0</div>
                  <div>Effective Date: {effectiveDate}</div>
                  <div>Last Updated: {lastUpdated}</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 space-y-8">
                {/* Subscription & Payment Terms */}
                <section id="subscription-payment" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Subscription & Payment Terms</h2>
                  </div>
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">
                      These Subscription & Payment Terms ("Payment Terms") supplement the ERMITS LLC Master Terms of Service and govern all paid subscriptions, purchases, and financial transactions related to ERMITS Services.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.1 Subscription Plans and Pricing</h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Freemium Tiers (No Payment Required):</h4>
                          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                            <li>Limited feature access</li>
                            <li>Usage quotas and restrictions</li>
                            <li>Community support only</li>
                            <li>No service level commitments</li>
                            <li>May include advertisements or promotional content</li>
                            <li>Subject to modification or termination at any time</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Free Trial Plans:</h4>
                          <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-200 text-sm">
                            <li>Full feature access for trial period</li>
                            <li>Duration varies by product (typically 14-30 days)</li>
                            <li>Requires payment method on file</li>
                            <li>Automatically converts to paid subscription unless cancelled</li>
                            <li>One free trial per user/organization per product</li>
                            <li>Abuse of free trials (multiple accounts, etc.) is prohibited</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Paid Subscription Tiers:</h4>
                          <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">Each ERMITS product offers multiple paid tiers with varying features, quotas, and support levels:</p>
                          <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200 text-sm">
                            <li><strong>Standard/Professional Plans:</strong> Core features, standard usage quotas, email support (24-hour response), monthly or annual billing</li>
                            <li><strong>Enterprise Plans:</strong> Advanced features, higher usage quotas, priority support (4-hour response), custom billing arrangements, volume discounts, dedicated account management</li>
                            <li><strong>Federal/Government Plans:</strong> CMMC-compliant features, FedRAMP-aligned infrastructure options, government-specific support, DFARS/FAR compliance features, custom pricing and contracts</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.2 Billing and Payment</h3>
                      <div className="space-y-4">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Payment Methods:</h4>
                          <ul className="list-disc list-inside space-y-1 text-orange-800 dark:text-orange-200 text-sm">
                            <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
                            <li>Debit cards with credit card logo</li>
                            <li>ACH bank transfers (Enterprise customers only)</li>
                            <li>Wire transfers (Enterprise customers, annual plans only)</li>
                            <li>Purchase orders (Enterprise/Government customers with approved credit)</li>
                          </ul>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mt-2">
                            All credit/debit card payments processed by Stripe, Inc. ERMITS does not store complete payment card information. Payment security governed by PCI-DSS compliance.
                          </p>
                        </div>
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Billing Cycles:</h4>
                          <ul className="list-disc list-inside space-y-1 text-cyan-800 dark:text-cyan-200 text-sm">
                            <li><strong>Monthly Subscriptions:</strong> Billed on the same day each month (subscription start date). Prorated charges for mid-cycle upgrades. No proration for downgrades (takes effect next billing cycle).</li>
                            <li><strong>Annual Subscriptions:</strong> Billed once per year on subscription anniversary date. Discounted pricing compared to monthly (typically 15-20% savings). Entire year charged upfront. Automatic renewal unless cancelled before anniversary.</li>
                            <li><strong>Custom Billing (Enterprise):</strong> Negotiated billing terms, quarterly or semi-annual billing available, invoice payment terms (Net 30, Net 60), multi-year contracts with fixed pricing, volume discounts and custom arrangements.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.3 Automatic Renewal</h3>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">
                          Subscriptions automatically renew at the end of each billing cycle. Renewal charge processed using payment method on file. No action required to continue service.
                        </p>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2">
                          <strong>Renewal Notifications:</strong> Email notification 7 days before renewal (monthly subscriptions), 30 days before renewal (annual subscriptions). Notification includes renewal date, amount, and payment method. Instructions for cancellation included in notification.
                        </p>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200">
                          <strong>Renewal Failure:</strong> If payment fails, ERMITS will retry up to 3 times over 7 days. After final failure, subscription cancelled and access suspended. Grace period of 7 days to update payment method. Service restored immediately upon successful payment.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.4 Taxes and Fees</h3>
                      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                        <p className="text-sm text-pink-800 dark:text-pink-200 mb-2">
                          <strong>Sales Tax and VAT:</strong> Sales tax charged based on billing address (United States). VAT charged for EU customers based on location. Applicable taxes charged per local requirements (GST, etc.). ERMITS collects and remits taxes as required by law.
                        </p>
                        <p className="text-sm text-pink-800 dark:text-pink-200">
                          <strong>Additional Fees:</strong> No additional fees for standard credit/debit card payments. Wire transfer fees may apply (typically $25-50 per transfer, paid by customer). Currency conversion fees charged by payment processor or your bank. Late payment fees: 1.5% monthly interest on overdue balances for Enterprise/Invoice customers (or maximum allowed by law).
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.5 Product-Specific Pricing</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">ERMITS Advisory + STEEL™:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-1"><strong>Digital Products:</strong> STEEL™ Premium Assessment: $29 (lifetime access), vCISO Starter Kit: $299-$499 (37 templates)</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200"><strong>Advisory Services:</strong> STEEL Strategic Assessment: $25,000 - $125,000, On-Demand Advisory: Custom (hourly or project-based)</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">TechnoSoluce™ SBOM Analyzer:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200">Free trial: 14 days, Starter: $5,000/year (up to 50 applications), Professional: $12,000/year (up to 51-200 applications), Enterprise: $25,000/year (200+ applications), Federal: $40,000/year</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">CyberCertitude™ Products:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200">CMMC Level 1: Free, CMMC Level 2: $179.99-$359.99/month, Enterprise: Custom pricing. One-Time Purchases: CMMC Planner Pro: $699, Incident Response Planner: $699, CMMC Gap Analysis Pro: $499, Risk Assessment Tool: $499, Security Control Mapper: $499, CUI Data Mapper Pro: $399, Tool Bundles: $1,299-$2,199</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">VendorSoluce™:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200">Free trial: 14 days, Starter: $39/month (up to 25 vendors), Professional: $129/month (up to 100 vendors), Enterprise: $399/month (unlimited vendors), Federal: Custom pricing, Bundles: $299-$599</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">CyberCorrect™ Products:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200">Free Tier: Basic features, Starter: $49/month, Professional: $99/month, Enterprise: Custom pricing. One-Time Purchases: Policy & Template Library: $99, GDPR Complete Kit: $199, Privacy Toolkit Pro: $299, Compliance Assessment Suite: $149, Bundles: $249-$599</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">CyberCaution™ Products:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200">Free Assessments: Basic features, Starter: $49, Analyst: $89, Professional: $149, Enterprise: Custom pricing</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">SocialCaution™ Products:</h4>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-2"><strong>Subscription Plans:</strong> Free Plan: Basic features (local-only storage, 3 assessments/month, up to 5 services), Premium: $2.99/month or $24.99/year (unlimited assessments, cloud sync, advanced analytics), Family Plan: $7.99/month or $64.99/year (up to 5 members, family dashboard, child protection features)</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-2"><strong>One-Time Purchases:</strong> Privacy Assessment Toolkit: $49, Service Monitoring Alerts: $29, Premium Report Template Pack: $19, Professional Privacy Audit: $299</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-2"><strong>Data Broker Removal Service (Coming Soon):</strong> Planned pricing - Basic: $79/year (10 brokers), Premium: $149/year (50+ brokers)</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-2"><strong>Enterprise Plans:</strong> Starter: $99/month (up to 10 team members), Professional: $299/month (up to 50 team members), Enterprise: Custom pricing</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-2"><strong>Privacy Courses:</strong> Privacy Basics Course: $49, Advanced Privacy Course: $99, GDPR/CCPA Compliance Workshop: $199</p>
                          <p className="text-xs text-gray-800 dark:text-gray-200"><strong>API Access:</strong> Developer: $49/month (1,000 calls/month), Business: $199/month (10,000 calls/month)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                        <strong>Note:</strong> Exact pricing subject to change. See individual product websites for current pricing. Advisory services require consultation for custom quotes.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Refund & Cancellation Policy */}
                <section id="refund-cancellation" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <RefreshCw className="w-6 h-6 text-green-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Refund & Cancellation Policy</h2>
                  </div>
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">
                      This Refund & Cancellation Policy governs subscription cancellations, refund requests, and account terminations for ERMITS LLC ("ERMITS") Services. This policy supplements the Master Terms of Service and Subscription & Payment Terms.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.1 No Money-Back Guarantee</h3>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                          ERMITS does <strong>not</strong> offer a standard 30-day money-back guarantee or similar blanket refund policy. All sales are final except as specifically provided in this policy.
                        </p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                          <strong>Rationale:</strong> Free trials available for most products. Freemium tiers allow service evaluation without payment. Privacy-First Architecture makes usage verification difficult. Client-side data processing limits ERMITS' ability to assess service use.
                        </p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Exceptions:</strong> Refunds may be granted under specific circumstances outlined in Section 2.3.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.2 Cancellation Process</h3>
                      <div className="space-y-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Self-Service Cancellation:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                            <li>Log in to your account</li>
                            <li>Navigate to Account Settings → Billing → Subscription</li>
                            <li>Click "Cancel Subscription"</li>
                            <li>Select cancellation reason (optional feedback)</li>
                            <li>Confirm cancellation</li>
                            <li>Receive email confirmation</li>
                          </ol>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Email Cancellation:</h4>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            Email <a href="mailto:contact@ermits.com" className="underline hover:no-underline">contact@ermits.com</a> with subject "Subscription Cancellation - [Your Name]". Include account email and subscription details. Confirmation sent within 1 business day.
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Cancellation Effective Date:</h4>
                          <p className="text-sm text-purple-800 dark:text-purple-200">
                            Cancellation takes effect at end of current billing period. Access continues through paid period. No charges after cancellation effective date. No partial refunds for remaining time in billing period.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.3 Refund Eligibility</h3>
                      <div className="space-y-3">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Digital Products (One-Time Purchases):</h4>
                          <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                            <strong>Eligibility:</strong> Refund available within 7 days of purchase if: Technical failure prevents access, Product incomplete or materially different from description, Billing error or duplicate charge.
                          </p>
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            <strong>Not Eligible:</strong> After 7 days, After downloading or accessing file or assessment, Change of mind or buyer's remorse, "Didn't use it" or "Forgot I purchased it", Incompatibility with user's environment (specs clearly documented).
                          </p>
                        </div>
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">Advisory Services:</h4>
                          <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-2">
                            <strong>STEEL Strategic Assessments ($25K-$125K):</strong> Milestone-based billing with satisfaction checkpoints. Pro-rated refund if ERMITS fails to deliver contracted scope, material breach of Statement of Work, or services not performed as specified. Not eligible after final deliverables accepted.
                          </p>
                          <p className="text-sm text-cyan-800 dark:text-cyan-200">
                            <strong>On-Demand Advisory Services:</strong> Hourly or project-based (invoiced monthly or at milestones). Refund for unperformed work only. Review invoices with account manager; dispute within 14 days.
                          </p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                          <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Subscription Products:</h4>
                          <p className="text-sm text-indigo-800 dark:text-indigo-200">
                            No pro-rated refunds for monthly subscriptions. Annual subscriptions: No pro-rated refunds. Refunds only for technical service failures. Free trials: Must cancel before trial ends to avoid charges. No refunds if auto-renewal not cancelled in time. One-time courtesy refund may be granted (discretionary).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.4 Annual Subscription Cancellations</h3>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                          <strong>Standard Policy:</strong> No prorated refunds for annual subscriptions. Cancellation takes effect at end of annual period. Access continues through paid annual period. Renewal prevented for next year.
                        </p>
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>Rationale:</strong> Discounted pricing (typically 15-20% off monthly pricing). Discount reflects annual commitment. Administrative and processing costs.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.5 Data Retention After Cancellation</h3>
                      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-800">
                        <p className="text-sm text-pink-800 dark:text-pink-200 mb-2">
                          <strong>Paid Accounts:</strong> 30-day grace period for data export. Read-only access to data during grace period. Download all data via Account Settings → Export Data. Multiple export formats available (JSON, CSV, PDF).
                        </p>
                        <p className="text-sm text-pink-800 dark:text-pink-200">
                          <strong>Free Trials:</strong> 7-day grace period for data export. Read-only access during grace period. Limited export functionality.
                        </p>
                        <p className="text-sm text-pink-800 dark:text-pink-200 mt-2">
                          After grace period: All user data permanently deleted from production systems. Deletion cannot be reversed. No data recovery possible after deletion. Backups deleted within 90 days.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.6 Refund Processing</h3>
                      <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                          <strong>Standard Refunds:</strong> Refunded to original payment method. Credit/debit card refunds appear in 5-10 business days. Bank transfers refunded via check or wire transfer. Processing time varies by payment processor (Stripe) and issuing bank.
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          <strong>Refund Processing Timeline:</strong> Approved refunds initiated within 2 business days. Confirmation email sent when refund processed. Includes refund amount, method, and expected timeline. Receipt of funds: Credit/Debit Cards: 5-10 business days from processing date, Bank Transfer: 7-14 business days from processing date, Check: 10-15 business days for delivery + time to deposit, Account Credit: Immediate.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2.7 Contact Information</h3>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Cancellation Requests:</h4>
                            <p className="text-blue-800 dark:text-blue-200">
                              Email: <a href="mailto:contact@ermits.com" className="underline hover:no-underline">contact@ermits.com</a><br />
                              Subject: "Subscription Cancellation"
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Refund Requests:</h4>
                            <p className="text-blue-800 dark:text-blue-200">
                              Email: <a href="mailto:contact@ermits.com" className="underline hover:no-underline">contact@ermits.com</a><br />
                              Subject: "Refund Request - [Invoice Number]"
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Billing Disputes:</h4>
                            <p className="text-blue-800 dark:text-blue-200">
                              Email: <a href="mailto:contact@ermits.com" className="underline hover:no-underline">contact@ermits.com</a><br />
                              Subject: "Billing Dispute - [Invoice Number]"
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Response Times:</h4>
                            <p className="text-blue-800 dark:text-blue-200">
                              Cancellation confirmation: Within 1 business day<br />
                              Refund requests: Review within 5 business days<br />
                              Billing disputes: Within 2 business days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommercePolicies;

