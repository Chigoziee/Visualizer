import { useState } from "react";

export function CodePanel({ code, durationMs }: { code: string; durationMs?: number }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-md flex flex-col shrink-0">
      <div className="px-4 py-2.5 bg-[#1e293b]/90 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="font-mono text-xs font-semibold text-slate-200 ml-1">generated_chart.py</span>
        </div>
        <div className="flex items-center gap-2">
          {durationMs !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[10px] border border-slate-700/80">
              <span className="material-symbols-outlined text-[12px] text-emerald-400">speed</span>
              Executed in {durationMs}ms
            </span>
          )}
          <button
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] font-medium transition-colors flex items-center gap-1 border border-slate-700"
            onClick={handleCopy}
          >
            <span className="material-symbols-outlined text-[13px]">content_copy</span>
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300">
        <div className="grid grid-cols-[32px_1fr] gap-x-4">
          <div className="text-slate-600 select-none text-right pr-2">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
