import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, 
  Lock, Smartphone, Mail, MessageSquare, Cloud, CreditCard,
  Activity, Bell, Settings, Users, Download, X
} from 'lucide-react';

// SocialCaution Personal Privacy Radar
// Client-side only - zero data transmission

interface Service {
  id: string;
  name: string;
  category: 'social' | 'messaging' | 'email' | 'cloud' | 'shopping' | 'streaming' | 'finance' | 'other';
  privacyScore: number;
  logo?: string;
  isActive: boolean;
  dataCollected: string[];
  thirdPartySharing: boolean;
  encryption: 'none' | 'in_transit' | 'end_to_end';
  lastPolicyUpdate: Date;
  breaches: Breach[];
  alternatives: Alternative[];
}

interface Breach {
  date: Date;
  recordsAffected: number;
  dataTypes: string[];
  status: 'active' | 'resolved';
  userAction: 'none' | 'password_changed' | 'account_deleted';
}

interface Alternative {
  name: string;
  privacyScore: number;
  improvement: number;
}

interface PrivacyTrend {
  date: Date;
  score: number;
  highRiskCount: number;
  breaches: number;
}

// Mock services data - in production, this would load from local storage
const getMockServices = (): Service[] => [
      {
        id: 'facebook',
        name: 'Facebook',
        category: 'social',
        privacyScore: 35,
        isActive: true,
        dataCollected: ['Name', 'Email', 'Phone', 'Location', 'Browsing History', 'Contacts', 'Messages'],
        thirdPartySharing: true,
        encryption: 'in_transit',
        lastPolicyUpdate: new Date('2024-01-15'),
        breaches: [
          {
            date: new Date('2024-11-20'),
            recordsAffected: 533000000,
            dataTypes: ['Phone', 'Email', 'Location'],
            status: 'active',
            userAction: 'password_changed'
          }
        ],
        alternatives: [
          { name: 'Signal', privacyScore: 95, improvement: 60 },
          { name: 'Mastodon', privacyScore: 85, improvement: 50 }
        ]
      },
      {
        id: 'gmail',
        name: 'Gmail',
        category: 'email',
        privacyScore: 45,
        isActive: true,
        dataCollected: ['Email Content', 'Contacts', 'Calendar', 'Location', 'Device Info'],
        thirdPartySharing: true,
        encryption: 'in_transit',
        lastPolicyUpdate: new Date('2024-02-01'),
        breaches: [],
        alternatives: [
          { name: 'ProtonMail', privacyScore: 95, improvement: 50 },
          { name: 'Tutanota', privacyScore: 90, improvement: 45 }
        ]
      },
      {
        id: 'signal',
        name: 'Signal',
        category: 'messaging',
        privacyScore: 95,
        isActive: true,
        dataCollected: ['Phone Number (encrypted)'],
        thirdPartySharing: false,
        encryption: 'end_to_end',
        lastPolicyUpdate: new Date('2023-12-01'),
        breaches: [],
        alternatives: []
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        category: 'messaging',
        privacyScore: 65,
        isActive: true,
        dataCollected: ['Phone', 'Contacts', 'Device Info', 'Metadata'],
        thirdPartySharing: true, // Shares metadata with Facebook
        encryption: 'end_to_end',
        lastPolicyUpdate: new Date('2024-01-10'),
        breaches: [],
        alternatives: [
          { name: 'Signal', privacyScore: 95, improvement: 30 },
          { name: 'Telegram', privacyScore: 75, improvement: 10 }
        ]
      },
      {
        id: 'dropbox',
        name: 'Dropbox',
        category: 'cloud',
        privacyScore: 55,
        isActive: true,
        dataCollected: ['Files', 'File Names', 'Metadata', 'Device Info', 'Location'],
        thirdPartySharing: true,
        encryption: 'in_transit',
        lastPolicyUpdate: new Date('2023-11-15'),
        breaches: [],
        alternatives: [
          { name: 'Tresorit', privacyScore: 95, improvement: 40 },
          { name: 'SpiderOak', privacyScore: 90, improvement: 35 }
        ]
      },
      {
        id: 'netflix',
        name: 'Netflix',
        category: 'streaming',
        privacyScore: 60,
        isActive: true,
        dataCollected: ['Viewing History', 'Device Info', 'Payment Info', 'Location'],
        thirdPartySharing: true,
        encryption: 'in_transit',
        lastPolicyUpdate: new Date('2024-01-01'),
        breaches: [],
        alternatives: []
      },
      {
        id: 'protonmail',
        name: 'ProtonMail',
        category: 'email',
        privacyScore: 95,
        isActive: true,
        dataCollected: ['Email (encrypted)'],
        thirdPartySharing: false,
        encryption: 'end_to_end',
        lastPolicyUpdate: new Date('2023-10-01'),
        breaches: [],
        alternatives: []
      }
    ];

