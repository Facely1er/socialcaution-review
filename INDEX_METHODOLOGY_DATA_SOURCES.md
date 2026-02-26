# Index Methodology — Data Sources

This document lists **all data sources and their URLs** used for the SocialCaution **Privacy Exposure Index** methodology: the Service Exposure Index (per-service score), the Digital Footprint Score, the Combined Privacy Exposure Index, and all supporting rating services.

---

## 1. Primary Data Sources (Service Exposure Index)

The **Service Exposure Index** (0–100 per service) is calculated from the following three primary data sources. They are maintained in the codebase and updated from public information (see Section 3).

| # | Data source | Description | Implementation file(s) |
|---|-------------|-------------|------------------------|
| 1 | **Service catalog** | Service metadata and categorization (e.g., category, name, type, id). Used to identify services and their category for factor logic (e.g., data sensitivity, privacy-enhancing caps). | `src/data/serviceCatalog.js` |
| 2 | **Service risk profiles** | Per-service privacy risks, known issues, regulations, and recommended actions. Feeds: typical privacy risks (Factor 1), known issues (Factor 2), known breach history (Factor 3), regulatory oversight (Factor 4), user control (Factor 7), third-party data sharing (Factor 8). | `src/data/serviceRiskProfiles.js` |
| 3 | **Service relationships** | Parent company and sibling service relationships. Used for the **Parent Company & Siblings** factor (Factor 5). | `src/data/serviceRelationships.js` |

**Enhanced catalog (optional):**  
When available, **enhanced service data** (extra metadata) is used via `getAllEnhancedServices()` from `src/data/serviceCatalogEnhanced.js`, which builds on the base catalog and `serviceRelationships`. The enhanced catalog contains 200+ services with detailed attributes including `privacy_policy_url`, `website`, `ios_app_url`, `android_app_url`, breach `source_url`s, encryption levels, data collection types, and more.

**Calculation:**  
The index is computed in `src/utils/privacyExposureIndex.js`, which imports the three primary sources above (and uses the enhanced catalog where applicable).

---

## 2. Data Sources for Combined Index & Digital Footprint

The **Combined Privacy Exposure Index** (0–100) combines:

- **Privacy Exposure Assessment** (60%): from the user's assessment answers (stored locally).
- **Digital Footprint Score** (40%): from the Service Exposure Indices of **services the user has selected/tracked**.

Relevant data sources:

| Data | Description | Where used / stored |
|------|-------------|----------------------|
| **User assessment answers & results** | Answers and computed assessment score (0–100). | Local storage (e.g. `socialcaution_results`, assessment state); used for the 60% component. |
| **User's selected/tracked services** | List of service IDs the user has added to "My Services" or equivalent. | Local storage (e.g. `socialcaution_services`); used to compute the 40% Digital Footprint (average of Service Exposure Indices for those services). |
| **Service Exposure Index (per service)** | As above, from the three primary sources. | Calculated by `privacyExposureIndex.js` for each tracked service. |

So the **methodology's data sources** for the index are: (1) the three primary sources in Section 1, and (2) user inputs (assessment + selected services) for the combined score.

---

## 3. External / Upstream Sources (What We Curate From)

Service catalog and risk profiles are **not** live feeds; they are **curated** and updated from the following types of **public** information:

| Type | Description |
|------|-------------|
| **Privacy policies** | Official privacy policies and terms of service of each provider. |
| **News and reports** | Publicly reported incidents, investigations, and privacy-related news. |
| **Data breach databases / reports** | Public breach databases and breach reports (e.g. known, publicly reported breaches). Used for "known breach history" only; absence of data does not mean no breaches have occurred. |
| **Regulatory filings and enforcement** | Public regulatory actions, consent decrees, and enforcement related to privacy. |
| **Established privacy frameworks** | Frameworks and principles used to structure assessments (see Section 4). |

*Source: Exposure Index Methodology page (Section 4 – Data Sources), FAQ "How is the service catalog updated?" (privacy policies, news reports, data breach databases), and methodology note in translations (publicly available information, privacy policies, regulatory filings, established frameworks).*

### 3a. Breach Source URLs (Enhanced Catalog)

Breach entries in `src/data/serviceCatalogEnhanced.js` reference specific source URLs used to verify breach data:

