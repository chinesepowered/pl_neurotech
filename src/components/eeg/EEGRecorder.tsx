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
const SAMPLES_PER_FRAME = 8; // samples generated per animation frame (~30fps * 8 = ~240 samples/s)

export default function EEGRecorder() {
  const { isRecording, isPaused, duration, session, startRecording, stopRecording, pauseRecording, resumeRecording, addSamples } = useEEGStore();
  const generatorRef = useRef<EEGGenerator | null>(null);
  const buffersRef = useRef<Float32Array[]>(EEG_CHANNELS.map(() => new Float32Array(BUFFER_SIZE)));
  const bufferIndexRef = useRef(0);
  const animRef = useRef<number>(0);
  const [, forceUpdate] = useState(0);

  const tick = useCallback(() => {
    if (!generatorRef.current) return;
    const store = useEEGStore.getState();
    if (!store.isRecording || store.isPaused) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    const batch = generatorRef.current.generateBatch(SAMPLES_PER_FRAME);
    store.addSamples(batch);

    for (const sample of batch) {
      for (let ch = 0; ch < sample.channels.length; ch++) {
        buffersRef.current[ch][bufferIndexRef.current] = sample.channels[ch];
      }
      bufferIndexRef.current = (bufferIndexRef.current + 1) % BUFFER_SIZE;
    }

    forceUpdate(n => n + 1);
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const handleStart = useCallback(() => {
    generatorRef.current = new EEGGenerator(SAMPLE_RATE, EEG_CHANNELS);
    buffersRef.current = EEG_CHANNELS.map(() => new Float32Array(BUFFER_SIZE));
    bufferIndexRef.current = 0;
    startRecording();
    animRef.current = requestAnimationFrame(tick);
  }, [startRecording, tick]);

  const handleStop = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    stopRecording();
  }, [stopRecording]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Run idle animation when not recording
  useEffect(() => {
    if (!isRecording && !session) {
      generatorRef.current = new EEGGenerator(SAMPLE_RATE, EEG_CHANNELS);
      const idleTick = () => {
        if (!generatorRef.current) return;
        const batch = generatorRef.current.generateBatch(SAMPLES_PER_FRAME);
        for (const sample of batch) {
          for (let ch = 0; ch < sample.channels.length; ch++) {
            buffersRef.current[ch][bufferIndexRef.current] = sample.channels[ch];
          }
          bufferIndexRef.current = (bufferIndexRef.current + 1) % BUFFER_SIZE;
        }
        forceUpdate(n => n + 1);
        animRef.current = requestAnimationFrame(idleTick);
      };
      animRef.current = requestAnimationFrame(idleTick);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [isRecording, session]);

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
          isActive={true}
        />

        <div className="mt-4">
          <ChannelLabels channels={EEG_CHANNELS} />
        </div>
      </div>

      {session && <SessionMetadata session={session} />}
    </div>
  );
}
