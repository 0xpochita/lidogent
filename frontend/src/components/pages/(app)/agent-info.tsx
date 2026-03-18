"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlinePauseCircle, HiOutlinePlayCircle, HiOutlinePencilSquare, HiOutlineArrowUpTray } from "react-icons/hi2";

function InfoRow({ label, value, mono, action }: { label: string; value: string; mono?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium text-text-main ${mono ? "font-mono" : ""}`}>{value}</span>
        {action}
      </div>
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
          <span className="flex items-center gap-1 text-sm font-medium text-text-main">
            0.8550 wstETH
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={12} height={12} className="rounded-full" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <span className="text-sm text-text-secondary">Unallocated yield</span>
          <span className="flex items-center gap-1 text-sm font-semibold text-brand">
            0.3450 wstETH
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={12} height={12} className="rounded-full" />
          </span>
        </div>
      </div>
    </div>
  );
}

function OwnerControls() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-main">Owner Controls</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <div>
            <p className="text-sm text-text-main">Global Pause</p>
            <p className="text-xs text-text-secondary">Freeze all agent spending</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isPaused
                ? "border-brand bg-brand-light text-brand hover:bg-brand hover:text-white"
                : "border-red-200 text-red-500 hover:bg-red-50"
            }`}
          >
            {isPaused ? (
              <><HiOutlinePlayCircle className="h-4 w-4" /> Resume</>
            ) : (
              <><HiOutlinePauseCircle className="h-4 w-4" /> Pause All</>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <div>
            <p className="text-sm text-text-main">Withdraw Principal</p>
            <p className="text-xs text-text-secondary">Withdraw locked wstETH (owner only)</p>
          </div>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-main px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-brand hover:text-brand"
          >
            <HiOutlineArrowUpTray className="h-4 w-4" />
            Withdraw
          </button>
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
        <p className="mt-1 text-sm text-text-secondary">Manage agent, budget, and owner controls</p>
      </div>
      <div className="space-y-3">
        <InfoRow
          label="Parent Agent"
          value="0x1a2B...eF12"
          mono
          action={
            <button type="button" className="cursor-pointer text-text-secondary transition-colors hover:text-brand">
              <HiOutlinePencilSquare className="h-4 w-4" />
            </button>
          }
        />
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

      <div className="border-t border-border-main pt-6">
        <OwnerControls />
      </div>
    </div>
  );
}
