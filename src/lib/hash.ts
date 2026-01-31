/**
 * Computes SHA-256 hash of a string using Web Crypto API
 */
export async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Computes SHA-256 hash of the canonical string for a receipt
 * Format: prompt|model|output|timestamp
 */
export async function computeReceiptHash(
  prompt: string,
  model: string,
  output: string,
  timestamp: string
): Promise<string> {
  const canonicalString = `${prompt}|${model}|${output}|${timestamp}`;
  return computeSHA256(canonicalString);
}

/**
 * Truncates a hash for display, showing first and last 8 characters
 */
export function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}

/**
 * Proof JSON schema for 0G Storage
 */
export interface ProofJson {
  version: string;
  receipt_hash: string;
  model: string;
  timestamp: string;
  prompt_hash: string;
  output_hash: string;
}

/**
 * Builds a proof JSON object for 0G Storage
 */
export async function buildProofJson(
  prompt: string,
  model: string,
  output: string,
  timestamp: string
): Promise<ProofJson> {
  const [receipt_hash, prompt_hash, output_hash] = await Promise.all([
    computeReceiptHash(prompt, model, output, timestamp),
    computeSHA256(prompt),
    computeSHA256(output),
  ]);

  return {
    version: "1.0",
    receipt_hash,
    model,
    timestamp,
    prompt_hash,
    output_hash,
  };
}
