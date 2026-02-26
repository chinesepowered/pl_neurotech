import { EEGChannel, EEGSample } from '@/types/eeg';

// Band power weights per region (controls relative contribution of each band)
const BAND_WEIGHTS: Record<string, { delta: number; theta: number; alpha: number; beta: number }> = {
  frontal:   { delta: 0.3, theta: 0.2, alpha: 0.2, beta: 0.5 },
  central:   { delta: 0.3, theta: 0.3, alpha: 0.3, beta: 0.3 },
  temporal:  { delta: 0.2, theta: 0.3, alpha: 0.2, beta: 0.4 },
  occipital: { delta: 0.2, theta: 0.2, alpha: 0.6, beta: 0.2 },
};

// Paul Kellett's refined pink noise algorithm (Voss-McCartney)
function pinkNoise(state: { b: number[] }): number {
  const white = Math.random() * 2 - 1;
  const b = state.b;
  b[0] = 0.99886 * b[0] + white * 0.0555179;
  b[1] = 0.99332 * b[1] + white * 0.0750759;
  b[2] = 0.96900 * b[2] + white * 0.1538520;
  b[3] = 0.86650 * b[3] + white * 0.3104856;
  b[4] = 0.55000 * b[4] + white * 0.5329522;
  b[5] = -0.7616 * b[5] - white * 0.0168980;
  const pink = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * 0.5362) * 0.11;
  b[6] = white * 0.115926;
  return pink;
}

export class EEGGenerator {
  private sampleRate: number;
  private channels: EEGChannel[];
  private t = 0;
  private noiseStates: { b: number[] }[];
  private nextBlink = 0;
  private nextMuscle = 0;
  private blinkCountdown = 0;
  private muscleCountdown = 0;

  constructor(sampleRate: number, channels: EEGChannel[]) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.noiseStates = channels.map(() => ({ b: new Array(7).fill(0) }));
    this.nextBlink = Math.random() * 3 + 3;
    this.nextMuscle = Math.random() * 5 + 5;
  }

  private generateBand(freq: number, bw: number, amp: number): number {
    const f = freq + (Math.random() - 0.5) * bw * 0.3;
    return amp * Math.sin(2 * Math.PI * f * this.t / this.sampleRate);
  }

  generateSample(): EEGSample {
    const timestamp = this.t / this.sampleRate;
    const channels: number[] = [];

    // Check for artifacts
    this.nextBlink -= 1 / this.sampleRate;
    this.nextMuscle -= 1 / this.sampleRate;

    let blinkArtifact = 0;
    if (this.nextBlink <= 0 && this.blinkCountdown <= 0) {
      this.blinkCountdown = 0.3 * this.sampleRate; // 300ms blink
      this.nextBlink = Math.random() * 5 + 3;
    }
    if (this.blinkCountdown > 0) {
      const progress = 1 - this.blinkCountdown / (0.3 * this.sampleRate);
      blinkArtifact = 120 * Math.sin(Math.PI * progress) * Math.exp(-progress * 2);
      this.blinkCountdown--;
    }

    let muscleArtifact = 0;
    if (this.nextMuscle <= 0 && this.muscleCountdown <= 0) {
      this.muscleCountdown = 0.15 * this.sampleRate; // 150ms burst
      this.nextMuscle = Math.random() * 8 + 5;
    }
    if (this.muscleCountdown > 0) {
      muscleArtifact = 40 * (Math.random() * 2 - 1);
      this.muscleCountdown--;
    }

    for (let i = 0; i < this.channels.length; i++) {
      const ch = this.channels[i];
      const w = BAND_WEIGHTS[ch.region];

      // Additive synthesis with realistic amplitudes (µV)
      let val = 0;
      // Delta (0.5-4Hz) — typically 20-100µV
      val += this.generateBand(2, 3.5, w.delta * 75);
      // Theta (4-8Hz) — typically 10-50µV
      val += this.generateBand(6, 4, w.theta * 50);
      // Alpha (8-13Hz) — typically 20-100µV (dominant in occipital)
      val += this.generateBand(10, 5, w.alpha * 60);
      // Beta (13-30Hz) — typically 5-30µV
      val += this.generateBand(20, 17, w.beta * 25);

      // Pink noise background (~10-15µV)
      val += pinkNoise(this.noiseStates[i]) * 15;

      // Eye blink artifact (Fp1/Fp2) — typically 50-200µV
      if (ch.region === 'frontal') {
        val += blinkArtifact;
      }

      // Muscle artifact (temporal) — high-frequency burst
      if (ch.region === 'temporal') {
        val += muscleArtifact;
      }

      channels.push(val);
    }

    this.t++;
    return { timestamp, channels };
  }

  generateBatch(count: number): EEGSample[] {
    const samples: EEGSample[] = [];
    for (let i = 0; i < count; i++) {
      samples.push(this.generateSample());
    }
    return samples;
  }

  reset() {
    this.t = 0;
    this.noiseStates = this.channels.map(() => ({ b: new Array(7).fill(0) }));
  }
}
