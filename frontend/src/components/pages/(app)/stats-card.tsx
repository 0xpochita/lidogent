"use client";

interface StatsCardProps {
  label: string;
  value: string;
  subtitle?: string;
}

export function StatsCard({ label, value, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border-main bg-surface p-6">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-main">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
