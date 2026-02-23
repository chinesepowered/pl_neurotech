'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Dataset } from '@/types/marketplace';
import ConsentBadge from './ConsentBadge';
import PricingDisplay from './PricingDisplay';

interface DatasetCardProps {
  dataset: Dataset;
  description?: string;
  index?: number;
}

export default function DatasetCard({ dataset, description, index = 0 }: DatasetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={`/marketplace/${dataset.id}`}>
        <div className="group bg-bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300 cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors truncate">
                {description || `Dataset #${dataset.id}`}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-1 truncate">{dataset.cid}</p>
            </div>
            <PricingDisplay priceWei={dataset.price} size="sm" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Channels</div>
              <div className="font-mono text-sm text-white">{dataset.channelCount}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Rate</div>
              <div className="font-mono text-sm text-white">{dataset.sampleRate}Hz</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Duration</div>
              <div className="font-mono text-sm text-white">{dataset.durationSeconds}s</div>
            </div>
          </div>

          {/* Consent badges */}
          <div className="flex flex-wrap gap-2">
            <ConsentBadge type="research" allowed={dataset.consent.allowResearch} />
            <ConsentBadge type="commercial" allowed={dataset.consent.allowCommercial} />
            <ConsentBadge type="ai" allowed={dataset.consent.allowAITraining} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