| # | Source | URL | Services Referenced |
|---|--------|-----|---------------------|
| 1 | BBC News Technology | `https://www.bbc.com/news/technology-45792349` | Google (Google+ breach) |
| 2 | CNIL (France) | `https://www.cnil.fr/en/cnils-restricted-committee-imposes-financial-penalty-50-million-euros-against-google-llc` | Google (GDPR fine) |
| 3 | BBC News Technology | `https://www.bbc.com/news/technology-38067100` | Yahoo (data breach) |
| 4 | BBC News Technology | `https://www.bbc.com/news/technology-45664470` | Facebook (security breach) |
| 5 | BBC News Technology | `https://www.bbc.com/news/technology-47815337` | Facebook (password storage) |
| 6 | FTC Press Release | `https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-imposes-5-billion-penalty-sweeping-new-privacy-restrictions-facebook` | Facebook ($5B FTC penalty) |
| 7 | BBC News Technology | `https://www.bbc.com/news/technology-53425822` | Twitter (2020 hack) |
| 8 | BBC News Technology | `https://www.bbc.com/news/technology-57580188` | LinkedIn (data scraping) |
| 9 | DPC Ireland | `https://www.dataprotection.ie/en/news-media/press-releases/dpc-announces-decision-in-whatsapp-inquiry` | WhatsApp (GDPR fine) |
| 10 | BBC News Technology | `https://www.bbc.com/news/technology-58810785` | Twitch (source code leak) |
| 11 | BBC News Technology | `https://www.bbc.com/news/technology-27503290` | eBay (2014 breach) |
| 12 | BBC News Technology | `https://www.bbc.com/news/technology-19042968` | Dropbox (breach) |
| 13 | BBC News Technology | `https://www.bbc.com/news/technology-43128037` | MyFitnessPal (breach) |
| 14 | BBC News Technology | `https://www.bbc.com/news/technology-38130362` | Uber (data breach) |
| 15 | BBC News Technology | `https://www.bbc.com/news/technology-49850277` | DoorDash (breach) |
| 16 | BBC News Technology | `https://www.bbc.com/news/technology-56666148` | Cash App (breach) |
| 17 | BBC News Technology | `https://www.bbc.com/news/technology-62712345` | LastPass (breach) |
| 18 | BBC News Technology | `https://www.bbc.com/news/technology-46398195` | Quora (breach) |
| 19 | BBC News Technology | `https://www.bbc.com/news/technology-13213504` | Sony/PlayStation (breach) |
| 20 | BBC News Technology | `https://www.bbc.com/news/technology-52133349` | Zoom (security issues) |
| 21 | BBC News Business | `https://www.bbc.com/news/business-25506006` | Target (breach) |

### 3b. State Attorney General Breach Databases

Referenced in the deployment guide (`privacy_radar+trends/SocialCaution_Deployment_Guide.md`) as additional upstream breach data sources:

| # | Source | URL |
|---|--------|-----|
| 1 | California Attorney General - Data Breach List | `https://oag.ca.gov/privacy/databreach/list` |
| 2 | Maine Attorney General - Breach Notices | `https://apps.web.maine.gov/online/aeviewer/ME/40/list.shtml` |
| 3 | Vermont Attorney General - Data Security Breach Notices | `https://ago.vermont.gov/blog/category/data-security-breach-notices/` |

---

## 4. Regulatory & Framework References

Privacy assessments and factor design are aligned with the following **established privacy frameworks and regulations** (referred to in methodology and translations):

| Framework / regulation | Relevant aspect (examples) |
|------------------------|----------------------------|
| **GDPR** | Art. 13 (transparency); EU data subject rights. |
| **CCPA** | § 1798.100 (right to know). |
| **CPRA** | California privacy rights (extension of CCPA). |
| **COPPA** | Children's privacy. |
| **PIPEDA** | Principle 4 (limiting collection). |
| **LGPD** | Art. 18 (data subject rights). |
| **HIPAA** | Privacy and security rules (health data). |
| **FERPA** | Student privacy. |
| **GLBA** | Financial privacy. |
| **VCDPA** | Virginia consumer data rights. |

These are used to structure risk categories, recommended actions, and regulatory oversight (Factor 4); they are **reference frameworks**, not "data feeds" in the sense of Section 1.

---

## 5. RSS Feed Data Sources (Privacy Radar & Trends Tracker)

These RSS feeds are used by the **Privacy Radar** (tactical/immediate threats) and **Trends Tracker** (strategic/long-term planning) features. They inform caution alerts and may influence curated updates to service risk profiles over time. Configured in `src/data/rssFeeds.js`.

### 5a. Tactical Feeds (Privacy Radar — Immediate Threats)

| # | Feed Name | URL | Category |
|---|-----------|-----|----------|
| 1 | Krebs on Security | `https://krebsonsecurity.com/feed/` | general-security |
| 2 | CISA Cybersecurity Alerts | `https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml` | general-security |
| 3 | Have I Been Pwned | `https://feeds.feedburner.com/HaveIBeenPwnedLatestBreaches` | data-breach |
| 4 | TechCrunch Security | `https://techcrunch.com/tag/security/feed/` | general-security |
| 5 | FTC Scam Alerts | `https://www.consumer.ftc.gov/rss/scam-alerts.xml` | scams |
| 6 | FTC Consumer Alerts | `https://www.consumer.ftc.gov/rss/consumer-alerts.xml` | scams |
| 7 | OpenPhish | `https://openphish.com/feed.txt` | phishing |
| 8 | APWG (Anti-Phishing Working Group) | `https://apwg.org/feed/` | phishing |
| 9 | PhishTank | `https://www.phishtank.com/rss.php` | phishing |
| 10 | CISA Phishing Alerts | `https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml` | phishing |
| 11 | Schneier on Security | `https://www.schneier.com/feed/atom` | general-security |
| 12 | Threatpost | `https://threatpost.com/feed/` | general-security |
| 13 | DataBreaches.net | `https://www.databreaches.net/feed/` | data-breach |
| 14 | Android Security Bulletin | `https://source.android.com/docs/security/bulletin/feed.xml` | device-security |

### 5b. Strategic Feeds (Trends Tracker — Long-term Planning)

