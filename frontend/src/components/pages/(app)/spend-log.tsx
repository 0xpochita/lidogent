"use client";

import { useState } from "react";
import Image from "next/image";
import { useTreasuryStore } from "@/stores/treasury-store";

function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SpendLog() {
  const spendHistory = useTreasuryStore((s) => s.spendHistory);
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? spendHistory.filter((r) => r.agent.toLowerCase() === filter.toLowerCase())
    : spendHistory;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-main">Spend Log</h3>
          <p className="mt-1 text-sm text-text-secondary">Transaction history from yield spending</p>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by agent"
          className="w-56 rounded-xl border border-border-main bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border-main">
          <p className="text-sm text-text-secondary">
            {filter ? "No transactions found for this agent." : "No transactions yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-brand">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-text-main">{truncateAddress(record.agent)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-text-secondary">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                    <span className="font-mono text-sm text-text-secondary">{truncateAddress(record.to)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {formatTimestamp(record.timestamp)}
                    {record.memo ? ` \u00B7 ${record.memo}` : ""}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-text-main">
                {formatETH(record.amount)} stETH
                <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
