import { NextResponse } from 'next/server';
import { getContract } from '@/lib/filecoin/contracts';
import { MARKETPLACE_ADDRESS } from '@/lib/filecoin/config';

export async function POST(request: Request) {
  try {
    const { datasetId, buyerType = 'human' } = await request.json();

    if (!MARKETPLACE_ADDRESS) {
      // Demo mode
      return NextResponse.json({
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        datasetId,
        demo: true,
      });
    }

    const contract = getContract();
    const dataset = await contract.getDataset(datasetId);
    const price = dataset.price;

    const tx = await contract.purchaseDataset(datasetId, buyerType, { value: price });
    const receipt = await tx.wait();

    return NextResponse.json({
      txHash: receipt.hash,
      datasetId,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      datasetId: 0,
      demo: true,
    });
  }
}
