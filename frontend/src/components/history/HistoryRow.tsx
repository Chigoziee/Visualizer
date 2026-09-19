import { historyImageUrl } from "../../api/history";
import { formatRelativeTime } from "../../lib/format";
import type { HistoryListItem } from "../../types/history";

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  error: "bg-red-100 text-red-700",
  timeout: "bg-amber-100 text-amber-700",
};

export function HistoryRow({ item, onClick }: { item: HistoryListItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border-b border-slate-100 last:border-0 text-left transition-colors"
    >
      <div className="w-12 h-9 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
        {item.execution_status === "success" ? (
          <img src={historyImageUrl(item.id)} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-slate-300 text-[18px]">bar_chart</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 truncate">{item.prompt}</p>
        <p className="text-[11px] text-slate-400 font-mono truncate">
          {item.data_source_name}
          {item.table_name ? ` • ${item.table_name}` : ""} • {item.llm_provider}/{item.llm_model}
        </p>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase shrink-0 ${STATUS_STYLES[item.execution_status]}`}>
        {item.execution_status}
      </span>
      <span className="text-[11px] text-slate-400 shrink-0 w-20 text-right">
        {formatRelativeTime(item.created_at)}
      </span>
    </button>
  );
}
