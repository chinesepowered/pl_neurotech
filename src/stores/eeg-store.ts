import { create } from 'zustand';
import { EEGSample, EEGSession } from '@/types/eeg';
import { EEG_CHANNELS, SAMPLE_RATE } from '@/lib/eeg/channels';

interface EEGState {
  isRecording: boolean;
  isPaused: boolean;
  samples: EEGSample[];
  duration: number;
  session: EEGSession | null;
  startRecording: () => void;
  stopRecording: () => EEGSession;
  pauseRecording: () => void;
  resumeRecording: () => void;
  addSamples: (samples: EEGSample[]) => void;
  reset: () => void;
}

export const useEEGStore = create<EEGState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  samples: [],
  duration: 0,
  session: null,

  startRecording: () => {
    set({ isRecording: true, isPaused: false, samples: [], duration: 0, session: null });
  },

  stopRecording: () => {
    const { samples } = get();
    const session: EEGSession = {
      id: `session_${Date.now()}`,
      channels: EEG_CHANNELS,
      sampleRate: SAMPLE_RATE,
      durationSeconds: samples.length / SAMPLE_RATE,
      data: samples,
      createdAt: Date.now(),
    };
    set({ isRecording: false, isPaused: false, session });
    return session;
  },

  pauseRecording: () => set({ isPaused: true }),
  resumeRecording: () => set({ isPaused: false }),

  addSamples: (newSamples) => {
    set(state => ({
      samples: [...state.samples, ...newSamples],
      duration: (state.samples.length + newSamples.length) / SAMPLE_RATE,
    }));
  },

  reset: () => set({ isRecording: false, isPaused: false, samples: [], duration: 0, session: null }),
}));
