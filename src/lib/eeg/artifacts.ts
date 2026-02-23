// Artifact generation utilities for realistic EEG simulation

export function generateEyeBlink(durationSamples: number, amplitude: number = 80): number[] {
  const artifact: number[] = [];
  for (let i = 0; i < durationSamples; i++) {
    const t = i / durationSamples;
    artifact.push(amplitude * Math.sin(Math.PI * t) * Math.exp(-t * 2));
  }
  return artifact;
}

export function generateMuscleBurst(durationSamples: number, amplitude: number = 30): number[] {
  const artifact: number[] = [];
  for (let i = 0; i < durationSamples; i++) {
    artifact.push(amplitude * (Math.random() * 2 - 1));
  }
  return artifact;
}

export function generateLineNoise(sampleRate: number, count: number, amplitude: number = 5): number[] {
  const artifact: number[] = [];
  for (let i = 0; i < count; i++) {
    artifact.push(amplitude * Math.sin(2 * Math.PI * 60 * i / sampleRate));
  }
  return artifact;
}
