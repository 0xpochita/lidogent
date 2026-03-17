"use client";

import { useTreasuryStore } from "@/stores/treasury-store";

const PERMISSION_LABELS: Record<string, string> = {
  whitelist: "Recipient Whitelist",
  "transaction-cap": "Per-Transaction Cap",
  "time-window": "Time Window",
};

export function PermissionsPanel() {
  const permissions = useTreasuryStore((s) => s.permissions);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-text-main">
        Permissions
      </h2>
      <div className="rounded-xl border border-border-main bg-surface">
        {permissions.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-secondary">
            No permissions configured yet.
          </div>
        ) : (
          <ul>
            {permissions.map((perm) => (
              <li
                key={perm.type}
                className="flex items-center justify-between border-b border-border-main px-6 py-4 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-text-main">
                    {PERMISSION_LABELS[perm.type] ?? perm.type}
                  </p>
                  <p className="mt-0.5 text-sm text-text-secondary">
                    {perm.value}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    perm.enabled
                      ? "bg-brand-light text-brand"
                      : "bg-gray-100 text-text-secondary"
                  }`}
                >
                  {perm.enabled ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
