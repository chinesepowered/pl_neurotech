'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dataset } from '@/types/marketplace';
import DatasetGrid from '@/components/marketplace/DatasetGrid';
import GlowButton from '@/components/ui/GlowButton';
import Link from 'next/link';

const DESCRIPTIONS: Record<number, string> = {
  0: 'Resting State EEG - Eyes Open',
  1: 'Cognitive Task EEG - Working Memory (Premium)',
  2: 'Sleep Stage N2 EEG Recording',
  3: 'Motor Imagery BCI - Budget Session',
  4: 'Meditation EEG - Deep Alpha State',
};

export default function MarketplacePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/listings')
      .then(r => r.json())
      .then(data => {
        setDatasets(data.datasets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Neural Data Marketplace</h1>
          <p className="text-gray-400">Browse and purchase verified EEG datasets stored on Filecoin.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/record">
            <GlowButton variant="cyan" size="sm">List Dataset</GlowButton>
          </Link>
          <Link href="/agent">
            <GlowButton variant="magenta" size="sm">Launch AI Agent</GlowButton>
          </Link>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4 mb-10"
      >
        {[
          { label: 'Total Datasets', value: datasets.length.toString() },
          { label: 'Total Channels', value: `${datasets.reduce((a, d) => a + d.channelCount, 0)}` },
          { label: 'Total Duration', value: `${datasets.reduce((a, d) => a + d.durationSeconds, 0)}s` },
          { label: 'AI-Trainable', value: datasets.filter(d => d.consent.allowAITraining).length.toString() },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="font-mono text-xl text-white">{stat.value}</div>
          </div>
        ))}
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-gray-500">Loading marketplace...</div>
        </div>
      ) : (
        <DatasetGrid datasets={datasets} descriptions={DESCRIPTIONS} />
      )}
    </div>
  );
}
