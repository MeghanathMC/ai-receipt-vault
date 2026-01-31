

# Switch to 0G Mainnet - Implementation Plan

## Summary

The 0G Testnet indexer nodes are currently experiencing 503 Service Unavailable errors. Since 0G is recommending to use mainnet, we'll update the edge function to use 0G mainnet endpoints instead.

## Changes Required

Update the network configuration in `supabase/functions/zg-storage/index.ts`:

| Setting | Current (Testnet) | New (Mainnet) |
|---------|-------------------|---------------|
| RPC URL | `https://evmrpc-testnet.0g.ai` | `https://evmrpc.0g.ai` |
| Indexer (turbo) | `https://indexer-storage-testnet-turbo.0g.ai` | `https://indexer-storage-turbo.0g.ai` |
| Indexer (standard) | `https://indexer-storage-testnet-standard.0g.ai` | `https://indexer-storage.0g.ai` |

## Code Changes

```typescript
// BEFORE: 0G Galileo Testnet configuration
const ZG_RPC_URL = "https://evmrpc-testnet.0g.ai";
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-testnet-turbo.0g.ai",
  "https://indexer-storage-testnet-standard.0g.ai"
];

// AFTER: 0G Mainnet configuration
const ZG_RPC_URL = "https://evmrpc.0g.ai";
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-turbo.0g.ai",
  "https://indexer-storage.0g.ai"
];
```

## Important Note

**Wallet Funding**: Your existing wallet (`0x8F7C37036C175A54eb4F94413A2a5b905369e075`) that has testnet A0GI tokens will need **mainnet A0GI tokens** to pay for storage fees. 

Mainnet tokens are real tokens with actual value, so you'll need to:
1. Acquire mainnet A0GI tokens (via exchange or bridge)
2. Send them to your wallet address

The storage fee is approximately 0.00003 A0GI per upload, so even a small amount will cover many operations.

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/zg-storage/index.ts` | Update RPC and indexer URLs to mainnet |

## Testing Plan

After implementation:
1. Verify wallet has mainnet A0GI tokens
2. Create a test receipt
3. Confirm successful upload with valid `rootHash` and `txHash`
4. Test downloading the proof using the returned `rootHash`

