import { useExecutionSettings } from "../../hooks/useExecutionSettings";

export function ExecutionLimitsCard() {
  const { data } = useExecutionSettings();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">Execution Limits</h2>
      <p className="text-xs text-slate-500 mb-4">
        Configured via environment variables — restart the server to change.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Sandbox Timeout
          </span>
          <p className="text-base font-bold text-slate-900 mt-0.5">
            {data ? `${data.execution_timeout_seconds}s` : "..."}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Max Rows</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">
            {data ? data.execution_max_rows.toLocaleString() : "..."}
          </p>
        </div>
      </div>
    </div>
  );
}
