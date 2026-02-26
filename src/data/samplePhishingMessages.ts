// Sample phishing messages for testing and demonstration
// Used for user education and detection accuracy validation

export const samplePhishingMessages = [
  {
    id: 'low-risk-1',
    title: 'Legitimate Service Notification',
    riskLevel: 'low',
    expectedScore: '5-20',
    message: `Hi John,

Thank you for your recent purchase. Your order #12345 has been confirmed and will ship within 2-3 business days.

You can track your order at any time by logging into your account.

Best regards,
Customer Service Team`,
    educationalNote: 'This is a typical legitimate notification with personal details, no urgency, and clear context.'
  },
  
  {
    id: 'medium-risk-1',
    title: 'Suspicious but Unclear',
    riskLevel: 'medium',
    expectedScore: '40-60',
    message: `Dear Customer,

We noticed some unusual activity on your account. For your security, please review your recent transactions.

Log in to your account to view details.

Security Team`,
    educationalNote: 'Contains "unusual activity" claim and generic greeting, but lacks extreme urgency or direct threats.'
  },
  
  {
    id: 'high-risk-1',
    title: 'Clear Phishing Attempt',
    riskLevel: 'high',
    expectedScore: '60-80',
    message: `URGENT: Your account will be suspended

Dear valued customer,

Your account has been flagged for suspicious activity. Click here immediately to verify your identity or your account will be locked within 24 hours.

Verify Now: http://suspicious-link.com/verify

Do not ignore this message.`,
    educationalNote: 'Multiple red flags: urgency, account threat, click pressure, generic greeting, suspicious link.'
  },
  
  {
    id: 'critical-risk-1',
    title: 'Aggressive Phishing Attack',
    riskLevel: 'critical',
    expectedScore: '80-100',
    message: `IMMEDIATE ACTION REQUIRED!!!

Your account will be TERMINATED in 12 hours due to unusual login activity detected from unauthorized location.

Click this link NOW to verify your identity and prevent account closure:
http://fake-bank-security.com/urgent

You must also confirm your password, social security number, and date of birth to restore full access.

This is your FINAL WARNING. Act now or lose access permanently.`,
    educationalNote: 'Extreme urgency, multiple threats, requests sensitive info, excessive punctuation, suspicious link.'
  },
  
  {
    id: 'high-risk-2',
    title: 'Prize Scam',
    riskLevel: 'high',
    expectedScore: '60-75',
    message: `Congratulations! You've been selected!

Dear Sir/Madam,

You have won $5,000 in our exclusive customer appreciation program. This is a limited time offer that expires tonight at midnight.

Tap here to claim your prize now before it's too late!

Don't miss this amazing opportunity!`,
    educationalNote: 'Unsolicited prize, generic greeting, artificial urgency, too good to be true, pressure to act.'
  },
  
  {
    id: 'critical-risk-2',
    title: 'Payment Threat Scam',
    riskLevel: 'critical',
    expectedScore: '85-100',
    message: `URGENT PAYMENT FAILED

Your payment method has been declined and your subscription will be cancelled today.

Update your credit card information immediately to avoid service interruption:
- Card number
- CVV
- Expiration date
- Billing address

Click here to update payment now: http://fake-payment-update.com

Your account will be suspended in 6 hours if you don't act now!`,
    educationalNote: 'Requests complete credit card details, extreme urgency, suspension threat, suspicious link, multiple red flags.'
  },
  
  {
    id: 'medium-risk-2',
    title: 'Delivery Notification Scam',
    riskLevel: 'medium',
    expectedScore: '45-60',
    message: `Your package delivery failed

We attempted to deliver your package but no one was home. 

Click below to reschedule delivery:
http://fake-delivery-tracking.com

Package will be returned to sender if not claimed within 48 hours.

Tracking: #XYZ123456`,
    educationalNote: 'Creates mild urgency, suspicious link, but less aggressive than high-risk phishing. May be legitimate if you\'re expecting a package.'
  },
  
  {
    id: 'critical-risk-3',
    title: 'IRS Authority Impersonation',
    riskLevel: 'critical',
    expectedScore: '90-100',
    message: `FINAL NOTICE FROM IRS

This is your final warning regarding unpaid taxes. You owe $2,847.32 in back taxes and penalties.

Immediate payment is required to avoid:
- Wage garnishment
- Bank account seizure
- Criminal prosecution

Call now: 1-800-FAKE-IRS
Or click here to pay immediately

Failure to respond within 24 hours will result in legal action and arrest warrant.`,
    educationalNote: 'Authority impersonation, financial threat, extreme consequences, artificial deadline. IRS never contacts via unsolicited messages.'
  },
  
  {
    id: 'low-risk-2',
    title: 'Legitimate Newsletter',
    riskLevel: 'low',
    expectedScore: '0-15',
    message: `Hi Sarah,

Here's your weekly privacy tips newsletter:

1. Enable two-factor authentication on all accounts
2. Review app permissions regularly
3. Use unique passwords for each service

You're receiving this because you subscribed to our newsletter. Unsubscribe anytime in your account settings.

Privacy Team`,
    educationalNote: 'Personal name, clear context, no urgency, legitimate purpose, proper unsubscribe option.'
  }
];

/**
 * Get a random sample message for demonstration
 */
export function getRandomSampleMessage(): typeof samplePhishingMessages[0] {
  return samplePhishingMessages[Math.floor(Math.random() * samplePhishingMessages.length)];
}

/**
 * Get samples by risk level
 */
export function getSamplesByRiskLevel(level: 'low' | 'medium' | 'high' | 'critical') {
  return samplePhishingMessages.filter(msg => msg.riskLevel === level);
}

/**
 * Get all sample messages
 */
export function getAllSamples() {
  return samplePhishingMessages;
}