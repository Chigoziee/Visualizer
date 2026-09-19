import { useTables } from "../../hooks/useDataSource";

export function TableSelector({
  connectionId,
  value,
  onChange,
}: {
  connectionId: number | undefined;
  value: string | undefined;
  onChange: (name: string) => void;
}) {
  const { data: tables } = useTables(connectionId);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium">
      <span className="material-symbols-outlined text-slate-500 text-[16px]">table_chart</span>
      <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">Table:</span>
      <select
        className="bg-transparent font-mono text-slate-800 font-semibold focus:outline-none max-w-[160px]"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={!connectionId}
      >
        <option value="" disabled>
          Select...
        </option>
        {tables?.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
