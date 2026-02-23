import { ethers } from "hardhat";

const SEED_DATASETS = [
  {
    cid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    metadataUri: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/metadata.json",
    price: ethers.parseEther("0.005"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 30,
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: true,
    description: "Resting state EEG - Eyes Open",
  },
  {
    cid: "bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i",
    metadataUri: "ipfs://bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462rwyinlb4i/metadata.json",
    price: ethers.parseEther("0.01"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 60,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Cognitive task EEG - Working Memory",
  },
  {
    cid: "bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636",
    metadataUri: "ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenure7636/metadata.json",
    price: ethers.parseEther("0.008"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 45,
    allowResearch: true,
    allowCommercial: false,
    allowAITraining: false,
    description: "Sleep Stage N2 EEG Recording",
  },
  {
    cid: "bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm",
    metadataUri: "ipfs://bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm/metadata.json",
    price: ethers.parseEther("0.015"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 120,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Motor Imagery BCI Session - Left/Right Hand",
  },
  {
    cid: "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354",
    metadataUri: "ipfs://bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354/metadata.json",
    price: ethers.parseEther("0.02"),
    channelCount: 8,
    sampleRate: 256,
    durationSeconds: 90,
    allowResearch: true,
    allowCommercial: true,
    allowAITraining: true,
    description: "Meditation EEG - Deep Alpha State",
  },
];

async function main() {
  const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Set MARKETPLACE_CONTRACT_ADDRESS in .env.local");
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
