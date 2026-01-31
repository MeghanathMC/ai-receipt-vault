import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ZgFile, Indexer } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 0G Galileo Testnet configuration
const ZG_RPC_URL = "https://evmrpc-testnet.0g.ai";

// Try turbo first, with standard as fallback
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-testnet-turbo.0g.ai",
  "https://indexer-storage-testnet-standard.0g.ai"
];

interface ProofJson {
  version: string;
  receipt_hash: string;
  model: string;
  timestamp: string;
  prompt_hash: string;
  output_hash: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const privateKey = Deno.env.get('ZG_PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('ZG_PRIVATE_KEY is not configured');
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(ZG_RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    
    // Log wallet info for debugging
    const walletAddress = await signer.getAddress();
    const balance = await provider.getBalance(walletAddress);
    console.log('Wallet address:', walletAddress);
    console.log('Wallet balance (wei):', balance.toString());
    console.log('Wallet balance (A0GI):', ethers.formatEther(balance));

    if (req.method === 'POST') {
      // Upload proof to 0G Storage
      const body = await req.json() as { proof: ProofJson };
      const proofJson = body.proof;

      if (!proofJson || !proofJson.receipt_hash) {
        throw new Error('Invalid proof JSON');
      }

      console.log('Uploading proof to 0G Storage:', proofJson.receipt_hash);

      // Convert JSON to blob/file
      const jsonString = JSON.stringify(proofJson);
      const encoder = new TextEncoder();
      const data = encoder.encode(jsonString);
      
      console.log('Proof JSON size:', data.length, 'bytes');
      
      // Create a temporary file for upload
      const tempPath = `/tmp/proof_${Date.now()}.json`;
      await Deno.writeFile(tempPath, data);
      
      // Create ZgFile from the temp file
      const zgFile = await ZgFile.fromFilePath(tempPath);
      const [tree, merkleError] = await zgFile.merkleTree();
      if (merkleError) {
        await Deno.remove(tempPath);
        throw new Error(`Failed to create merkle tree: ${merkleError}`);
      }

      console.log('Computed merkle root:', tree!.rootHash());
      console.log('Starting upload with indexer fallback...');

      // Try each indexer endpoint
      let lastError: unknown = null;
      for (const indexerRpc of INDEXER_ENDPOINTS) {
        try {
          console.log('Trying indexer:', indexerRpc);
          const indexer = new Indexer(indexerRpc);
          
          // Upload to 0G Storage - tx is an object with rootHash and txHash
          const [tx, uploadError] = await indexer.upload(zgFile, ZG_RPC_URL, signer as any);
          
          if (uploadError) {
            lastError = uploadError;
            console.log('Upload error on', indexerRpc, ':', uploadError);
            continue;
          }

          // SUCCESS - tx is an object with rootHash and txHash properties
          console.log('Upload successful via', indexerRpc);
          console.log('Root hash:', tx.rootHash);
          console.log('Tx hash:', tx.txHash);
          
          // Clean up temp file
          await zgFile.close();
          await Deno.remove(tempPath);

          return new Response(
            JSON.stringify({ 
              success: true, 
              rootHash: tx.rootHash,
              txHash: tx.txHash 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        } catch (e) {
          lastError = e;
          console.log('Exception on', indexerRpc, ':', e);
          console.log('Error stack:', e instanceof Error ? e.stack : 'No stack');
        }
      }

      // Clean up temp file on failure
      try {
        await zgFile.close();
        await Deno.remove(tempPath);
      } catch (cleanupErr) {
        console.log('Cleanup error:', cleanupErr);
      }

      // All endpoints failed
      const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`All indexer endpoints failed. Last error: ${errorMessage}`);

    } else if (req.method === 'GET') {
      // Download proof from 0G Storage
      const url = new URL(req.url);
      const rootHash = url.searchParams.get('rootHash');

      if (!rootHash) {
        throw new Error('rootHash parameter is required');
      }

      console.log('Downloading proof from 0G Storage:', rootHash);

      // Try each indexer endpoint for download
      let lastError: unknown = null;
      for (const indexerRpc of INDEXER_ENDPOINTS) {
        try {
          console.log('Trying download from:', indexerRpc);
          const indexer = new Indexer(indexerRpc);
          
          const tempDownloadPath = `/tmp/download_${Date.now()}.json`;
          const downloadError = await indexer.download(rootHash, tempDownloadPath, true);

          if (downloadError) {
            lastError = downloadError;
            console.log('Download error on', indexerRpc, ':', downloadError);
            continue;
          }

          // Read the downloaded file
          const fileContent = await Deno.readTextFile(tempDownloadPath);
          await Deno.remove(tempDownloadPath);

          const proof = JSON.parse(fileContent) as ProofJson;
          console.log('Download successful via', indexerRpc);

          return new Response(
            JSON.stringify({ success: true, proof }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        } catch (e) {
          lastError = e;
          console.log('Download exception on', indexerRpc, ':', e);
        }
      }

      const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`All indexer endpoints failed for download. Last error: ${errorMessage}`);

    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }

  } catch (error: unknown) {
    console.error('0G Storage error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
