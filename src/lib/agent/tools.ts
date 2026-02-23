import { tool } from 'ai';
import { z } from 'zod';
import { Dataset } from '@/types/marketplace';

const DESCRIPTIONS: Record<number, string> = {
  0: 'Resting State EEG - Eyes Open',
  1: 'Cognitive Task EEG - Working Memory',
  2: 'Sleep Stage N2 EEG Recording',
  3: 'Motor Imagery BCI - Left/Right Hand',
  4: 'Meditation EEG - Deep Alpha State',
};

async function fetchListings(): Promise<Dataset[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/marketplace/listings`);
  const data = await res.json();
  return data.datasets || [];
}

export const agentTools = {
  browseMarketplace: tool({
    description: 'Browse all available neural datasets on the marketplace. Returns a list of all active listings with their metadata, pricing, and consent terms.',
    inputSchema: z.object({}),
    execute: async () => {
      const datasets = await fetchListings();
      return datasets.map(ds => ({
        id: ds.id,
        description: DESCRIPTIONS[ds.id] || `Dataset #${ds.id}`,
        price: `${(Number(ds.price) / 1e18).toFixed(4)} tFIL`,
        priceWei: ds.price,
        channels: ds.channelCount,
        sampleRate: ds.sampleRate,
        duration: `${ds.durationSeconds} seconds`,
        durationSeconds: ds.durationSeconds,
        consent: {
          research: ds.consent.allowResearch,
          commercial: ds.consent.allowCommercial,
          aiTraining: ds.consent.allowAITraining,
        },
        cid: ds.cid,
      }));
    },
  }),

  evaluateDataset: tool({
    description: 'Get detailed evaluation metrics for a specific dataset. Returns quality score, value analysis, and compatibility assessment.',
    inputSchema: z.object({
      datasetId: z.number().describe('The ID of the dataset to evaluate'),
    }),
    execute: async ({ datasetId }) => {
      const datasets = await fetchListings();
      const ds = datasets.find(d => d.id === datasetId);
      if (!ds) return { error: 'Dataset not found' };

      const priceEth = Number(ds.price) / 1e18;
      const dataPoints = ds.channelCount * ds.sampleRate * ds.durationSeconds;
      const valueScore = dataPoints / (priceEth * 1e6);

      let qualityScore = 50;
      if (ds.channelCount >= 8) qualityScore += 15;
      if (ds.durationSeconds >= 60) qualityScore += 15;
      if (ds.sampleRate >= 256) qualityScore += 10;
      if (ds.consent.allowAITraining) qualityScore += 10;

      return {
        id: ds.id,
        description: DESCRIPTIONS[ds.id] || `Dataset #${ds.id}`,
        qualityScore,
        totalDataPoints: dataPoints.toLocaleString(),
        valueScore: valueScore.toFixed(2),
        pricePerSecond: `${(priceEth / ds.durationSeconds).toFixed(6)} tFIL`,
        recommendation: qualityScore >= 80 ? 'STRONG BUY' : qualityScore >= 60 ? 'CONSIDER' : 'PASS',
        aiTrainingCompatible: ds.consent.allowAITraining,
        details: {
          channels: ds.channelCount,
          sampleRate: ds.sampleRate,
          duration: ds.durationSeconds,
          consent: ds.consent,
        },
      };
    },
  }),

  purchaseDataset: tool({
    description: 'Purchase a dataset from the marketplace. Executes an on-chain transaction to acquire the dataset.',
    inputSchema: z.object({
      datasetId: z.number().describe('The ID of the dataset to purchase'),
      reason: z.string().describe('The reason for purchasing this dataset'),
    }),
    execute: async ({ datasetId, reason }) => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/marketplace/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId, buyerType: 'agent' }),
      });
      const data = await res.json();

      return {
        success: true,
        datasetId,
        reason,
        txHash: data.txHash,
        message: `Successfully purchased dataset #${datasetId}`,
      };
    },
  }),
};
