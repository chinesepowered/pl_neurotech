# NeuroVault Deployment Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Filecoin Calibration testnet wallet with tFIL

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Get Testnet Tokens

Get tFIL (for contract deployment + transactions):
- https://faucet.calibnet.chainsafe-fil.io

Get USDFC (for Synapse SDK storage payments):
- https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc

## 3. Configure Environment

Copy and fill in `.env.local`:

```env
# Your funded Calibration testnet wallet private key (with or without 0x prefix)
FILECOIN_PRIVATE_KEY=your_private_key_here

# Will be filled after contract deployment (step 4)
MARKETPLACE_CONTRACT_ADDRESS=

# Get from https://cerebras.ai (needed for AI agent)
CEREBRAS_API_KEY=csk-your_key_here

# Public config (defaults are correct for Calibration testnet)
NEXT_PUBLIC_CHAIN_ID=314159
NEXT_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Deploy Smart Contract

```bash
pnpm run deploy
```

This compiles `contracts/NeuralDataMarketplace.sol` and deploys to Calibration testnet.

Copy the deployed contract address and update `.env.local`:
```env
MARKETPLACE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```

## 5. Seed Marketplace Data

```bash
pnpm run seed
```

This creates 5 varied neural datasets on-chain:
- Resting State EEG (8ch/256Hz/120s) — 0.008 tFIL
- Cognitive Task EEG Premium (16ch/512Hz/180s) — 0.035 tFIL
- Sleep Stage N2 (no AI training consent) — 0.003 tFIL
- Motor Imagery Budget (4ch/128Hz/45s) — 0.005 tFIL
- Meditation EEG Overpriced (4ch/128Hz/30s) — 0.025 tFIL

## 6. Run the App

```bash
pnpm dev
```

Open http://localhost:3000

## 7. Production Build

```bash
pnpm build
pnpm start
```

## Demo Flow

1. **Landing** (`/`) — Overview of the platform
2. **Record** (`/record`) — Record synthetic EEG, set consent, upload to Filecoin via Synapse SDK, list on marketplace
3. **Marketplace** (`/marketplace`) — Browse and purchase neural datasets
4. **Agent** (`/agent`) — Launch AI buyer agent that autonomously evaluates and purchases datasets
5. **Dashboard** (`/dashboard`) — Revenue, transactions, activity

## Troubleshooting

**"Stack too deep" on compile**: Already fixed with `viaIR: true` in hardhat.config.ts.

**Named export error on deploy/seed**: Scripts use `import pkg from "hardhat"` pattern for Node.js ESM compatibility.

**Agent not working**: Make sure `CEREBRAS_API_KEY` is set. The agent requires a valid Cerebras API key for the Llama 3.3 70B model.

**Storage showing demo CIDs**: Set `FILECOIN_PRIVATE_KEY` with a wallet that has USDFC balance. Without it, uploads fall back to demo mode (SHA-256 generated CIDs).

**Contract interactions returning demo data**: Make sure `MARKETPLACE_CONTRACT_ADDRESS` is set to the deployed contract address.

## Contract Verification

View your contract on the Calibration block explorer:
```
https://filecoin-testnet.blockscout.com/address/YOUR_CONTRACT_ADDRESS
```

## Architecture

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion
- **AI**: Vercel AI SDK v6 + Cerebras Llama 3.3 70B
- **Storage**: Synapse SDK (`@filoz/synapse-sdk`) on Filecoin Onchain Cloud
- **Contract**: Solidity 0.8.20 on Filecoin Calibration Testnet (chainId 314159)
- **Chain interaction**: ethers v6 (marketplace contract) + viem (Synapse SDK)
