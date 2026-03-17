"use client";

import { useState } from "react";
import Image from "next/image";

const AGENT_COLORS: Record<string, string> = {
  Research: "bg-blue-100 text-blue-700",
  Execution: "bg-amber-100 text-amber-700",
  Integration: "bg-emerald-100 text-emerald-700",
};

const MOCK_LOGS = [
  {
    id: "1",
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    agent: "0xAa1Bb2Cc3Dd4Ee5Ff6001122334455667788aAbB",
    agentLabel: "Research",
    to: "0x4455667788990011223344556677889900AaBbCc",
    toLabel: "Perplexity API",
    amount: "0.0120",
    memo: "Research job #12 — AI news summary",
  },
  {
    id: "2",
    timestamp: Math.floor(Date.now() / 1000) - 7200,
    agent: "0xBb2Cc3Dd4Ee5Ff600112233445566778899bBcC",
    agentLabel: "Execution",
    to: "0x5566778899001122334455667788990011DdEeFf",
    toLabel: "AWS Billing",
    amount: "0.0450",
    memo: "GPU compute — model fine-tuning batch #8",
  },
  {
    id: "3",
    timestamp: Math.floor(Date.now() / 1000) - 18000,
    agent: "0xAa1Bb2Cc3Dd4Ee5Ff6001122334455667788aAbB",
    agentLabel: "Research",
    to: "0x6677889900112233445566778899001122EeFf00",
    toLabel: "OpenAI API",
    amount: "0.0085",
    memo: "GPT-4 calls — competitor analysis report",
  },
  {
    id: "4",
    timestamp: Math.floor(Date.now() / 1000) - 43200,
    agent: "0xCc3Dd4Ee5Ff60011223344556677889900cCdDeE",
    agentLabel: "Integration",
    to: "0x7788990011223344556677889900112233FfAa11",
    toLabel: "Alchemy RPC",
    amount: "0.0035",
    memo: "RPC credits — mainnet indexing",
  },
];

function truncateAddress(address: string): string {
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
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? MOCK_LOGS.filter((r) => r.agentLabel.toLowerCase().includes(filter.toLowerCase()))
    : MOCK_LOGS;

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
          placeholder="Filter by agent role"
          className="w-56 rounded-xl border border-border-main bg-main-bg px-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((record) => (
          <div key={record.id} className="rounded-xl border border-border-main px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-brand">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${AGENT_COLORS[record.agentLabel] ?? "bg-gray-100 text-gray-600"}`}>
                      {record.agentLabel}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-text-secondary">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-main">{record.toLabel}</span>
                    <span className="font-mono text-xs text-text-secondary">{truncateAddress(record.to)}</span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{record.memo}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-text-main">
                  {formatETH(record.amount)} stETH
                  <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={16} height={16} />
                </span>
                <p className="mt-0.5 text-xs text-text-secondary">{formatTimestamp(record.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
