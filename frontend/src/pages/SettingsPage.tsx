import { ApiKeysCard } from "../components/settings/ApiKeysCard";
import { ExecutionLimitsCard } from "../components/settings/ExecutionLimitsCard";
import { LlmProviderCard } from "../components/settings/LlmProviderCard";
import { TopBar } from "../layout/TopBar";

export function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-3xl mx-auto space-y-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
          <ApiKeysCard />
          <LlmProviderCard />
          <ExecutionLimitsCard />
        </div>
      </main>
    </>
  );
}
