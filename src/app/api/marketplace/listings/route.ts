import { NextResponse } from 'next/server';
import { getContract, parseDataset } from '@/lib/filecoin/contracts';
import { MARKETPLACE_ADDRESS } from '@/lib/filecoin/config';
import { Dataset } from '@/types/marketplace';

// Demo datasets used when contract isn't deployed
const DEMO_DATASETS: Dataset[] = [
  {
    id: 0, owner: '0xDemo1...', cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadataUri: '', price: '5000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 30,
    consent: { allowResearch: true, allowCommercial: false, allowAITraining: true, expiresAt: 1761350400 },
    active: true, createdAt: Date.now() / 1000 - 86400,
  },
  {
    id: 1, owner: '0xDemo2...', cid: 'bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i',
    metadataUri: '', price: '10000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 60,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1761350400 },
    active: true, createdAt: Date.now() / 1000 - 43200,
  },
  {
    id: 2, owner: '0xDemo3...', cid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636',
    metadataUri: '', price: '8000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 45,
    consent: { allowResearch: true, allowCommercial: false, allowAITraining: false, expiresAt: 1761350400 },
    active: true, createdAt: Date.now() / 1000 - 21600,
  },
  {
    id: 3, owner: '0xDemo4...', cid: 'bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm',
    metadataUri: '', price: '15000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 120,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1761350400 },
    active: true, createdAt: Date.now() / 1000 - 7200,
  },
  {
    id: 4, owner: '0xDemo5...', cid: 'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
    metadataUri: '', price: '20000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 90,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1761350400 },
    active: true, createdAt: Date.now() / 1000 - 3600,
  },
];


export async function GET() {
  try {
    if (!MARKETPLACE_ADDRESS) {
      return NextResponse.json({ datasets: DEMO_DATASETS, demo: true });
    }

    const contract = getContract();
    const raw = await contract.getActiveListings();
    const datasets = raw.map(parseDataset);

    return NextResponse.json({ datasets, demo: false });
  } catch (error) {
    console.error('Listings error:', error);
    return NextResponse.json({ datasets: DEMO_DATASETS, demo: true });
  }
}
