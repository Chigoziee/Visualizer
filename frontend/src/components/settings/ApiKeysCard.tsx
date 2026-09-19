import { useState } from "react";

import { useApiKeys, useDeleteApiKey, useSetApiKey } from "../../hooks/useLlm";
import type { ApiKeyStatus } from "../../types/llm";

const SOURCE_LABELS: Record<ApiKeyStatus["source"], string> = {
  database: "Set here",
  environment: "From environment variable",
  none: "Not configured",
};

function ProviderKeyRow({ status }: { status: ApiKeyStatus }) {
  const [apiKey, setApiKey] = useState("");
  const [apiBase, setApiBase] = useState(status.api_base ?? "");
  const [saved, setSaved] = useState(false);
  const setKey = useSetApiKey();
  const deleteKey = useDeleteApiKey();

  async function handleSave() {
    if (!apiKey.trim()) return;
    await setKey.mutateAsync({
      provider: status.provider,
      data: { api_key: apiKey.trim(), api_base: apiBase.trim() || undefined },
    });
    setApiKey("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-800 capitalize">{status.provider}</span>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            status.configured ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
          }`}
        >
          {SOURCE_LABELS[status.source]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="password"
          className="flex-1 h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          placeholder={status.configured ? "Enter a new key to replace it" : "Enter API key"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          disabled={!apiKey.trim() || setKey.isPending}
          className="h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors shrink-0"
          onClick={handleSave}
        >
          {saved ? "Saved!" : "Save"}
        </button>
        {status.source === "database" && (
          <button
            className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors shrink-0"
            onClick={() => deleteKey.mutate(status.provider)}
          >
            Clear
          </button>
        )}
      </div>

      {status.provider === "litellm" && (
        <input
          className="w-full h-9 px-3 mt-2 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          placeholder="API base URL (optional, e.g. a self-hosted LiteLLM proxy)"
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
        />
      )}
    </div>
  );
}

export function ApiKeysCard() {
  const { data: keys, isLoading } = useApiKeys();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">API Keys</h2>
      <p className="text-xs text-slate-500 mb-4">
        Keys are encrypted at rest. A key set here overrides the matching environment variable.
      </p>
      {isLoading && <p className="text-xs text-slate-400">Loading...</p>}
      <div className="space-y-3">
        {keys?.map((status) => (
          <ProviderKeyRow key={status.provider} status={status} />
        ))}
      </div>
    </div>
  );
}
