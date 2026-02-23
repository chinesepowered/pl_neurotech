export interface ConsentTerms {
  allowResearch: boolean;
  allowCommercial: boolean;
  allowAITraining: boolean;
  expiresAt: number;
}

export interface Dataset {
  id: number;
  owner: string;
  cid: string;
  metadataUri: string;
  price: string; // in wei
  channelCount: number;
  sampleRate: number;
  durationSeconds: number;
  consent: ConsentTerms;
  active: boolean;
  createdAt: number;
}

export interface Purchase {
  datasetId: number;
  buyer: string;
  price: string;
  purchasedAt: number;
  buyerType: 'human' | 'agent';
}

export interface ListingFormData {
  cid: string;
  metadataUri: string;
  price: string;
  channelCount: number;
  sampleRate: number;
  durationSeconds: number;
  consent: ConsentTerms;
}
