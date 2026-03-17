"use client";

import { useTreasuryStore } from "@/stores/treasury-store";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SpendHistory() {
  const spendHistory = useTreasuryStore((s) => s.spendHistory);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-text-main">
        Spend History
      </h2>
      <div className="rounded-xl border border-border-main bg-surface">
        {spendHistory.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-secondary">
            No transactions yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-main text-text-secondary">
                <th className="px-6 py-3 font-medium">Recipient</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Tx</th>
              </tr>
            </thead>
            <tbody>
              {spendHistory.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border-main last:border-b-0"
                >
                  <td className="px-6 py-4 font-mono text-text-main">
                    {truncateAddress(record.to)}
                  </td>
                  <td className="px-6 py-4 text-text-main">
                    {record.amount} stETH
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {formatTimestamp(record.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="cursor-pointer font-mono text-brand hover:text-brand-hover">
                      {truncateAddress(record.txHash)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
