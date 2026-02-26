import { tool } from 'ai';
import { z } from 'zod';
import { Dataset } from '@/types/marketplace';

const DESCRIPTIONS: Record<number, string> = {
  0: 'Resting State EEG - Eyes Open (8ch/256Hz/120s)',
  1: 'Cognitive Task EEG - Working Memory (16ch/512Hz/180s)',
  2: 'Sleep Stage N2 EEG Recording (NO AI Training)',
  3: 'Motor Imagery BCI - Budget (4ch/128Hz/45s)',
  4: 'Meditation EEG - Overpriced (4ch/128Hz/30s)',
};

// Track spending across tool calls within a session
let sessionSpent = 0;
let sessionBudget = 0;

export function resetAgentSession(budget: number) {
  sessionSpent = 0;
  sessionBudget = budget;
}

async function fetchListings(): Promise<Dataset[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/marketplace/listings`);
  if (!res.ok) {
    throw new Error(`Failed to fetch listings: HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.datasets || [];
}

export const agentTools = {
  browseMarketplace: tool({
    description: 'Browse all available neural datasets on the marketplace. Returns a list of all active listings with their metadata, pricing, and consent terms.',
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const datasets = await fetchListings();
        return {
          datasets: datasets.map(ds => ({
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
          })),
          budgetRemaining: `${(sessionBudget - sessionSpent).toFixed(4)} tFIL`,
          totalSpent: `${sessionSpent.toFixed(4)} tFIL`,
        };
      } catch (error) {
        return { error: `Failed to browse marketplace: ${error}` };
      }
    },
  }),

  evaluateDataset: tool({
    description: 'Get detailed evaluation metrics for a specific dataset. Returns quality score, value analysis, and compatibility assessment for AI training.',
    inputSchema: z.object({
      datasetId: z.number().describe('The ID of the dataset to evaluate'),
    }),
    execute: async ({ datasetId }) => {
      try {
        const datasets = await fetchListings();
        const ds = datasets.find(d => d.id === datasetId);
        if (!ds) return { error: `Dataset #${datasetId} not found` };

        const priceEth = Number(ds.price) / 1e18;
        const dataPoints = ds.channelCount * ds.sampleRate * ds.durationSeconds;
        const valueScore = dataPoints / (priceEth * 1e6);

        let qualityScore = 50;
        if (ds.channelCount >= 8) qualityScore += 10;
        if (ds.channelCount >= 16) qualityScore += 10;
        if (ds.durationSeconds >= 60) qualityScore += 10;
        if (ds.durationSeconds >= 120) qualityScore += 5;
        if (ds.sampleRate >= 256) qualityScore += 5;
        if (ds.sampleRate >= 512) qualityScore += 5;
        if (ds.consent.allowAITraining) qualityScore += 10;
        if (ds.consent.allowResearch) qualityScore += 5;

        const withinBudget = priceEth <= (sessionBudget - sessionSpent);

        return {
          id: ds.id,
          description: DESCRIPTIONS[ds.id] || `Dataset #${ds.id}`,
          qualityScore,
          totalDataPoints: dataPoints.toLocaleString(),
          valueScore: valueScore.toFixed(2),
          pricePerSecond: `${(priceEth / ds.durationSeconds).toFixed(6)} tFIL`,
          price: `${priceEth.toFixed(4)} tFIL`,
          recommendation: !ds.consent.allowAITraining ? 'REJECT - No AI training consent'
            : !withinBudget ? 'REJECT - Over budget'
            : qualityScore >= 80 ? 'STRONG BUY'
            : qualityScore >= 65 ? 'CONSIDER'
            : 'PASS - Low quality',
          aiTrainingCompatible: ds.consent.allowAITraining,
          withinBudget,
          budgetRemaining: `${(sessionBudget - sessionSpent).toFixed(4)} tFIL`,
          details: {
            channels: ds.channelCount,
            sampleRate: ds.sampleRate,
            duration: ds.durationSeconds,
            consent: ds.consent,
          },
        };
      } catch (error) {
        return { error: `Failed to evaluate dataset: ${error}` };
      }
    },
  }),

  purchaseDataset: tool({
    description: 'Purchase a dataset from the marketplace. Executes an on-chain transaction to acquire the dataset. Check budget before purchasing.',
    inputSchema: z.object({
      datasetId: z.number().describe('The ID of the dataset to purchase'),
      reason: z.string().describe('The reason for purchasing this dataset'),
    }),
    execute: async ({ datasetId, reason }) => {
      try {
        // Check budget first
        const datasets = await fetchListings();
        const ds = datasets.find(d => d.id === datasetId);
        if (!ds) return { success: false, error: `Dataset #${datasetId} not found` };

        const priceEth = Number(ds.price) / 1e18;
        if (priceEth > (sessionBudget - sessionSpent)) {
          return {
            success: false,
            error: `Insufficient budget. Price: ${priceEth.toFixed(4)} tFIL, Remaining: ${(sessionBudget - sessionSpent).toFixed(4)} tFIL`,
          };
        }

        if (!ds.consent.allowAITraining) {
          return {
            success: false,
            error: 'Dataset does not allow AI training use. Purchase rejected to respect consent terms.',
          };
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/marketplace/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datasetId, buyerType: 'agent' }),
        });

        if (!res.ok) {
          return { success: false, error: `Purchase API error: HTTP ${res.status}` };
        }

        const data = await res.json();
        if (data.error) {
          return { success: false, error: data.error };
        }

        // Track spending
        sessionSpent += priceEth;

        return {
          success: true,
          datasetId,
          reason,
          txHash: data.txHash,
          price: `${priceEth.toFixed(4)} tFIL`,
          demo: data.demo || false,
          message: `Successfully purchased dataset #${datasetId}`,
          budgetRemaining: `${(sessionBudget - sessionSpent).toFixed(4)} tFIL`,
          totalSpent: `${sessionSpent.toFixed(4)} tFIL`,
        };
      } catch (error) {
        return { success: false, error: `Purchase failed: ${error}` };
      }
    },
  }),
};
