# Product Deliverables

This folder contains the paid product deliverables that users can download after purchase.

## Folder Structure

```
products/
  privacy-audit/
    SocialCaution_Personal_Privacy_Audit.pdf
  action-plan/
    SocialCaution_30-Day_Privacy_Action_Plan.pdf
  broker-removal/
    SocialCaution_Data_Broker_Removal_Kit.zip
```

## Products

### 1. Digital Privacy Audit (PDF)
- **File**: `privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf`
- **Price**: $29
- **Stripe Product ID**: `privacy_audit_pdf`
- **Contents**:
  - Executive Summary (risk level, top concerns, impact)
  - Privacy Concern Profile section
  - Exposure Breakdown by category
  - Digital Footprint Snapshot (aggregate only)
  - Key Risk Drivers table (5 items max)
  - Priority Actions (3 immediate / 3 short-term / 3 strategic)
  - Regulatory & Rights Snapshot
  - Methodology & Privacy Statement

### 2. 30-Day Privacy Action Plan (PDF)
- **File**: `action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf`
- **Price**: $19
- **Stripe Product ID**: `action_plan_30d`
- **Contents**:
  - Week 1–4 action checklist
  - Effort / impact / dependency markers
  - Tool references (no links required v1)

### 3. Data Broker Removal Toolkit
- **File**: `broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip`
- **Price**: $39
- **Stripe Product ID**: `broker_removal_kit`
- **Contents**:
  - Removal Guide PDF
  - Broker Removal Request Templates (DOCX)
  - Tracking Checklist (XLSX or PDF)

## Access URLs

Files are served at:
- `/products/privacy-audit/SocialCaution_Personal_Privacy_Audit.pdf`
- `/products/action-plan/SocialCaution_30-Day_Privacy_Action_Plan.pdf`
- `/products/broker-removal/SocialCaution_Data_Broker_Removal_Kit.zip`

## Notes

- Files should be generated once and placed in these folders
- Files are served statically by Vite (no build step needed)
- To copy to other repo: `cp -r public/products/ ../other-repo/public/`
