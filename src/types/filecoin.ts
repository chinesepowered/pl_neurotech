export interface StorageResult {
  cid: string;
  size: number;
  timestamp: number;
}

export interface RetrievalResult {
  data: ArrayBuffer;
  cid: string;
  size: number;
}

export interface ProvenanceEntry {
  action: 'created' | 'stored' | 'listed' | 'purchased' | 'delisted';
  txHash?: string;
  cid?: string;
  timestamp: number;
  actor: string;
  details?: string;
}
