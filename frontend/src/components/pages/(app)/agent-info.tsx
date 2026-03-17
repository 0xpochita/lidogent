"use client";

import { useTreasuryStore } from "@/stores/treasury-store";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AgentInfo() {
  const treasury = useTreasuryStore((s) => s.treasury);

  const agent = treasury?.agentAddress ?? "Not set";
  const owner = treasury?.ownerAddress ?? "Not set";
  const isPaused = treasury?.isPaused ?? false;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-text-main">
        Agent Configuration
      </h2>
      <div className="rounded-xl border border-border-main bg-surface p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Agent Address
            </p>
            <p className="mt-1 font-mono text-sm text-text-main">
              {agent.startsWith("0x") ? truncateAddress(agent) : agent}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Owner Address
            </p>
            <p className="mt-1 font-mono text-sm text-text-main">
              {owner.startsWith("0x") ? truncateAddress(owner) : owner}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border-main pt-6">
          <div>
            <p className="text-sm font-medium text-text-main">Agent Status</p>
            <p className="mt-0.5 text-sm text-text-secondary">
              {isPaused
                ? "Agent spending is currently paused"
                : "Agent can spend available yield"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isPaused
                ? "bg-gray-100 text-text-secondary"
                : "bg-brand-light text-brand"
            }`}
          >
            {isPaused ? "Paused" : "Active"}
          </span>
        </div>
      </div>
    </section>
  );
}
