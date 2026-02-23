'use client';

import { motion } from 'framer-motion';

interface UploadProgressProps {
  progress: number; // 0-100
  status: string;
}

export default function UploadProgress({ progress, status }: UploadProgressProps) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{status}</span>
        <span className="text-sm font-mono text-neon-cyan">{progress}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}
