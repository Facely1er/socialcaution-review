/**
 * Plain Language Dictionary
 * Translates technical terms to parent-friendly language
 */

/* eslint-disable react-refresh/only-export-components */
import React from 'react';

export const plainLanguage: Record<string, string> = {
  // Core Terms
  'Service': 'App or Website',
  'service': 'app or website',
  'Services': 'Apps and Websites',
  'services': 'apps and websites',
  
  // Risk & Privacy Terms
  'Risk Score': 'Privacy Safety Level',
  'risk score': 'privacy safety level',
  'Risk': 'Privacy Safety',
  'risk': 'privacy safety',
  'Privacy Exposure': 'How Much Information is Shared',
  'privacy exposure': 'how much information is shared',
  'Data Collection': 'What Information is Collected',
  'data collection': 'what information is collected',
  'Third-Party': 'Other Companies',
  'third-party': 'other companies',
  'Third Party': 'Other Companies',
  'third party': 'other companies',
  
  // Technical Terms
  'API': 'Connection',
  'Authentication': 'Sign In',
  'authentication': 'sign in',
  'Authorization': 'Permission',
  'authorization': 'permission',
  'Encryption': 'Lock',
  'encryption': 'lock',
  'Metadata': 'Hidden Details',
  'metadata': 'hidden details',
  'Algorithm': 'How the App Decides What to Show',
  'algorithm': 'how the app decides what to show',
  
  // Privacy Settings
  'Privacy Settings': 'Who Can See Your Information',
  'privacy settings': 'who can see your information',
  'Location Sharing': 'Sharing Where You Are',
  'location sharing': 'sharing where you are',
  'Data Sharing': 'Sharing Your Information',
  'data sharing': 'sharing your information',
  
  // Account Terms
  'Account': 'Profile',
  'account': 'profile',
  'Profile': 'Your Information',
  'profile': 'your information',
  'Username': 'Your Name on the App',
  'username': 'your name on the app',
  'Password': 'Secret Code',
  'password': 'secret code',
  
  // Social Media Terms
  'Followers': 'People Who See Your Posts',
  'followers': 'people who see your posts',
  'Public': 'Everyone Can See',
  'public': 'everyone can see',
  'Private': 'Only Friends Can See',
  'private': 'only friends can see',
  'Tag': 'Mention',
  'tag': 'mention',
  
  // Security Terms
  'Phishing': 'Fake Messages Trying to Trick You',
  'phishing': 'fake messages trying to trick you',
  'Malware': 'Bad Software',
  'malware': 'bad software',
  'Virus': 'Bad Software',
  'virus': 'bad software',
  'Hack': 'Someone Getting Into Your Account',
  'hack': 'someone getting into your account',
  'Breach': 'Information Leaked',
  'breach': 'information leaked',
  
  // Digital Footprint
  'Digital Footprint': 'Everything You Do Online',
  'digital footprint': 'everything you do online',
  'Online Presence': 'What People See About You Online',
  'online presence': 'what people see about you online',
  'Reputation': 'What People Think About You',
  'reputation': 'what people think about you',
  
  // App Terms
  'App': 'Application',
  'app': 'application',
  'Application': 'Program',
  'application': 'program',
  'Platform': 'Website or App',
  'platform': 'website or app',
  'Device': 'Phone, Tablet, or Computer',
  'device': 'phone, tablet, or computer',
  
  // Permission Terms
  'Permission': 'What the App Can Do',
  'permission': 'what the app can do',
  'Access': 'Use',
  'access': 'use',
  'Grant': 'Allow',
  'grant': 'allow',
  'Revoke': 'Stop Allowing',
  'revoke': 'stop allowing',
  
  // Data Terms
  'Personal Information': 'Information About You',
  'personal information': 'information about you',
  'Personal Data': 'Information About You',
  'personal data': 'information about you',
  'PII': 'Personal Information',
  'pii': 'personal information',
  'Data': 'Information',
  'data': 'information',
  
  // Network Terms
  'Wi-Fi': 'Internet Connection',
  'wifi': 'internet connection',
  'Network': 'Internet Connection',
  'network': 'internet connection',
  'VPN': 'Secure Internet Connection',
  'vpn': 'secure internet connection',
  
  // Browser Terms
  'Browser': 'Program to View Websites',
  'browser': 'program to view websites',
  'Cookie': 'Small File That Remembers You',
  'cookie': 'small file that remembers you',
  'Cache': 'Stored Information',
  'cache': 'stored information',
  
  // Messaging Terms
  'DM': 'Private Message',
  'dm': 'private message',
  'Direct Message': 'Private Message',
  'direct message': 'private message',
  'End-to-End Encryption': 'Private Messages Only You and the Other Person Can Read',
  'end-to-end encryption': 'private messages only you and the other person can read',
  
  // Gaming Terms
  'Server': 'Online Game Location',
  'server': 'online game location',
  'Multiplayer': 'Playing With Others Online',
  'multiplayer': 'playing with others online',
  'In-Game Chat': 'Talking to Other Players',
  'in-game chat': 'talking to other players',
  
  // Age-Specific Terms
  'COPPA': 'Children\'s Privacy Protection Law',
  'coppa': 'children\'s privacy protection law',
  'Age Verification': 'Checking How Old You Are',
  'age verification': 'checking how old you are',
  
  // Family Terms
  'Family Hub': 'Your Family\'s Privacy Center',
  'family hub': 'your family\'s privacy center',
  'Family Member': 'Person in Your Family',
  'family member': 'person in your family',
  'Parent Dashboard': 'Your Privacy Control Center',
  'parent dashboard': 'your privacy control center',
};

