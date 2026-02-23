export interface EEGChannel {
  name: string;
  index: number;
  color: string;
  region: 'frontal' | 'central' | 'temporal' | 'occipital';
}

export interface EEGSample {
  timestamp: number;
  channels: number[];
}

export interface EEGSession {
  id: string;
  channels: EEGChannel[];
  sampleRate: number;
  durationSeconds: number;
  data: EEGSample[];
  createdAt: number;
}

export interface EEGGeneratorConfig {
  sampleRate: number;
  channels: EEGChannel[];
  noiseLevel: number;
  artifactProbability: number;
}
