

# 0G Storage Integration - Implementation Plan

## Overview

Integrate 0G Storage (decentralized storage, Log layer - immutable) to store cryptographic receipt proofs on-chain instead of storing full content in the database. The actual AI content stays in the user's session only.

---

## Architecture Change

```text
+------------------+     +-------------------+     +------------------+
|   Frontend       |     |   Edge Function   |     |   0G Storage     |
|   (React)        |<--->|   (Deno)          |<--->|   (Log Layer)    |
+------------------+     +-------------------+     +------------------+
        |                         |
        |    compute hashes       |
        |    locally              |
        +-------------------------+
```

### Key Design Decisions:

1. **Proof-Only Storage**: Only cryptographic proof JSON goes to 0G (never the actual prompt/output content)
2. **Edge Function Backend**: Use Supabase Edge Functions for 0G SDK operations since it requires a private key
3. **Database Optional**: Keep local database for optional metadata caching, but 0G is the source of truth
4. **Testnet First**: Use 0G Galileo Testnet for development

---

## Proof JSON Schema

```json
{
  "version": "1.0",
  "receipt_hash": "<sha256(prompt|model|output|timestamp)>",
  "model": "claude",
  "timestamp": "2026-01-31T13:45:22.123Z",
  "prompt_hash": "<sha256(prompt)>",
  "output_hash": "<sha256(output)>"
}
```

---

## Implementation Steps

### Step 1: Create Edge Function for 0G Storage Operations

Create `supabase/functions/zg-storage/index.ts` that handles:
- `POST /zg-storage` - Upload proof JSON, returns `rootHash`
- `GET /zg-storage?rootHash=xxx` - Download proof JSON

The function will use:
- `@0glabs/0g-ts-sdk` for 0G Storage operations
- `ethers` for wallet/signer operations
- Environment variables for private key and network config

### Step 2: Add Required Secrets

Request user to configure:
- `ZG_PRIVATE_KEY`: Ethereum private key for signing 0G transactions (needs 0G testnet tokens)

Environment variables (hardcoded or configurable):
- `ZG_RPC_URL`: `https://evmrpc-testnet.0g.ai`
- `ZG_INDEXER_RPC`: `https://indexer-storage-testnet-turbo.0g.ai`

### Step 3: Update Hash Utilities

Extend `src/lib/hash.ts` to add:
- `computeSHA256(text: string)` - Generic SHA-256 for individual fields
- Keep existing `computeReceiptHash()` for the main canonical hash

### Step 4: Update Create Receipt Flow

Modify `src/components/ReceiptForm.tsx`:

1. Compute all hashes client-side:
   - `receipt_hash` = sha256(prompt|model|output|timestamp)
   - `prompt_hash` = sha256(prompt)
   - `output_hash` = sha256(output)

2. Build proof JSON object

3. Call edge function to upload proof to 0G Storage

4. Receive `rootHash` from 0G as the receipt ID

5. Show success with 0G storage reference and verification link

### Step 5: Update Verify Receipt Flow

Modify `src/pages/VerifyReceipt.tsx`:

1. Use `rootHash` from URL parameter (instead of UUID)

2. Call edge function to fetch proof JSON from 0G Storage

3. Display proof metadata (model, timestamp, prompt_hash, output_hash)

4. For integrity verification:
   - User re-enters prompt and output in form fields
   - Compute hashes locally
   - Compare with fetched proof's `receipt_hash`
   - Show VERIFIED/MODIFIED badge

5. "Simulate Tamper" toggle appends " (edited)" to output before hash computation

### Step 6: Update Database Schema (Optional)

Add a `zg_root_hash` column to receipts table to optionally cache the 0G reference alongside local data. This allows hybrid mode where users can still use local storage.

---

## Environment Variables Setup

Secrets to configure via Lovable:

| Secret | Description |
|--------|-------------|
| `ZG_PRIVATE_KEY` | Ethereum private key for 0G transactions |

Hardcoded in edge function:
- Testnet RPC: `https://evmrpc-testnet.0g.ai`
- Indexer RPC: `https://indexer-storage-testnet-turbo.0g.ai`

---

## Edge Function Implementation Details

```typescript
// POST: Upload proof JSON to 0G Storage
// 1. Receive proof JSON from request body
// 2. Convert JSON to file-like blob
// 3. Use ZgFile.fromStream() or similar to create uploadable object
// 4. Upload via indexer.upload()
// 5. Return rootHash

// GET: Download proof JSON from 0G Storage  
// 1. Receive rootHash from query params
// 2. Download file using indexer.download()
// 3. Parse JSON content
// 4. Return proof JSON
```

---

## UI Changes Summary

### Create Receipt Page
- Same form fields (prompt, model, output)
- After submit: show "0G Storage Hash" instead of "Receipt ID"
- Verification link format: `/verify/{rootHash}`
- Note: Content never leaves browser (only proof is stored)

### Verify Receipt Page
- Fetch proof from 0G using rootHash
- Display proof metadata (hashes, model, timestamp)
- Add input fields for user to enter original prompt/output for local verification
- Integrity check compares locally-computed hash with stored `receipt_hash`

---

## Technical Notes

1. **SDK Compatibility**: The `@0glabs/0g-ts-sdk` works in Deno edge functions with proper imports

2. **File Upload Method**: For JSON blobs, use the stream-based upload approach:
   ```typescript
   import { Readable } from 'stream';
   const stream = new Readable();
   stream.push(JSON.stringify(proofJson));
   stream.push(null);
   const file = await ZgFile.fromStream(stream, 'proof.json');
   ```

3. **0G Testnet Tokens**: User needs testnet 0G tokens from faucet (https://faucet.0g.ai) to fund transactions

4. **Root Hash**: The Merkle root hash returned by 0G serves as the unique, immutable identifier for the proof

---

## Testing Checklist

After implementation:
- [ ] Receipt creates successfully
- [ ] 0G storage reference (rootHash) is displayed
- [ ] Verification page loads proof from 0G
- [ ] Original content verification works (VERIFIED shows green)
- [ ] "Simulate Tamper" toggle causes MODIFIED (red) state
- [ ] Error handling for invalid/missing rootHash

