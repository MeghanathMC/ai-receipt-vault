
# UI Improvements for Judge Credibility

This plan implements the tiered improvements you outlined to enhance clarity and trust for judges evaluating the AI Output Receipt system.

---

## Tier 1 - High Priority (15-20 mins)

### 1. Clearer Hash Labels
Update labels in both `ReceiptSuccess.tsx` and `VerifyReceipt.tsx`:

| Current Label | New Label |
|---------------|-----------|
| 0G Storage Hash | **0G Storage Root Hash** |
| Receipt Hash | **Receipt Hash (SHA-256 of prompt + output)** |
| Transaction | **0G Mainnet Transaction Hash** |

**Files:** `src/components/ReceiptSuccess.tsx`, `src/pages/VerifyReceipt.tsx`

### 2. Info Icon with Tooltip
Add an info icon next to "0G Storage Root Hash" with tooltip:

> "This hash identifies the immutable receipt stored on 0G Storage mainnet."

**Files:** `src/components/ReceiptSuccess.tsx`, `src/pages/VerifyReceipt.tsx`

### 3. Receipt Metadata Section
Add a collapsible "Receipt Metadata" section (collapsed by default) showing:
- **Model:** gpt-4 / claude / etc
- **Created at:** formatted timestamp
- **Hash algorithm:** SHA-256
- **Network:** 0G Mainnet

**Files:** `src/components/ReceiptSuccess.tsx` (needs model and timestamp passed in), `src/components/ReceiptForm.tsx` (pass additional data)

---

## Tier 2 - Differentiators

### 4. Shareable Verification Link Message
Below the "Copy Verification Link" button, add:

> "Anyone with this link can independently verify the output."

**Files:** `src/components/ReceiptSuccess.tsx`

### 5. Tamper Failure Explanation
When verification fails (MODIFIED status), show explanation:

> "The computed hash does not match the immutable proof stored on 0G."

**Files:** `src/pages/VerifyReceipt.tsx`

---

## Tier 3 - Optional Impressive Feature

### 6. Raw Proof JSON Modal
Add a "View Stored Proof" button that opens a dialog showing the formatted JSON:

```json
{
  "version": "1.0",
  "receiptHash": "...",
  "promptHash": "...",
  "outputHash": "...",
  "timestamp": "...",
  "model": "..."
}
```

**Files:** `src/pages/VerifyReceipt.tsx`

---

## Technical Details

### Props Changes
The `ReceiptSuccess` component needs additional props for metadata display:
```typescript
interface ReceiptSuccessProps {
  rootHash: string;
  receiptHash: string;
  txHash: string;
  model: string;      // NEW
  timestamp: string;  // NEW
  onCreateAnother: () => void;
}
```

### New Components Used
- `Collapsible` from `@radix-ui/react-collapsible` (already installed)
- `Dialog` components (already available)
- `Info` icon from lucide-react (already imported)

### Files to Modify
1. `src/components/ReceiptSuccess.tsx` - Labels, tooltips, metadata section, shareable link message
2. `src/components/ReceiptForm.tsx` - Pass model and timestamp to ReceiptSuccess
3. `src/pages/VerifyReceipt.tsx` - Labels, tooltips, failure explanation, raw proof modal
