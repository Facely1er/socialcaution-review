import React from 'react';
import { 
  Shield, AlertTriangle, Target, TrendingUp, Clock, CheckCircle, 
  BookOpen, Zap, Globe, Lock, Key, Smartphone, Wifi, 
  Calendar, Award, Info, Download, AlertCircle, GraduationCap
} from 'lucide-react';

/**
 * Enhanced Security Recommendations Component
 * Provides comprehensive, actionable guidance based on Security Awareness Assessment results
 * Similar to Enhanced Recommendations for Privacy Risk Exposure
 */

// Calculate topic-specific scores (0-100, where 100 = best, 0 = worst)
const calculateTopicScores = (securityResults) => {
  const topics = {
    phishingAwareness: 100,
    malwareAwareness: 100,
    ransomwareAwareness: 100,
    passwordSecurityKnowledge: 100,
    twoFactorAuthKnowledge: 100,
    networkSecurityAwareness: 100,
    softwareUpdateAwareness: 100,
    dataBackupAwareness: 100,
    incidentResponseAwareness: 100
  };

  if (!securityResults?.answers) return topics;

  // Phishing Awareness
  if (securityResults.answers.phishingAwareness === 'expert') topics.phishingAwareness = 100;
  else if (securityResults.answers.phishingAwareness === 'good') topics.phishingAwareness = 67;
  else if (securityResults.answers.phishingAwareness === 'basic') topics.phishingAwareness = 33;
  else if (securityResults.answers.phishingAwareness === 'unaware') topics.phishingAwareness = 0;

  // Malware Awareness
  if (securityResults.answers.malwareAwareness === 'expert') topics.malwareAwareness = 100;
  else if (securityResults.answers.malwareAwareness === 'good') topics.malwareAwareness = 67;
  else if (securityResults.answers.malwareAwareness === 'basic') topics.malwareAwareness = 33;
  else if (securityResults.answers.malwareAwareness === 'unaware') topics.malwareAwareness = 0;

  // Ransomware Awareness
  if (securityResults.answers.ransomwareAwareness === 'expert') topics.ransomwareAwareness = 100;
  else if (securityResults.answers.ransomwareAwareness === 'good') topics.ransomwareAwareness = 67;
  else if (securityResults.answers.ransomwareAwareness === 'basic') topics.ransomwareAwareness = 33;
  else if (securityResults.answers.ransomwareAwareness === 'unaware') topics.ransomwareAwareness = 0;

  // Password Security Knowledge
  if (securityResults.answers.passwordSecurityKnowledge === 'expert') topics.passwordSecurityKnowledge = 100;
  else if (securityResults.answers.passwordSecurityKnowledge === 'good') topics.passwordSecurityKnowledge = 67;
  else if (securityResults.answers.passwordSecurityKnowledge === 'basic') topics.passwordSecurityKnowledge = 33;
  else if (securityResults.answers.passwordSecurityKnowledge === 'unaware') topics.passwordSecurityKnowledge = 0;

  // Two-Factor Auth Knowledge
  if (securityResults.answers.twoFactorAuthKnowledge === 'expert') topics.twoFactorAuthKnowledge = 100;
  else if (securityResults.answers.twoFactorAuthKnowledge === 'good') topics.twoFactorAuthKnowledge = 67;
  else if (securityResults.answers.twoFactorAuthKnowledge === 'basic') topics.twoFactorAuthKnowledge = 33;
  else if (securityResults.answers.twoFactorAuthKnowledge === 'unaware') topics.twoFactorAuthKnowledge = 0;

  // Network Security Awareness
  if (securityResults.answers.networkSecurityAwareness === 'expert') topics.networkSecurityAwareness = 100;
  else if (securityResults.answers.networkSecurityAwareness === 'good') topics.networkSecurityAwareness = 67;
  else if (securityResults.answers.networkSecurityAwareness === 'basic') topics.networkSecurityAwareness = 33;
  else if (securityResults.answers.networkSecurityAwareness === 'unaware') topics.networkSecurityAwareness = 0;

  // Software Update Awareness
  if (securityResults.answers.softwareUpdateAwareness === 'expert') topics.softwareUpdateAwareness = 100;
  else if (securityResults.answers.softwareUpdateAwareness === 'good') topics.softwareUpdateAwareness = 67;
  else if (securityResults.answers.softwareUpdateAwareness === 'basic') topics.softwareUpdateAwareness = 33;
  else if (securityResults.answers.softwareUpdateAwareness === 'unaware') topics.softwareUpdateAwareness = 0;

  // Data Backup Awareness
  if (securityResults.answers.dataBackupAwareness === 'expert') topics.dataBackupAwareness = 100;
  else if (securityResults.answers.dataBackupAwareness === 'good') topics.dataBackupAwareness = 67;
  else if (securityResults.answers.dataBackupAwareness === 'basic') topics.dataBackupAwareness = 33;
  else if (securityResults.answers.dataBackupAwareness === 'unaware') topics.dataBackupAwareness = 0;

  // Incident Response Awareness
  if (securityResults.answers.incidentResponseAwareness === 'expert') topics.incidentResponseAwareness = 100;
  else if (securityResults.answers.incidentResponseAwareness === 'good') topics.incidentResponseAwareness = 67;
  else if (securityResults.answers.incidentResponseAwareness === 'basic') topics.incidentResponseAwareness = 33;
  else if (securityResults.answers.incidentResponseAwareness === 'unaware') topics.incidentResponseAwareness = 0;

  return topics;
};

