import { useEffect, useState } from "react";

import { useLlmDefault, useLlmProviders, useSetLlmDefault } from "../../hooks/useLlm";
import type { LLMProviderName } from "../../types/llm";

export function LlmProviderCard() {
  const { data: providers } = useLlmProviders();
  const { data: current } = useLlmDefault();
  const setDefault = useSetLlmDefault();

  const [provider, setProvider] = useState<LLMProviderName | undefined>(undefined);
  const [model, setModel] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (current && provider === undefined) {
      setProvider(current.provider);
      setModel(current.model);
    }
  }, [current, provider]);

  const selectedProvider = providers?.find((p) => p.provider === provider);

  async function handleSave() {
    if (!provider || !model) return;
    await setDefault.mutateAsync({ provider, model });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">Default LLM</h2>
      <p className="text-xs text-slate-500 mb-4">Used for visualize requests that don't specify a provider.</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {providers?.map((p) => (
          <button
            key={p.provider}
            disabled={!p.configured}
            onClick={() => {
              setProvider(p.provider);
              setModel(p.models[0]);
            }}
            className={`p-3 rounded-lg border text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              provider === p.provider ? "border-indigo-500 bg-indigo-50/60" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 capitalize">{p.provider}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  p.configured ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                {p.configured ? "Configured" : "Not configured"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedProvider && (
        <div className="space-y-1.5 mb-4">
          <label className="text-xs font-medium text-slate-700">Model</label>
          <select
            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            value={model ?? ""}
            onChange={(e) => setModel(e.target.value)}
          >
            {selectedProvider.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="h-8.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        onClick={handleSave}
      >
        {saved ? "Saved!" : "Save Default"}
      </button>
    </div>
  );
}
