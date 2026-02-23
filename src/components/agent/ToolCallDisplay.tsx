'use client';

import { motion } from 'framer-motion';

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'calling' | 'complete';
}

const toolIcons: Record<string, string> = {
  browseMarketplace: '\uD83D\uDD0D',
  evaluateDataset: '\uD83D\uDCCA',
  purchaseDataset: '\uD83D\uDCB0',
};

const toolColors: Record<string, string> = {
  browseMarketplace: 'border-cyan-500/30 bg-cyan-500/5',
  evaluateDataset: 'border-purple-500/30 bg-purple-500/5',
  purchaseDataset: 'border-green-500/30 bg-green-500/5',
};

export default function ToolCallDisplay({ toolName, args, result, status }: ToolCallDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border rounded-xl p-4 ${toolColors[toolName] || 'border-white/10 bg-white/5'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{toolIcons[toolName] || '\u2699\uFE0F'}</span>
        <span className="font-mono text-sm font-semibold text-white">{toolName}</span>
        {status === 'calling' ? (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Running...
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            Complete
          </span>
        )}
      </div>

      {Object.keys(args).length > 0 && (
        <div className="text-xs font-mono text-gray-400 mb-2 bg-black/20 rounded-lg p-2">
          {JSON.stringify(args, null, 2)}
        </div>
      )}

      {result != null && (
        <div className="text-xs font-mono text-gray-300 bg-black/20 rounded-lg p-2 max-h-48 overflow-y-auto">
          <pre className="whitespace-pre-wrap">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </motion.div>
  );
}
