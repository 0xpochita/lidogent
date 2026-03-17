"use client";

import { useState, useEffect } from "react";

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-sm font-medium text-text-main ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "0d 00:00:00";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function BudgetCycle() {
  const resetTimestamp = Math.floor(Date.now() / 1000) + 86400 * 18;
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      setRemaining(Math.max(0, Math.floor(resetTimestamp - Date.now() / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [resetTimestamp]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-main">Budget Cycle</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <span className="text-sm text-text-secondary">Cycle duration</span>
          <span className="text-sm font-medium text-text-main">30 days</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-brand/20 bg-brand-light px-5 py-4">
          <span className="text-sm text-text-secondary">Next reset</span>
          <span className="font-mono text-sm font-semibold text-brand">{formatCountdown(remaining)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <span className="text-sm text-text-secondary">Allocated to sub-agents</span>
          <span className="text-sm font-medium text-text-main">0.8550 stETH</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <span className="text-sm text-text-secondary">Unallocated yield</span>
          <span className="text-sm font-semibold text-brand">0.3450 stETH</span>
        </div>
      </div>
    </div>
  );
}

export function AgentInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Agent Configuration</h3>
        <p className="mt-1 text-sm text-text-secondary">Current agent and owner details</p>
      </div>
      <div className="space-y-3">
        <InfoRow label="Agent Address" value="0x1a2B...eF12" mono />
        <InfoRow label="Owner Address" value="0xeBa4...4179" mono />
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-brand" />
            <span className="text-sm text-text-secondary">Agent Status</span>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
            Active
          </span>
        </div>
      </div>

      <div className="border-t border-border-main pt-6">
        <BudgetCycle />
      </div>
    </div>
  );
}