| # | Feed Name | URL | Category |
|---|-----------|-----|----------|
| 1 | Privacy Rights Clearinghouse | `https://privacyrights.org/feed` | privacy-laws |
| 2 | NIST Cybersecurity | `https://csrc.nist.gov/news/rss` | compliance |
| 3 | EFF Deeplinks Blog | `https://www.eff.org/rss/updates.xml` | news |
| 4 | Privacy International | `https://privacyinternational.org/rss.xml` | privacy-laws |
| 5 | IAPP Privacy Tracker | `https://iapp.org/news/feed/` | regulation |
| 6 | GDPR Enforcement Tracker | `https://www.enforcementtracker.com/feed` | enforcement |
| 7 | FTC Business Blog (Privacy) | `https://www.ftc.gov/news-events/blogs/business-blog/rss` | enforcement |
| 8 | EPIC Privacy News | `https://epic.org/feed/` | privacy-laws |
| 9 | This Week in Privacy | `https://thisweek.in/privacy/rss` | news (inactive) |

### 5c. Other Feeds

| # | Feed Name | URL | Category |
|---|-----------|-----|----------|
| 1 | Social Media Today | `https://www.socialmediatoday.com/rss` | social-media |
| 2 | Identity Theft Resource Center | `https://www.idtheftcenter.org/feed/` | identity-theft |
| 3 | Common Sense Media | `https://www.commonsensemedia.org/rss/articles` | parental-controls |

---

## 6. Breach Monitoring API

The breach monitoring system (used for breach checking, not the static index calculation) connects to:

| # | API / Service | URL | Description | File |
|---|---------------|-----|-------------|------|
| 1 | Have I Been Pwned API v3 | `https://haveibeenpwned.com/api/v3` | Checks if email addresses appear in known data breaches | `privacy_radar+trends/socialcaution_data_collector.py` |

---

## 7. Service Privacy Policy URLs

Privacy policy URLs are stored in two places and used for linking users to the official policies of rated services. These policies are also an upstream source for curating service risk profiles.

### 7a. Core Service Privacy Policies (`src/utils/serviceNotifications.js`)

| # | Service | Privacy Policy URL |
|---|---------|-------------------|
| 1 | Google | `https://policies.google.com/privacy` |
| 2 | Microsoft | `https://privacy.microsoft.com/privacystatement` |
| 3 | Yahoo | `https://legal.yahoo.com/us/en/yahoo/privacy/index.html` |
| 4 | Facebook | `https://www.facebook.com/privacy/explanation` |
| 5 | Instagram | `https://help.instagram.com/519522125107875` |
| 6 | TikTok | `https://www.tiktok.com/legal/privacy-policy` |
| 7 | Twitter/X | `https://twitter.com/privacy` |
| 8 | LinkedIn | `https://www.linkedin.com/legal/privacy-policy` |
| 9 | Snapchat | `https://www.snap.com/privacy/privacy-policy` |
| 10 | Pinterest | `https://policy.pinterest.com/privacy-policy` |
| 11 | Reddit | `https://www.reddit.com/policies/privacy-policy` |
| 12 | WhatsApp | `https://www.whatsapp.com/legal/privacy-policy` |
| 13 | Telegram | `https://telegram.org/privacy` |
| 14 | Discord | `https://discord.com/privacy` |
| 15 | Slack | `https://slack.com/privacy-policy` |
| 16 | Netflix | `https://help.netflix.com/legal/privacy` |
| 17 | Spotify | `https://www.spotify.com/us/legal/privacy-policy/` |
| 18 | YouTube | `https://policies.google.com/privacy` |
| 19 | Disney+ | `https://disneytermsofuse.com/privacy-policy/` |
| 20 | Hulu | `https://www.hulu.com/privacy` |
| 21 | Amazon / Prime | `https://www.amazon.com/gp/help/customer/display.html?nodeId=468496` |
| 22 | Apple Music / iCloud | `https://www.apple.com/privacy/` |
| 23 | Twitch | `https://www.twitch.tv/p/privacy-policy` |
| 24 | eBay | `https://www.ebay.com/help/policies/member-behaviour-policies/user-privacy-notice?id=4260` |
| 25 | Etsy | `https://www.etsy.com/legal/privacy` |
| 26 | Walmart | `https://corporate.walmart.com/privacy-security/walmart-privacy-policy` |
| 27 | Dropbox | `https://www.dropbox.com/privacy` |
| 28 | OneDrive | `https://privacy.microsoft.com/privacystatement` |
| 29 | Google Drive | `https://policies.google.com/privacy` |
| 30 | Fitbit | `https://www.fitbit.com/global/us/legal/privacy-policy` |
| 31 | Strava | `https://www.strava.com/legal/privacy` |
| 32 | MyFitnessPal | `https://www.myfitnesspal.com/privacy` |
| 33 | Uber / Uber Eats | `https://www.uber.com/legal/privacy/users/en` |
| 34 | Airbnb | `https://www.airbnb.com/help/article/2855/privacy-policy` |
| 35 | DoorDash | `https://www.doordash.com/legal/privacy` |
| 36 | Grubhub | `https://www.grubhub.com/legal/privacy-policy` |
| 37 | Tinder | `https://policies.tinder.com/privacy` |
| 38 | Bumble | `https://bumble.com/privacy` |
| 39 | Hinge | `https://hinge.co/privacy` |
| 40 | PayPal | `https://www.paypal.com/us/webapps/mpp/ua/privacy-full` |
| 41 | Venmo | `https://venmo.com/legal/us-privacy-policy` |
| 42 | Cash App | `https://cash.app/legal/us/en-us/privacy` |

### 7b. Enhanced Catalog Privacy Policies (`src/data/serviceCatalogEnhanced.js`)