// Mock trends data generator
const getMockTrends = (): PrivacyTrend[] => {
  const mockTrends: PrivacyTrend[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    mockTrends.push({
      date,
      score: 55 + Math.random() * 20 + (29 - i) * 0.5, // Improving trend
      highRiskCount: Math.floor(3 - (29 - i) * 0.05),
      breaches: i === 10 ? 1 : 0 // One breach 10 days ago
    });
  }
  
  return mockTrends;
};

const SocialCautionPrivacyRadar: React.FC = () => {
  // Initialize state with mock data using useMemo to avoid setState in useEffect
  const initialServices = useMemo(() => getMockServices(), []);
  const initialTrends = useMemo(() => getMockTrends(), []);
  
  const [services] = useState<Service[]>(initialServices);
  const [trends] = useState<PrivacyTrend[]>(initialTrends);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calculate overall score from services
  const overallScore = useMemo(() => {
    if (services.length === 0) {
      return 0;
    }

    // Weight active services more heavily
    const activeServices = services.filter(s => s.isActive);
    const totalScore = activeServices.reduce((sum, s) => sum + s.privacyScore, 0);
    return Math.round(totalScore / activeServices.length);
  }, [services]);

  const getCategoryIcon = (category: string) => {
    const icons = {
      social: <Users className="h-4 w-4" />,
      messaging: <MessageSquare className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      cloud: <Cloud className="h-4 w-4" />,
      shopping: <CreditCard className="h-4 w-4" />,
      streaming: <Smartphone className="h-4 w-4" />,
      finance: <CreditCard className="h-4 w-4" />,
      other: <Activity className="h-4 w-4" />
    };
    return icons[category] || icons.other;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 75) return 'Low Risk';
    if (score >= 50) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskCounts = () => {
    const activeServices = services.filter(s => s.isActive);
    return {
      high: activeServices.filter(s => s.privacyScore < 50).length,
      medium: activeServices.filter(s => s.privacyScore >= 50 && s.privacyScore < 75).length,
      low: activeServices.filter(s => s.privacyScore >= 75).length
    };
  };

  const getEncryptionBadge = (encryption: string) => {
    const badges = {
      'end_to_end': { text: 'E2E Encrypted', color: 'bg-green-100 text-green-700' },
      'in_transit': { text: 'Transport Only', color: 'bg-yellow-100 text-yellow-700' },
      'none': { text: 'No Encryption', color: 'bg-red-100 text-red-700' }
    };
    return badges[encryption] || badges.none;
  };

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const riskCounts = getRiskCounts();
  const scoreChange = trends.length > 7 ? 
    Math.round(trends[trends.length - 1].score - trends[trends.length - 8].score) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gradient-to-br from-red-50 to-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SocialCaution®</h1>
              <p className="text-sm text-gray-600">Personal Privacy Radar</p>
            </div>
          </div>
          <p className="text-gray-600">Your data matters. Monitor and protect your digital privacy.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hero Score Card */}
      <Card className="bg-white border-2 border-red-100">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:col-span-1">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-pink-500 mb-4">
                <div className="text-5xl font-bold text-white">{overallScore}</div>
              </div>
              <h3 className="text-lg font-semibold mb-1">Your Privacy Score</h3>
              <div className="flex items-center justify-center gap-2">
                {scoreChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">+{scoreChange} this week</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">{scoreChange} this week</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-200">
                <div className="text-3xl font-bold text-red-700">{riskCounts.high}</div>
                <div className="text-sm text-red-600 mt-1">High Risk</div>
                <div className="text-xs text-red-500 mt-2">Immediate attention needed</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
                <div className="text-3xl font-bold text-yellow-700">{riskCounts.medium}</div>
                <div className="text-sm text-yellow-600 mt-1">Medium Risk</div>
                <div className="text-xs text-yellow-500 mt-2">Review recommended</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                <div className="text-3xl font-bold text-green-700">{riskCounts.low}</div>
                <div className="text-sm text-green-600 mt-1">Low Risk</div>
                <div className="text-xs text-green-500 mt-2">Well protected</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">My Services</TabsTrigger>
          <TabsTrigger value="breaches">Breach Alerts</TabsTrigger>
          <TabsTrigger value="trends">Privacy Trends</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        {/* My Services Tab */}
        <TabsContent value="services" className="space-y-4 mt-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setSelectedCategory('social')}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                selectedCategory === 'social' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Users className="h-4 w-4" /> Social Media
            </button>
            <button
              onClick={() => setSelectedCategory('messaging')}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                selectedCategory === 'messaging' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Messaging
            </button>
            <button
              onClick={() => setSelectedCategory('email')}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                selectedCategory === 'email' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              onClick={() => setSelectedCategory('cloud')}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                selectedCategory === 'cloud' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Cloud className="h-4 w-4" /> Cloud Storage
            </button>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(service.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="capitalize">{service.category}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(service.privacyScore)}`}>
                        {service.privacyScore}
                      </div>
                      <Badge className={getScoreColor(service.privacyScore)}>
                        {getScoreBadge(service.privacyScore)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getEncryptionBadge(service.encryption).color}>
                      <Lock className="h-3 w-3 mr-1" />
                      {getEncryptionBadge(service.encryption).text}
                    </Badge>
                    {service.thirdPartySharing && (
                      <Badge className="bg-orange-100 text-orange-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Shares Data
                      </Badge>
                    )}
                    {service.breaches.length > 0 && (
                      <Badge className="bg-red-100 text-red-700">
                        <Bell className="h-3 w-3 mr-1" />
                        {service.breaches.length} Breach(es)
                      </Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Data Collected:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {service.dataCollected.slice(0, 5).map((data, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {data}
                        </span>
                      ))}
                      {service.dataCollected.length > 5 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{service.dataCollected.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {service.alternatives.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-800 mb-2">
                        Better Alternatives:
                      </div>
                      {service.alternatives.map((alt, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-green-700">{alt.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">Score: {alt.privacyScore}</span>
                            <Badge className="bg-green-100 text-green-700">
                              +{alt.improvement} points
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Review Privacy Settings
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      Details
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Breach Alerts Tab */}
        <TabsContent value="breaches" className="space-y-4 mt-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              We monitor breach databases 24/7 and alert you immediately if your data appears in any breach.
              All monitoring happens on your device - your email addresses are never shared.
            </AlertDescription>
          </Alert>

          {services.filter(s => s.breaches.length > 0).map((service) => (
            service.breaches.map((breach, idx) => (
              <Card key={`${service.id}-${idx}`} className="border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        {service.name} Data Breach
                      </CardTitle>
                      <CardDescription>
                        Discovered {breach.date.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={
                      breach.userAction === 'account_deleted' ? 'bg-green-100 text-green-700' :
                      breach.userAction === 'password_changed' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {breach.userAction === 'none' ? 'Action Needed' : 
                       breach.userAction === 'password_changed' ? 'Password Changed' :
                       'Account Deleted'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Records Affected:</span>
                      <p className="text-gray-600">{breach.recordsAffected.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Data Types Exposed:</span>
                      <p className="text-gray-600">{breach.dataTypes.join(', ')}</p>
                    </div>
                  </div>

                  {breach.userAction === 'none' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="font-medium text-red-800 mb-2">Recommended Actions:</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                        <li>Change your password immediately</li>
                        <li>Enable two-factor authentication</li>
                        <li>Review recent account activity</li>
                        <li>Consider deleting your account if not essential</li>
                      </ol>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Change Password
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      Learn More
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ))}

          {services.filter(s => s.breaches.length > 0).length === 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">All Clear!</h3>
                <p className="text-green-700">
                  No recent breaches detected for your monitored services.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Privacy Trends Tab */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Privacy Score Trend</CardTitle>
              <CardDescription>
                Track how your privacy protection improves over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-1">
                {trends.map((trend, idx) => {
                  const height = (trend.score / 100) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${trend.date.toLocaleDateString()}: Score ${Math.round(trend.score)}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>30 days ago</span>
                <span>Today</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(trends[0]?.score || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Starting Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{Math.round((trends[trends.length - 1]?.score || 0) - (trends[0]?.score || 0))}
                  </div>
                  <div className="text-sm text-gray-600">Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(trends[trends.length - 1]?.score || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Current Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Reached 60+ Score</div>
                      <div className="text-sm text-gray-600">15 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Enabled 2FA on 5 Services</div>
                      <div className="text-sm text-gray-600">8 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Next Goal: 70+ Score</div>
                      <div className="text-sm text-gray-600">3 points to go</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passwords Changed</span>
                    <span className="font-bold text-gray-900">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Privacy Settings Updated</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accounts Deleted</span>
                    <span className="font-bold text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Opt-outs Completed</span>
                    <span className="font-bold text-gray-900">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">2FA Enabled</span>
                    <span className="font-bold text-gray-900">9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Actions Tab */}
        <TabsContent value="actions" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Quick Win #1
                </CardTitle>
                <CardDescription>Highest impact, minimal effort</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    Enable 2FA on Instagram
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600 font-medium">+8 points</span>
                    </div>
                    <span className="text-gray-600">⏱️ 3 minutes</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Start Now →
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Quick Win #2
                </CardTitle>
                <CardDescription>Major privacy upgrade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    Switch to Signal for messaging
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">+15 points</span>
                    </div>
                    <span className="text-gray-600">⏱️ 5 minutes</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Learn How →
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-yellow-600" />
                  Quick Win #3
                </CardTitle>
                <CardDescription>Enhanced email privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    Create ProtonMail account
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">+12 points</span>
                    </div>
                    <span className="text-gray-600">⏱️ 10 minutes</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  Get Started →
                </button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  Consider Removing
                </CardTitle>
                <CardDescription>Low-value, high-risk services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    Delete unused Facebook account
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-red-600" />
                      <span className="text-red-600 font-medium">+20 points</span>
                    </div>
                    <span className="text-gray-600">⏱️ 15 minutes</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Deletion Guide →
                </button>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-pink-50 border-pink-200">
            <Shield className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-800">
              <strong>Privacy Tip:</strong> Each action you take improves your privacy score and reduces 
              your digital footprint. Start with the quick wins for maximum impact with minimal effort!
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-red-500" />
          <span className="font-medium">100% Client-Side Processing</span>
        </div>
        <p>Your data never leaves your device. All analysis happens locally in your browser.</p>
        <p className="mt-1">Part of the ERMITS Corporation Ecosystem | "Your Data Matters."</p>
      </div>
    </div>
  );
};

export default SocialCautionPrivacyRadar;
