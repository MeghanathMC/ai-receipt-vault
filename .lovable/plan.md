

# AI Output Receipt - Implementation Plan

## Overview
A two-page MVP that creates verifiable "receipts" for AI outputs by hashing the prompt, model, output, and timestamp. Users can share verification links to prove the integrity of stored AI outputs.

---

## Page 1: Create Receipt (/)

### Layout
- Clean top navigation bar with "AI Output Receipt" title and current page indicator
- Centered card containing the form
- Minimal white background with subtle shadows

### Form Fields
1. **Prompt** - Large textarea (required)
2. **Model Name** - Text input with "claude" as default
3. **AI Output** - Large textarea (required)
4. **Create Receipt** - Primary action button

### After Successful Creation
Display a success card showing:
- Receipt ID (truncated with copy option)
- Stored Hash (first/last 8 chars with full hash on hover)
- **Copy Verification Link** button
- **Open Verification Page** link

---

## Page 2: Verify Receipt (/verify/:id)

### Layout
- Same top navigation with link back to Create page
- Two-section layout: Receipt details + Integrity check

### Receipt Details Section
Display in a clean card:
- **Prompt** (scrollable if long)
- **Model**
- **Output** (scrollable if long)
- **Timestamp** (formatted for readability)
- **Stored Hash**

### Integrity Check Section
- **Simulate Tamper** toggle with explanation tooltip
- **Verify Integrity** button
- Result badge:
  - ✅ **VERIFIED** (green) - hashes match
  - ❌ **MODIFIED** (red) - hashes don't match
- Show recomputed hash for transparency

### Error Handling
- Show friendly error message if receipt ID not found
- Clear loading states while fetching

---

## Database Setup (Lovable Cloud / Supabase)

### Table: receipts
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| prompt | text | Required |
| model | text | Required |
| output | text | Required |
| timestamp | text | ISO string |
| hash | text | SHA-256 hex string |
| created_at | timestamptz | Auto-set on insert |

### Security
- Public read access (for verification)
- Public insert access (no auth required)
- No update/delete policies

---

## Technical Implementation

### Client-Side Hashing
- Use Web Crypto API (`crypto.subtle.digest`) for SHA-256
- Canonical string format: `${prompt}|${model}|${output}|${timestamp}`
- Output as lowercase hex string

### API/Database Operations
- Insert new receipts directly via Supabase client
- Fetch receipts by ID for verification page

### UX Details
- Copy-to-clipboard with toast confirmation
- Form validation with clear error messages
- Responsive design for mobile use

---

## Design Style
- **Colors**: White background, gray text, blue accent for buttons
- **Typography**: Clean sans-serif, good hierarchy
- **Cards**: Subtle shadows, rounded corners
- **Status badges**: Large, clear, color-coded

