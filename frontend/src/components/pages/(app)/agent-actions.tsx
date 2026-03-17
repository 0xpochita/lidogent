"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTreasuryStore } from "@/stores/treasury-store";

const AGENTS = [
  { id: "parent", label: "Parent Agent", role: "Treasury Owner", budget: "1.2000" },
  { id: "sub-a", label: "Sub-Agent A", role: "Research", budget: "0.2800" },
  { id: "sub-b", label: "Sub-Agent B", role: "Execution", budget: "0.2900" },
  { id: "sub-c", label: "Sub-Agent C", role: "Integration", budget: "0.2850" },
];

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CycleCountdown({ targetTimestamp }: { targetTimestamp: number }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, Math.floor(targetTimestamp - Date.now() / 1000));
      setRemaining(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return (
    <div className="flex items-center justify-between rounded-xl bg-main-bg px-4 py-3">
      <span className="text-sm text-text-secondary">Next cycle reset</span>
      <span className="font-mono text-sm font-semibold text-text-main">
        {formatCountdown(remaining)}
      </span>
    </div>
  );
}

export function AgentActions() {
  const treasury = useTreasuryStore((s) => s.treasury);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("parent");

  const isPaused = treasury?.isPaused ?? false;
  const nextCycle = treasury?.nextCycleTimestamp ?? Math.floor(Date.now() / 1000) + 86400;
  const agent = AGENTS.find((a) => a.id === selectedAgent) ?? AGENTS[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Trigger Spend</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Send wstETH yield to a whitelisted recipient
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="agent-select" className="mb-1.5 block text-sm font-medium text-text-main">
            Select Agent
          </label>
          <select
            id="agent-select"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-border-main bg-main-bg px-4 py-3 text-sm text-text-main focus:border-brand focus:outline-none"
          >
            {AGENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} ({a.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-brand-light px-5 py-4">
          <div>
            <span className="text-sm font-medium text-text-secondary">Remaining budget</span>
            <p className="mt-0.5 text-xs text-text-secondary">{agent.role}</p>
          </div>
          <span className="flex items-center gap-1.5 text-lg font-semibold text-brand">
            {formatETH(agent.budget)} wstETH
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" className="rounded-full" width={18} height={18} />
          </span>
        </div>

        <div>
          <label htmlFor="spend-recipient" className="mb-1.5 block text-sm font-medium text-text-main">
            Recipient
          </label>
          <input
            id="spend-recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isPaused}
            className="w-full rounded-xl border border-border-main bg-main-bg px-4 py-3 font-mono text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="spend-amount" className="mb-1.5 block text-sm font-medium text-text-main">
            Amount
          </label>
          <div className="flex items-center gap-2">
            <input
              id="spend-amount"
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              disabled={isPaused}
              className="w-full rounded-xl border border-border-main bg-main-bg px-4 py-3 text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none disabled:opacity-50"
            />
            <span className="flex items-center gap-1 whitespace-nowrap text-sm text-text-secondary">
              wstETH
              <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" className="rounded-full" width={16} height={16} />
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isPaused || !amount || !recipient}
        className="w-full cursor-pointer rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPaused ? "Agent Paused" : "Trigger Spend"}
      </button>

      <CycleCountdown targetTimestamp={nextCycle} />
    </div>
  );
}
