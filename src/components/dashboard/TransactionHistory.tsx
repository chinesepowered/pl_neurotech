'use client';

import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';

interface Transaction {
  type: 'sale' | 'purchase' | 'listing';
  datasetId: number;
  description: string;
  amount: string;
  buyer?: string;
  txHash: string;
  timestamp: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const typeColors = {
  sale: 'text-neon-green',
  purchase: 'text-neon-amber',
  listing: 'text-neon-cyan',
};

const typeLabels = {
  sale: 'Sale',
  purchase: 'Purchase',
  listing: 'Listing',
};

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <GlassPanel>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Transaction History</h3>
      <div className="space-y-0">
        {transactions.map((tx, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-semibold px-2 py-1 rounded-md bg-white/5 ${typeColors[tx.type]}`}>
                {typeLabels[tx.type]}
              </span>
              <div>
                <div className="text-sm">{tx.description}</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{tx.txHash.slice(0, 20)}...</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-sm font-semibold ${tx.type === 'sale' ? 'text-neon-green' : 'text-gray-400'}`}>
                {tx.type === 'sale' ? '+' : ''}{tx.amount} tFIL
              </div>
              <div className="text-xs text-gray-600">{new Date(tx.timestamp).toLocaleDateString()}</div>
            </div>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center text-gray-600 py-8 text-sm">No transactions yet</div>
        )}
      </div>
    </GlassPanel>
  );
}
