import { NextResponse } from 'next/server';
import { uploadToFilecoin } from '@/lib/filecoin/synapse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, channels, sampleRate, duration, dataSize, eegData } = body;

    // Build the full payload — include actual EEG data if provided
    const payload = {
      sessionId,
      channels,
      sampleRate,
      duration,
      dataSize,
      format: 'eeg-json',
      createdAt: new Date().toISOString(),
      ...(eegData ? { data: eegData } : {}),
    };

    // Convert to buffer for upload — includes real data when available
    const data = new TextEncoder().encode(JSON.stringify(payload));
    const result = await uploadToFilecoin(data, `${sessionId}.json`);

    return NextResponse.json({
      cid: result.cid,
      size: result.size,
      timestamp: result.timestamp,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
