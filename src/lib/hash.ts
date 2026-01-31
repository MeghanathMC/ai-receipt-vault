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
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Truncates a hash for display, showing first and last 8 characters
 */
export function truncateHash(hash: string): string {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}
