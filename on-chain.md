# NeuroVault — On-Chain Activity Report

**Network:** Filecoin Calibration Testnet (Chain ID: 314159)
**Wallet:** `0x6Bd07000C5F746af69BEe7f151eb30285a6678B2`
**Block Explorer:** https://filecoin-testnet.blockscout.com/address/0x6Bd07000C5F746af69BEe7f151eb30285a6678B2

---

## Smart Contract

| Field | Value |
|-------|-------|
| **Contract** | `NeuralDataMarketplace.sol` (Solidity 0.8.20) |
| **Address** | [`0x0A027767aC1e4aA5474A1B98C3eF730C3994E67b`](https://filecoin-testnet.blockscout.com/address/0x0A027767aC1e4aA5474A1B98C3eF730C3994E67b) |
| **Deployment Tx** | [`0xee4f103e52dff951...`](https://filecoin-testnet.blockscout.com/tx/0xee4f103e52dff951) |
| **Block** | 3,491,880 |
| **Security** | OpenZeppelin ReentrancyGuard |

**Contract Functions:**
- `listDataset()` — List EEG data with CID, price, consent terms
- `purchaseDataset()` — Buy access to a dataset (payable in tFIL)
- `delistDataset()` — Remove a listing (owner only)
- `withdrawFunds()` — Withdraw revenue from sales
- `getDataset()` / `getActiveListings()` / `getDatasetCount()` — Read marketplace state
- `getPurchaseHistory()` / `getOwnerRevenue()` — Query purchase/revenue data

---

## Synapse SDK — Filecoin Onchain Cloud Storage

| Field | Value |
|-------|-------|
| **SDK** | `@filoz/synapse-sdk@0.37.0` |
| **USDFC Token** | [`0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0`](https://filecoin-testnet.blockscout.com/address/0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0) |
| **Payments Contract** | [`0x09a0fDc2723fAd1A7b8e3e00eE5DF73841df55a0`](https://filecoin-testnet.blockscout.com/address/0x09a0fDc2723fAd1A7b8e3e00eE5DF73841df55a0) |
| **USDFC Deposited** | 5 USDFC |
| **USDFC Available** | ~4.94 USDFC (after storage fees) |

### Synapse Transactions

| Action | Tx Hash | Block |
|--------|---------|-------|
| ERC20 Approve (USDFC → Payments) | `0xf7fa1cff023bbdb817e32c8ebab8ea3f54755b41e84afba45a8b754d60d85d20` | 3,493,804 |
| Deposit 5 USDFC into Synapse | `0xb394579df2575c47be2a63f680cf88c1c63fc56e8a7397aaf4e7160c7e36ddc7` | 3,493,806 |
| Approve Warm Storage Operator | `0x0e6559802c9eb7816cf9eb3787fe78dda35822c9de95bc1d55aa93ae0a13d6a1` | 3,494,005 |

---

## On-Chain Datasets (7 total)

All datasets verified via `getDataset()` read calls on the deployed contract.

### Seeded Datasets (5) — Listed at deployment

| ID | Type | CID | Price | Channels | Rate | Duration | AI Training |
|----|------|-----|-------|----------|------|----------|-------------|
| 0 | Resting State EEG | `bafybeigdyrzt5sfp7...` | 0.008 tFIL | 8 | 256 Hz | 120s | Yes |
| 1 | Cognitive Task Premium | `bafybeif7ztnhq65lu...` | 0.035 tFIL | 16 | 512 Hz | 180s | Yes |
| 2 | Sleep Stage N2 | `bafybeihdwdcefgh4d...` | 0.003 tFIL | 8 | 256 Hz | 60s | No |
| 3 | Motor Imagery BCI | `bafybeibml5uieyxa5...` | 0.005 tFIL | 4 | 128 Hz | 45s | Yes |
| 4 | Meditation EEG | `bafybeiczsscdsbs7f...` | 0.025 tFIL | 4 | 128 Hz | 30s | Yes |

### Live-Recorded Datasets (2) — Created via app UI

| ID | Type | CID | Price | Channels | Rate | Duration | AI Training |
|----|------|-----|-------|----------|------|----------|-------------|
| 5 | Live Recording #1 | `bafybeig49394492...` | 0.01 tFIL | 8 | 256 Hz | 1s | Yes |
| 6 | **Live Recording #2 (Real Filecoin)** | `bafkzcibd3jwawdqr24ek2mynzecrpwi47f6jmpwmps7ujhxmo4aqnkwas52y2ois` | 0.01 tFIL | 8 | 256 Hz | 1s | Yes |

**Dataset #6** was uploaded via Synapse SDK to a real Filecoin storage provider (Provider #9) and returned a genuine PieceCID (`bafkz...`). This proves end-to-end storage on Filecoin Onchain Cloud with PDP verification.

---

## Full Transaction History (11 transactions)

| # | Action | Tx Hash | Block | Date |
|---|--------|---------|-------|------|
| 1 | Faucet: Receive tFIL | `0x9037b1fe0fe88ba4...` | 3,491,724 | 2026-02-26 |
| 2 | Deploy NeuralDataMarketplace | `0xee4f103e52dff951...` | 3,491,880 | 2026-02-26 |
| 3 | listDataset #0 (Resting State) | `0xa7aae2999535b39c...` | 3,491,883 | 2026-02-26 |
| 4 | listDataset #1 (Cognitive Task) | `0xe106dd9112fc13b6...` | 3,491,885 | 2026-02-26 |
| 5 | listDataset #2 (Sleep Stage) | `0x3eb25b63903666ed...` | 3,491,887 | 2026-02-26 |
| 6 | listDataset #3 (Motor Imagery) | `0x40e02c92034592684...` | 3,491,889 | 2026-02-26 |
| 7 | listDataset #4 (Meditation) | `0x0e67f7a6d4a32c43...` | 3,491,891 | 2026-02-26 |
| 8 | Approve USDFC for Synapse | `0xf7fa1cff023bbdb817e32c8ebab8ea3f54755b41e84afba45a8b754d60d85d20` | 3,493,804 | 2026-02-26 |
| 9 | Deposit 5 USDFC into Synapse | `0xb394579df2575c47be2a63f680cf88c1c63fc56e8a7397aaf4e7160c7e36ddc7` | 3,493,806 | 2026-02-26 |
| 10 | listDataset #5 (Live Recording) | `0x430efbf4fa462410...` | 3,493,994 | 2026-02-26 |
| 11 | Approve Warm Storage Operator | `0x0e6559802c9eb7816cf9eb3787fe78dda35822c9de95bc1d55aa93ae0a13d6a1` | 3,494,005 | 2026-02-26 |
| 12 | listDataset #6 (Real Synapse Upload) | `0x2af085b16715db2b...` | 3,494,074 | 2026-02-26 |

---

## Wallet Balances (current)

| Asset | Balance |
|-------|---------|
| tFIL (native) | ~105 tFIL |
| USDFC (wallet) | 5 USDFC |
| USDFC (Synapse deposited) | ~4.94 USDFC |

---

## How to Verify

1. **Contract code & txs:** Visit the [contract on Blockscout](https://filecoin-testnet.blockscout.com/address/0x0A027767aC1e4aA5474A1B98C3eF730C3994E67b)
2. **Wallet activity:** Visit the [wallet on Blockscout](https://filecoin-testnet.blockscout.com/address/0x6Bd07000C5F746af69BEe7f151eb30285a6678B2)
3. **Read contract state:** Call `getDatasetCount()` and `getDataset(6)` on the contract to see the real Synapse-uploaded dataset
4. **Verify PieceCID:** The CID `bafkzcibd3jwawdqr24ek2mynzecrpwi47f6jmpwmps7ujhxmo4aqnkwas52y2ois` is a real PieceCID stored by Filecoin storage provider #9 via Synapse SDK
5. **USDFC token:** Check `balanceOf(0x6Bd07000C5F746af69BEe7f151eb30285a6678B2)` on the [USDFC contract](https://filecoin-testnet.blockscout.com/address/0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0)
