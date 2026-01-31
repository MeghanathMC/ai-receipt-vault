import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ZgFile, Indexer } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 0G Galileo Testnet configuration
const ZG_RPC_URL = "https://evmrpc-testnet.0g.ai";
const ZG_INDEXER_RPC = "https://indexer-storage-testnet-turbo.0g.ai";

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
    
    // Initialize 0G indexer
    const indexer = new Indexer(ZG_INDEXER_RPC);

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

      const rootHash = tree!.rootHash();
      console.log('Root hash:', rootHash);

      // Upload to 0G Storage
      // In SDK v0.3.3, the return is [result, error] where result contains txHash
      const [uploadResult, uploadError] = await indexer.upload(zgFile, ZG_RPC_URL, signer as any);
      
      // Clean up temp file
      await zgFile.close();
      await Deno.remove(tempPath);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError}`);
      }

      // In SDK v0.3.3, uploadResult is the transaction hash string
      const txHash = typeof uploadResult === 'string' ? uploadResult : uploadResult?.toString();
      console.log('Upload successful, tx:', txHash, 'rootHash:', rootHash);

      return new Response(
        JSON.stringify({ 
          success: true, 
          rootHash: rootHash,
          txHash: txHash 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } else if (req.method === 'GET') {
      // Download proof from 0G Storage
      const url = new URL(req.url);
      const rootHash = url.searchParams.get('rootHash');

      if (!rootHash) {
        throw new Error('rootHash parameter is required');
      }

      console.log('Downloading proof from 0G Storage:', rootHash);

      // Download file from 0G Storage
      const tempDownloadPath = `/tmp/download_${Date.now()}.json`;
      const downloadError = await indexer.download(rootHash, tempDownloadPath, true);

      if (downloadError) {
        throw new Error(`Download failed: ${downloadError}`);
      }

      // Read the downloaded file
      const fileContent = await Deno.readTextFile(tempDownloadPath);
      await Deno.remove(tempDownloadPath);

      const proof = JSON.parse(fileContent) as ProofJson;

      return new Response(
        JSON.stringify({ success: true, proof }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

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
