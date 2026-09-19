import { useState } from "react";

export function PromptComposer({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (prompt: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className="p-3 border-t border-slate-200/80 bg-slate-50/70 shrink-0">
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-xs">
        <textarea
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-xs focus:outline-none resize-none px-1 py-0.5 leading-relaxed font-normal"
          placeholder="Describe the chart you want... e.g. 'show monthly revenue trend as a line chart'"
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex items-center justify-end pt-2 border-t border-slate-100 mt-1">
          <button
            disabled={disabled || !value.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs shadow-sm transition-all"
            onClick={handleSubmit}
          >
            <span>Generate</span>
            <span className="material-symbols-outlined text-[14px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