The enhanced catalog contains `privacy_policy_url` for 200+ services. Beyond those listed in Section 7a, additional services include:

| # | Service | Privacy Policy URL |
|---|---------|-------------------|
| 43 | Signal | `https://signal.org/legal/privacy-policy` |
| 44 | Element (Matrix) | `https://element.io/privacy` |
| 45 | Threema | `https://threema.ch/en/privacy` |
| 46 | Wire | `https://wire.com/en/legal/privacy` |
| 47 | Session | `https://getsession.org/privacy-policy` |
| 48 | ProtonMail | `https://proton.me/legal/privacy` |
| 49 | Tutanota | `https://tutanota.com/privacy` |
| 50 | Fastmail | `https://www.fastmail.com/about/privacy` |
| 51 | Mailbox.org | `https://mailbox.org/en/data-protection-privacy-policy` |
| 52 | Posteo | `https://posteo.de/en/site/privacy` |
| 53 | ProtonDrive | `https://proton.me/legal/privacy` |
| 54 | Tresorit | `https://tresorit.com/legal/privacy-policy` |
| 55 | Sync.com | `https://www.sync.com/legal/privacy` |
| 56 | pCloud | `https://www.pcloud.com/privacy-policy` |
| 57 | MEGA | `https://mega.nz/privacy` |
| 58 | SpiderOak | `https://spideroak.com/privacy-policy` |
| 59 | NordVPN | `https://nordvpn.com/privacy-policy` |
| 60 | ExpressVPN | `https://www.expressvpn.com/privacy-policy` |
| 61 | Surfshark | `https://surfshark.com/privacy-policy` |
| 62 | ProtonVPN | `https://protonvpn.com/privacy-policy` |
| 63 | Mullvad VPN | `https://mullvad.net/en/help/privacy-policy` |
| 64 | IVPN | `https://www.ivpn.net/privacy` |
| 65 | Bitwarden | `https://bitwarden.com/privacy` |
| 66 | 1Password | `https://1password.com/legal/privacy` |
| 67 | LastPass | `https://www.lastpass.com/legal/privacy-policy` |
| 68 | Dashlane | `https://www.dashlane.com/privacy` |
| 69 | KeePass | `https://keepass.info/help/base/security.html` |
| 70 | Proton Pass | `https://proton.me/legal/privacy` |
| 71 | Firefox | `https://www.mozilla.org/privacy/firefox` |
| 72 | Brave Browser | `https://brave.com/privacy` |
| 73 | Tor Browser | `https://www.torproject.org/about/privacypolicy` |
| 74 | DuckDuckGo | `https://duckduckgo.com/privacy` |
| 75 | Vivaldi | `https://vivaldi.com/privacy` |
| 76 | Opera | `https://www.opera.com/privacy` |
| 77 | Edge | `https://privacy.microsoft.com/en-us/privacystatement` |
| 78 | Safari | `https://www.apple.com/privacy` |
| 79 | Mastodon | `https://joinmastodon.org/privacy-policy` |
| 80 | Pixelfed | `https://pixelfed.org/privacy` |
| 81 | Diaspora | `https://diaspora.github.io/diaspora_federation/privacy_policy.html` |
| 82 | BeReal | `https://bereal.com/privacy` |
| 83 | Clubhouse | `https://www.clubhouse.com/privacy` |
| 84 | Vero | `https://vero.co/privacy` |
| 85 | VK | `https://vk.com/privacy` |
| 86 | Weibo | `https://weibo.com/signup/v5/privacy` |
| 87 | Tumblr | `https://www.tumblr.com/privacy` |
| 88 | Medium | `https://policy.medium.com/medium-privacy-policy-f03bf92035c9` |
| 89 | Quora | `https://www.quora.com/about/privacy` |
| 90 | Nextdoor | `https://nextdoor.com/privacy_policy` |
| 91 | Google Nest | `https://policies.google.com/privacy` |
| 92 | Amazon Alexa | `https://www.amazon.com/gp/help/customer/display.html?nodeId=468496` |
| 93 | Ring | `https://ring.com/privacy` |
| 94 | Apple HomeKit | `https://www.apple.com/privacy` |
| 95 | Philips Hue | `https://www.philips-hue.com/en-us/support/privacy` |
| 96 | Apple Health | `https://www.apple.com/privacy` |
| 97 | Google Fit | `https://policies.google.com/privacy` |
| 98 | Samsung Health | `https://www.samsung.com/us/account/privacy-policy` |
| 99 | Noom | `https://www.noom.com/privacy-policy` |
| 100 | Calm | `https://www.calm.com/privacy` |
| 101 | Headspace | `https://www.headspace.com/legal/privacy-policy` |
| 102 | Notion | `https://www.notion.so/Privacy-Policy-3468d120cf614d4c9014c09f6adc9091` |
| 103 | Evernote | `https://evernote.com/legal/privacy` |
| 104 | Obsidian | `https://obsidian.md/privacy` |
| 105 | Trello | `https://trello.com/legal/privacy` |
| 106 | Asana | `https://asana.com/terms#privacy` |
| 107 | Todoist | `https://todoist.com/privacy` |
| 108 | Steam | `https://store.steampowered.com/privacy_agreement` |
| 109 | Epic Games | `https://www.epicgames.com/site/en-US/privacypolicy` |
| 110 | PlayStation | `https://www.playstation.com/en-us/legal/privacy-policy` |
| 111 | Xbox | `https://privacy.microsoft.com/en-us/privacystatement` |
| 112 | Nintendo | `https://www.nintendo.com/privacy-policy` |
| 113 | Coursera | `https://www.coursera.org/legal/privacy` |
| 114 | Khan Academy | `https://www.khanacademy.org/about/privacy-policy` |
| 115 | Udemy | `https://www.udemy.com/terms/privacy` |
| 116 | Duolingo | `https://www.duolingo.com/privacy` |
| 117 | Zoom | `https://zoom.us/privacy` |
| 118 | Substack | `https://substack.com/privacy` |
| 119 | Patreon | `https://www.patreon.com/privacy` |
| 120 | Lemmy | `https://join-lemmy.org/docs/en/privacy_policy.html` |
| 121 | Bluesky | `https://bsky.social/about/support/privacy` |
| 122 | Threads | `https://www.threads.net/privacy-policy` |
| 123 | Matrix | `https://matrix.org/legal/privacy` |
| 124 | Wickr | `https://wickr.com/privacy-policy` |
| 125 | Keybase | `https://keybase.io/docs/privacypolicy` |
| 126 | StartMail | `https://www.startmail.com/privacy` |
| 127 | CTemplar | `https://ctemplar.com/privacy-policy` |
| 128 | Nextcloud | `https://nextcloud.com/privacy` |
| 129 | Seafile | `https://www.seafile.com/en/home/privacy` |
| 130 | Windscribe | `https://windscribe.com/privacy` |
| 131 | Private Internet Access | `https://www.privateinternetaccess.com/privacy-policy` |
| 132 | Keeper | `https://www.keepersecurity.com/privacy-policy` |
| 133 | RoboForm | `https://www.roboform.com/privacy-policy` |
| 134 | Roam Research | `https://roamresearch.com/privacy` |
| 135 | Logseq | `https://logseq.com/privacy` |
| 136 | Joplin | `https://joplinapp.org/privacy` |
| 137 | GOG | `https://www.gog.com/privacy` |
| 138 | itch.io | `https://itch.io/docs/legal/privacy` |
| 139 | edX | `https://www.edx.org/privacy-policy` |
| 140 | Skillshare | `https://www.skillshare.com/privacy` |
| 141 | Codecademy | `https://www.codecademy.com/privacy` |
| 142 | Zelle | `https://www.zellepay.com/privacy` |
| 143 | Square | `https://squareup.com/us/en/legal/general/privacy` |
| 144 | Stripe | `https://stripe.com/privacy` |
| 145 | Samsung SmartThings | `https://www.samsung.com/us/privacy/privacy-policy` |
| 146 | Home Assistant | `https://www.home-assistant.io/privacy` |
| 147 | WHOOP | `https://www.whoop.com/privacy` |
| 148 | Oura Ring | `https://ouraring.com/privacy-policy` |
| 149 | Ghost | `https://ghost.org/privacy` |
| 150 | WordPress.com | `https://automattic.com/privacy` |
| 151 | Paramount+ | `https://www.paramount.com/legal/privacy-policy` |
| 152 | Peacock | `https://www.nbcuniversal.com/privacy` |
| 153 | HBO Max | `https://www.warnermediaprivacy.com/policy` |
| 154 | Target | `https://www.target.com/c/privacy-policy` |
| 155 | Shopify | `https://www.shopify.com/legal/privacy` |
| 156 | Adobe | `https://www.adobe.com/privacy/policy.html` |
| 157 | Dribbble | `https://dribbble.com/privacy` |
| 158 | Flickr | `https://www.flickr.com/help/privacy` |
| 159 | 500px | `https://500px.com/privacy` |
| 160 | GitHub | `https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement` |
| 161 | GitLab | `https://about.gitlab.com/privacy` |
| 162 | Jira/Confluence | `https://www.atlassian.com/legal/privacy-policy` |
| 163 | Stack Overflow | `https://stackoverflow.com/legal/privacy-policy` |
| 164 | DeviantArt | `https://www.deviantart.com/about/policy/privacy` |
| 165 | Goodreads | `https://www.goodreads.com/about/privacy` |
| 166 | Letterboxd | `https://letterboxd.com/privacy` |
| 167 | Monday.com | `https://monday.com/privacy` |
| 168 | TIDAL | `https://tidal.com/privacy` |
| 169 | Deezer | `https://www.deezer.com/legal/privacy` |
| 170 | Udacity | `https://www.udacity.com/legal/privacy` |
| 171 | Pluralsight | `https://www.pluralsight.com/privacy` |
| 172 | Teams | `https://privacy.microsoft.com/privacy` |
| 173 | Google Meet | `https://policies.google.com/privacy` |
| 174 | Mattermost | `https://mattermost.com/privacy-policy` |
| 175 | Rocket.Chat | `https://rocket.chat/privacy` |
| 176 | Bear | `https://bear.app/privacy` |
| 177 | Standard Notes | `https://standardnotes.com/privacy` |
| 178 | WorkFlowy | `https://workflowy.com/privacy` |
| 179 | Box | `https://www.box.com/legal/privacy` |
| 180 | Crunchyroll | `https://www.crunchyroll.com/privacy` |
| 181 | SoundCloud | `https://soundcloud.com/pages/privacy` |
| 182 | Pandora | `https://www.pandora.com/privacy` |
| 183 | Ubisoft | `https://www.ubisoft.com/en-us/legal/privacy-policy` |
| 184 | EA | `https://www.ea.com/privacy-policy` |
| 185 | Activision Blizzard | `https://www.activision.com/legal/privacy-policy` |
| 186 | Nike | `https://www.nike.com/help/a/privacy-policy` |
| 187 | Adidas | `https://www.adidas.com/us/help-topics-privacy_policy.html` |
| 188 | Costco | `https://www.costco.com/privacy-policy.html` |
| 189 | Best Buy | `https://www.bestbuy.com/site/help-topics/privacy-policy/pcmcat204400050062.c` |
| 190 | Wise | `https://wise.com/legal/privacy-policy` |
| 191 | Revolut | `https://www.revolut.com/legal/privacy` |
| 192 | Apple Pay | `https://www.apple.com/privacy` |
| 193 | Mint | `https://mint.intuit.com/privacy` (Python collector) |
| 194 | Robinhood | `https://robinhood.com/us/en/support/articles/privacy-policy` (Python collector) |

