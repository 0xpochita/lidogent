"use client";

import {
  Header,
  TreasuryOverview,
  PermissionsPanel,
  SpendHistory,
  AgentInfo,
} from "@/components/pages/(app)";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-main-bg">
      <Header />
      <main className="mx-auto max-w-5xl space-y-8 px-8 py-8">
        <TreasuryOverview />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AgentInfo />
          <PermissionsPanel />
        </div>
        <SpendHistory />
      </main>
    </div>
  );
}
