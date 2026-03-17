"use client";

import { useTreasuryStore } from "@/stores/treasury-store";

function truncateAddress(address: string): string {
  if (!address || !address.startsWith("0x")) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-sm font-medium text-text-main ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function AgentInfo() {
  const treasury = useTreasuryStore((s) => s.treasury);

  const agent = treasury?.agentAddress ?? "Not set";
  const owner = treasury?.ownerAddress ?? "Not set";
  const isPaused = treasury?.isPaused ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Agent Configuration</h3>
        <p className="mt-1 text-sm text-text-secondary">Current agent and owner details</p>
      </div>
      <div className="space-y-3">
        <InfoRow label="Agent Address" value={truncateAddress(agent)} mono />
        <InfoRow label="Owner Address" value={truncateAddress(owner)} mono />
        <div className="flex items-center justify-between rounded-xl border border-border-main px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${isPaused ? "bg-gray-300" : "bg-brand"}`} />
            <span className="text-sm text-text-secondary">Agent Status</span>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPaused ? "bg-gray-100 text-text-secondary" : "bg-brand-light text-brand"
            }`}
          >
            {isPaused ? "Paused" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