---

## 8. Service Security Settings URLs

Security settings URLs stored in `src/utils/serviceNotifications.js`, used for directing users to harden their accounts.

| # | Service | Security Settings URL |
|---|---------|----------------------|
| 1 | Google | `https://myaccount.google.com/security` |
| 2 | Facebook | `https://www.facebook.com/settings?tab=security` |
| 3 | Instagram | `https://www.instagram.com/accounts/privacy_and_security/` |
| 4 | Twitter/X | `https://twitter.com/settings/security` |
| 5 | Microsoft | `https://account.microsoft.com/security` |
| 6 | Amazon | `https://www.amazon.com/gp/css/homepage.html?ie=UTF8&ref_=nav_youraccount_ya` |
| 7 | PayPal | `https://www.paypal.com/myaccount/security/` |

---

## 9. Service Terms of Service URLs

Terms of service URLs stored in `src/utils/serviceNotifications.js`.

| # | Service | Terms of Service URL |
|---|---------|---------------------|
| 1 | Google | `https://policies.google.com/terms` |
| 2 | Facebook | `https://www.facebook.com/legal/terms` |
| 3 | Instagram | `https://help.instagram.com/581066165581870` |
| 4 | Twitter/X | `https://twitter.com/tos` |
| 5 | Microsoft | `https://www.microsoft.com/legal/terms-of-use` |
| 6 | Amazon | `https://www.amazon.com/gp/help/customer/display.html?nodeId=508088` |

