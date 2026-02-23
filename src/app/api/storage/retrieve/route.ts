import { NextResponse } from 'next/server';
import { retrieveFromFilecoin } from '@/lib/filecoin/synapse';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cid = url.searchParams.get('cid');

    if (!cid) {
      return NextResponse.json({ error: 'CID required' }, { status: 400 });
    }

    const data = await retrieveFromFilecoin(cid);

    if (!data) {
      return NextResponse.json({
        cid,
        status: 'demo-mode',
        message: 'Data retrieval available with Synapse SDK configured',
      });
    }

    return new Response(data.buffer as ArrayBuffer, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
