# NeuroVault Demo Script (~3-4 minutes)

## 1. The Problem (15s)

"Your brain data is the most sensitive data you own — but there's no way to monetize it while keeping control. We built NeuroVault."

## 2. Record EEG — `/record` (45s)

- Hit **Record**, show live 8-channel waveforms rendering in real-time
- Point out: "Synthetic 256Hz EEG across 8 channels — Fp1, Fp2, C3, C4, T7, T8, O1, O2. You can see eye blink artifacts on the frontal channels."
- Stop recording after ~10s
- **Consent step**: Toggle the switches — "The data owner controls exactly what their data can be used for. Research, commercial, AI training — each is independently toggled. This is cognitive sovereignty."
- Set a price, hit **Upload to Filecoin & Create Listing**

## 3. Filecoin Storage (15s)

- "The EEG data is uploaded to Filecoin via the Synapse SDK — real decentralized storage with Proof of Data Possession. The PieceCID is the on-chain anchor for provenance."
- Show the CID display and transaction hash

## 4. Marketplace — `/marketplace` (30s)

- "Five neural datasets are listed on-chain on Filecoin Calibration testnet. Each has different specs, prices, and consent terms."
- Click into a dataset — show provenance chain, consent badges, pricing
- Point out the dataset with **no AI training consent** — "This one can't be purchased by AI agents. Consent is enforced, not optional."

## 5. AI Agent — `/agent` (60-90s) ⭐ The Money Shot

- "Now the interesting part. We launch an autonomous AI buyer agent with a 0.05 tFIL budget."
- Hit **Launch Agent**, watch it stream:
  1. Agent browses marketplace (tool call)
  2. Evaluates each dataset (quality scores, value analysis)
  3. **Rejects Dataset #2** — "No AI training consent. I must respect data sovereignty."
  4. **Rejects Dataset #4** — "Overpriced for the specs."
  5. **Purchases Dataset #0** — best value
  6. Checks remaining budget, maybe purchases Dataset #3
  7. Summary of spending
- "The agent made autonomous purchasing decisions, respected consent boundaries, and tracked its budget — all with on-chain settlement on Filecoin."

## 6. Dashboard — `/dashboard` (15s)

- Quick flash of revenue stats, transaction history, activity feed

## 7. Architecture Close (15s)

- "Next.js 15, Synapse SDK on Filecoin Calibration testnet, Solidity smart contract, Cerebras Llama 3.3 70B for the agent — all open source."

---

## Key Phrases to Hit for Judges

**Technical Execution (40%)**: "Synapse SDK", "on-chain smart contract on Calibration testnet", "real PieceCIDs", "streaming tool calls"

**Innovation / Wow Factor (30%)**: "autonomous AI agents buying neural data with consent enforcement", "cognitive sovereignty"

**Potential Impact (20%)**: "brain data marketplace", "data owners control monetization"

**Presentation / Demo (10%)**: The live agent stream is the wow moment — let it run

## Pre-Demo Checklist

- [ ] Dev server running (`pnpm dev`)
- [ ] Browser open to `http://localhost:3000`
- [ ] Cerebras API key set in `.env.local`
- [ ] Contract deployed and seeded (already done)
- [ ] Test the agent page once before going live to warm up the API
