'use client';

import { useState } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import GlassPanel from '@/components/ui/GlassPanel';

interface AgentLauncherProps {
  onLaunch: (budget: string) => void;
  isRunning: boolean;
}

export default function AgentLauncher({ onLaunch, isRunning }: AgentLauncherProps) {
  const [budget, setBudget] = useState('0.05');

  return (
    <GlassPanel>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">AI Buyer Agent</h3>
          <p className="text-xs text-gray-500">Autonomous data buyer</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Budget (tFIL)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          disabled={isRunning}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-white focus:outline-none focus:border-neon-cyan/50 disabled:opacity-50"
        />
      </div>

      <GlowButton variant="magenta" className="w-full" onClick={() => onLaunch(budget)} disabled={isRunning}>
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Agent Running...
          </span>
        ) : (
          'Launch Agent'
        )}
      </GlowButton>
    </GlassPanel>
  );
}
