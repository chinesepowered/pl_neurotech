import { ethers } from 'ethers';
import { RPC_URL, PRIVATE_KEY, MARKETPLACE_ADDRESS } from './config';

const ABI = [
  "function listDataset(string cid, string metadataUri, uint256 price, uint256 channelCount, uint256 sampleRate, uint256 durationSeconds, bool allowResearch, bool allowCommercial, bool allowAITraining, uint256 consentExpiresAt) external returns (uint256)",
  "function purchaseDataset(uint256 datasetId, string buyerType) external payable",
  "function delistDataset(uint256 datasetId) external",
  "function withdrawFunds() external",
  "function getDataset(uint256 id) external view returns (tuple(uint256 id, address owner, string cid, string metadataUri, uint256 price, uint256 channelCount, uint256 sampleRate, uint256 durationSeconds, tuple(bool allowResearch, bool allowCommercial, bool allowAITraining, uint256 expiresAt) consent, bool active, uint256 createdAt))",
  "function getDatasetCount() external view returns (uint256)",
  "function getActiveListings() external view returns (tuple(uint256 id, address owner, string cid, string metadataUri, uint256 price, uint256 channelCount, uint256 sampleRate, uint256 durationSeconds, tuple(bool allowResearch, bool allowCommercial, bool allowAITraining, uint256 expiresAt) consent, bool active, uint256 createdAt)[])",
  "function getPurchaseHistory(uint256 datasetId) external view returns (tuple(uint256 datasetId, address buyer, uint256 price, uint256 purchasedAt, string buyerType)[])",
  "function getOwnerRevenue(address owner) external view returns (uint256)",
  "event DatasetListed(uint256 indexed id, address indexed owner, string cid, uint256 price)",
  "event DatasetPurchased(uint256 indexed id, address indexed buyer, uint256 price, string buyerType)",
  "event DatasetDelisted(uint256 indexed id)",
  "event FundsWithdrawn(address indexed owner, uint256 amount)",
];

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getSigner() {
  const provider = getProvider();
  return new ethers.Wallet(PRIVATE_KEY, provider);
}

export function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const sp = signerOrProvider || getSigner();
  return new ethers.Contract(MARKETPLACE_ADDRESS, ABI, sp);
}

export function parseDataset(raw: ethers.Result) {
  return {
    id: Number(raw.id),
    owner: raw.owner,
    cid: raw.cid,
    metadataUri: raw.metadataUri,
    price: raw.price.toString(),
    channelCount: Number(raw.channelCount),
    sampleRate: Number(raw.sampleRate),
    durationSeconds: Number(raw.durationSeconds),
    consent: {
      allowResearch: raw.consent.allowResearch,
      allowCommercial: raw.consent.allowCommercial,
      allowAITraining: raw.consent.allowAITraining,
      expiresAt: Number(raw.consent.expiresAt),
    },
    active: raw.active,
    createdAt: Number(raw.createdAt),
  };
}

export function parsePurchase(raw: ethers.Result) {
  return {
    datasetId: Number(raw.datasetId),
    buyer: raw.buyer,
    price: raw.price.toString(),
    purchasedAt: Number(raw.purchasedAt),
    buyerType: raw.buyerType as 'human' | 'agent',
  };
}
