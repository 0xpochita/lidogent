# Lidogent — User Flow

## Step 1: Connect Wallet

User opens Lidogent and clicks "Connect Wallet" in the header. RainbowKit modal appears with wallet options (MetaMask, WalletConnect, etc.). After connecting, the header shows the user's address and ETH balance on Ethereum Mainnet.

---

## Step 2: Stake ETH to Get stETH

**Page: Stake (`/`)**

User enters an amount of ETH in the Stake panel. The interface shows:
- Exchange rate (1 ETH = ~1.0000 stETH)
- Estimated stETH to receive
- Max transaction cost (~$0.50)
- Reward fee (10%)

User clicks "Stake ETH" and confirms the transaction. ETH is sent to Lido, user receives stETH in their wallet. stETH earns ~3.5% APY from Ethereum staking rewards.

**After staking:** User can see the Treasury Overview banner below showing their locked principal, spendable yield, and total spent.

---

## Step 3: Deposit stETH to Agent Treasury

**Page: Treasury (`/treasury`)**

User navigates to the Treasury page. In the Agent Actions tab, user deposits stETH into the treasury smart contract.

What happens onchain:
- stETH is wrapped to wstETH internally
- The initial wstETH amount is recorded as principal
- Principal is structurally locked — no function exists for the agent to withdraw it
- Over time, wstETH value grows relative to stETH (that growth is the yield)
- Only the yield portion becomes spendable by the agent

---

## Step 4: Configure Agent Permissions

**Page: Treasury (`/treasury`) > Permissions tab**

User sets spending rules:

1. **Recipient Whitelist** — Toggle on, then add addresses of AI services the agent is allowed to pay (e.g. Claude API billing address, Perplexity API address)

2. **Per-Transaction Cap** — Set maximum stETH per single transaction (e.g. 0.01 stETH). Prevents the agent from draining yield in one transaction.

3. **Daily Rate Limit** — Set maximum total stETH per day (e.g. 0.1 stETH/day). Controls how fast the agent can spend.

All three are enforced at the smart contract level. If any rule is violated, the transaction reverts onchain.

---

## Step 5: Set Up Agent Hierarchy

**Page: Treasury (`/treasury`) > Hierarchy tab**

User configures sub-agents with dedicated budgets:

- **Parent Agent** — Total budget from yield (e.g. 1.2000 stETH)
- **Sub-Agent A (Research)** — Allocated 0.4000 stETH for research tasks
- **Sub-Agent B (Execution)** — Allocated 0.5000 stETH for compute tasks
- **Sub-Agent C (Integration)** — Allocated 0.3000 stETH for integration tasks

Each sub-agent can only spend within its allocated cap. User can pause/resume individual sub-agents at any time.

---

## Step 6: Add AI Services

**Page: Agent Hub (`/agent-hub`)**

User clicks "Add Service" in the Active Services card. A modal appears with popular AI services:

- Claude API (Anthropic)
- ChatGPT API (OpenAI)
- Gemini API (Google)
- Perplexity API (Perplexity AI)

User selects a service and sets a monthly budget cap. The service address gets added to the whitelist automatically. User can also enter a custom recipient address for other services.

---

## Step 7: Chat with AI (Pay Per Request)

**Page: Agent Hub (`/agent-hub`) > AI Chat**

User selects an AI model (Claude, ChatGPT, Gemini, or Perplexity) and types a message. The flow:

1. User sends message
2. Request goes to AI model via API
3. Payment is triggered via x402 HTTP payment protocol
4. Cost (e.g. 0.0003 stETH) is deducted from the selected agent's yield balance
5. AI response appears in the chat with cost displayed (e.g. "0.0003 stETH via x402")

User can choose which agent pays via the agent selector at the bottom:
- Parent Agent
- Sub-Agent A (Research)
- Sub-Agent B (Execution)
- Sub-Agent C (Integration)

The Active Agent card in the top right shows the currently selected agent and its remaining budget.

---

## Step 8: Monitor Spending

**Page: Agent Hub (`/agent-hub`)**

User monitors spending across all services:

- **Monthly Spending** — Total budget vs spent vs remaining, with breakdown by category (Research, Infrastructure, Hosting)
- **Active Services** — Table showing each service's usage progress bar, last used time, and revoke button
- **Activity Feed** — Real-time timeline of payments, approvals, alerts, and yield harvests

---

## Step 9: Review Transaction History

**Page: Treasury (`/treasury`) > Spend Log tab**

User reviews detailed transaction history:
- Filter by agent role
- See color-coded agent badges (Research, Execution, Integration)
- Each transaction shows: recipient label, amount in stETH, memo, and timestamp

---

## Step 10: Adjust and Maintain

User can at any time:
- **Pause agents** — Freeze all spending instantly via Quick Actions or per sub-agent in Hierarchy
- **Revoke services** — Remove a service from the whitelist in Active Services
- **Adjust caps** — Change per-transaction or daily limits in Permissions
- **Reallocate budgets** — Shift yield between sub-agents in Hierarchy
- **Withdraw principal** — Owner can withdraw the locked principal (only owner, never agent)
- **Top up** — Stake more ETH and deposit more stETH to increase yield budget

---

## Safety Guarantees Throughout

| What | Guarantee |
|------|-----------|
| Principal | Structurally locked in contract, no agent function can access it |
| Spending | Only from yield, enforced onchain |
| Recipients | Only whitelisted addresses, enforced onchain |
| Amounts | Per-tx cap and daily rate limit, enforced onchain |
| Pause | Owner can freeze all agent spending instantly |
| Visibility | Every transaction recorded onchain and visible in Spend Log |

---

## Flow Diagram

```
    STAKE                    CONFIGURE                    EXECUTE
      │                         │                           │
      ▼                         ▼                           ▼
  ┌────────┐            ┌──────────────┐            ┌──────────────┐
  │        │            │              │            │              │
  │  ETH   │──stake──▶  │   Treasury   │──yield──▶  │  Agent Hub   │
  │   →    │            │              │            │              │
  │ stETH  │            │ - Permissions│            │ - AI Chat    │
  │        │            │ - Hierarchy  │            │ - Services   │
  │        │            │ - Budgets    │            │ - Activity   │
  │        │            │ - Spend Log  │            │ - Spending   │
  └────────┘            └──────────────┘            └──────────────┘
       │                       │                          │
       │              principal locked              pay per request
       │              yield flows out               via x402 from
       └───────────────────────┴──────────────────── stETH yield
```