// Get topic risk level
const getTopicRiskLevel = (score) => {
  const safeScore = score ?? 0;
  if (safeScore >= 80) return { level: 'excellent', color: 'success', label: 'Excellent' };
  if (safeScore >= 60) return { level: 'good', color: 'primary', label: 'Good' };
  if (safeScore >= 40) return { level: 'fair', color: 'warning', label: 'Needs Improvement' };
  return { level: 'poor', color: 'danger', label: 'Critical Gap' };
};

// Get topic-specific recommendations
const getTopicRecommendations = (topicId, score, securityResults = {}) => {
  const recommendations = {
    phishingAwareness: {
      name: 'Phishing & Social Engineering',
      icon: AlertTriangle,
      whyItMatters: 'Phishing attacks are the #1 cause of data breaches. Attackers use sophisticated tactics to trick you into revealing passwords, financial information, or installing malware. Recognizing phishing attempts is your first line of defense.',
      critical: {
        immediateActions: [
          'Learn the 5 red flags of phishing emails (urgent language, suspicious sender, unexpected attachments, generic greetings, suspicious links)',
          'Practice identifying phishing attempts using interactive training tools',
          'Learn about social engineering tactics (pretexting, baiting, quid pro quo)',
          'Set up email security filters and spam protection',
          'Bookmark official websites instead of clicking email links'
        ],
        tools: [
          { name: 'Google Phishing Quiz', description: 'Interactive phishing identification practice' },
          { name: 'KnowBe4 Security Awareness', description: 'Free security training resources' },
          { name: 'CISA Phishing Infographic', description: 'Visual guide to phishing tactics' },
          { name: 'Email Security Best Practices', description: 'CISA email security guide' }
        ],
        followUp: {
          '24h': 'Complete phishing identification quiz',
          '1week': 'Review and practice identifying phishing emails',
          '1month': 'Take advanced social engineering awareness course'
        }
      },
      high: {
        immediateActions: [
          'Review advanced phishing tactics',
          'Practice identifying sophisticated phishing attempts',
          'Learn about business email compromise (BEC)'
        ],
        tools: [
          { name: 'Phishing Training Tools', description: 'Practice identifying phishing' },
          { name: 'Security Awareness Training', description: 'Advanced phishing education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Stay updated on new phishing tactics',
          'Share knowledge with others',
          'Practice identifying advanced phishing attempts'
        ]
      }
    },
    malwareAwareness: {
      name: 'Malware & Threat Recognition',
      icon: Shield,
      whyItMatters: 'Malware can steal your data, encrypt your files (ransomware), spy on your activities, or turn your device into part of a botnet. Ransomware is particularly destructive - it can permanently lock you out of all your files. Recognizing warning signs helps you respond quickly and minimize damage.',
      critical: {
        immediateActions: [
          'Learn the 8 types of malware: viruses, worms, trojans, ransomware, spyware, adware, rootkits, and keyloggers',
          'Understand ransomware specifically: how it encrypts files, demands payment, and why it\'s so dangerous',
          'Recognize warning signs: slow performance, pop-ups, changed settings, unknown programs, disabled security software, files becoming encrypted',
          'Install reputable antivirus/anti-malware software with ransomware protection',
          'Learn how malware spreads (email attachments, downloads, USB drives, malicious websites, phishing)',
          'Set up automatic malware scanning and real-time protection',
          'Understand that ransomware is often spread through phishing emails - be extra cautious with email attachments'
        ],
        tools: [
          { name: 'Windows Defender', description: 'Built-in Windows antivirus (free)' },
          { name: 'Malwarebytes', description: 'Advanced malware protection' },
          { name: 'CISA Malware Guide', description: 'Official malware protection guide' },
          { name: 'VirusTotal', description: 'Scan suspicious files online' }
        ],
        followUp: {
          '24h': 'Install and configure antivirus software',
          '1week': 'Learn about different malware types and warning signs',
          '1month': 'Complete malware awareness training course'
        }
      },
      high: {
        immediateActions: [
          'Deepen understanding of malware types',
          'Learn advanced threat detection',
          'Set up comprehensive malware protection'
        ],
        tools: [
          { name: 'Malware Protection Tools', description: 'Advanced security software' },
          { name: 'Threat Intelligence', description: 'Stay informed about new threats' }
        ]
      },
      moderate: {
        immediateActions: [
          'Stay updated on emerging malware threats',
          'Review and update security software',
          'Practice threat recognition'
        ]
      }
    },
    ransomwareAwareness: {
      name: 'Ransomware Awareness & Prevention',
      icon: AlertTriangle,
      whyItMatters: 'Ransomware encrypts your files and demands payment to restore access. It\'s one of the most destructive cyber threats, affecting millions of users and businesses. Without proper awareness and prevention, you could lose all your files permanently. Never pay the ransom - it funds criminal activity and doesn\'t guarantee file recovery.',
      critical: {
        immediateActions: [
          'Understand what ransomware is: malware that encrypts your files and demands payment (usually in cryptocurrency) to restore access',
          'Learn how ransomware spreads: phishing emails with malicious attachments, malicious downloads, compromised websites, USB drives, Remote Desktop Protocol (RDP) attacks',
          'Learn ransomware warning signs: files becoming encrypted (file extensions change to .locked, .encrypted, .crypto), ransom notes appearing on screen, system slowdown, inability to access files',
          'Understand why you should NEVER pay the ransom: it funds criminal activity, doesn\'t guarantee file recovery, and makes you a target for future attacks',
          'Set up the 3-2-1 backup rule immediately: 3 copies of data, 2 different storage types, 1 offsite backup (this is your best defense)',
          'Enable automatic backups and test restoration regularly',
          'Keep software updated (ransomware exploits known vulnerabilities)',
          'Use reputable antivirus/anti-malware with ransomware protection',
          'Learn ransomware response steps: disconnect from network immediately, don\'t pay ransom, restore from backups, report to authorities'
        ],
        tools: [
          { name: 'CISA Ransomware Guide', description: 'Official ransomware prevention and response guide' },
          { name: 'No More Ransom Project', description: 'Free ransomware decryption tools and resources' },
          { name: 'FBI Internet Crime Complaint Center', description: 'Report ransomware attacks to FBI' },
          { name: 'Ransomware Protection Tools', description: 'Antivirus with ransomware protection (Windows Defender, Malwarebytes)' },
          { name: 'Backup Solutions', description: 'Cloud backups (Backblaze, iCloud, OneDrive) and external drives' }
        ],
        followUp: {
          '24h': 'Set up automatic backups using 3-2-1 rule',
          '1week': 'Learn ransomware prevention methods and response procedures',
          '1month': 'Complete ransomware awareness training and test backup restoration'
        }
      },
      high: {
        immediateActions: [
          'Review and strengthen ransomware prevention measures',
          'Learn about advanced ransomware variants (double extortion, RaaS)',
          'Set up comprehensive backup strategy',
          'Practice ransomware response procedures'
        ],
        tools: [
          { name: 'Ransomware Prevention Tools', description: 'Advanced protection software' },
          { name: 'Ransomware Resources', description: 'Stay informed about ransomware threats' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue maintaining ransomware prevention measures',
          'Stay updated on ransomware threats and trends',
          'Regularly test backup restoration procedures',
          'Review and update ransomware response plan'
        ]
      }
    },
    passwordSecurityKnowledge: {
      name: 'Password Security Best Practices',
      icon: Lock,
      whyItMatters: 'Weak or reused passwords are the easiest way for attackers to access your accounts. Understanding password security helps you create strong, unique passwords and manage them securely.',
      critical: {
        immediateActions: [
          'Learn why length (16+ characters) matters more than complexity',
          'Understand why password reuse is dangerous (one breach = all accounts compromised)',
          'Learn why password managers are recommended (unique passwords, encrypted storage)',
          'Install a password manager (Bitwarden free, 1Password, or Dashlane)',
          'Learn about passphrases vs passwords (correct horse battery staple)'
        ],
        tools: [
          { name: 'Bitwarden', description: 'Free, open-source password manager' },
          { name: '1Password', description: 'Premium password manager' },
          { name: 'Have I Been Pwned', description: 'Check if passwords were breached' },
          { name: 'NIST Password Guidelines', description: 'Official password best practices' }
        ],
        followUp: {
          '24h': 'Install password manager and create master password',
          '1week': 'Learn password security fundamentals and migrate accounts',
          '1month': 'Complete password security best practices course'
        }
      },
      high: {
        immediateActions: [
          'Review advanced password security practices',
          'Learn about password hashing and encryption',
          'Implement password security across all accounts'
        ],
        tools: [
          { name: 'Password Manager', description: 'Secure password management' },
          { name: 'Password Security Resources', description: 'Advanced password education' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue using password manager',
          'Review and strengthen existing passwords',
          'Stay updated on password security best practices'
        ]
      }
    },
    twoFactorAuthKnowledge: {
      name: 'Multi-Factor Authentication',
      icon: Key,
      whyItMatters: '2FA/MFA adds a second layer of security beyond passwords. Even if someone steals your password, they can\'t access your account without the second factor. This prevents 99.9% of account takeovers.',
      critical: {
        immediateActions: [
          'Learn what 2FA/MFA is and why it\'s important (something you know + something you have)',
          'Understand different 2FA methods: SMS (less secure), authenticator apps (recommended), security keys (most secure)',
          'Download an authenticator app (Google Authenticator, Authy, or Microsoft Authenticator)',
          'Enable 2FA on your top 5 most important accounts (email, banking, social media)',
          'Learn why SMS 2FA is less secure than authenticator apps'
        ],
        tools: [
          { name: 'Google Authenticator', description: 'Free authenticator app' },
          { name: 'Authy', description: 'Cloud-synced authenticator app' },
          { name: 'YubiKey', description: 'Hardware security key (most secure)' },
          { name: '2FA Directory', description: 'Find sites that support 2FA' }
        ],
        followUp: {
          '24h': 'Install authenticator app and enable 2FA on email',
          '1week': 'Enable 2FA on all important accounts',
          '1month': 'Upgrade to security keys for maximum protection'
        }
      },
      high: {
        immediateActions: [
          'Enable 2FA on remaining accounts',
          'Learn about advanced 2FA methods',
          'Consider upgrading to security keys'
        ],
        tools: [
          { name: 'Authenticator Apps', description: '2FA app options' },
          { name: 'Security Keys', description: 'Hardware 2FA devices' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue using 2FA on all accounts',
          'Review and update 2FA methods',
          'Consider upgrading to more secure 2FA methods'
        ]
      }
    },
    networkSecurityAwareness: {
      name: 'Network Security',
      icon: Wifi,
      whyItMatters: 'Public Wi-Fi networks are unsecured and allow attackers to intercept your data. Home networks can be compromised if not properly secured. Understanding network security protects your data in transit.',
      critical: {
        immediateActions: [
          'Learn why public Wi-Fi is dangerous (man-in-the-middle attacks, packet sniffing)',
          'Understand how VPNs protect you (encrypted tunnel, hides your IP address)',
          'Install a VPN app (ProtonVPN free, NordVPN, or ExpressVPN)',
          'Learn about home network security (WPA3 encryption, router password, firmware updates)',
          'Set up VPN auto-connect for public networks'
        ],
        tools: [
          { name: 'ProtonVPN', description: 'Free VPN with strong privacy' },
          { name: 'NordVPN', description: 'Premium VPN service' },
          { name: 'Router Security Guide', description: 'CISA home network security guide' },
          { name: 'HTTPS Everywhere', description: 'Browser extension for secure connections' }
        ],
        followUp: {
          '24h': 'Install VPN and configure auto-connect',
          '1week': 'Review and secure home network settings',
          '1month': 'Complete network security fundamentals course'
        }
      },
      high: {
        immediateActions: [
          'Review advanced network security practices',
          'Secure home network configuration',
          'Learn about network monitoring'
        ],
        tools: [
          { name: 'VPN Services', description: 'Secure network connections' },
          { name: 'Network Security Tools', description: 'Home network protection' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue using VPN on public networks',
          'Regularly review network security settings',
          'Stay updated on network security best practices'
        ]
      }
    },
    softwareUpdateAwareness: {
      name: 'Software Updates & Patches',
      icon: Download,
      whyItMatters: 'Software updates fix security vulnerabilities that attackers exploit. Delaying updates leaves you vulnerable to known attacks. Keeping software updated is one of the most important security practices.',
      critical: {
        immediateActions: [
          'Learn why updates are critical (they fix security vulnerabilities, patch exploits)',
          'Understand the difference between feature updates and security patches',
          'Enable automatic updates for operating system, browsers, and critical software',
          'Learn to identify legitimate update notifications vs fake update scams',
          'Set up update notifications and review update logs'
        ],
        tools: [
          { name: 'Windows Update', description: 'Automatic Windows security updates' },
          { name: 'Mac Software Update', description: 'Automatic macOS updates' },
          { name: 'CVE Database', description: 'Track known vulnerabilities' },
          { name: 'Update Checkers', description: 'Verify software is up to date' }
        ],
        followUp: {
          '24h': 'Enable automatic updates on all devices',
          '1week': 'Review and update all installed software',
          '1month': 'Establish regular software update routine'
        }
      },
      high: {
        immediateActions: [
          'Review update policies and schedules',
          'Learn about zero-day vulnerabilities',
          'Set up comprehensive update management'
        ],
        tools: [
          { name: 'Update Management', description: 'Software update tools' },
          { name: 'Vulnerability Tracking', description: 'Stay informed about patches' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue maintaining software updates',
          'Review update schedules',
          'Stay informed about critical security patches'
        ]
      }
    },
    dataBackupAwareness: {
      name: 'Data Backup & Recovery',
      icon: Shield,
      whyItMatters: 'Backups protect you from ransomware attacks, hardware failures, accidental deletion, and natural disasters. Without backups, you can lose everything. The 3-2-1 backup rule ensures you can always recover.',
      critical: {
        immediateActions: [
          'Learn the 3-2-1 backup rule (3 copies, 2 different media types, 1 offsite)',
          'Understand why backups protect against ransomware (you can restore without paying)',
          'Set up automatic cloud backups (iCloud, Google Drive, OneDrive, or Backblaze)',
          'Create local backups on external drives',
          'Test backup restoration process (backups are useless if you can\'t restore)'
        ],
        tools: [
          { name: 'Backblaze', description: 'Automatic cloud backup service' },
          { name: 'Time Machine (Mac)', description: 'Built-in Mac backup' },
          { name: 'File History (Windows)', description: 'Built-in Windows backup' },
          { name: '3-2-1 Backup Guide', description: 'CISA backup best practices' }
        ],
        followUp: {
          '24h': 'Set up automatic cloud backup',
          '1week': 'Create local backup and test restoration',
          '1month': 'Establish comprehensive backup strategy'
        }
      },
      high: {
        immediateActions: [
          'Review and improve backup strategy',
          'Learn about backup encryption',
          'Set up automated backup testing'
        ],
        tools: [
          { name: 'Backup Services', description: 'Cloud and local backup solutions' },
          { name: 'Backup Best Practices', description: 'Advanced backup strategies' }
        ]
      },
      moderate: {
        immediateActions: [
          'Continue maintaining backups',
          'Review backup schedules and retention',
          'Test backup restoration regularly'
        ]
      }
    },
    incidentResponseAwareness: {
      name: 'Security Incident Response',
      icon: AlertCircle,
      whyItMatters: 'Knowing how to respond to security incidents minimizes damage. Quick action can prevent account takeovers, data theft, financial loss, and ransomware encryption. For ransomware attacks, immediate response is critical - disconnect from networks immediately to prevent spread. A clear response plan helps you act effectively under stress.',
      critical: {
        immediateActions: [
          'Learn the incident response steps: Identify, Contain, Eradicate, Recover, Learn',
          'Create an incident response checklist for common scenarios (phishing, malware, ransomware, account compromise)',
          'Learn ransomware-specific response: disconnect from network/WiFi immediately, don\'t pay ransom, isolate infected device, restore from backups, report to FBI/authorities',
          'Learn how to change passwords quickly and securely',
          'Understand how to check for unauthorized account activity',
          'Know how to report security incidents (to companies, authorities, credit bureaus, FBI for ransomware)',
          'Practice ransomware response: know how to disconnect from network, identify encrypted files, restore from backups'
        ],
        tools: [
          { name: 'Incident Response Checklist', description: 'CISA incident response guide' },
          { name: 'CISA Ransomware Response Guide', description: 'Official ransomware response procedures' },
          { name: 'FBI Internet Crime Complaint Center', description: 'Report ransomware attacks' },
          { name: 'No More Ransom Project', description: 'Free ransomware decryption tools' },
          { name: 'Account Activity Monitoring', description: 'Check for unauthorized access' },
          { name: 'IdentityTheft.gov', description: 'Report identity theft' },
          { name: 'FTC Data Breach Response', description: 'Official breach response guide' }
        ],
        followUp: {
          '24h': 'Create personal incident response checklist including ransomware response',
          '1week': 'Practice incident response scenarios, especially ransomware response',
          '1month': 'Complete incident response training including ransomware scenarios'
        }
      },
      high: {
        immediateActions: [
          'Develop comprehensive incident response plan',
          'Learn advanced incident response techniques',
          'Practice incident response scenarios'
        ],
        tools: [
          { name: 'Incident Response Planning', description: 'Create response procedures' },
          { name: 'Security Incident Training', description: 'Practice response scenarios' }
        ]
      },
      moderate: {
        immediateActions: [
          'Review and update incident response plan',
          'Stay updated on incident response best practices',
          'Practice response procedures regularly'
        ]
      }
    }
  };

  const topic = recommendations[topicId];
  if (!topic) return null;

  if (score < 40) {
    return { ...topic, ...topic.critical, priority: 'critical' };
  } else if (score < 60) {
    return { ...topic, ...topic.high, priority: 'high' };
  } else {
    return { ...topic, ...topic.moderate, priority: 'moderate' };
  }
};

// Generate learning journey phases
const getLearningJourney = (overallScore) => {
  if (overallScore < 40) {
    return {
      phase: 'Foundation Building',
      duration: '2-3 weeks',
      description: 'Your security awareness needs fundamental building. Start with core security concepts and build a strong foundation of knowledge.',
      focus: 'Core security fundamentals and basic threat recognition',
      actions: [
        'Learn about phishing and malware basics',
        'Understand ransomware threats and prevention',
        'Understand password security fundamentals',
        'Study network security essentials',
        'Learn about software updates and backups',
        'Practice identifying common security threats'
      ]
    };
  } else if (overallScore < 60) {
    return {
      phase: 'Knowledge Expansion',
      duration: '2-4 weeks',
      description: 'You have good security awareness basics. Expand your knowledge with advanced concepts and practical applications.',
      focus: 'Advanced security concepts and practical application',
      actions: [
        'Learn advanced threat recognition including ransomware variants',
        'Study incident response procedures especially ransomware response',
        'Explore security tools and technologies',
        'Practice security best practices',
        'Learn about emerging threats including new ransomware strains'
      ]
    };
  } else if (overallScore < 80) {
    return {
      phase: 'Skill Refinement',
      duration: '1-2 weeks',
      description: 'Strong security awareness! Refine your skills and stay current with evolving threats and best practices.',
      focus: 'Advanced security skills and staying current',
      actions: [
        'Review advanced security topics',
        'Stay updated on emerging threats',
        'Practice advanced security scenarios',
        'Share knowledge with others',
        'Consider security certifications'
      ]
    };
  } else {
    return {
      phase: 'Mastery & Leadership',
      duration: 'Ongoing',
      description: 'Excellent security awareness! Focus on maintaining expertise, helping others, and staying ahead of evolving threats.',
      focus: 'Continuous learning and security leadership',
      actions: [
        'Stay updated on security news and threats',
        'Help others improve their security awareness',
        'Consider professional security certifications (Security+, CISSP)',
        'Engage with security community',
        'Practice security leadership and mentorship'
      ]
    };
  }
};

// Detect learning patterns
const detectLearningPatterns = (securityResults = {}, topicScores = {}) => {
  const patterns = [];

  // Knowledge Gap Pattern - Multiple critical gaps
  const criticalGaps = (topicScores && typeof topicScores === 'object' ? Object.values(topicScores).filter(score => score < 40).length : 0);
  if (criticalGaps >= 4) {
    patterns.push({
      type: 'foundationGap',
      title: 'Foundation Knowledge Gaps Detected',
      description: `You have ${criticalGaps} critical knowledge gaps. Building a strong security awareness foundation is essential before advancing to more complex topics.`,
      recommendation: 'Focus on foundational security education. Start with phishing, malware, and password security basics. Build knowledge systematically before moving to advanced topics.',
      icon: BookOpen,
      color: 'danger'
    });
  }

  // Practical Application Gap - Good knowledge but may lack practice
  const goodScores = (topicScores && typeof topicScores === 'object' ? Object.values(topicScores).filter(score => score >= 60).length : 0);
  const poorScores = (topicScores && typeof topicScores === 'object' ? Object.values(topicScores).filter(score => score < 40).length : 0);
  if (goodScores >= 4 && poorScores === 0) {
    patterns.push({
      type: 'applicationGap',
      title: 'Ready for Practical Application',
      description: 'You have strong security awareness knowledge. Focus on applying this knowledge in real-world scenarios and practicing security skills.',
      recommendation: 'Practice applying your security knowledge. Use interactive training tools, practice identifying threats, and implement security best practices in your daily digital life.',
      icon: Target,
      color: 'primary'
    });
  }

  // Specialized Knowledge Pattern - Strong in some areas, weak in others
  const scoreValues = Object.values(topicScores);
  const scoreVariance = scoreValues.length > 0 
    ? Math.max(...scoreValues) - Math.min(...scoreValues)
    : 0;
  if (scoreVariance >= 50 && goodScores >= 2) {
    patterns.push({
      type: 'specializedGap',
      title: 'Specialized Knowledge Gaps',
      description: 'You have strong knowledge in some areas but significant gaps in others. Focus on filling knowledge gaps in weaker areas.',
      recommendation: 'Identify your weakest security awareness areas and focus learning efforts there. Balance your security knowledge across all topics for comprehensive protection.',
      icon: GraduationCap,
      color: 'warning'
    });
  }

  return patterns;
};

// Essential resource library
const getResourceLibrary = () => ({
  officialDocumentation: [
    { name: 'CISA Cybersecurity Guide', url: 'https://www.cisa.gov/cybersecurity', description: 'Official cybersecurity guidance and resources' },
    { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', description: 'Cybersecurity best practices framework' },
    { name: 'FTC Security Guide', url: 'https://www.ftc.gov/tips-advice/business-center/guidance/start-security-guide-business', description: 'Security guidance for individuals and businesses' },
    { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', description: 'Top web application security risks' }
  ],
  practicalTools: [
    { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', description: 'Check if your accounts were breached' },
    { name: 'Google Phishing Quiz', url: 'https://phishingquiz.withgoogle.com', description: 'Practice identifying phishing attempts' },
    { name: 'VirusTotal', url: 'https://www.virustotal.com', description: 'Scan suspicious files for malware' },
    { name: '2FA Directory', url: 'https://2fa.directory', description: 'Find sites that support two-factor authentication' }
  ],
  learningPlatforms: [
    { name: 'CISA Security Awareness', url: 'https://www.cisa.gov/secure-our-world', description: 'Free security awareness resources' },
    { name: 'SANS Security Awareness', url: 'https://www.sans.org/security-awareness-training', description: 'Professional security training' },
    { name: 'Cybrary', url: 'https://www.cybrary.it', description: 'Free cybersecurity courses' },
    { name: 'Security+ Training', url: 'https://www.comptia.org/certifications/security', description: 'Security certification preparation' }
  ],
  community: [
    { name: 'r/cybersecurity', url: 'https://reddit.com/r/cybersecurity', description: 'Cybersecurity discussion community' },
    { name: 'r/SecurityCareerAdvice', url: 'https://reddit.com/r/SecurityCareerAdvice', description: 'Security career guidance' },
    { name: 'SANS Newsletters', url: 'https://www.sans.org/newsletters/', description: 'Security news and updates' },
    { name: 'Krebs on Security', url: 'https://krebsonsecurity.com', description: 'Security news and analysis' }
  ]
});

const EnhancedSecurityRecommendations = ({ securityResults, securityScore }) => {
  // Safety checks for props
  const safeSecurityScore = securityScore ?? 0;
  const safeSecurityResults = securityResults || {};
  
  const topicScores = calculateTopicScores(safeSecurityResults);
  const journey = getLearningJourney(safeSecurityScore);
  const learningPatterns = detectLearningPatterns(safeSecurityResults, topicScores);
  const resources = getResourceLibrary();

  // Get awareness level
  const awarenessLevel = safeSecurityScore >= 80 ? 'expert' : 
                        safeSecurityScore >= 60 ? 'good' : 
                        safeSecurityScore >= 40 ? 'basic' : 'beginner';

  // Sort topics by score (lowest = needs most attention)
  const sortedTopics = Object.entries(topicScores)
    .map(([id, score]) => ({
      id,
      score,
      riskLevel: getTopicRiskLevel(score),
      recommendation: getTopicRecommendations(id, score, safeSecurityResults)
    }))
    .sort((a, b) => a.score - b.score);

  const criticalTopics = sortedTopics.filter(t => t.score < 40);
  const highTopics = sortedTopics.filter(t => t.score >= 40 && t.score < 60);
  const moderateTopics = sortedTopics.filter(t => t.score >= 60 && t.score < 80);
  const excellentTopics = sortedTopics.filter(t => t.score >= 80);

  return (
    <div className="space-y-8">
      {/* Overall Awareness Strategy Dashboard */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Target className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Overall Security Awareness Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Overall Score Card */}
          <div className={`p-6 rounded-lg border-2 ${
            awarenessLevel === 'beginner' ? 'bg-danger/10 border-danger' :
            awarenessLevel === 'basic' ? 'bg-warning/10 border-warning' :
            awarenessLevel === 'good' ? 'bg-primary/10 border-primary' :
            'bg-success/10 border-success'
          }`}>
            <div className="text-sm text-text-secondary mb-2">Security Awareness Score</div>
            <div className={`text-4xl md:text-5xl font-bold mb-2 ${
              awarenessLevel === 'beginner' ? 'text-danger' :
              awarenessLevel === 'basic' ? 'text-warning' :
              awarenessLevel === 'good' ? 'text-primary' :
              'text-success'
            }`}>
              {safeSecurityScore}/100
            </div>
            <div className={`text-lg font-semibold ${
              awarenessLevel === 'beginner' ? 'text-danger' :
              awarenessLevel === 'basic' ? 'text-warning' :
              awarenessLevel === 'good' ? 'text-primary' :
              'text-success'
            }`}>
              {awarenessLevel.charAt(0).toUpperCase() + awarenessLevel.slice(1)} Level
            </div>
            <div className="text-sm text-text-secondary mt-2">
              {awarenessLevel === 'beginner' && 'Build your security awareness foundation with fundamental concepts.'}
              {awarenessLevel === 'basic' && 'Good start! Expand your security knowledge with practical applications.'}
              {awarenessLevel === 'good' && 'Strong security awareness! Refine your skills and stay current.'}
              {awarenessLevel === 'expert' && 'Excellent security awareness! Maintain expertise and help others.'}
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="p-6 bg-background-secondary rounded-lg">
            <div className="text-sm text-text-secondary mb-4">Topic Breakdown</div>
            <div className="space-y-3">
              {sortedTopics.map(({ id, score, riskLevel }) => (
                <div key={id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text capitalize">
                      {id.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-semibold ${
                      riskLevel.color === 'danger' ? 'text-danger' :
                      riskLevel.color === 'warning' ? 'text-warning' :
                      riskLevel.color === 'primary' ? 'text-primary' :
                      'text-success'
                    }`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        riskLevel.color === 'danger' ? 'bg-danger' :
                        riskLevel.color === 'warning' ? 'bg-warning' :
                        riskLevel.color === 'primary' ? 'bg-primary' :
                        'bg-success'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Journey */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Your Security Awareness Learning Journey
        </h2>
        
        <div className={`p-6 rounded-lg border-2 mb-6 ${
          journey.phase === 'Foundation Building' ? 'bg-danger/10 border-danger' :
          journey.phase === 'Knowledge Expansion' ? 'bg-warning/10 border-warning' :
          journey.phase === 'Skill Refinement' ? 'bg-primary/10 border-primary' :
          'bg-success/10 border-success'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text mb-2">{journey.phase}</h3>
              <div className="flex items-center text-text-secondary mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Duration: {journey.duration}</span>
              </div>
            </div>
            {journey.phase === 'Foundation Building' && (
              <BookOpen className="w-8 h-8 text-danger flex-shrink-0" />
            )}
            {journey.phase === 'Mastery & Leadership' && (
              <Award className="w-8 h-8 text-success flex-shrink-0" />
            )}
          </div>
          
          <p className="text-text-secondary mb-4">{journey.description}</p>
          
          <div className="mb-4">
            <div className="text-sm font-semibold text-text mb-2">Focus Areas:</div>
            <p className="text-text-secondary">{journey.focus}</p>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-text mb-2">Key Learning Actions:</div>
            <ul className="space-y-2">
              {journey.actions.map((action, index) => (
                <li key={index} className="flex items-start text-text-secondary">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Learning Patterns */}
      {learningPatterns.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <Zap className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
            Learning Insights
          </h2>
          
          <div className="space-y-4">
            {learningPatterns.map((pattern, index) => {
              const Icon = pattern.icon;
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    pattern.color === 'danger' ? 'bg-danger/10 border-danger/20' :
                    pattern.color === 'warning' ? 'bg-warning/10 border-warning/20' :
                    'bg-primary/10 border-primary/20'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      pattern.color === 'danger' ? 'text-danger' :
                      pattern.color === 'warning' ? 'text-warning' :
                      'text-primary'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{pattern.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{pattern.description}</p>
                      <div className="text-sm text-text">
                        <strong>Recommendation:</strong> {pattern.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Critical Priority Topics */}
      {criticalTopics.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-danger" />
            🔴 Critical Priority Topics
          </h2>
          
          <div className="space-y-6">
            {criticalTopics.map(({ id, score, recommendation }) => {
              if (!recommendation) return null;
              const Icon = recommendation.icon;
              
              return (
                <div key={id} className="border-2 border-danger/30 rounded-lg p-6 bg-danger/5">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-danger/10 rounded-lg mr-4">
                      <Icon className="w-6 h-6 text-danger" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text mb-2">{recommendation.name}</h3>
                      <div className="text-sm text-danger font-semibold mb-2">Score: {score}/100 - Critical Knowledge Gap</div>
                    </div>
                  </div>
                  
                  {/* Why This Matters */}
                  <div className="mb-4 p-4 bg-background-secondary rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text mb-1">Why This Matters:</div>
                        <p className="text-sm text-text-secondary">{recommendation.whyItMatters}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* LEARN THIS NOW */}
                  <div className="mb-4">
                    <div className="font-semibold text-danger mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      LEARN THIS NOW - Essential Knowledge:
                    </div>
                    <ul className="space-y-2">
                      {recommendation.immediateActions.map((action, idx) => (
                        <li key={idx} className="flex items-start text-text">
                          <span className="font-bold text-danger mr-2">{idx + 1}.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tools & Resources */}
                  {recommendation.tools && recommendation.tools.length > 0 && (
                    <div className="mb-4">
                      <div className="font-semibold text-text mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Learning Resources:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendation.tools.map((tool, idx) => (
                          <div key={idx} className="p-3 bg-card rounded-lg border border-border">
                            <div className="font-medium text-text">{tool.name}</div>
                            <div className="text-sm text-text-secondary">{tool.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow-up Timeline */}
                  {recommendation.followUp && (
                    <div>
                      <div className="font-semibold text-text mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Learning Timeline:
                      </div>
                      <div className="space-y-2">
                        {Object.entries(recommendation.followUp).map(([time, action]) => (
                          <div key={time} className="flex items-start text-sm">
                            <span className="font-semibold text-accent mr-3 min-w-[60px]">{time}:</span>
                            <span className="text-text-secondary">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* High Priority Topics */}
      {highTopics.length > 0 && (
        <div className="card rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 mr-3 text-warning" />
            🟠 High Priority Topics
          </h2>
          
          <div className="space-y-4">
            {highTopics.map(({ id, score, recommendation }) => {
              if (!recommendation) return null;
              const Icon = recommendation.icon;
              
              return (
                <div key={id} className="border border-warning/30 rounded-lg p-4 bg-warning/5">
                  <div className="flex items-start mb-3">
                    <Icon className="w-5 h-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-text mb-1">{recommendation.name}</h3>
                      <div className="text-xs text-warning font-semibold mb-2">Score: {score}/100 - Needs Improvement</div>
                    </div>
                  </div>
                  
                  {recommendation.immediateActions && (
                    <div>
                      <div className="text-sm font-semibold text-text mb-2">Focus Areas:</div>
                      <ul className="space-y-1">
                        {recommendation.immediateActions.slice(0, 3).map((action, idx) => (
                          <li key={idx} className="flex items-start text-sm text-text-secondary">
                            <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-warning flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Essential Resource Library */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Essential Security Resource Library
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Documentation */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Official Documentation
            </h3>
            <div className="space-y-2">
              {resources.officialDocumentation.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Practical Tools */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Practical Tools & Training
            </h3>
            <div className="space-y-2">
              {resources.practicalTools.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Learning Platforms */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Learning Platforms
            </h3>
            <div className="space-y-2">
              {resources.learningPlatforms.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="font-semibold text-text mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Community & Updates
            </h3>
            <div className="space-y-2">
              {resources.community.map((resource, idx) => (
                <div key={idx} className="p-3 bg-card rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="font-medium text-text mb-1">{resource.name}</div>
                  <div className="text-sm text-text-secondary">{resource.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Timeline */}
      <div className="card rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center">
          <Clock className="w-6 h-6 md:w-8 md:h-8 mr-3 text-accent" />
          Actionable Learning Timeline
        </h2>
        
        <div className="space-y-4">
          {/* Right Now */}
          <div className="p-4 bg-danger/10 rounded-lg border border-danger/20">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-danger mr-2" />
              <h3 className="font-semibold text-text">Right Now (15 minutes)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalTopics.length > 0 && (
                <>
                  <li>• Start learning about your top 2 critical topics</li>
                  <li>• Bookmark essential security resources</li>
                </>
              )}
              {criticalTopics.length === 0 && (
                <>
                  <li>• Review your weakest security awareness areas</li>
                  <li>• Set up one new security tool or practice</li>
                </>
              )}
            </ul>
          </div>
          
          {/* Today */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-warning mr-2" />
              <h3 className="font-semibold text-text">Today (1 hour)</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              {criticalTopics.length > 0 && (
                <>
                  <li>• Complete interactive security training for critical topics</li>
                  <li>• Set up essential security tools (password manager, 2FA, antivirus)</li>
                  <li>• Practice identifying security threats</li>
                </>
              )}
              {criticalTopics.length === 0 && (
                <>
                  <li>• Complete advanced security training modules</li>
                  <li>• Practice security incident response scenarios</li>
                </>
              )}
            </ul>
          </div>
          
          {/* This Week */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-semibold text-text">This Week</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              <li>• Address all {criticalTopics.length > 0 ? 'CRITICAL and ' : ''}HIGH priority topics</li>
              <li>• Complete security awareness training courses</li>
              <li>• Implement security best practices learned</li>
              <li>• Practice security skills with interactive tools</li>
            </ul>
          </div>
          
          {/* This Month */}
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-success mr-2" />
              <h3 className="font-semibold text-text">This Month</h3>
            </div>
            <ul className="space-y-1 text-sm text-text-secondary ml-7">
              <li>• Complete comprehensive security awareness learning journey</li>
              <li>• Establish regular security learning routine</li>
              <li>• Practice security skills regularly</li>
              <li>• Stay updated on security news and emerging threats</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text">
              <strong>Pro Tip:</strong> Security awareness is a continuous journey. Regular practice and staying updated on evolving threats is more valuable than one-time learning. Set aside 15-30 minutes weekly for security education!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSecurityRecommendations;

