import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { getContract } from '@/lib/filecoin/contracts';
import { MARKETPLACE_ADDRESS } from '@/lib/filecoin/config';

export async function POST(request: Request) {
  try {
    const { cid, metadataUri, price, channelCount, sampleRate, durationSeconds, consent } = await request.json();

    if (!MARKETPLACE_ADDRESS) {
      // Demo mode: return mock response
      return NextResponse.json({
        datasetId: Math.floor(Math.random() * 1000),
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        demo: true,
      });
    }

    const contract = getContract();
    const priceWei = ethers.parseEther(price.toString());

    const tx = await contract.listDataset(
      cid,
      metadataUri,
      priceWei,
      Math.floor(channelCount),
      Math.floor(sampleRate),
      Math.floor(durationSeconds),
      consent.allowResearch,
      consent.allowCommercial,
      consent.allowAITraining,
      consent.expiresAt
    );

    const receipt = await tx.wait();

    // Parse the DatasetListed event to get the ID
    const event = receipt.logs.find((log: ethers.Log) => {
      try {
        return contract.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === 'DatasetListed';
      } catch { return false; }
    });

    let datasetId = 0;
    if (event) {
      const parsed = contract.interface.parseLog({ topics: event.topics as string[], data: event.data });
      datasetId = Number(parsed?.args.id);
    }

    return NextResponse.json({
      datasetId,
      txHash: receipt.hash,
    });
  } catch (error) {
    console.error('List error:', error);
    // Fallback to demo mode
    return NextResponse.json({
      datasetId: Math.floor(Math.random() * 1000),
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      demo: true,
    });
  }
}
