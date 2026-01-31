

# Fix 0G Storage Upload - Implementation Plan

## Problem Analysis

After thorough investigation comparing our edge function implementation against the official 0G SDK documentation, starter kit, and npm package, I identified the **root cause** of the `require(false)` revert during `estimateGas`:

### The Bug: Incorrect Upload Result Handling

The official 0G Storage TypeScript Starter Kit clearly shows:

```javascript
const [tx, uploadErr] = await indexer.upload(zgFile, RPC_URL, signer);
// tx is an OBJECT with properties:
const rootHash = tx.rootHash;
const transactionHash = tx.txHash;
```

**Our current code incorrectly treats the result as a string:**
```typescript
const txHash = typeof uploadResult === 'string' ? uploadResult : uploadResult?.toString();
```

This mismatch may cause issues in how the SDK processes the upload chain, or the result handling is masking the actual error.

However, the logs show the SDK IS attempting to submit the transaction with storage fee (`30733644962n` wei), which means the SDK is working up to the point of transaction submission. The `require(false)` revert happens at the contract level during `estimateGas`.

### Potential Root Causes (in order of likelihood):

1. **SDK/Contract ABI mismatch**: The npm SDK v0.3.3 is 3 months old, but contract interfaces may have been updated on Galileo testnet
2. **File handling issue in Deno**: The `ZgFile.fromFilePath()` may not work correctly in Deno's edge runtime environment
3. **Storage node availability**: The turbo indexer may not have available nodes for small files

---

## Solution: Multi-Pronged Fix

### Step 1: Fix Upload Result Handling

Update the edge function to correctly extract `rootHash` and `txHash` from the upload result object:

```typescript
const [tx, uploadError] = await indexer.upload(zgFile, ZG_RPC_URL, signer);

if (uploadError) {
  throw new Error(`Upload failed: ${uploadError}`);
}

// tx is an object with rootHash and txHash properties
console.log('Upload successful:', tx);

return new Response(
  JSON.stringify({ 
    success: true, 
    rootHash: tx.rootHash,
    txHash: tx.txHash 
  }),
  // ...
);
```

### Step 2: Add Enhanced Error Logging

Add more detailed logging to capture the exact point of failure:

```typescript
console.log('File size:', data.length, 'bytes');
console.log('Merkle root:', tree.rootHash());
console.log('Starting upload...');
```

### Step 3: Try Standard Indexer (Fallback)

If the turbo indexer continues to fail, try the standard indexer as a fallback:

```typescript
const ZG_INDEXER_RPC = "https://indexer-storage-testnet-standard.0g.ai";
// Note: docs show turbo as primary, but standard may have better compatibility
```

### Step 4: Add Retry Logic with Different Endpoints

Implement a retry mechanism that tries multiple indexer endpoints:

```typescript
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-testnet-turbo.0g.ai",
  "https://indexer-storage-testnet-standard.0g.ai"
];
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/zg-storage/index.ts` | Fix result handling, add logging, try alternative endpoints |

---

## Implementation Details

### Updated Edge Function (key changes):

```typescript
// 0G Testnet configuration
const ZG_RPC_URL = "https://evmrpc-testnet.0g.ai";

// Try turbo first, with standard as fallback
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-testnet-turbo.0g.ai",
  "https://indexer-storage-testnet-standard.0g.ai"
];

// In the POST handler:
console.log('Proof JSON size:', data.length, 'bytes');
console.log('Computed merkle root:', tree.rootHash());

// Try each indexer endpoint
let lastError = null;
for (const indexerRpc of INDEXER_ENDPOINTS) {
  try {
    console.log('Trying indexer:', indexerRpc);
    const indexer = new Indexer(indexerRpc);
    
    const [tx, uploadError] = await indexer.upload(zgFile, ZG_RPC_URL, signer);
    
    if (uploadError) {
      lastError = uploadError;
      console.log('Upload error on', indexerRpc, ':', uploadError);
      continue;
    }
    
    // SUCCESS - tx is an object with rootHash and txHash
    console.log('Upload successful via', indexerRpc);
    console.log('Root hash:', tx.rootHash);
    console.log('Tx hash:', tx.txHash);
    
    await zgFile.close();
    await Deno.remove(tempPath);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        rootHash: tx.rootHash,
        txHash: tx.txHash 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    lastError = e;
    console.log('Exception on', indexerRpc, ':', e);
  }
}

// All endpoints failed
throw new Error(`All indexer endpoints failed. Last error: ${lastError}`);
```

---

## Technical Notes

1. **Verified Configuration**: The RPC URL (`https://evmrpc-testnet.0g.ai`) and Flow contract (`0x22E03a6A89B950F1c82ec5e74F8eCa321a105296`) match the official 0G documentation

2. **Wallet Funding Confirmed**: The wallet `0x8F7C37036C175A54eb4F94413A2a5b905369e075` has ~25 A0GI, which is more than sufficient for storage operations

3. **SDK Version**: Using `@0glabs/0g-ts-sdk@0.3.3` (latest on npm, published 3 months ago)

4. **Storage Fee**: The SDK is calculating storage fees correctly (`30733644962n` wei ≈ 0.00003 A0GI per upload)

---

## Testing Plan

After implementation:

1. Deploy the updated edge function
2. Create a test receipt with minimal data
3. Verify the response contains valid `rootHash` and `txHash`
4. Check which indexer endpoint succeeded in the logs
5. Test downloading the proof using the returned `rootHash`

---

## Fallback Option

If 0G uploads continue to fail after all fixes, implement a fallback to local database storage so users can still use the app while we debug the 0G integration:

```typescript
// In ReceiptForm.tsx
try {
  const { rootHash, txHash } = await uploadProofToZG(proof);
  // Success with 0G
} catch (zgError) {
  console.warn('0G upload failed, falling back to local storage:', zgError);
  // Store proof in Supabase instead
  const { data } = await supabase.from('receipts').insert({
    proof_json: proof,
    created_at: timestamp
  }).select().single();
  // Use database ID as receipt reference
}
```

