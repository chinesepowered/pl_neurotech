'use client';

import { motion } from 'framer-motion';
import { ProvenanceEntry } from '@/types/filecoin';

interface ProvenanceChainProps {
  entries: ProvenanceEntry[];
}

const actionColors: Record<string, string> = {
  created: 'bg-cyan-500',
  stored: 'bg-green-500',
  listed: 'bg-purple-500',
  purchased: 'bg-amber-500',
  delisted: 'bg-red-500',
};

export default function ProvenanceChain({ entries }: ProvenanceChainProps) {
  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4 pb-6 last:pb-0"
        >
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${actionColors[entry.action] || 'bg-gray-500'}`} />
            {i < entries.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
          </div>
          <div className="flex-1 -mt-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">{entry.action}</span>
              <span className="text-xs text-gray-500">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">{entry.actor}</div>
            {entry.txHash && (
              <div className="font-mono text-xs text-neon-cyan mt-1 truncate">{entry.txHash}</div>
            )}
            {entry.details && (
              <div className="text-xs text-gray-500 mt-1">{entry.details}</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