---

## 10. External Resource & Reference URLs

These URLs are used in recommendation and resource pages to link users to external privacy/security tools and learning resources.

### 10a. Official Documentation & Regulatory References

| # | Resource | URL | Used In |
|---|----------|-----|---------|
| 1 | CISA Cybersecurity Guide | `https://www.cisa.gov/cybersecurity` | Exposure & Security Recommendations |
| 2 | FTC Privacy & Security | `https://www.ftc.gov/tips-advice/business-center/privacy-and-security` | Exposure & Rights Recommendations |
| 3 | FTC Security Guide for Business | `https://www.ftc.gov/tips-advice/business-center/guidance/start-security-guide-business` | Security Recommendations |
| 4 | GDPR Full Text | `https://gdpr-info.eu/` | Exposure & Rights Recommendations |
| 5 | CCPA/CPRA Text | `https://oag.ca.gov/privacy/ccpa` | Exposure & Rights Recommendations |
| 6 | NIST Cybersecurity Framework | `https://www.nist.gov/cyberframework` | Security Recommendations |
| 7 | OWASP Top 10 | `https://owasp.org/www-project-top-ten/` | Security Recommendations |
| 8 | GDPR.eu | `https://gdpr.eu` | Rights Recommendations |

### 10b. Practical Privacy & Security Tools

| # | Tool | URL | Description | Source File |
|---|------|-----|-------------|-------------|
| 1 | Have I Been Pwned | `https://haveibeenpwned.com` | Check if accounts were breached | Exposure/Security/Rights Recommendations |
| 2 | Have I Been Pwned - Passwords | `https://haveibeenpwned.com/Passwords` | Password breach checker | `src/data/tools.js` |
| 3 | Privacy Rights Clearinghouse | `https://privacyrights.org` | Privacy education and resources | Exposure/Rights Recommendations |
| 4 | JustGetMyData | `https://justgetmydata.com` | Request your data from companies | Exposure/Rights Recommendations |
| 5 | JustDeleteMe | `https://justdeleteme.xyz` | Delete accounts easily | Exposure/Rights Recommendations |
| 6 | Google Phishing Quiz | `https://phishingquiz.withgoogle.com` | Practice identifying phishing | Security Recommendations |
| 7 | VirusTotal | `https://www.virustotal.com` | Scan suspicious files for malware | Security Recommendations |
| 8 | 2FA Directory | `https://2fa.directory` | Find sites that support 2FA | Security Recommendations |
| 9 | Terms of Service; Didn't Read | `https://tosdr.org` | Understand privacy policies | Rights Recommendations |
| 10 | Privacy Badger | `https://privacybadger.org/` | Privacy-focused browser extension | `src/data/tools.js` |
| 11 | JoinDeleteMe | `https://joindeleteme.com/` | Data broker removal service | `src/data/tools.js` |
| 12 | Qustodio | `https://www.qustodio.com/` | Family safety dashboard | `src/data/tools.js` |
| 13 | ScamAdviser | `https://www.scamadviser.com/` | Shopping security checker | `src/data/tools.js` |
| 14 | Google Alerts | `https://www.google.com/alerts` | Online reputation monitoring | `src/data/tools.js` |
| 15 | Tor Project | `https://www.torproject.org/` | Anonymous browsing suite | `src/data/tools.js` |
| 16 | YourDigitalRights | `https://yourdigitalrights.org/` | Exercise privacy rights (GDPR, CCPA) | `src/data/tools.js` |

