'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dataset } from '@/types/marketplace';
import { ProvenanceEntry } from '@/types/filecoin';
import ConsentBadge from '@/components/marketplace/ConsentBadge';
import PricingDisplay from '@/components/marketplace/PricingDisplay';
import ProvenanceChain from '@/components/storage/ProvenanceChain';
import CIDDisplay from '@/components/storage/CIDDisplay';
import GlowButton from '@/components/ui/GlowButton';
import GlassPanel from '@/components/ui/GlassPanel';

const DESCRIPTIONS: Record<number, string> = {
  0: 'Resting State EEG - Eyes Open',
  1: 'Cognitive Task EEG - Working Memory',
  2: 'Sleep Stage N2 EEG Recording',
  3: 'Motor Imagery BCI - Left/Right Hand',
  4: 'Meditation EEG - Deep Alpha State',
};

export default function DatasetDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    fetch('/api/marketplace/listings')
      .then(r => r.json())
      .then(data => {
        const ds = (data.datasets as Dataset[]).find(d => d.id === id);
        if (ds) setDataset(ds);
      });
  }, [id]);

  const handlePurchase = async () => {
    if (!dataset) return;
    setPurchasing(true);
    try {
      const res = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: dataset.id, buyerType: 'human' }),
      });
      const data = await res.json();
      setTxHash(data.txHash);
      setPurchased(true);

      // Confetti!
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#00ffff', '#ff00ff', '#39ff14'] });
    } finally {
      setPurchasing(false);
    }
  };

  if (!dataset) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-gray-500">Loading dataset...</div>
        </div>
      </div>
    );
  }

  const provenance: ProvenanceEntry[] = [
    { action: 'created', timestamp: dataset.createdAt * 1000, actor: dataset.owner, details: `${dataset.channelCount}-channel EEG, ${dataset.durationSeconds}s` },
    { action: 'stored', timestamp: dataset.createdAt * 1000 + 1000, actor: 'Filecoin Network', cid: dataset.cid, details: 'Pinned via Synapse SDK' },
    { action: 'listed', timestamp: dataset.createdAt * 1000 + 2000, actor: dataset.owner, details: `Price: ${(Number(dataset.price) / 1e18).toFixed(4)} tFIL` },
    ...(purchased ? [{ action: 'purchased' as const, timestamp: Date.now(), actor: 'You', txHash, details: 'Manual purchase' }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <a href="/marketplace" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4 inline-block">&larr; Back to Marketplace</a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel>
              <h1 className="text-2xl font-bold mb-2">{DESCRIPTIONS[id] || `Dataset #${id}`}</h1>
              <p className="text-sm text-gray-500 font-mono mb-6">{dataset.owner}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Channels', value: dataset.channelCount.toString(), color: 'text-neon-cyan' },
                  { label: 'Sample Rate', value: `${dataset.sampleRate}Hz`, color: 'text-neon-green' },
                  { label: 'Duration', value: `${dataset.durationSeconds}s`, color: 'text-neon-magenta' },
                  { label: 'Data Points', value: (dataset.channelCount * dataset.sampleRate * dataset.durationSeconds).toLocaleString(), color: 'text-neon-amber' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                    <div className={`font-mono text-lg font-bold ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Consent Terms</h3>
              <div className="flex flex-wrap gap-3">
                <ConsentBadge type="research" allowed={dataset.consent.allowResearch} />
                <ConsentBadge type="commercial" allowed={dataset.consent.allowCommercial} />
                <ConsentBadge type="ai" allowed={dataset.consent.allowAITraining} />
              </div>
            </GlassPanel>

            <CIDDisplay cid={dataset.cid} />

            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Provenance Chain</h3>
              <ProvenanceChain entries={provenance} />
            </GlassPanel>
          </div>

          {/* Purchase sidebar */}
          <div className="space-y-6">
            <GlassPanel>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">Price</div>
                <PricingDisplay priceWei={dataset.price} size="lg" />
              </div>
              <div className="mt-6">
                {purchased ? (
                  <div className="text-center">
                    <div className="text-neon-green font-semibold mb-2">Purchased!</div>
                    <div className="font-mono text-xs text-gray-500 break-all">{txHash}</div>
                  </div>
                ) : (
                  <GlowButton variant="cyan" className="w-full" onClick={handlePurchase} disabled={purchasing}>
                    {purchasing ? 'Processing...' : 'Purchase Dataset'}
                  </GlowButton>
                )}
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Dataset Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-mono">#{dataset.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-neon-green">Active</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Listed</span><span>{new Date(dataset.createdAt * 1000).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Consent Expires</span><span>{new Date(dataset.consent.expiresAt * 1000).toLocaleDateString()}</span></div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
