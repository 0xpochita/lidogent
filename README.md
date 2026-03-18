<div align="center">
  <img src="./frontend/public/Assets/Images/Logo/lidogent-logo.webp" width="200" alt="Lidogent Logo">

# Lidogent

**Yield-bearing operating budget for AI agents, powered by Lido stETH.**
**Humans deposit, principal stays locked, agents spend only from yield.**

[![Ethereum](https://img.shields.io/badge/Ethereum-Mainnet-blue)](https://etherscan.io)
[![Lido](https://img.shields.io/badge/Lido-stETH-00A3FF)](https://lido.fi)
[![Chainlink](https://img.shields.io/badge/Chainlink-ETH%2FUSD-375BD2)](https://data.chain.link)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## What is Lidogent?

AI agents need operating budgets to pay for API calls, compute, and services. But giving an agent direct access to funds is risky — one bug or exploit and the treasury is drained.

**Lidogent** solves this by using Lido stETH staking yield as the agent's budget source. Humans deposit ETH, which gets staked via Lido and wrapped to wstETH. The principal is **structurally locked** in the smart contract — no function exists for the agent to access it. Only the **yield** (staking rewards, ~2.4% APR) flows into the agent's spendable balance.

All spending is enforced onchain: recipient whitelists, per-transaction caps, cycle rate limits, and per-agent budgets.

---

## Problem

| Problem | Description |
|---------|-------------|
| **No Safe Funding** | Giving agents direct access to funds means one exploit drains everything |
| **No Yield Utilization** | Staked ETH earns rewards, but agents can't use that yield autonomously |
| **No Onchain Permissions** | Existing solutions rely on off-chain trust, not contract-level enforcement |

## Solution

| Solution | How |
|----------|-----|
| **Principal Locked** | wstETH deposited as principal — structurally inaccessible to agent |
| **Yield-Only Spending** | Agent budget comes from staking rewards via Lido (~2.4% APR) |
| **Onchain Permissions** | Whitelist, per-tx cap, cycle rate limit — all enforced at contract level |

---

## Key Features

| Feature | Description |
|---------|-------------|
| Fully Onchain | All deposits, permissions, and spending recorded on Ethereum Mainnet |
| Lido Integration | Real stETH/wstETH staking via Lido — no mocks |
| Multi-Agent | Parent agent + sub-agents with individual budget caps |
| AI Chat | Pay per request via x402 (Claude, ChatGPT, Gemini, Perplexity) |
| Live Data | ETH price from Chainlink, APR from Lido API, balances from ERC20 |
| Permission Controls | Whitelist toggle, per-tx cap, cycle rate limit — owner configurable |

---

## System Architecture

```
Human deposits ETH
       |
       v
  Lido (0xae7a...)
  submit() → receives stETH
       |
       v
  wstETH (0x7f39...)
  wrap() → non-rebasing token
       |
       v
  AgentTreasury (0x783e...)
  principal locked, yield accrues
       |
       v
  Agent spends yield
  → AI services (Claude, ChatGPT, Gemini, Perplexity)
  → Only to whitelisted addresses
  → Within per-tx caps and cycle limits
  → Principal never touched
```

---

## User Flow

```mermaid
stateDiagram-v2
    [*] --> Stake: Deposit ETH
    Stake --> stETH: Lido submit()
    stETH --> wstETH: wrap()
    wstETH --> Treasury: depositWstETH()
    Treasury --> Yield: stEthPerToken increases
    Yield --> Spend: agent spend()
    Spend --> [*]: AI services paid
```

| Phase | Action | Actor |
|-------|--------|-------|
| Stake | ETH → stETH via Lido | Anyone |
| Wrap | stETH → wstETH, lock in treasury | Anyone |
| Configure | Set permissions, agents, budgets | Owner |
| Spend | Agent pays for AI services from yield | Agent |

---

## Deployed Contracts (Ethereum Mainnet)

| Contract | Address | Verified |
|----------|---------|----------|
| AgentTreasury | [`0x783e1512bFEa7C8B51A92cB150FEb5A04b91E9Aa`](https://etherscan.io/address/0x783e1512bFEa7C8B51A92cB150FEb5A04b91E9Aa) | Yes |
| Lido stETH | [`0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84`](https://etherscan.io/address/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) | Yes |
| wstETH | [`0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0`](https://etherscan.io/address/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0) | Yes |

---

## Project Structure

| Folder | Purpose |
|--------|---------|
| `frontend/` | Next.js 16 frontend with wagmi, RainbowKit, Tailwind CSS 4 |
| `contracts/` | Solidity smart contracts (Foundry), interfaces, tests, deploy script |
| `brainstorm/` | Architecture docs, flow, smart contract spec, contract addresses |
| `conversation-log/` | Human-agent collaboration log, contribution breakdown |
| `skills/` | AI agent skill documentation (SKILL.md) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Smart Contract Spec](./brainstorm/smart-contract.md) | AgentTreasury architecture, functions, FE mapping |
| [User Flow](./brainstorm/flow.md) | 11-step user flow from stake to spend |
| [Project Overview](./brainstorm/overview.md) | Full frontend architecture, components, design system |
| [Contract Addresses](./brainstorm/contract-address.md) | Deployed addresses and interaction flows |
| [Conversation Log](./conversation-log/conversation-log.md) | 25 sessions of human-agent collaboration |
| [Contribution Breakdown](./conversation-log/contribution-breakdown.md) | Human vs Agent contributions |
| [Agent Skill](./skills/SKILL.md) | Lido integration skill for AI agents |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Ethereum Mainnet |
| Smart Contracts | Solidity 0.8.20, OpenZeppelin, Foundry |
| Frontend | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS 4, framer-motion |
| Web3 | wagmi v2, viem, RainbowKit |
| State | Zustand |
| Oracles | Chainlink ETH/USD Price Feed |
| Staking | Lido stETH, wstETH |
| AI | OpenRouter API (Gemini Flash) |
| Icons | react-icons (Heroicons Outline) |

---

## Testing

All tests run against **real Lido contracts on Ethereum Mainnet** via fork testing. No mocks.

```bash
cd contracts
forge test --fork-url https://eth.drpc.org -v
```

**30/30 tests passing** covering:
- Deposits (ETH, stETH, wstETH)
- Yield accrual and spending
- Whitelist, per-tx cap, cycle rate limit enforcement
- Sub-agent budget caps and pause/resume
- Owner-only access control
- Principal withdrawal protection

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Foundry (forge, cast)

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in NEXT_PUBLIC_WC_PROJECT_ID, RPC_URL, OPENROUTER_API_KEY
pnpm install
pnpm dev
```

### Smart Contracts

```bash
cd contracts
forge build
forge test --fork-url https://eth.drpc.org -v
```

---

## Built For

[**The Synthesis Hackathon**](https://synthesis.md) — stETH Agent Treasury track by Lido Labs Foundation ($3,000 prize pool).

Built by **0xpochita** (Human) and **Claude Opus 4.6** (AI Agent) in 2 days.

---

## Resources

### Lido Finance
- [stETH Integration Guide](https://docs.lido.fi/guides/steth-integration-guide) — rebasing drift is the key section
- [wstETH Contract Docs](https://docs.lido.fi/contracts/wsteth)
- [Deployed Contracts](https://docs.lido.fi/deployed-contracts)
- [Lido JS SDK](https://github.com/lidofinance/lido-ethereum-sdk)

### Lidogent
- [AgentTreasury on Etherscan](https://etherscan.io/address/0x783e1512bFEa7C8B51A92cB150FEb5A04b91E9Aa)
- [GitHub Repository](https://github.com/0xpochita/lidogent)
