"use client";

import Image from "next/image";
import { formatEther } from "viem";
import { useTreasuryRead } from "@/hooks/use-treasury";

export function SpendLog() {
  const { totalSpentWstETH } = useTreasuryRead();

  const totalSpent = totalSpentWstETH.data
    ? Number.parseFloat(formatEther(totalSpentWstETH.data as bigint)).toFixed(6)
    : "0.000000";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-main">Spend Log</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
          Total spent:
          <span className="font-medium text-text-main">{totalSpent}</span>
          <Image src="/Assets/Images/Logo/wstETH-logo.png" alt="wstETH" width={14} height={14} className="rounded-full" />
          wstETH
        </p>
      </div>

      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border-main">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-text-secondary/30">
          <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.25 2.25 0 0 1 1 14.75l-.01-9.5Z" clipRule="evenodd" />
        </svg>
        <p className="mt-3 text-sm text-text-secondary">No transactions yet</p>
        <p className="mt-1 text-xs text-text-secondary">Spend events will appear here when agents use yield</p>
      </div>
    </div>
  );
}
