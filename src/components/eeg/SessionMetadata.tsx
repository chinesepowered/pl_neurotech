'use client';

import { EEGSession } from '@/types/eeg';
import GlassPanel from '@/components/ui/GlassPanel';

interface SessionMetadataProps {
  session: EEGSession;
}

export default function SessionMetadata({ session }: SessionMetadataProps) {
  const stats = [
    { label: 'Channels', value: session.channels.length.toString() },
    { label: 'Sample Rate', value: `${session.sampleRate} Hz` },
    { label: 'Duration', value: `${session.durationSeconds.toFixed(1)}s` },
    { label: 'Total Samples', value: session.data.length.toLocaleString() },
    { label: 'Data Size', value: `${(session.data.length * session.channels.length * 4 / 1024).toFixed(1)} KB` },
  ];

  return (
    <GlassPanel>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Session Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(s => (
          <div key={s.label}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="font-mono text-sm text-white">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="text-xs text-gray-500">Session ID</div>
        <div className="font-mono text-xs text-neon-cyan mt-1">{session.id}</div>
      </div>
    </GlassPanel>
  );
}
