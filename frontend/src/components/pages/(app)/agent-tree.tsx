"use client";

import { useTreasuryStore } from "@/stores/treasury-store";
import type { SubAgent } from "@/types/treasury";

function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function AgentCard({
  address,
  budget,
  spent,
  status,
  isRoot,
}: {
  address: string;
  budget: string;
  spent: string;
  status: "active" | "paused";
  isRoot?: boolean;
}) {
  const isPaused = status === "paused";

  return (
    <div className={`rounded-xl border p-4 transition-colors ${isPaused ? "border-gray-200 opacity-50" : "border-border-main"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isRoot ? "bg-brand" : "bg-brand-light"}`}>
            <span className={`text-xs font-bold ${isRoot ? "text-white" : "text-brand"}`}>
              {isRoot ? "P" : "S"}
            </span>
          </div>
          <span className="font-mono text-sm text-text-main">{truncateAddress(address)}</span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isPaused ? "bg-gray-100 text-text-secondary" : "bg-brand-light text-brand"
          }`}
        >
          {isPaused ? "Paused" : "Active"}
        </span>
      </div>
      <div className="mt-3 flex gap-4">
        <div className="flex-1 rounded-lg bg-main-bg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary">Budget</p>
          <p className="mt-0.5 text-sm font-semibold text-text-main">{formatETH(budget)}</p>
        </div>
        <div className="flex-1 rounded-lg bg-main-bg px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary">Spent</p>
          <p className="mt-0.5 text-sm font-semibold text-text-main">{formatETH(spent)}</p>
        </div>
      </div>
    </div>
  );
}

function SubAgentList({ agents }: { agents: SubAgent[] }) {
  if (agents.length === 0) return null;

  return (
    <div className="space-y-2">
      {agents.map((agent) => (
        <div key={agent.address} className="relative pl-10">
          <div className="absolute left-4 top-0 h-full w-px bg-border-main" />
          <div className="absolute left-4 top-6 h-px w-6 bg-border-main" />
          <AgentCard
            address={agent.address}
            budget={agent.allocatedBudget}
            spent={agent.spent}
            status={agent.status}
          />
        </div>
      ))}
    </div>
  );
}

export function AgentTree() {
  const agentTree = useTreasuryStore((s) => s.agentTree);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Agent Hierarchy</h3>
        <p className="mt-1 text-sm text-text-secondary">Parent agent and sub-agent budget allocation</p>
      </div>
      {!agentTree ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border-main">
          <p className="text-sm text-text-secondary">No agent hierarchy configured.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AgentCard
            address={agentTree.address}
            budget={agentTree.allocatedBudget}
            spent={agentTree.spent}
            status={agentTree.status}
            isRoot
          />
          <SubAgentList agents={agentTree.subAgents} />
        </div>
      )}
    </div>
  );
}
