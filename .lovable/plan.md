
# ProofReceipt Landing Page Implementation

This plan creates a comprehensive landing page that explains the value proposition of ProofReceipt, with a clear path to the receipt creation functionality.

---

## Overview

The current app shows the receipt form immediately on the home page. This plan introduces a proper landing page with all the sections you provided, moving the receipt creation to a dedicated `/create` route.

---

## Route Structure Changes

| Route | Current | New |
|-------|---------|-----|
| `/` | CreateReceipt | **Home** (landing page) |
| `/create` | - | **CreateReceipt** (form) |
| `/verify/:id` | VerifyReceipt | VerifyReceipt (unchanged) |

---

## New Files to Create

### 1. `src/pages/Home.tsx`
The main landing page containing all sections:

**Hero Section**
- Large "ProofReceipt" heading (Playfair Display)
- Tagline: "Receipts for AI outputs. Verifiable. Immutable. Private."
- Problem statement about AI outputs being easy to fake
- CTA button: "Create a Receipt" linking to `/create`

**What Does This App Do Section**
- Explanation of turning AI responses into provable receipts
- Step-by-step: hash generation, 0G storage, verification link

**How It Works Section**
- Two-column layout or numbered steps
- Creation flow and verification flow
- "No trust. Only math." closing statement

**Why This Matters Section**
- Use cases: assignments, reports, research, documents
- Problems solved: proving original content, timestamp, edits

**Privacy-First Section**
- What is NOT stored (prompt, output, personal data)
- Only cryptographic hashes on 0G
- "Verification without exposing content"

**Core Features Section**
- 6 feature cards in a grid:
  - AI Output Receipts
  - Independent Verification
  - Tamper Detection
  - 0G Storage (Mainnet)
  - No Wallet Required
  - Proof Export

**Who Is This For Section**
- Audience list: Students, Companies, Researchers, Teams

**Closing Section**
- "Proof, not trust."
- Final CTA button

---

## Files to Modify

### 2. `src/App.tsx`
- Import new `Home` component
- Add route: `/` for Home
- Change CreateReceipt route to `/create`

### 3. `src/components/Navigation.tsx`
- Update brand name to "ProofReceipt"
- Add navigation links:
  - "Home" linking to `/`
  - "Create" linking to `/create`

---

## Component Structure

```text
Home.tsx
  |-- HeroSection
  |-- WhatItDoesSection
  |-- HowItWorksSection
  |-- WhyItMattersSection
  |-- PrivacySection
  |-- FeaturesSection (6 cards)
  |-- AudienceSection
  |-- ClosingSection
```

All sections will be implemented as part of the single Home.tsx file to keep things simple, using semantic section elements.

---

## Technical Details

### Typography Usage
- `font-heading` (Playfair Display): Main headings, section titles, brand name
- `font-sans` (Inter): Body text, descriptions, feature cards

### Icons (from lucide-react)
- `FileCheck` - Receipts
- `Shield` - Verification
- `AlertTriangle` - Tamper Detection
- `Database` - 0G Storage
- `Wallet` - No Wallet
- `Download` - Proof Export
- `Lock` - Privacy

### Styling Approach
- Consistent with existing "Minimal and Clean" design
- White background, subtle borders, professional spacing
- Max width containers matching existing `max-w-4xl` pattern
- Responsive grid layouts for features

### Button Navigation
- Primary CTA uses `Link` from react-router-dom
- Styled with existing `Button` component

---

## Files Summary

| File | Action |
|------|--------|
| `src/pages/Home.tsx` | Create new |
| `src/App.tsx` | Modify routes |
| `src/components/Navigation.tsx` | Update links and brand |
