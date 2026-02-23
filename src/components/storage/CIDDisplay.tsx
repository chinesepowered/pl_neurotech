'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CIDDisplayProps {
  cid: string;
}

export default function CIDDisplay({ cid }: CIDDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-xl p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">Content Identifier (CID)</div>
          <div className="font-mono text-sm text-neon-green break-all">{cid}</div>
        </div>
        <button
          onClick={handleCopy}
          className="ml-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}
