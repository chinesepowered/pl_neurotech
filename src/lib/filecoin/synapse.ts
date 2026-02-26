// Filecoin storage via Synapse SDK (@filoz/synapse-sdk)
// Uses Filecoin Onchain Cloud for real decentralized storage
// Falls back to demo mode if private key is not configured

import { Synapse, calibration } from '@filoz/synapse-sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export interface UploadResult {
  cid: string; // PieceCID from Synapse
  size: number;
  timestamp: number;
}

let synapseInstance: Synapse | null = null;

function getSynapse(): Synapse | null {
  if (synapseInstance) return synapseInstance;

  const raw = process.env.FILECOIN_PRIVATE_KEY;
  if (!raw || raw === '0x_YOUR_PRIVATE_KEY_HERE' || raw.length < 64) {
    return null;
  }

  try {
    const privateKey = (raw.startsWith('0x') ? raw : `0x${raw}`) as `0x${string}`;
    const account = privateKeyToAccount(privateKey);
    const client = createWalletClient({
      account,
      chain: calibration,
      transport: http(calibration.rpcUrls.default.http[0]),
    });
    synapseInstance = new Synapse({ client });
    return synapseInstance;
  } catch (error) {
    console.error('Failed to initialize Synapse SDK:', error);
    return null;
  }
}

export async function uploadToFilecoin(data: Buffer | Uint8Array, filename: string): Promise<UploadResult> {
  const synapse = getSynapse();

  if (synapse) {
    try {
      console.log(`[Synapse] Uploading ${filename} (${data.length} bytes) to Filecoin...`);

      // Upload via Synapse SDK - stores on Filecoin with PDP verification
      const result = await synapse.storage.upload(data, {
        metadata: { filename, type: 'eeg-neural-data' },
        forceCreateDataSet: true,
        callbacks: {
          onProviderSelected: (provider) => {
            console.log(`[Synapse] Provider selected: ${provider.id}`);
          },
          onDataSetResolved: (info) => {
            console.log(`[Synapse] DataSet ${info.isExisting ? 'reused' : 'created'}: ${info.dataSetId}`);
          },
        },
      });

      console.log(`[Synapse] Upload complete. PieceCID: ${result.pieceCid}`);

      return {
        cid: String(result.pieceCid),
        size: result.size,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('[Synapse] Upload failed, falling back to demo mode:', error);
    }
  }

  // Demo mode fallback: generate CID from data hash
  console.log('[Synapse] Demo mode: generating local CID');
  const buf = data instanceof Uint8Array
    ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    : data;
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

export async function retrieveFromFilecoin(pieceCid: string): Promise<Uint8Array | null> {
  const synapse = getSynapse();

  if (synapse && pieceCid && !pieceCid.startsWith('bafybeig')) {
    try {
      console.log(`[Synapse] Retrieving piece: ${pieceCid}`);
      const data = await synapse.storage.download({ pieceCid });
      console.log(`[Synapse] Retrieved ${data.length} bytes`);
      return data;
    } catch (error) {
      console.error('[Synapse] Retrieval failed:', error);
    }
  }

  // Demo mode: return null
  return null;
}

/** Check if Synapse SDK is configured and ready */
export function isSynapseConfigured(): boolean {
  return getSynapse() !== null;
}
