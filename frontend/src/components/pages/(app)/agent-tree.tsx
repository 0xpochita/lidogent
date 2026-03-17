"use client";

import { HiOutlineUserCircle, HiOutlineMagnifyingGlass, HiOutlineCpuChip, HiOutlinePuzzlePiece } from "react-icons/hi2";

const MOCK_TREE = {
  address: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
  label: "Parent Agent",
  totalBudget: "1.2000",
  spent: "0.3450",
  status: "active" as const,
  subAgents: [
    { address: "0xAa1Bb2Cc3Dd4Ee5Ff6001122334455667788aAbB", label: "Research", role: "Sub-Agent A", budget: "0.4000", spent: "0.1200", status: "active" as const, icon: <HiOutlineMagnifyingGlass className="h-4 w-4" /> },
    { address: "0xBb2Cc3Dd4Ee5Ff600112233445566778899bBcC", label: "Execution", role: "Sub-Agent B", budget: "0.5000", spent: "0.2100", status: "active" as const, icon: <HiOutlineCpuChip className="h-4 w-4" /> },
    { address: "0xCc3Dd4Ee5Ff60011223344556677889900cCdDeE", label: "Integration", role: "Sub-Agent C", budget: "0.3000", spent: "0.0150", status: "paused" as const, icon: <HiOutlinePuzzlePiece className="h-4 w-4" /> },
  ],
};

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

function ProgressBar({ spent, budget }: { spent: string; budget: string }) {
  const s = Number.parseFloat(spent);
  const b = Number.parseFloat(budget);
  const pct = b > 0 ? Math.min((s / b) * 100, 100) : 0;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-[10px] text-text-secondary">
        <span>{formatETH(spent)} / {formatETH(budget)} stETH</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-border-main">
        <div className="h-1.5 rounded-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SubAgentCard({ agent }: { agent: typeof MOCK_TREE.subAgents[0] }) {
  const isPaused = agent.status === "paused";

  return (
    <div className={`rounded-xl border p-4 transition-colors ${isPaused ? "border-gray-200 opacity-60" : "border-border-main"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
            {agent.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-text-main">{agent.role}</p>
            <p className="font-mono text-xs text-text-secondary">{truncateAddress(agent.address)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPaused ? "bg-gray-100 text-text-secondary" : "bg-brand-light text-brand"}`}>
            {isPaused ? "Paused" : "Active"}
          </span>
          <button
            type="button"
            className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              isPaused
                ? "border-brand bg-brand-light text-brand hover:bg-brand hover:text-white"
                : "border-border-main text-text-secondary hover:border-red-300 hover:text-red-500"
            }`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
      <ProgressBar spent={agent.spent} budget={agent.budget} />
    </div>
  );
}

export function AgentTree() {
  const tree = MOCK_TREE;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Agent Hierarchy</h3>
        <p className="mt-1 text-sm text-text-secondary">Parent agent and sub-agent budget allocation</p>
      </div>

      <div className="rounded-xl border-2 border-brand/20 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <HiOutlineUserCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main">{tree.label}</p>
              <p className="font-mono text-xs text-text-secondary">{truncateAddress(tree.address)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-text-main">{formatETH(tree.totalBudget)} stETH</p>
            <p className="text-xs text-text-secondary">Total budget</p>
          </div>
        </div>
        <ProgressBar spent={tree.spent} budget={tree.totalBudget} />
      </div>

      <div className="space-y-2">
        {tree.subAgents.map((agent) => (
          <div key={agent.address} className="relative pl-10">
            <div className="absolute left-4 top-0 h-full w-px bg-border-main" />
            <div className="absolute left-4 top-7 h-px w-6 bg-border-main" />
            <SubAgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
}
