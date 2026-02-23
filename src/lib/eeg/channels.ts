import { EEGChannel } from '@/types/eeg';

export const EEG_CHANNELS: EEGChannel[] = [
  { name: 'Fp1', index: 0, color: '#00ffff', region: 'frontal' },
  { name: 'Fp2', index: 1, color: '#ff00ff', region: 'frontal' },
  { name: 'C3',  index: 2, color: '#39ff14', region: 'central' },
  { name: 'C4',  index: 3, color: '#ffd740', region: 'central' },
  { name: 'T3',  index: 4, color: '#a855f7', region: 'temporal' },
  { name: 'T4',  index: 5, color: '#ec4899', region: 'temporal' },
  { name: 'O1',  index: 6, color: '#3b82f6', region: 'occipital' },
  { name: 'O2',  index: 7, color: '#ef4444', region: 'occipital' },
];

export const SAMPLE_RATE = 256; // Hz
export const CHANNEL_COUNT = 8;
