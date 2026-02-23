'use client';

interface ConsentBadgeProps {
  type: 'research' | 'commercial' | 'ai';
  allowed: boolean;
}

const config = {
  research: { label: 'Research', colorOn: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', colorOff: 'bg-white/5 text-gray-600 border-white/5' },
  commercial: { label: 'Commercial', colorOn: 'bg-purple-500/20 text-purple-400 border-purple-500/30', colorOff: 'bg-white/5 text-gray-600 border-white/5' },
  ai: { label: 'AI Training', colorOn: 'bg-green-500/20 text-green-400 border-green-500/30', colorOff: 'bg-white/5 text-gray-600 border-white/5' },
};

export default function ConsentBadge({ type, allowed }: ConsentBadgeProps) {
  const c = config[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${allowed ? c.colorOn : c.colorOff}`}>
      {allowed ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      )}
      {c.label}
    </span>
  );
}
