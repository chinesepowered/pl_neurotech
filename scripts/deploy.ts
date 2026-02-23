import { ethers } from "hardhat";

async function main() {
  console.log("Deploying NeuralDataMarketplace...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "tFIL");

  const Factory = await ethers.getContractFactory("NeuralDataMarketplace");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("NeuralDataMarketplace deployed to:", address);
  console.log("\nUpdate your .env.local:");
  console.log(`MARKETPLACE_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