### 10c. Learning Platforms

| # | Platform | URL | Description | Source File |
|---|----------|-----|-------------|-------------|
| 1 | IAPP Training | `https://iapp.org` | Privacy professional training | Exposure/Rights Recommendations |
| 2 | IAPP Community | `https://iapp.org/community` | Privacy professionals community | Rights Recommendations |
| 3 | Privacy Rights Consumer Guides | `https://privacyrights.org/consumer-guides` | Free privacy guides | Exposure/Rights Recommendations |
| 4 | EFF Surveillance Self-Defense | `https://ssd.eff.org` | Privacy self-defense guides | Exposure/Rights Recommendations |
| 5 | CISA Secure Our World | `https://www.cisa.gov/secure-our-world` | Free security awareness resources | Security Recommendations |
| 6 | SANS Security Awareness | `https://www.sans.org/security-awareness-training` | Professional security training | Security Recommendations |
| 7 | Cybrary | `https://www.cybrary.it` | Free cybersecurity courses | Security Recommendations |
| 8 | CompTIA Security+ | `https://www.comptia.org/certifications/security` | Security certification preparation | Security Recommendations |
| 9 | GDPR.eu Education | `https://gdpr.eu` | GDPR education and resources | Rights Recommendations |

### 10d. Community & News

| # | Resource | URL | Description | Source File |
|---|----------|-----|-------------|-------------|
| 1 | r/privacy | `https://reddit.com/r/privacy` | Privacy discussion community | Exposure/Rights Recommendations |
| 2 | r/privacytoolsIO | `https://reddit.com/r/privacytoolsIO` | Privacy tools discussion | Exposure Recommendations |
| 3 | r/cybersecurity | `https://reddit.com/r/cybersecurity` | Cybersecurity discussion | Security Recommendations |
| 4 | r/SecurityCareerAdvice | `https://reddit.com/r/SecurityCareerAdvice` | Security career guidance | Security Recommendations |
| 5 | The Markup | `https://themarkup.org` | Privacy journalism | Exposure/Rights Recommendations |
| 6 | Krebs on Security | `https://krebsonsecurity.com` | Security news and analysis | Security Recommendations |
| 7 | SANS Newsletters | `https://www.sans.org/newsletters/` | Security news and updates | Security Recommendations |
| 8 | Privacy International | `https://privacyinternational.org` | Privacy advocacy organization | Rights Recommendations |

---

## 11. Affiliate Partner URLs

Privacy-focused affiliate partnerships configured in `src/config/affiliates.ts`. These are recommended tools, not data sources for the rating calculation.

| # | Partner | URL | Category |
|---|---------|-----|----------|
| 1 | NordVPN | `https://nordvpn.com` | VPN |
| 2 | ExpressVPN | `https://expressvpn.com` | VPN |
| 3 | 1Password | `https://1password.com` | Password Manager |
| 4 | Bitwarden | `https://bitwarden.com` | Password Manager |
| 5 | Brave Browser | `https://brave.com` | Browser |
| 6 | ProtonMail | `https://protonmail.com` | Privacy Tool |

---

## 12. Third-Party Service Providers (Platform Infrastructure)

Third-party services used by the SocialCaution platform itself, referenced in cookie/legal pages and CSP configuration. These are **not** data sources for rating calculations.

| # | Service | Privacy URL | Purpose | Source File |
|---|---------|-------------|---------|-------------|
| 1 | Supabase | `https://supabase.com/privacy` | Database / Auth (premium features) | `src/components/legal/CookiePolicy.jsx` |
| 2 | Sentry | `https://sentry.io/privacy/` | Error tracking | `src/components/legal/CookiePolicy.jsx` |
| 3 | PostHog | `https://posthog.com/privacy` | Product analytics | `src/components/legal/CookiePolicy.jsx` |
| 4 | Stripe | `https://stripe.com/privacy` | Payment processing | `src/components/legal/CookiePolicy.jsx` |
| 5 | Vercel | `https://vercel.com/legal/privacy-policy` | Hosting (alternative) | `src/components/legal/CookiePolicy.jsx` |
| 6 | Google Analytics | `https://www.google-analytics.com` | Web analytics | `src/utils/security.js`, `src/utils/analytics.js` |
| 7 | Google Tag Manager | `https://www.googletagmanager.com` | Tag management | `src/utils/security.js`, `src/utils/analytics.js` |
| 8 | Google Fonts | `https://fonts.googleapis.com` / `https://fonts.gstatic.com` | Web fonts | `src/utils/security.js` |
| 9 | DoD DIBNet | `https://dibnet.dod.mil` | CUI incident reporting | `src/components/legal/PrivacyPolicy.jsx` |

---

## 13. Infrastructure & API URLs

