// Persona-specific hints for service risk assessment
export const personaServiceHints = {
  'cautious-parent': {
    highlightCategories: ['social-media', 'messaging', 'streaming', 'dating'],
    extraRiskNotes: {
      tiktok: 'Pay special attention to TikTok if your children use it - the algorithm can expose them to inappropriate content and the data collection is extensive.',
      instagram: 'Instagram can expose children to cyberbullying, unrealistic beauty standards, and predatory behavior. Monitor usage carefully.',
      whatsapp: 'Children may share personal information in group chats. Teach them about safe messaging practices.',
      snapchat: 'Snapchat\'s disappearing messages can create false sense of security. Children may share inappropriate content thinking it\'s private.',
      youtube: 'YouTube Kids still collects data. Monitor what children watch and review privacy settings regularly.',
      discord: 'Discord servers can expose children to inappropriate content and strangers. Monitor server memberships carefully.',
      tinder: 'Dating apps are not appropriate for minors. Ensure age verification is working and monitor app usage.',
      netflix: 'Review viewing history and profiles to ensure children aren\'t accessing inappropriate content.',
      spotify: 'Music preferences can reveal personal information. Review playlists and listening history with children.'
    }
  },
  'digital-novice': {
    highlightCategories: ['search-email', 'social-media'],
    extraRiskNotes: {
      google: 'Start here - Google likely knows more about you than any other service. Review your activity and delete what you don\'t need.',
      facebook: 'Facebook\'s privacy settings are complex. Take time to understand each setting and limit who can see your information.',
      amazon: 'Be aware that Amazon tracks everything you view and purchase to build a profile of your interests.'
    }
  },
  'online-shopper': {
    highlightCategories: ['shopping', 'cloud-storage', 'financial', 'lifestyle'],
    extraRiskNotes: {
      amazon: 'Your purchase history reveals sensitive personal information. Regularly review and delete browsing history.',
      google: 'Gmail scans your emails for shopping receipts and tracks packages. Consider using a privacy-focused email for purchases.',
      dropbox: 'If you store receipts or financial documents, ensure they\'re encrypted before uploading.',
      ebay: 'Purchase history and seller interactions reveal shopping patterns. Review and clear browsing history regularly.',
      paypal: 'Transaction history is highly sensitive. Review regularly and limit linked payment methods.',
      venmo: 'All transactions are public by default - set to private immediately to protect your financial privacy.',
      doordash: 'Order history reveals eating habits and home address. Use work address for deliveries when possible.',
      walmart: 'Pharmacy data is particularly sensitive. Review pharmacy privacy settings separately.'
    }
  },
  'social-influencer': {
    highlightCategories: ['social-media', 'messaging', 'streaming'],
    extraRiskNotes: {
      instagram: 'As an influencer, your metadata (posting times, locations) can reveal your personal routines. Be strategic about what you share.',
      tiktok: 'The algorithm learns your patterns - don\'t mix personal and professional accounts.',
      facebook: 'Business pages and personal profiles are linked. Separate them to maintain privacy boundaries.',
      youtube: 'Watch history and comments can reveal personal interests separate from your channel. Use separate accounts.',
      twitter: 'Tweet history is public and permanent. Be strategic about what you post on your public account.',
      linkedin: 'Professional network can expose personal connections. Review connection visibility settings.',
      twitch: 'Streaming schedule and chat interactions reveal routines. Be cautious about sharing personal information during streams.'
    }
  },
  'privacy-advocate': {
    highlightCategories: ['search-email', 'cloud-storage', 'messaging', 'financial', 'streaming'],
    extraRiskNotes: {
      google: 'Consider migrating to privacy-focused alternatives like ProtonMail, Startpage, or DuckDuckGo.',
      dropbox: 'Use end-to-end encrypted alternatives like Tresorit or Sync.com for sensitive files.',
      whatsapp: 'Switch to Signal for truly private messaging - WhatsApp shares metadata with Facebook.',
      venmo: 'All transactions are public by default. Use cash or privacy-focused payment apps instead.',
      spotify: 'Listening data is sold to advertisers. Consider privacy-focused music services like Apple Music or local music files.',
      netflix: 'Viewing history reveals personal information. Use separate profiles and clear history regularly.',
      paypal: 'Transaction data is highly sensitive. Consider using cryptocurrency or cash for maximum privacy.',
      telegram: 'Use Secret Chats for sensitive conversations - default cloud chats are accessible to Telegram.'
    }
  },
  'private-individual': {
    highlightCategories: ['search-email', 'social-media', 'cloud-storage', 'streaming', 'lifestyle'],
    extraRiskNotes: {
      google: 'Google creates shadow profiles even if you don\'t have an account. Use privacy-focused alternatives.',
      facebook: 'Consider deleting your account entirely - Facebook tracks non-users through embedded pixels on websites.',
      icloud: 'Apple\'s Advanced Data Protection is important if you value privacy but want convenience.',
      strava: 'GPS routes can reveal home and work addresses. Use privacy zones and set activities to private.',
      fitbit: 'Health data is highly sensitive. Review data sharing with insurance companies and limit social features.',
      airbnb: 'Travel data reveals when your home is empty. Be cautious about booking dates and reviews.',
      uber: 'Trip history reveals home and work addresses. Regularly delete trip history and use cash when possible.',
      venmo: 'All transactions are public by default. Set to private immediately or avoid using the service.',
      tinder: 'Location data can be very precise. Limit location precision and don\'t use photos that reveal your location.'
    }
  }
};
