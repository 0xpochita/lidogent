"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTreasuryStore } from "@/stores/treasury-store";

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

  const available = treasury?.availableYield ?? "0";
  const isPaused = treasury?.isPaused ?? false;
  const nextCycle = treasury?.nextCycleTimestamp ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Trigger Spend</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Send stETH yield to a whitelisted recipient
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-brand-light px-5 py-4">
        <span className="text-sm font-medium text-text-secondary">Available yield</span>
        <span className="flex items-center gap-1.5 text-lg font-semibold text-brand">
          {formatETH(available)} stETH
          <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={18} height={18} />
        </span>
      </div>

      <div className="space-y-4">
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
              stETH
              <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
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

      {nextCycle > 0 && <CycleCountdown targetTimestamp={nextCycle} />}
    </div>
  );
}
