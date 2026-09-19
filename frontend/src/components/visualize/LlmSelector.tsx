import { useLlmProviders } from "../../hooks/useLlm";
import type { LLMProviderName } from "../../types/llm";

export function LlmSelector({
  provider,
  model,
  onChange,
}: {
  provider: LLMProviderName | undefined;
  model: string | undefined;
  onChange: (provider: LLMProviderName, model: string) => void;
}) {
  const { data: providers } = useLlmProviders();
  const configured = providers?.filter((p) => p.configured) ?? [];
  const currentProvider = providers?.find((p) => p.provider === provider);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm text-xs font-medium">
      <span className="material-symbols-outlined text-slate-500 text-[16px]">smart_toy</span>
      <select
        className="bg-transparent font-medium text-slate-800 focus:outline-none"
        value={provider ?? ""}
        onChange={(e) => {
          const nextProvider = e.target.value as LLMProviderName;
          const nextModel = providers?.find((p) => p.provider === nextProvider)?.models[0] ?? "";
          onChange(nextProvider, nextModel);
        }}
      >
        <option value="" disabled>
          Select provider...
        </option>
        {configured.map((p) => (
          <option key={p.provider} value={p.provider}>
            {p.provider}
          </option>
        ))}
      </select>
      {currentProvider && (
        <select
          className="bg-transparent font-mono text-slate-600 text-[11px] focus:outline-none max-w-[160px]"
          value={model ?? ""}
          onChange={(e) => onChange(currentProvider.provider, e.target.value)}
        >
          {currentProvider.models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
      {providers && configured.length === 0 && (
        <span className="text-amber-600 text-[11px]">No providers configured</span>
      )}
    </div>
  );
}
