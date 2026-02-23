'use client';

import { EEGChannel } from '@/types/eeg';

interface ChannelLabelsProps {
  channels: EEGChannel[];
}

export default function ChannelLabels({ channels }: ChannelLabelsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {channels.map(ch => (
        <div key={ch.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color, boxShadow: `0 0 8px ${ch.color}40` }} />
          <span className="text-sm font-mono font-medium" style={{ color: ch.color }}>{ch.name}</span>
          <span className="text-xs text-gray-500">{ch.region}</span>
        </div>
      ))}
    </div>
  );
}
