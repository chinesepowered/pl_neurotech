# Project Context: NeuroVault

> This file is for AI coding tools to understand the project when picking it up later. It contains architecture decisions, current state, and implementation details.

## What This Is

A neural data wallet + AI agent marketplace on Filecoin. Users record EEG sessions, store on Filecoin via Synapse SDK, set consent/pricing, list on a marketplace, and autonomous AI agents (Cerebras llama-3.3-70b) can browse/evaluate/purchase datasets via streaming tool calls.

## Current State

**All pages implemented and building cleanly.** The project compiles with zero type errors on `pnpm build`. Every page renders. The smart contract is written but needs deployment (requires tFIL + USDFC in wallet).

### What Works
- Landing page with animations
- EEG recording with live 8-channel Canvas waveforms (synthetic data, 256Hz, 10-20 system)
- Full record → consent → upload → list flow
- Filecoin storage via `@filoz/synapse-sdk` (real upload with PieceCID, falls back to demo mode)
- Marketplace browse and detail pages with varied demo data
- AI agent page with Cerebras streaming, tool call display, budget tracking, consent enforcement
- Dashboard with charts, transactions, activity feed
- All 7 API routes
- Smart contract + deploy/seed scripts

### What Needs External Setup
- `FILECOIN_PRIVATE_KEY` — needs a funded Calibration testnet wallet (both tFIL and USDFC)
- `MARKETPLACE_CONTRACT_ADDRESS` — run `pnpm deploy` after funding wallet
- `CEREBRAS_API_KEY` — needed for the AI agent to work (get from cerebras.ai)
- Run `pnpm seed` after deployment to populate marketplace with 5 demo datasets

### Demo Mode
All API routes gracefully fallback to demo mode when contract/keys aren't configured. The marketplace shows 5 varied demo datasets (different channel counts, sample rates, prices, consent terms), uploads generate SHA-256 based CIDs, purchases return mock tx hashes. The app is fully navigable without any external setup — only the AI agent requires the Cerebras API key.

## Package Versions (all latest as of Feb 2026)

- `ai@6.0.97` — Vercel AI SDK v6 (uses `streamText`, `stepCountIs`, `toUIMessageStreamResponse`, `DefaultChatTransport`, `inputSchema` on tools)
- `@ai-sdk/cerebras@2.0.34` — Returns `LanguageModelV3`
- `@ai-sdk/react@3.0.99` — `useChat` returns `{ messages, status, sendMessage, setMessages }`. No `isLoading` or `append`.
- `@filoz/synapse-sdk@0.37.0` — Filecoin Onchain Cloud storage (uses viem for client, not ethers)
- `viem@2.46.3` — Required by Synapse SDK
- `zod@4.3.6` — Zod v4
- `next@15.5.12` — Next.js 15 with App Router
- `tailwindcss@4.2.1` — Tailwind v4 (uses `@theme` block in CSS, `@tailwindcss/postcss` plugin)
- `ethers@6.13.4` — ethers v6 (used for marketplace contract interaction)
- `framer-motion@12.6.3`
- `zustand@5.0.3`

## Filecoin Storage (Synapse SDK)

`src/lib/filecoin/synapse.ts` integrates `@filoz/synapse-sdk` for real Filecoin storage:
- Initializes Synapse with viem wallet client on Calibration testnet (chainId 314159)
- `uploadToFilecoin()` → calls `synapse.storage.upload()` → returns PieceCID
- `retrieveFromFilecoin()` → calls `synapse.storage.download({ pieceCid })` → returns Uint8Array
- Graceful fallback to demo mode (SHA-256 CID generation) when private key not configured
- Requires USDFC for storage payments (get from Calibration faucet)

Note: Synapse SDK uses **viem** for its client, while marketplace contract uses **ethers v6**. Both coexist.

## AI SDK v6 API Notes (important for future edits)

The AI SDK underwent major API changes from v4 → v5 → v6. Key patterns:

### Server (API routes)
```typescript
import { streamText, stepCountIs } from 'ai';
import { cerebras } from '@ai-sdk/cerebras';

const result = streamText({
  model: cerebras('llama-3.3-70b'),  // Returns LanguageModelV3
  system: '...',
  messages,
  tools: myTools,
  stopWhen: stepCountIs(10),  // NOT maxSteps
});
return result.toUIMessageStreamResponse();  // NOT toDataStreamResponse
```

### Tools
```typescript
import { tool } from 'ai';
import { z } from 'zod';

const myTool = tool({
  description: '...',
  inputSchema: z.object({ ... }),  // NOT parameters
  execute: async (input) => { ... },
});
```

