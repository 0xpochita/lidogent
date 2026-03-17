"use client";

import Image from "next/image";

type ActivityType = "payment" | "approval" | "alert" | "system";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: string;
  timestamp: number;
  agent: string;
  logo?: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: "1", type: "payment", title: "Perplexity API", description: "AI news summary job #12", amount: "0.0120", timestamp: Date.now() - 2 * 3600000, agent: "Research", logo: "/Assets/Images/Logo/perplexity-logo.png" },
  { id: "2", type: "payment", title: "Claude API", description: "Code review for treasury contract", amount: "0.0320", timestamp: Date.now() - 4 * 3600000, agent: "Execution", logo: "/Assets/Images/Logo/claude-logo.png" },
  { id: "3", type: "alert", title: "Budget warning", description: "Claude API at 40% of monthly cap", timestamp: Date.now() - 4.5 * 3600000, agent: "System" },
  { id: "4", type: "payment", title: "ChatGPT API", description: "Competitor analysis report", amount: "0.0085", timestamp: Date.now() - 8 * 3600000, agent: "Research", logo: "/Assets/Images/Logo/chatgpt-logo.webp" },
  { id: "5", type: "approval", title: "Gemini approved", description: "Added to whitelist by owner", timestamp: Date.now() - 12 * 3600000, agent: "Owner", logo: "/Assets/Images/Logo/gemini-logo.jpeg" },
  { id: "6", type: "payment", title: "Gemini API", description: "Data extraction for market trends", amount: "0.0035", timestamp: Date.now() - 18 * 3600000, agent: "Integration", logo: "/Assets/Images/Logo/gemini-logo.jpeg" },
  { id: "7", type: "system", title: "Yield harvested", description: "Added to spendable balance", amount: "0.0180", timestamp: Date.now() - 24 * 3600000, agent: "System" },
];

const TYPE_STYLES: Record<ActivityType, string> = {
  payment: "bg-brand-light text-brand",
  approval: "bg-emerald-50 text-emerald-600",
  alert: "bg-amber-50 text-amber-600",
  system: "bg-gray-100 text-text-secondary",
};

function formatTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

export function ActivityFeed() {
  return (
    <div>
      <h2 className="text-base font-semibold text-text-main">Activity Feed</h2>
      <p className="mt-1 text-sm text-text-secondary">Recent agent operations</p>
      <div className="mt-4 space-y-1">
        {MOCK_ACTIVITIES.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-main-bg">
            {a.logo ? (
              <Image src={a.logo} alt={a.title} width={28} height={28} className="shrink-0 rounded-full object-cover" />
            ) : (
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${TYPE_STYLES[a.type]}`}>
                {a.type === "alert" ? "!" : "S"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text-main">{a.title}</p>
              <p className="truncate text-[11px] text-text-secondary">{a.description}</p>
            </div>
            <div className="shrink-0 text-right">
              {a.amount ? (
                <p className="flex items-center gap-1 text-xs font-semibold text-text-main">
                  -{formatETH(a.amount)}
                  <Image src="/Assets/Images/Logo/stETH-logo.svg" alt="stETH" width={12} height={12} />
                </p>
              ) : (
                <p className={`text-[10px] font-medium ${TYPE_STYLES[a.type].split(" ")[1]}`}>{a.agent}</p>
              )}
              <p className="text-[10px] text-text-secondary">{formatTime(a.timestamp)} ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
