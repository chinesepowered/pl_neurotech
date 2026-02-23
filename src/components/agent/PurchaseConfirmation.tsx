'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface PurchaseConfirmationProps {
  datasetId: number;
  txHash: string;
}

export default function PurchaseConfirmation({ datasetId, txHash }: PurchaseConfirmationProps) {
  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#ff00ff', '#39ff14', '#ffd740'],
      });
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-green-500/30 bg-green-500/5 rounded-xl p-6 text-center"
    >
      <div className="text-4xl mb-3">&#127881;</div>
      <h3 className="text-xl font-bold text-neon-green mb-2">Dataset Purchased!</h3>
      <p className="text-sm text-gray-400 mb-4">
        Agent successfully acquired Dataset #{datasetId}
      </p>
      <div className="font-mono text-xs text-gray-500 break-all bg-black/20 rounded-lg p-3">
        TX: {txHash}
      </div>
    </motion.div>
  );
}