/**
 * Translate a technical term to plain language
 */
export function translateToPlainLanguage(term: string): string {
  // Check exact match first
  if (plainLanguage[term]) {
    return plainLanguage[term];
  }
  
  // Check case-insensitive match
  const lowerTerm = term.toLowerCase();
  if (plainLanguage[lowerTerm]) {
    return plainLanguage[lowerTerm];
  }
  
  // Check capitalized version
  const capitalizedTerm = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
  if (plainLanguage[capitalizedTerm]) {
    return plainLanguage[capitalizedTerm];
  }
  
  // Return original if no translation found
  return term;
}

/**
 * Translate a sentence or paragraph, replacing technical terms
 */
export function translateText(text: string): string {
  let translated = text;
  
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(plainLanguage).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    // Create case-insensitive regex
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translated = translated.replace(regex, (match) => {
      // Preserve original case pattern
      if (match === match.toUpperCase()) {
        return plainLanguage[key].toUpperCase();
      } else if (match === match.toLowerCase()) {
        return plainLanguage[key].toLowerCase();
      } else if (match.charAt(0) === match.charAt(0).toUpperCase()) {
        return plainLanguage[key].charAt(0).toUpperCase() + plainLanguage[key].slice(1).toLowerCase();
      }
      return plainLanguage[key];
    });
  }
  
  return translated;
}

/**
 * Get a plain language explanation for common concepts
 */
export const explanations: Record<string, string> = {
  'risk_score': 'A number that shows how safe your child\'s privacy is. Lower is safer, higher means more risk.',
  'service_approval': 'When your child wants to use a new app or website, you can approve or deny it.',
  'privacy_settings': 'Controls that decide who can see your child\'s information and posts.',
  'conversation_starter': 'Ready-to-use questions and topics to help you talk with your child about online safety.',
  'family_privacy_plan': 'A plan your family creates together about how to stay safe online.',
  'digital_footprint': 'Everything your child does online that others can see, like posts, photos, and comments.',
  'location_sharing': 'When apps know and share where your child is located.',
  'data_collection': 'Information that apps and websites collect about your child, like their name, age, or what they like.',
};

/**
 * Get explanation for a concept
 */
export function getExplanation(key: string): string {
  return explanations[key] || '';
}

/**
 * React component helper for plain language
 */
export function PlainLanguage({ term, children }: { term?: string; children?: React.ReactNode }) {
  if (term) {
    return <>{translateToPlainLanguage(term)}</>;
  }
  if (children && typeof children === 'string') {
    return <>{translateText(children)}</>;
  }
  return <>{children}</>;
}