| # | Service | URL | Description | File |
|---|---------|-----|-------------|------|
| 1 | SocialCaution API | `https://api.socialcaution.com` | Backend API (env variable `VITE_REACT_APP_API_BASE_URL`) | `.env.example` |
| 2 | SocialCaution (Basic) | `https://socialcaution.com` | Basic version URL | `src/utils/versionDetection.js` |
| 3 | SocialCaution (Standard) | `https://app.socialcaution.com` | Standard/premium version URL | `src/utils/versionDetection.js` |
| 4 | Simple Icons CDN | `https://cdn.simpleicons.org/{iconSlug}/{color}` | Service logo icons | `src/utils/serviceLogos.js` |
| 5 | RSS Aggregator | `/api/rss-aggregator` (Netlify Function) | Serverless RSS feed aggregation | `netlify/functions/` |
| 6 | Pexels (Stock Images) | `https://images.pexels.com/photos/...` | Blog post featured images | `src/blog/` |
| 7 | Google Calendar | `https://calendar.google.com/calendar/render` | Calendar event export | `src/tools/privacy-calendar/` |
| 8 | Schema.org | `https://schema.org` | Structured data markup | `src/components/seo/StructuredData.jsx` |

---

## 14. Python Data Collector Additional Services

The Python data collector (`privacy_radar+trends/socialcaution_data_collector.py`) contains privacy policy URLs for additional services beyond the main catalog, used for data collection and monitoring:

| # | Service | Privacy Policy URL | Category |
|---|---------|-------------------|----------|
| 1 | Signal | `https://signal.org/legal` | Messaging |
| 2 | iMessage | `https://apple.com/legal/privacy` | Messaging |
| 3 | Facebook Messenger | `https://facebook.com/privacy` | Messaging |
| 4 | ProtonMail | `https://proton.me/legal/privacy` | Email |
| 5 | Tutanota | `https://tutanota.com/privacy` | Email |
| 6 | Gmail | `https://policies.google.com/privacy` | Email |
| 7 | Outlook/Hotmail | `https://privacy.microsoft.com` | Email |
| 8 | Yahoo Mail | `https://legal.yahoo.com/privacy.html` | Email |
| 9 | iCloud Mail | `https://apple.com/legal/privacy` | Email |
| 10 | Tresorit | `https://tresorit.com/privacy_policy.html` | Cloud Storage |
| 11 | SpiderOak | `https://spideroak.com/policy/privacy-policy` | Cloud Storage |
| 12 | pCloud | `https://pcloud.com/privacy_policy.html` | Cloud Storage |
| 13 | Mint | `https://mint.intuit.com/privacy` | Finance |
| 14 | Robinhood | `https://robinhood.com/us/en/support/articles/privacy-policy` | Finance |
| 15 | Notion | `https://notion.so/Privacy-Policy` | Productivity |
| 16 | Evernote | `https://evernote.com/privacy` | Productivity |
| 17 | Todoist | `https://todoist.com/privacy` | Productivity |
| 18 | Trello | `https://trello.com/privacy` | Productivity |
| 19 | Mullvad VPN | `https://mullvad.net/privacy` | Privacy Tools |
| 20 | ProtonVPN | `https://protonvpn.com/privacy-policy` | Privacy Tools |
| 21 | NordVPN | `https://nordvpn.com/privacy-policy` | Privacy Tools |

---

## 15. Summary Table (All Data Sources)

| Data source | Used for | File / origin |
|-------------|----------|----------------|
| Service catalog | Service list, category, metadata | `src/data/serviceCatalog.js` |
| Service risk profiles | Risks, issues, regulations, breach signals, actions | `src/data/serviceRiskProfiles.js` |
| Service relationships | Parent/sibling factor | `src/data/serviceRelationships.js` |
| Enhanced service data (200+ services) | Extra metadata, breach source URLs, privacy policy URLs | `src/data/serviceCatalogEnhanced.js` |
| User assessment answers/results | 60% of Combined Index | Local storage |
| User tracked services | 40% of Combined Index (which services to average) | Local storage |
| Public privacy policies (194 services) | Upstream curation & user reference links | `src/utils/serviceNotifications.js`, `src/data/serviceCatalogEnhanced.js` |
| Breach source URLs (21 entries) | Verification of breach data in enhanced catalog | `src/data/serviceCatalogEnhanced.js` |
| RSS feeds (26 feeds) | Privacy Radar alerts & Trends Tracker | `src/data/rssFeeds.js` |
| Have I Been Pwned API v3 | Breach monitoring | `privacy_radar+trends/socialcaution_data_collector.py` |
| State AG breach databases (3 states) | Upstream breach data | Deployment guide |
| External tools (8 third-party tools) | Recommended tools directory | `src/data/tools.js` |
| Resource libraries (3 assessment types) | Exposure, Security, Rights recommendations | `src/components/assessments/Enhanced*Recommendations.jsx` |
| Affiliate partners (6 partners) | Recommended privacy tools | `src/config/affiliates.ts` |
| Third-party infrastructure (9 services) | Platform operations (analytics, payments, hosting) | `src/utils/security.js`, legal pages |
| GDPR, CCPA, PIPEDA, LGPD, HIPAA, FERPA, GLBA, VCDPA, etc. | Framework reference for factors and wording | Methodology & translations |
| Python data collector (21 additional services) | Extended service monitoring | `privacy_radar+trends/socialcaution_data_collector.py` |

---

*This document is the single reference for **all data sources used for the Index Methodology and rating services**. For calculation details, see the Index Methodology & Disclaimers page (`/privacy-exposure-disclaimer`) and `METHODOLOGY_PRINCIPLES.md`.*
