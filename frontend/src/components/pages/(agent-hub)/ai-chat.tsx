"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlinePaperAirplane, HiOutlineUserCircle, HiOutlineMagnifyingGlass, HiOutlineCpuChip, HiOutlinePuzzlePiece, HiOutlineChevronDown } from "react-icons/hi2";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  cost?: string;
  timestamp: number;
}

const MODELS = [
  { id: "claude", name: "Claude", logo: "/Assets/Images/Logo/claude-logo.png", costPerReq: "0.0003" },
  { id: "chatgpt", name: "ChatGPT", logo: "/Assets/Images/Logo/chatgpt-logo.webp", costPerReq: "0.0002" },
  { id: "gemini", name: "Gemini", logo: "/Assets/Images/Logo/gemini-logo.jpeg", costPerReq: "0.0001" },
  { id: "perplexity", name: "Perplexity", logo: "/Assets/Images/Logo/perplexity-logo.png", costPerReq: "0.0002" },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Summarize the latest Ethereum staking trends for Q1 2026",
    timestamp: Date.now() - 120000,
  },
  {
    id: "2",
    role: "assistant",
    content: "Here are the key Ethereum staking trends for Q1 2026:\n\n1. Total staked ETH surpassed 45M ETH (~37% of supply)\n2. Lido maintains market lead at 28.5% of staked ETH\n3. Restaking via EigenLayer grew 140% QoQ\n4. Average validator yield stabilized at 3.4-3.7% APY\n5. Liquid staking tokens (stETH, rETH) increasingly used as collateral in DeFi\n\nThe trend toward institutional staking adoption accelerated, with several TradFi firms launching staking products.",
    model: "claude",
    cost: "0.0003",
    timestamp: Date.now() - 115000,
  },
  {
    id: "3",
    role: "user",
    content: "What are the risks of using stETH as agent budget collateral?",
    timestamp: Date.now() - 60000,
  },
  {
    id: "4",
    role: "assistant",
    content: "Key risks to consider:\n\n1. **Smart contract risk** — Lido protocol or your treasury contract could have vulnerabilities\n2. **Slashing risk** — Validators could get slashed, reducing stETH value (historically very rare)\n3. **De-peg risk** — stETH could temporarily trade below ETH (happened briefly in 2022)\n4. **Yield variability** — APY fluctuates with network activity, affecting agent budget\n5. **Gas costs** — Agent transactions cost gas, which can eat into yield during congestion\n\nMitigation: Use wstETH (non-rebasing), set conservative budget caps, and maintain emergency pause capability.",
    model: "perplexity",
    cost: "0.0002",
    timestamp: Date.now() - 55000,
  },
];

const AGENTS = [
  { id: "parent", label: "Parent Agent", icon: <HiOutlineUserCircle className="h-4 w-4" /> },
  { id: "sub-a", label: "Sub-Agent A (Research)", icon: <HiOutlineMagnifyingGlass className="h-4 w-4" /> },
  { id: "sub-b", label: "Sub-Agent B (Execution)", icon: <HiOutlineCpuChip className="h-4 w-4" /> },
  { id: "sub-c", label: "Sub-Agent C (Integration)", icon: <HiOutlinePuzzlePiece className="h-4 w-4" /> },
];

function AgentSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = AGENTS.find((a) => a.id === selected) ?? AGENTS[0];

  return (
    <div className="flex items-center gap-2">
      <p className="text-[11px] text-text-secondary">Pay via x402 from</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-main bg-surface px-2.5 py-1 text-[11px] font-medium text-text-main transition-colors hover:border-brand"
        >
          <span className="text-brand">{current.icon}</span>
          <span>{current.label}</span>
          <HiOutlineChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute bottom-full left-0 z-50 mb-1 w-56 overflow-hidden rounded-xl border border-border-main bg-surface shadow-lg">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => { onSelect(agent.id); setOpen(false); }}
                className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors ${
                  selected === agent.id
                    ? "bg-brand-light font-medium text-brand"
                    : "text-text-main hover:bg-main-bg"
                }`}
              >
                <span className={selected === agent.id ? "text-brand" : "text-text-secondary"}>{agent.icon}</span>
                <span>{agent.label}</span>
                {selected === agent.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-auto h-3.5 w-3.5 text-brand">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModelLogo({ model }: { model: string }) {
  const m = MODELS.find((mod) => mod.id === model);
  if (!m) return null;
  return <Image src={m.logo} alt={m.name} width={18} height={18} className="rounded-full object-cover" />;
}

function ActiveAgentCard({ agentId }: { agentId: string }) {
  const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
  const budgets: Record<string, string> = {
    parent: "1.2000",
    "sub-a": "0.2800",
    "sub-b": "0.2900",
    "sub-c": "0.2850",
  };

  return (
    <div className="rounded-xl border border-brand/20 bg-brand-light px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-text-secondary">Active Agent</p>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-brand">{agent.icon}</span>
        <span className="text-sm font-semibold text-text-main">{agent.label}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        <span className="text-xs text-text-secondary">Remaining budget:</span>
        <span className="flex items-center gap-1 text-xs font-semibold text-brand">
          {budgets[agentId] ?? "0.0000"} stETH
          <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={12} height={12} />
        </span>
      </div>
    </div>
  );
}

export function AiChat() {
  const [messages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude");
  const [selectedAgent, setSelectedAgent] = useState("parent");

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Chat with AI</h2>
          <div className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
            <span>Paid with</span>
            <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={14} height={14} />
            <span>stETH yield</span>
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
            <span>~{currentModel.costPerReq} stETH</span>
            <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={12} height={12} />
            <span>/ request</span>
          </p>
        </div>
        <ActiveAgentCard agentId={selectedAgent} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => setSelectedModel(model.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              selectedModel === model.id
                ? "border-brand bg-brand-light text-brand"
                : "border-border-main text-text-secondary hover:border-brand/30"
            }`}
          >
            <Image src={model.logo} alt={model.name} width={20} height={20} className="rounded-full object-cover" />
            {model.name}
          </button>
        ))}
      </div>

      <div className="mt-4 h-[400px] overflow-y-auto rounded-xl border border-border-main bg-main-bg p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && msg.model && (
                <div className="mt-1 shrink-0">
                  <ModelLogo model={msg.model} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-brand text-white"
                    : "bg-surface border border-border-main"
                }`}
              >
                <p className={`whitespace-pre-line text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-text-main"}`}>
                  {msg.content}
                </p>
                {msg.cost && (
                  <div className="mt-2 flex items-center gap-1 border-t border-border-main/20 pt-2">
                    <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={10} height={10} />
                    <span className={`text-[10px] ${msg.role === "user" ? "text-white/60" : "text-text-secondary"}`}>
                      {msg.cost} stETH via x402
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${currentModel.name} anything...`}
            className="w-full rounded-xl border border-border-main bg-surface py-3 pl-4 pr-12 text-sm text-text-main placeholder:text-text-secondary/50 focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg bg-brand p-2 text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiOutlinePaperAirplane className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />
        <p className="flex items-center gap-1 text-[11px] text-text-secondary">
          <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={10} height={10} />
          Paid from yield balance
        </p>
      </div>
    </div>
  );
}
