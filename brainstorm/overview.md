# Lidogent — Project Overview

## What is Lidogent?

Lidogent is a smart contract primitive that gives AI agents a yield-bearing operating budget backed by stETH. Humans deposit stETH, the principal stays locked and inaccessible, while staking yield (~3.5% APY) flows into a spendable balance that agents use to pay for AI services like Claude, ChatGPT, Gemini, and Perplexity — all enforced onchain.

---

## Frontend Architecture

### Pages & User Flow

```
Stake (/)  →  Agent Hub (/agent-hub)  →  Treasury (/treasury)
   │                  │                         │
   │                  │                         │
 FUND            EXECUTE               CONFIGURE
```

### 1. Stake (`/`)

The entry point. Users convert ETH to stETH via Lido.

**Layout:** Two-column — stake form (left) + staking info with Lidogent background (right), followed by Treasury Overview banner.

**Components:**
- `StakePanel` — ETH input, stETH output, exchange rate, MAX button, "Stake ETH" button
- `HeroBanner` — Treasury Overview with locked principal, spendable yield (live accumulation + ~3.5% APY badge), total spent

**User action:** Stake ETH → receive stETH → deposit to treasury.

---

### 2. Agent Hub (`/agent-hub`)

The execution layer. Users chat with AI, manage services, and monitor spending.

**Layout:** Dashboard card layout — AI Chat (full width top), Spending + Quick Actions (2:1 grid), Services + Activity Feed (3:2 grid).

**Components:**

#### AI Chat (`AiChat`)
- Model selector: Claude, ChatGPT, Gemini, Perplexity (with real logos)
- Chat interface with message bubbles
- Each AI response shows cost (e.g. "0.0003 stETH via x402")
- Active Agent card (top right) — shows which agent is paying and remaining budget
- Agent selector dropdown (bottom) — choose Parent Agent or Sub-Agent A/B/C
- Payment via x402 HTTP payment protocol from stETH yield

#### Monthly Spending (`SpendingSummary`)
- Total budget, spent, remaining with stETH amounts
- Overall usage progress bar
- Category breakdown: Research, Infrastructure, Hosting

#### Quick Actions (`QuickActions`)
- Add Service, Pause All Agents, Refresh Budgets, Set Alerts

#### Active Services (`ActiveServices`)
- Table: service name (with logo), category, usage progress bar, last used, revoke button
- Services: Perplexity, OpenAI, Claude, Gemini, ChatGPT
- "Add Service" button opens modal with framer-motion animations
- Modal shows AI services with logos + custom address input

#### Activity Feed (`ActivityFeed`)
- Timeline of agent operations: payments, approvals, alerts, yield harvests
- Each entry shows service logo, description, cost, and time ago

---

### 3. Treasury (`/treasury`)

The configuration layer. Users set permissions, manage agent hierarchy, and configure budgets.

**Layout:** Treasury Overview banner (full width) + tabbed DashboardPanel.

**Components:**

#### Treasury Overview (`HeroBanner`)
- Background: Lidogent anime character with blue overlay
- Three glassmorphism cards: Locked Principal, Spendable Yield, Total Spent
- Live yield indicator: plant icon + incrementing counter
- ~3.5% APY badge

#### Dashboard Panel (`DashboardPanel`)
Tabbed sidebar navigation with 5 sections:

1. **Agent Actions** (`AgentActions`)
   - Sub-agent selector dropdown
   - Available yield display per selected agent
   - Recipient + amount inputs
   - "Trigger Spend" button
   - Next cycle reset countdown

2. **Permissions** (`PermissionPanel`)
   - Recipient Whitelist — add/remove addresses, enable/disable toggle
   - Per-Transaction Cap — max stETH per spend
   - Daily Rate Limit — max stETH per day

3. **Configuration** (`AgentInfo`)
   - Agent address, owner address, status (active/paused)
   - Budget Cycle: 30-day duration, next reset countdown, allocated vs unallocated yield

4. **Hierarchy** (`AgentTree`)
   - Parent agent card with total budget + progress bar
   - 3 sub-agent cards connected via tree lines:
     - Sub-Agent A (Research) — active
     - Sub-Agent B (Execution) — active
     - Sub-Agent C (Integration) — paused
   - Each card: address, budget cap, spent progress bar, status badge, pause/resume button

5. **Spend Log** (`SpendLog`)
   - Filterable transaction list
   - Color-coded agent badges (Research=blue, Execution=amber, Integration=green)
   - Recipient labels (e.g. "Claude API", "Gemini API")
   - Memo text per transaction

---

## Shared Components

### Header (`Header`)
- Lidogent logo + brand name
- Navigation: Stake | Agent Hub | Treasury
- Custom wallet: ConnectWallet + ChainSelector (Ethereum Mainnet)

### ConnectWallet (`ConnectWallet`)
- Not connected: "Connect Wallet" button (opens RainbowKit modal)
- Connected: chain selector dropdown + account menu (balance, address, copy, disconnect)

---

## Design System

- **Theme:** Blue (#2563eb) + White minimalist
- **Font:** Inter
- **Tokens:** `bg-brand`, `bg-brand-light`, `bg-surface`, `bg-main-bg`, `text-text-main`, `text-text-secondary`, `border-border-main`
- **Rules:** No gradients, no emojis, no decorative elements. Minimal borders, consistent radius + spacing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Web3 | wagmi v2, viem, RainbowKit |
| Animation | framer-motion |
| Icons | react-icons (Heroicons Outline) |
| Toast | sonner |
| Linting | Biome |

---

## How It All Connects

```
Human deposits ETH
       │
       ▼
  Stake Page (/)
  ETH → stETH via Lido
       │
       ▼
  Treasury (/treasury)
  Deposit stETH → principal locked
  Configure: permissions, hierarchy, budgets
       │
       ▼
  Agent Hub (/agent-hub)
  Agent chats with AI (Claude, ChatGPT, Gemini, Perplexity)
  Each request paid from stETH yield via x402
  Agent can only spend to whitelisted addresses
  Within per-tx caps and daily rate limits
  Principal never touched
```

---

## Key Differentiators

1. **Principal safety** — Structurally locked, not just access-controlled
2. **Yield-only spending** — Agent budget comes from staking rewards, not deposits
3. **Multi-agent hierarchy** — Parent allocates budgets to specialized sub-agents
4. **Pay-per-request** — No subscriptions, no prepaid credits; x402 micropayments
5. **Onchain enforcement** — Permissions enforced at smart contract level
6. **Real AI integration** — Claude, ChatGPT, Gemini, Perplexity with actual logos and pricing
