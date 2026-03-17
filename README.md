# Lido Yield Agent Treasury

A smart contract primitive that gives AI agents a yield-bearing operating budget backed by stETH.

Humans deposit stETH — the principal stays locked and inaccessible to the agent, while staking yield flows into a spendable balance the agent can draw from. Spending is enforced onchain via configurable permissions: recipient whitelists, per-transaction caps, and time windows.

## Problem

AI agents need operating budgets to pay for API calls, compute, and services — but giving an agent direct access to funds is risky. There is no onchain primitive that lets a human fund an agent with yield-only spending while keeping the principal structurally safe.

This project solves that by using Lido stETH yield as the agent's budget source, with contract-level permission enforcement.

## Project Structure

```
frontend/    → Next.js frontend
contracts/   → Solidity smart contracts (Foundry)
```

## Built For

[The Synthesis Hackathon](https://synthesis.md) — stETH Agent Treasury track by Lido Labs Foundation.
