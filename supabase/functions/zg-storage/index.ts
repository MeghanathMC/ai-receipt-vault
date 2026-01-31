import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ZgFile, Indexer } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 0G Mainnet configuration (v2)
const ZG_RPC_URL = "https://evmrpc.0g.ai";

// Try turbo first, with standard as fallback
const INDEXER_ENDPOINTS = [
  "https://indexer-storage-turbo.0g.ai",
  "https://indexer-storage.0g.ai"
];

interface ProofJson {
  version: string;
  receipt_hash: string;
  model: string;
  timestamp: string;
  prompt_hash: string;
  output_hash: string;
}

interface FileLocation {
  url: string;
  start: number;
  end: number;
}

// Custom download function that uses HTTP fetch instead of filesystem
async function downloadFromStorageNodes(rootHash: string): Promise<string> {
  // First, get file locations from indexer
  let fileLocations: FileLocation[] = [];
  let lastError: Error | null = null;

  for (const indexerRpc of INDEXER_ENDPOINTS) {
    try {
      console.log('Getting file locations from:', indexerRpc);
      
      // Get file locations via JSON-RPC
      const locationsResponse = await fetch(indexerRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'indexer_getFileLocations',
          params: [rootHash],
          id: Date.now()
        })
      });

      if (!locationsResponse.ok) {
        throw new Error(`HTTP ${locationsResponse.status}: ${await locationsResponse.text()}`);
      }

      const locationsData = await locationsResponse.json();
      
      if (locationsData.error) {
        throw new Error(locationsData.error.message || JSON.stringify(locationsData.error));
      }

      if (!locationsData.result || locationsData.result.length === 0) {
        throw new Error('No storage nodes found for this file');
      }

      fileLocations = locationsData.result;
      console.log('Found', fileLocations.length, 'storage nodes');
      break;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.log('Indexer error on', indexerRpc, ':', lastError.message);
    }
  }

  if (fileLocations.length === 0) {
    throw lastError || new Error('Failed to get file locations');
  }

  // Try to download from storage nodes using JSON-RPC
  for (const location of fileLocations) {
    try {
      const nodeUrl = location.url;
      console.log('Downloading from storage node:', nodeUrl);

      // Use zgs_downloadSegmentWithProof to get the data
      // For small files (< 256KB), we only need segment 0
      const segmentResponse = await fetch(nodeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'zgs_downloadSegmentWithProof',
          params: [rootHash, 0],
          id: Date.now()
        })
      });

      if (!segmentResponse.ok) {
        throw new Error(`Segment HTTP ${segmentResponse.status}`);
      }

      const segmentData = await segmentResponse.json();
      
      if (segmentData.error) {
        console.log('zgs_downloadSegmentWithProof error:', segmentData.error.message);
        throw new Error(segmentData.error.message);
      }

      if (segmentData.result && segmentData.result.data) {
        // Data is base64 encoded
        const base64Data = segmentData.result.data;
        const binaryString = atob(base64Data);
        
        // Find the actual JSON content (it might be padded)
        // Look for the JSON structure
        let content = '';
        for (let i = 0; i < binaryString.length; i++) {
          const char = binaryString[i];
          if (char.charCodeAt(0) === 0) break; // Stop at null bytes
          content += char;
        }
        
        // Try to parse as JSON to verify
        JSON.parse(content); // This will throw if invalid
        console.log('Download successful from', nodeUrl, '- content length:', content.length);
        return content;
      }

      throw new Error('No data in segment response');
    } catch (e) {
      console.log('Storage node download error:', e);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  // Fallback: try zgs_getFileInfo to get more details
  for (const location of fileLocations) {
    try {
      const nodeUrl = location.url;
      console.log('Trying getFileInfoByTxSeq from:', nodeUrl);

      // First get file info
      const fileInfoResponse = await fetch(nodeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'zgs_getFileInfo',
          params: [rootHash],
          id: Date.now()
        })
      });

      if (!fileInfoResponse.ok) {
        throw new Error(`FileInfo HTTP ${fileInfoResponse.status}`);
      }

      const fileInfo = await fileInfoResponse.json();
      if (fileInfo.error) {
        throw new Error(fileInfo.error.message);
      }

      console.log('File info:', JSON.stringify(fileInfo.result));
      
      if (fileInfo.result && fileInfo.result.tx) {
        const fileSize = fileInfo.result.tx.size;
        console.log('File size from info:', fileSize);
        
        // Try downloading with size info
        const chunkResponse = await fetch(nodeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'zgs_downloadSegment',
            params: [rootHash, 0, 1],
            id: Date.now()
          })
        });

        if (!chunkResponse.ok) {
          throw new Error(`Chunk HTTP ${chunkResponse.status}`);
        }

        const chunkData = await chunkResponse.json();
        if (chunkData.error) {
          throw new Error(chunkData.error.message);
        }

        if (chunkData.result) {
          const base64Data = chunkData.result;
          const binaryString = atob(base64Data);
          
          // Trim to file size and decode
          const trimmed = binaryString.substring(0, fileSize);
          console.log('Chunk download successful, trimmed content length:', trimmed.length);
          return trimmed;
        }
      }

      throw new Error('Could not get file data');
    } catch (e) {
      console.log('Fallback download error:', e);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  throw lastError || new Error('Failed to download from all storage nodes');
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
      // Download proof from 0G Storage using custom HTTP-based download
      const url = new URL(req.url);
      const rootHash = url.searchParams.get('rootHash');

      if (!rootHash) {
        throw new Error('rootHash parameter is required');
      }

      console.log('Downloading proof from 0G Storage:', rootHash);

      // Use custom download function that works without filesystem
      const fileContent = await downloadFromStorageNodes(rootHash);
      const proof = JSON.parse(fileContent) as ProofJson;
      
      console.log('Download successful, proof receipt_hash:', proof.receipt_hash);

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
