import { supabase } from "@/integrations/supabase/client";
import type { ProofJson } from "./hash";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Uploads a proof JSON to 0G Storage via edge function
 * Returns the root hash which serves as the receipt ID
 */
export async function uploadProofToZG(proof: ProofJson): Promise<{ rootHash: string; txHash: string }> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/zg-storage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
    },
    body: JSON.stringify({ proof }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload proof to 0G Storage');
  }

  return {
    rootHash: data.rootHash,
    txHash: data.txHash,
  };
}

/**
 * Fetches a proof JSON from 0G Storage via edge function
 */
export async function fetchProofFromZG(rootHash: string): Promise<ProofJson> {
  if (!rootHash || rootHash.startsWith(":")) {
    throw new Error("Invalid 0G Storage root hash.");
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/zg-storage?rootHash=${encodeURIComponent(rootHash)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch proof from 0G Storage');
  }

  return data.proof;
}
