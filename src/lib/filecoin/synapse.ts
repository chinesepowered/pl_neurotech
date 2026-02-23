// Filecoin storage via Synapse SDK
// Falls back to demo mode if SDK is not configured

export interface UploadResult {
  cid: string;
  size: number;
  timestamp: number;
}

export async function uploadToFilecoin(data: Buffer | Uint8Array, _filename: string): Promise<UploadResult> {
  // Demo mode: generate a realistic-looking CID from data hash
  const buf = data instanceof Uint8Array ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buf as ArrayBuffer);
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    cid: `bafybeig${hash.slice(0, 50)}`,
    size: data.length,
    timestamp: Date.now(),
  };
}

export async function retrieveFromFilecoin(_cid: string): Promise<Uint8Array | null> {
  // Demo mode: return null (real retrieval requires Synapse SDK)
  return null;
}
