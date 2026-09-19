import { formatDuration } from "../../lib/format";
import type { VisualizeResponse } from "../../types/visualization";

export interface Exchange {
  id: string;
  prompt: string;
  status: "pending" | "done" | "failed";
  response?: VisualizeResponse;
  error?: string;
}

export function ChatMessage({
  exchange,
  isActive,
  onSelect,
  onRetry,
}: {
  exchange: Exchange;
  isActive: boolean;
  onSelect: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="self-end max-w-[90%] bg-slate-100 rounded-xl rounded-tr-sm px-3.5 py-2.5 text-slate-800 shadow-sm border border-slate-200/70">
        <p className="text-slate-800 leading-relaxed font-normal text-xs">{exchange.prompt}</p>
      </div>

      {exchange.status === "pending" && (
        <div className="self-start w-full bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span className="font-mono text-[11px] text-indigo-600 font-semibold">
              Generating chart &amp; executing code...
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
            <div className="flex items-end justify-between h-12 gap-2 px-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-1/6 bg-slate-200 rounded-t animate-pulse" style={{ height: `${30 + i * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {exchange.status === "done" && exchange.response && exchange.response.execution_status === "success" && (
        <button
          onClick={onSelect}
          className={`self-start w-full text-left rounded-xl p-3 border shadow-sm space-y-2 transition-colors ${
            isActive ? "bg-indigo-50/40 border-indigo-100/90" : "bg-white border-slate-200 hover:border-indigo-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-700 font-mono text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Success • {formatDuration(exchange.response.duration_ms)}
            </span>
            {isActive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Active on Canvas
              </span>
            )}
          </div>
          {exchange.response.image_base64 && (
            <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200/80">
              <img
                src={`data:image/png;base64,${exchange.response.image_base64}`}
                alt="Chart thumbnail"
                className="w-14 h-10 rounded border border-slate-100 object-cover shrink-0"
              />
              <span className="font-mono text-[10px] text-slate-400 truncate">Plot #{exchange.response.history_id}</span>
            </div>
          )}
        </button>
      )}

      {exchange.status === "done" &&
        exchange.response &&
        exchange.response.execution_status !== "success" && (
          <div className="self-start w-full bg-rose-50/60 rounded-xl p-3.5 border border-rose-200 shadow-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-800">
                    {exchange.response.execution_status === "timeout" ? "Execution Timed Out" : "Execution Error"}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-rose-700/90 mt-1 leading-relaxed">
                  {exchange.response.error_message}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="px-2.5 py-1 bg-white hover:bg-rose-100/60 text-slate-800 border border-rose-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
                    onClick={onRetry}
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {exchange.status === "failed" && (
        <div className="self-start w-full bg-rose-50/60 rounded-xl p-3.5 border border-rose-200 shadow-sm">
          <p className="font-mono text-[11px] text-rose-700/90 leading-relaxed">{exchange.error}</p>
          <button
            className="mt-3 px-2.5 py-1 bg-white hover:bg-rose-100/60 text-slate-800 border border-rose-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
            onClick={onRetry}
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