### Client (React)
```typescript
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const transport = useMemo(() => new DefaultChatTransport({ api: '/api/my-route' }), []);
const { messages, status, sendMessage, setMessages } = useChat({ transport });
// status: 'ready' | 'submitted' | 'streaming'
// sendMessage({ text: '...' })  — NOT append({ role, content })
// messages have .parts array (TextUIPart, DynamicToolUIPart, etc.) — NOT .content or .toolInvocations
```

### UIMessage Parts (rendering)
```typescript
message.parts.map(part => {
  if (part.type === 'text') { /* part.text */ }
  if (part.type === 'dynamic-tool') {
    // part.toolName, part.state ('input-available' | 'output-available' | ...), part.input, part.output
  }
  // Typed tools: part.type === 'tool-${toolName}'
})
```

## Design System

Dark neon neurotech aesthetic. Key tokens defined in `src/app/globals.css` under `@theme`:
- Backgrounds: `bg-primary` (#0a0a0f), `bg-panel` (#12121a), `bg-card` (#1a1a2e)
- Neon accents: `neon-cyan` (#00ffff), `neon-magenta` (#ff00ff), `neon-green` (#39ff14), `neon-amber` (#ffd740)
- Fonts: Inter (body), JetBrains Mono (code/data)
- Glassmorphism: `.glass-panel` class (backdrop-blur + border)

## EEG Engine

Synthetic signal generator in `src/lib/eeg/generator.ts`:
- Additive synthesis: delta (0.5-4Hz), theta (4-8Hz), alpha (8-13Hz), beta (13-30Hz)
- Band weights vary by brain region (occipital = more alpha, frontal = more beta)
- Realistic amplitudes: delta ~75µV, theta ~50µV, alpha ~60µV, beta ~25µV
- Pink noise background (~15µV) via Voss-McCartney algorithm
- Artifacts: eye blinks (120µV) on Fp1/Fp2, muscle bursts (40µV) on T7/T8
- 8 channels using 10-20 system: Fp1, Fp2, C3, C4, T7, T8, O1, O2
- Canvas ring buffer rendering with dynamic amplitude scaling at ~60fps
- ~4 samples/frame at 60fps ≈ 240 samples/s (approximating 256Hz)

## Agent Features

- Budget tracking across multi-step tool calls (resetAgentSession/sessionSpent)
- Consent enforcement: agent tools reject datasets without AI training consent
- HTTP error handling on all fetch() calls
- Varied demo data creates interesting tradeoffs (premium vs budget vs overpriced vs consent-blocked)

## Smart Contract

`contracts/NeuralDataMarketplace.sol` — Solidity 0.8.20 with OpenZeppelin ReentrancyGuard:
- `listDataset(...)` → emits DatasetListed
- `purchaseDataset(id, buyerType)` payable → escrow to owner revenue
- `delistDataset(id)`, `withdrawFunds()`
- View: `getDataset`, `getActiveListings`, `getPurchaseHistory`, `getOwnerRevenue`, `getDatasetCount`
- Uses native tFIL (no ERC-20)
- Target: Filecoin Calibration Testnet (chainId 314159)

## File Structure

```
pl_neurotech/
├── contracts/NeuralDataMarketplace.sol
├── scripts/deploy.ts, seed.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── record/page.tsx
│   │   ├── marketplace/page.tsx, [id]/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── api/ (7 routes)
│   ├── components/ (ui, eeg, marketplace, agent, dashboard, layout, landing, storage)
│   ├── lib/ (eeg/, filecoin/, agent/)
│   ├── stores/ (eeg-store, marketplace-store, agent-store)
│   └── types/ (eeg, marketplace, agent, filecoin)
├── hardhat.config.ts
├── package.json, tsconfig.json, next.config.ts
└── .env.local
```

## Common Commands

```bash
pnpm dev          # Dev server with Turbopack
pnpm build        # Production build
pnpm compile      # Compile Solidity contracts
pnpm deploy       # Deploy to Calibration testnet
pnpm seed         # Seed marketplace with 5 demo datasets
```

## Pre-Demo Setup

1. Get tFIL from faucet: https://faucet.calibnet.chainsafe-fil.io
2. Get USDFC from faucet: https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc
3. Set `FILECOIN_PRIVATE_KEY` in `.env.local`
4. Deploy contract: `pnpm deploy` → copy address to `MARKETPLACE_CONTRACT_ADDRESS`
5. Seed data: `pnpm seed`
6. Get Cerebras API key from cerebras.ai → set `CEREBRAS_API_KEY`
