"use client";

import { useTreasuryStore } from "@/stores/treasury-store";
import { StatsCard } from "./stats-card";

export function TreasuryOverview() {
  const treasury = useTreasuryStore((s) => s.treasury);

  const principal = treasury?.principalStETH ?? "0.00";
  const yield_ = treasury?.availableYield ?? "0.00";
  const spent = treasury?.totalSpent ?? "0.00";

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-text-main">
        Treasury Overview
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label="Locked Principal"
          value={`${principal} stETH`}
          subtitle="Inaccessible to agent"
        />
        <StatsCard
          label="Available Yield"
          value={`${yield_} stETH`}
          subtitle="Spendable by agent"
        />
        <StatsCard
          label="Total Spent"
          value={`${spent} stETH`}
          subtitle="From yield balance"
        />
      </div>
    </section>
  );
}
