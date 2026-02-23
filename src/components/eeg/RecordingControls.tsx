'use client';

import GlowButton from '@/components/ui/GlowButton';
import PulseIndicator from '@/components/ui/PulseIndicator';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
}

export default function RecordingControls({
  isRecording, isPaused, duration,
  onStart, onStop, onPause, onResume,
}: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        {isRecording ? (
          <>
            <PulseIndicator color={isPaused ? 'amber' : 'red'} label={isPaused ? 'Paused' : 'Recording'} />
            <span className="font-mono text-2xl text-white tabular-nums">{formatDuration(duration)}</span>
          </>
        ) : (
          <span className="text-gray-500 text-sm">Ready to record</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <GlowButton variant="green" onClick={onStart}>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
              Record
            </span>
          </GlowButton>
        ) : (
          <>
            {isPaused ? (
              <GlowButton variant="green" size="sm" onClick={onResume}>Resume</GlowButton>
            ) : (
              <GlowButton variant="amber" size="sm" onClick={onPause}>Pause</GlowButton>
            )}
            <GlowButton variant="magenta" size="sm" onClick={onStop}>
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                Stop
              </span>
            </GlowButton>
          </>
        )}
      </div>
    </div>
  );
}
