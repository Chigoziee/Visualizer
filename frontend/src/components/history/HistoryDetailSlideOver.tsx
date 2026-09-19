import { historyImageUrl } from "../../api/history";
import { formatDuration, formatRelativeTime } from "../../lib/format";
import { useDeleteHistory, useHistoryDetail } from "../../hooks/useHistory";
import { CodePanel } from "../visualize/CodePanel";
import { Spinner } from "../common/Spinner";

export function HistoryDetailSlideOver({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: detail, isLoading } = useHistoryDetail(id);
  const deleteHistory = useDeleteHistory();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-sm font-semibold text-slate-900">History Detail</h2>
          <button className="text-slate-400 hover:text-slate-700" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-10 justify-center">
            <Spinner /> Loading...
          </div>
        )}

        {detail && (
          <div className="p-5 space-y-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Prompt</span>
              <p className="text-sm text-slate-800 mt-1">{detail.prompt}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span>{detail.data_source_name}{detail.table_name ? ` • ${detail.table_name}` : ""}</span>
              <span>{detail.llm_provider}/{detail.llm_model}</span>
              <span>{formatRelativeTime(detail.created_at)}</span>
              <span>{formatDuration(detail.duration_ms)}</span>
            </div>

            {detail.execution_status === "success" && detail.has_image && (
              <img
                src={historyImageUrl(detail.id)}
                alt="Chart"
                className="w-full rounded-lg border border-slate-200"
              />
            )}

            {detail.execution_status !== "success" && detail.error_message && (
              <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
                <p className="font-mono text-[11px] text-rose-700/90 leading-relaxed">{detail.error_message}</p>
              </div>
            )}

            {detail.generated_code && <CodePanel code={detail.generated_code} />}

            <button
              className="w-full h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              onClick={() => {
                deleteHistory.mutate(detail.id);
                onClose();
              }}
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
