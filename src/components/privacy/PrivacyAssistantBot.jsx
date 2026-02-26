import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageCircle, 
  Send, 
  Shield, 
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const PrivacyAssistantBot = ({ userProfile, onAssistantUpdate }) => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assistantMode, setAssistantMode] = useState('general'); // general, expert, emergency
  const [assistantStats, setAssistantStats] = useLocalStorage('assistant-stats', {});
  const [quickActions] = useLocalStorage('quick-actions', []);
  const [isOnline] = useState(true);

  const assistantModes = {
    general: {
      name: 'General Assistant',
      icon: Bot,
      color: 'blue',
      description: 'General privacy questions and guidance',
      capabilities: ['Basic privacy advice', 'Tool recommendations', 'General questions']
    },
    expert: {
      name: 'Expert Mode',
      icon: GraduationCap,
      color: 'purple',
      description: 'Advanced privacy expertise and detailed guidance',
      capabilities: ['Advanced privacy strategies', 'Compliance guidance', 'Technical solutions']
    },
    emergency: {
      name: 'Emergency Response',
      icon: AlertTriangle,
      color: 'red',
      description: 'Immediate privacy threat response',
      capabilities: ['Data breach response', 'Identity theft help', 'Emergency privacy lockdown']
    }
  };

  const quickActionTemplates = [
    {
      id: 'data-breach',
      title: 'Data Breach Response',
      description: 'Immediate steps for data breach',
      actions: ['Change passwords', 'Enable 2FA', 'Monitor accounts', 'Contact credit agencies']
    },
    {
      id: 'privacy-audit',
      title: 'Quick Privacy Audit',
      description: 'Review current privacy settings',
      actions: ['Check social media privacy', 'Review app permissions', 'Update browser settings']
    },
    {
      id: 'secure-communication',
      title: 'Secure Communication',
      description: 'Set up encrypted messaging',
      actions: ['Install Signal', 'Configure ProtonMail', 'Use encrypted file sharing']
    }
  ];

  const expertKnowledge = {
    gdpr: {
      title: 'GDPR Compliance',
      description: 'European privacy regulation guidance',
      topics: ['Data subject rights', 'Lawful basis', 'Privacy by design', 'Data protection impact assessments']
    },
    ccpa: {
      title: 'CCPA Compliance',
      description: 'California privacy law guidance',
      topics: ['Consumer rights', 'Data deletion', 'Opt-out requirements', 'Privacy policy requirements']
    },
    hipaa: {
      title: 'HIPAA Compliance',
      description: 'Healthcare privacy protection',
      topics: ['PHI protection', 'Business associate agreements', 'Security safeguards', 'Breach notification']
    }
  };

  useEffect(() => {
    initializeAssistant();
  }, []);

  const initializeAssistant = () => {
    if (conversationHistory.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `Hello! I'm your Privacy Assistant. I'm here to help you with privacy questions, guide you through security improvements, and provide expert advice. How can I help you today?`,
        timestamp: new Date().toISOString(),
        mode: assistantMode
      };
      setConversationHistory([welcomeMessage]);
    }

    // Update stats
    const stats = {
      ...assistantStats,
      totalSessions: (assistantStats.totalSessions || 0) + 1,
      lastUsed: new Date().toISOString(),
      preferredMode: assistantMode
    };
    setAssistantStats(stats);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(messageToProcess);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        mode: assistantMode
      };
      setConversationHistory(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Privacy-related responses
    if (lowerInput.includes('password') || lowerInput.includes('passwords')) {
      return `For strong password security, I recommend:

1. **Use a Password Manager**: Tools like 1Password, Bitwarden, or Dashlane
2. **Enable Two-Factor Authentication**: Add an extra layer of security
3. **Use Unique Passwords**: Never reuse passwords across accounts
4. **Check for Breaches**: Use HaveIBeenPwned to check if your passwords were compromised
5. **Password Requirements**: At least 12 characters with mixed case, numbers, and symbols

Would you like specific recommendations for password managers or help setting up 2FA?`;
    }

    if (lowerInput.includes('data breach') || lowerInput.includes('hack') || lowerInput.includes('compromised')) {
      return `If you suspect a data breach, take these immediate steps:

**Immediate Actions:**
1. **Change Passwords**: Start with critical accounts (email, banking, social media)
2. **Enable 2FA**: Add two-factor authentication where available
3. **Monitor Accounts**: Check for unauthorized transactions or activities
4. **Credit Monitoring**: Consider freezing your credit reports

**Documentation:**
- Screenshot any suspicious activities
- Save confirmation emails from password changes
- Keep records of when you discovered the breach

**Next Steps:**
- Contact affected companies directly
- File reports with relevant authorities if needed
- Consider identity theft protection services

Would you like help with any of these specific steps?`;
    }

    if (lowerInput.includes('social media') || lowerInput.includes('facebook') || lowerInput.includes('instagram') || lowerInput.includes('twitter')) {
      return `Here are essential social media privacy settings to review:

**Facebook:**
- Privacy settings → "Who can see your posts" → Friends only
- Timeline settings → Review posts before they appear
- Apps and websites → Remove unused app permissions
- Ad preferences → Limit ad targeting

**Instagram:**
- Account privacy → Private account
- Story settings → Hide from specific people
- Activity status → Turn off "Show when active"
- Data download → Review what data they have

**Twitter/X:**
- Privacy and safety → Protect your posts
- Discoverability → Limit who can find you
- Ads preferences → Reduce personalized ads
- Data and privacy → Review connected apps

**General Tips:**
- Review friend/follower lists regularly
- Limit personal information in profiles
- Be cautious about location sharing
- Regularly audit app permissions

Would you like detailed steps for any specific platform?`;
    }

    if (lowerInput.includes('vpn') || lowerInput.includes('virtual private network')) {
      return `VPN selection and setup guidance:

**Top Privacy-Focused VPN Services:**
1. **ProtonVPN** - Strong privacy, based in Switzerland
2. **Mullvad** - Anonymous accounts, no logs policy
3. **ExpressVPN** - Fast speeds, good for streaming
4. **NordVPN** - Double VPN, malware protection

**Key Features to Look For:**
- No-logs policy (independently audited)
- Strong encryption (WireGuard or OpenVPN)
- Kill switch functionality
- DNS leak protection
- Based in privacy-friendly jurisdiction

**Setup Tips:**
- Use VPN on all devices (phone, laptop, router)
- Enable auto-connect on untrusted networks
- Regularly test for DNS/IP leaks
- Choose servers close to your location for speed

**When to Use VPN:**
- Public WiFi networks
- Accessing geo-restricted content
- General browsing privacy
- Torrenting or P2P activities

Need help choosing a VPN for your specific needs?`;
    }

    if (lowerInput.includes('gdpr') || lowerInput.includes('data rights') || lowerInput.includes('european')) {
      return `GDPR provides strong data protection rights for EU residents:

**Your Rights Under GDPR:**
1. **Right to Information** - Know what data is collected and why
2. **Right of Access** - Get copies of your personal data
3. **Right to Rectification** - Correct inaccurate data
4. **Right to Erasure** - "Right to be forgotten"
5. **Right to Restrict Processing** - Limit how data is used
6. **Right to Data Portability** - Move data between services
7. **Right to Object** - Opt out of data processing
8. **Rights Related to Automated Decision Making** - Human review of AI decisions

**How to Exercise Your Rights:**
- Contact companies' Data Protection Officers
- Use standardized request forms
- Keep records of all communications
- Allow 30 days for responses
- Escalate to supervisory authorities if needed

**GDPR Applies When:**
- You're an EU resident
- Companies process your data in the EU
- Companies target EU markets

Would you like help drafting a GDPR data request or understanding specific rights?`;
    }

    // Default helpful response
    return `I'm here to help with your privacy questions! I can assist with:

**Privacy Tools & Setup:**
- Password managers and two-factor authentication
- VPN selection and configuration
- Secure messaging apps
- Browser privacy settings

**Data Protection:**
- Social media privacy settings
- Data broker removal
- Identity theft protection
- Secure data storage

**Compliance & Legal:**
- GDPR, CCPA, and other privacy laws
- Data subject rights
- Privacy policy understanding
- Breach response procedures

**Emergency Response:**
- Data breach immediate actions
- Identity theft recovery
- Account compromise recovery
- Privacy incident management

Could you be more specific about what privacy topic you'd like help with? I'm here to provide detailed, actionable guidance!`;
  };

  const switchMode = (mode) => {
    setAssistantMode(mode);
    const modeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `Switched to ${assistantModes[mode].name}. ${assistantModes[mode].description}`,
      timestamp: new Date().toISOString(),
      mode: mode
    };
    setConversationHistory(prev => [...prev, modeMessage]);
  };

  const executeQuickAction = (action) => {
    const actionMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `Starting ${action.title}: ${action.description}\n\nRecommended steps:\n${action.actions.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
      timestamp: new Date().toISOString(),
      mode: assistantMode
    };
    setConversationHistory(prev => [...prev, actionMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                assistantModes[assistantMode].color === 'blue' ? 'bg-light-blue text-primary' :
                assistantModes[assistantMode].color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                'bg-danger/10 text-danger'
              }`}>
                {React.createElement(assistantModes[assistantMode].icon, { size: 24 })}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text">
                  Privacy Assistant
                </h2>
                <p className="text-sm text-text-secondary">
                  {assistantModes[assistantMode].description}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isOnline ? 'bg-success/10 text-success' : 'bg-muted/20 text-muted-foreground'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-border">
          <div className="flex space-x-2">
            {Object.entries(assistantModes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  assistantMode === key
                    ? `${mode.color === 'blue' ? 'bg-light-blue text-primary' :
                        mode.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                        'bg-danger/10 text-danger'}`
                    : 'bg-card-hover text-text-secondary hover:bg-card-hover/80'
                }`}
              >
                {React.createElement(mode.icon, { size: 16, className: 'inline mr-1' })}
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {assistantMode === 'emergency' && (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-text mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickActionTemplates.map((action) => (
                <button
                  key={action.id}
                  onClick={() => executeQuickAction(action)}
                  className="p-3 text-left bg-danger/10 hover:bg-danger/20 rounded-lg border border-danger/20 transition-colors"
                >
                  <div className="text-sm font-medium text-danger">{action.title}</div>
                  <div className="text-xs text-danger/80 mt-1">{action.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {conversationHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-card-hover text-text'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-white/80' : 'text-text-secondary'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card-hover px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me about privacy, security, or data protection..."
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-card text-text"
            />
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Assistant Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow">
          <div className="text-sm text-text-secondary">Total Sessions</div>
          <div className="text-2xl font-bold text-text">
            {assistantStats.totalSessions || 0}
          </div>
        </div>
        <div className="card p-4 shadow">
          <div className="text-sm text-text-secondary">Messages Sent</div>
          <div className="text-2xl font-bold text-text">
            {conversationHistory.filter(m => m.type === 'user').length}
          </div>
        </div>
        <div className="card p-4 shadow">
          <div className="text-sm text-text-secondary">Preferred Mode</div>
          <div className="text-2xl font-bold text-text">
            {assistantModes[assistantStats.preferredMode || assistantMode].name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAssistantBot;

