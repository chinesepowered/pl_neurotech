import { NextResponse } from 'next/server';
import { uploadToFilecoin } from '@/lib/filecoin/synapse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, channels, sampleRate, duration, dataSize } = body;

    // Create metadata
    const metadata = {
      sessionId,
      channels,
      sampleRate,
      duration,
      dataSize,
      format: 'eeg-json',
      createdAt: new Date().toISOString(),
    };

    // Convert to buffer for upload
    const data = new TextEncoder().encode(JSON.stringify(metadata));
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
