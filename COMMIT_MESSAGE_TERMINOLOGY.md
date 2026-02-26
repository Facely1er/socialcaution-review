feat: standardize and clarify privacy terminology across application

- Standardized terminology: Privacy Exposure Index (service-level) vs Privacy Exposure Score (user-level)
- Updated all translation files (en, es, fr) to use consistent "Privacy Exposure Index" terminology
- Enhanced UI components with clearer labels, tooltips, and context explanations
- Added scale and direction indicators (0-100, higher = more risk) to all score displays
- Created comprehensive terminology usage guide and documentation

Key Changes:
- Replaced "Privacy Risk Index" with "Privacy Exposure Index" throughout codebase
- Clarified distinction between service-level (Index) and user-level (Score) metrics
- Enhanced tooltips and descriptions to explain score differences
- Added breakdown displays showing calculation components (Assessment 60% + Footprint 40%)

Files Modified:
- src/data/translations/en.json, es.json, fr.json - Updated terminology
- src/config/stripe.ts - Updated product descriptions
- src/components/pages/FAQPage.jsx - Updated FAQ answers
- src/utils/privacyExposureIndex.js - Updated code comments
- src/components/QuickPrivacyScore.jsx - Added context and scale notes
- src/components/ExposureIndexDashboard.jsx - Enhanced descriptions
- src/components/ServiceCatalog.jsx - Added service-specific labels
- src/components/PersonalizedDashboard.jsx - Added scale notes and breakdowns
- src/components/DigitalFootprintAnalysis.jsx - Enhanced explanations
- src/components/pages/PrivacyRegulationsMonitoring.jsx - Added scale notes
- PRICING_JUSTIFICATION.md - Updated documentation

Documentation Created:
- TERMINOLOGY_STANDARDIZATION_SUMMARY.md - Standardization summary
- TERMINOLOGY_USAGE_GUIDE.md - Comprehensive usage guide
- TERMINOLOGY_CLARIFICATION_SUMMARY.md - Implementation summary

