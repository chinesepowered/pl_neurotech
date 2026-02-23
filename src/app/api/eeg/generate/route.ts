import { NextResponse } from 'next/server';
import { EEGGenerator } from '@/lib/eeg/generator';
import { EEG_CHANNELS, SAMPLE_RATE } from '@/lib/eeg/channels';

export async function POST(request: Request) {
  try {
    const { duration = 10, sampleRate = SAMPLE_RATE } = await request.json();

    const generator = new EEGGenerator(sampleRate, EEG_CHANNELS);
    const totalSamples = Math.floor(duration * sampleRate);
    const samples = generator.generateBatch(totalSamples);

    return NextResponse.json({
      channels: EEG_CHANNELS.map(c => c.name),
      sampleRate,
      duration,
      totalSamples,
      data: samples,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
