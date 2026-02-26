'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { EEGGenerator } from '@/lib/eeg/generator';
import { EEG_CHANNELS, SAMPLE_RATE } from '@/lib/eeg/channels';
import { useEEGStore } from '@/stores/eeg-store';
import WaveformCanvas from './WaveformCanvas';
import RecordingControls from './RecordingControls';
import ChannelLabels from './ChannelLabels';
import SessionMetadata from './SessionMetadata';

const BUFFER_SIZE = 1024;
// At ~60fps, 4 samples/frame gives ~240 samples/s which approximates 256Hz
const SAMPLES_PER_FRAME = 4;

export default function EEGRecorder() {
  const { isRecording, isPaused, duration, session, startRecording, stopRecording, pauseRecording, resumeRecording } = useEEGStore();
  const generatorRef = useRef<EEGGenerator | null>(null);
  const buffersRef = useRef<Float32Array[]>(EEG_CHANNELS.map(() => new Float32Array(BUFFER_SIZE)));
  const bufferIndexRef = useRef(0);
  const animRef = useRef<number>(0);
  const [, setFrame] = useState(0);

  // Lazy-init generator
  if (!generatorRef.current) {
    generatorRef.current = new EEGGenerator(SAMPLE_RATE, EEG_CHANNELS);
  }

  // Single animation loop for the lifetime of the component.
  // Reads store state directly each frame — no stale closures.
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const state = useEEGStore.getState();

      // Generate data when idle (preview) or actively recording
      const isIdle = !state.isRecording && !state.session;
      const isActiveRecording = state.isRecording && !state.isPaused;

      if (isIdle || isActiveRecording) {
        const gen = generatorRef.current;
        if (gen) {
          const batch = gen.generateBatch(SAMPLES_PER_FRAME);

          // Only store to session data when recording
          if (isActiveRecording) {
            state.addSamples(batch);
          }

          // Always write to ring buffer for display
          for (const sample of batch) {
            for (let ch = 0; ch < sample.channels.length; ch++) {
              buffersRef.current[ch][bufferIndexRef.current] = sample.channels[ch];
            }
            bufferIndexRef.current = (bufferIndexRef.current + 1) % BUFFER_SIZE;
          }

          // Trigger re-render so WaveformCanvas draws new data
          setFrame(n => n + 1);
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    // Fresh generator for consistent timing, but DON'T reset buffers —
    // keeps the idle waveforms for a seamless visual transition
    generatorRef.current = new EEGGenerator(SAMPLE_RATE, EEG_CHANNELS);
    startRecording();
  }, [startRecording]);

  const handleStop = useCallback(() => {
    stopRecording();
    // Loop keeps running but won't generate new data
    // (session exists + not recording = frozen display)
  }, [stopRecording]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">EEG Neural Recording</h2>
            <p className="text-sm text-gray-500 mt-1">8-channel 10-20 system &middot; {SAMPLE_RATE}Hz sample rate</p>
          </div>
          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            duration={duration}
            onStart={handleStart}
            onStop={handleStop}
            onPause={pauseRecording}
            onResume={resumeRecording}
          />
        </div>

        <WaveformCanvas
          channels={EEG_CHANNELS}
          buffers={buffersRef.current}
          bufferIndex={bufferIndexRef.current}
          bufferSize={BUFFER_SIZE}
        />

        <div className="mt-4">
          <ChannelLabels channels={EEG_CHANNELS} />
        </div>
      </div>

      {session && <SessionMetadata session={session} />}
    </div>
  );
}
