import pkg from "hardhat";
const { ethers } = pkg;

// Seed datasets match the demo data in listings/route.ts
// Varied specs for interesting agent evaluation
const SEED_DATASETS = [
  {
    cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    metadataUri: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/metadata.json",
    price: ethers.parseEther("0.008"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 120,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Resting State EEG - Eyes Open (8ch, 256Hz, 120s)",
  },
  {
    cid: "bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i",
    metadataUri: "ipfs://bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i/metadata.json",
    price: ethers.parseEther("0.035"),
    channelCount: 16,
    sampleRate: 512,
    durationSeconds: 180,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Cognitive Task EEG - Working Memory (16ch, 512Hz, 180s) PREMIUM",
  },
  {
    cid: "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636",
    metadataUri: "ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636/metadata.json",
    price: ethers.parseEther("0.003"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 60,
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: false, // Agent must reject this one
    description: "Sleep Stage N2 EEG Recording (NO AI TRAINING CONSENT)",
  },
  {
    cid: "bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm",
    metadataUri: "ipfs://bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm/metadata.json",
    price: ethers.parseEther("0.005"),
    channelCount: 4,
    sampleRate: 128,
    durationSeconds: 45,
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: true,
    description: "Motor Imagery BCI - Budget (4ch, 128Hz, 45s)",
  },
  {
    cid: "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354",
    metadataUri: "ipfs://bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354/metadata.json",
    price: ethers.parseEther("0.025"),
    channelCount: 4,
    sampleRate: 128,
    durationSeconds: 30,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Meditation EEG - Overpriced (4ch, 128Hz, 30s)",
  },
];

async function main() {
  const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
  if (!contractAddress || contractAddress === "0x_DEPLOYED_CONTRACT_ADDRESS") {
    console.error("Set MARKETPLACE_CONTRACT_ADDRESS in .env.local (run deploy first)");
    process.exit(1);
  }

  const [signer] = await ethers.getSigners();
  console.log("Seeding from:", signer.address);

  const contract = await ethers.getContractAt("NeuralDataMarketplace", contractAddress, signer);
  const oneYear = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

  for (const ds of SEED_DATASETS) {
    console.log(`Listing: ${ds.description}`);
    const tx = await contract.listDataset(
      ds.cid,
      ds.metadataUri,
      ds.price,
      ds.channelCount,
      ds.sampleRate,
      ds.durationSeconds,
      ds.allowResearch,
      ds.allowCommercial,
      ds.allowAITraining,
      oneYear
    );
    await tx.wait();
    console.log(`  TX: ${tx.hash}`);
  }

  const count = await contract.getDatasetCount();
  console.log(`\nDone! ${count} datasets listed.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
