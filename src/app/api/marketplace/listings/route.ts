import { NextResponse } from 'next/server';
import { getContract, parseDataset } from '@/lib/filecoin/contracts';
import { MARKETPLACE_ADDRESS } from '@/lib/filecoin/config';
import { Dataset } from '@/types/marketplace';

// Demo datasets with varied specs for interesting agent evaluation
const DEMO_DATASETS: Dataset[] = [
  {
    // High quality, good price, full consent — agent should love this
    id: 0, owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadataUri: '', price: '8000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 120,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1793000000 },
    active: true, createdAt: Date.now() / 1000 - 86400,
  },
  {
    // Premium: 16-channel, 512Hz, expensive — high quality but costly
    id: 1, owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    cid: 'bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i',
    metadataUri: '', price: '35000000000000000', channelCount: 16, sampleRate: 512, durationSeconds: 180,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1793000000 },
    active: true, createdAt: Date.now() / 1000 - 43200,
  },
  {
    // Trap: cheap but NO AI training consent — agent must reject
    id: 2, owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    cid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636',
    metadataUri: '', price: '3000000000000000', channelCount: 8, sampleRate: 256, durationSeconds: 60,
    consent: { allowResearch: true, allowCommercial: false, allowAITraining: false, expiresAt: 1793000000 },
    active: true, createdAt: Date.now() / 1000 - 21600,
  },
  {
    // Budget option: low channel count (4ch), short, but cheap and AI-allowed
    id: 3, owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    cid: 'bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm',
    metadataUri: '', price: '5000000000000000', channelCount: 4, sampleRate: 128, durationSeconds: 45,
    consent: { allowResearch: true, allowCommercial: false, allowAITraining: true, expiresAt: 1793000000 },
    active: true, createdAt: Date.now() / 1000 - 7200,
  },
  {
    // Overpriced: mediocre specs with high price — agent should pass
    id: 4, owner: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    cid: 'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
    metadataUri: '', price: '25000000000000000', channelCount: 4, sampleRate: 128, durationSeconds: 30,
    consent: { allowResearch: true, allowCommercial: true, allowAITraining: true, expiresAt: 1793000000 },
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
