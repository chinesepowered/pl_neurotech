# NeuroVault

**Own your neural data. Set consent terms. Let AI agents discover and purchase datasets on Filecoin.**

NeuroVault is a decentralized neural data wallet and agent marketplace. It gives individuals sovereignty over their brain data — record EEG sessions, store them immutably on Filecoin, define granular consent terms, and monetize them through an open marketplace where autonomous AI agents can browse, evaluate, and purchase datasets in real-time.

## The Problem

Neural data is one of the most intimate forms of personal information, yet individuals have almost zero control over how it's collected, stored, or used. Research institutions and corporations accumulate massive EEG datasets behind closed doors, with no transparency, no consent mechanisms, and no compensation for the people whose brains generated the data.

## The Solution

NeuroVault flips this model. Data producers control everything:

- **Record** — Capture 8-channel EEG sessions with realistic synthetic waveforms (10-20 system, 256Hz)
- **Store** — Pin data to Filecoin with content-addressed CIDs for verifiable, immutable storage
- **Consent** — Set granular permissions: research use, commercial use, AI training — each toggled independently with expiration dates
- **Price** — Set your own price in tFIL
- **Sell** — List on an open marketplace where both humans and AI agents can discover and purchase your data
- **Track** — Full provenance chain from recording to purchase, all on-chain and auditable

## Autonomous AI Buyer Agents

The marketplace features autonomous AI buyer agents powered by Cerebras inference (~2000 tokens/second). These agents:

1. Browse the entire marketplace catalog
2. Evaluate each dataset on quality metrics (channel count, duration, sample rate, consent terms, value-per-tFIL)
3. Reason transparently about their purchase decisions
4. Execute on-chain purchases automatically

Watch the agent think in real-time — every reasoning step, tool call, and purchase decision streams to the UI as it happens.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Framer Motion |
| AI Agent | Cerebras `gpt-oss-120b` via Vercel AI SDK v6, SSE streaming with tool calls |
| Smart Contract | Solidity 0.8.20, OpenZeppelin ReentrancyGuard, Hardhat |
| Storage | Filecoin (Calibration Testnet), content-addressed CIDs |
| Visualization | Canvas API for 60fps EEG waveform rendering |
| State | Zustand, ethers v6 |

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
FILECOIN_PRIVATE_KEY=0x...              # Calibration testnet wallet private key
MARKETPLACE_CONTRACT_ADDRESS=0x...       # Deployed contract address
CEREBRAS_API_KEY=csk-...                # Cerebras API key for AI agent
NEXT_PUBLIC_CHAIN_ID=314159
NEXT_PUBLIC_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
```

## Smart Contract Deployment

```bash
# Compile
pnpm compile

# Deploy to Filecoin Calibration Testnet
pnpm deploy

# Seed marketplace with sample datasets
pnpm seed
```

Get testnet tFIL from the [Calibration faucet](https://faucet.calibnet.chainsafe-fil.io).

## Demo Flow

1. **Landing** — Dark neon neurotech aesthetic, project overview
2. **Record** (`/record`) — Live 8-channel EEG waveforms animate at 60fps, hit record/stop
3. **Store** — Data uploaded to Filecoin, CID displayed
4. **Consent** — Toggle research/commercial/AI training permissions, set price
5. **Marketplace** (`/marketplace`) — Browse all listed datasets with metadata and consent badges
6. **AI Agent** (`/agent`) — Launch autonomous buyer agent, watch it stream reasoning and purchase
7. **Dashboard** (`/dashboard`) — Revenue tracking, transaction history, provenance chain

## Architecture

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── record/             # EEG recording studio
│   ├── marketplace/        # Dataset browsing and detail pages
│   ├── agent/              # AI buyer agent interface
│   ├── dashboard/          # Revenue and analytics
│   └── api/                # Backend routes (EEG, storage, marketplace, agent)
├── components/             # React components organized by feature
│   ├── ui/                 # Design system primitives
│   ├── eeg/                # Waveform canvas, recording controls
│   ├── marketplace/        # Dataset cards, consent badges
│   ├── agent/              # Stream display, tool call cards
│   └── dashboard/          # Charts, transaction history
├── lib/                    # Core logic
│   ├── eeg/                # Signal generator, channel config
│   ├── filecoin/           # Contract interaction, storage
│   └── agent/              # System prompt, tool definitions
├── stores/                 # Zustand state management
└── types/                  # TypeScript type definitions
contracts/
└── NeuralDataMarketplace.sol
```

## License

MIT
