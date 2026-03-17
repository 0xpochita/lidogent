"use client";

import Image from "next/image";

const CATEGORIES = [
  { label: "Research", spent: "0.0205", color: "bg-blue-500" },
  { label: "Infrastructure", spent: "0.0485", color: "bg-amber-500" },
  { label: "Hosting", spent: "0.0000", color: "bg-emerald-500" },
];

function formatETH(value: string): string {
  return Number.parseFloat(value || "0").toFixed(4);
}

export function SpendingSummary() {
  const totalSpent = CATEGORIES.reduce((sum, c) => sum + Number.parseFloat(c.spent), 0);
  const totalBudget = 0.165;
  const remaining = totalBudget - totalSpent;
  const pctUsed = ((totalSpent / totalBudget) * 100).toFixed(0);

  return (
    <div>
      <h2 className="text-base font-semibold text-text-main">Monthly Spending</h2>
      <p className="mt-1 text-sm text-text-secondary">Budget usage this cycle</p>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-main-bg p-4">
          <p className="text-[11px] uppercase tracking-wider text-text-secondary">Budget</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-text-main">
            {formatETH(String(totalBudget))}
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" className="rounded-full" width={14} height={14} />
          </p>
        </div>
        <div className="rounded-xl bg-brand-light p-4">
          <p className="text-[11px] uppercase tracking-wider text-text-secondary">Spent</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-brand">
            {formatETH(String(totalSpent))}
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" className="rounded-full" width={14} height={14} />
          </p>
        </div>
        <div className="rounded-xl bg-main-bg p-4">
          <p className="text-[11px] uppercase tracking-wider text-text-secondary">Remaining</p>
          <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-text-main">
            {formatETH(String(remaining))}
            <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" className="rounded-full" width={14} height={14} />
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Overall usage</span>
          <span>{pctUsed}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full rounded-full bg-border-main">
          <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${pctUsed}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {CATEGORIES.map((cat) => {
          const catPct = totalBudget > 0 ? (Number.parseFloat(cat.spent) / totalBudget) * 100 : 0;
          return (
            <div key={cat.label} className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${cat.color}`} />
              <span className="w-24 text-sm text-text-main">{cat.label}</span>
              <div className="flex-1">
                <div className="h-1.5 w-full rounded-full bg-border-main">
                  <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${catPct}%` }} />
                </div>
              </div>
              <span className="w-20 text-right text-xs font-medium text-text-main">{formatETH(cat.spent)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
