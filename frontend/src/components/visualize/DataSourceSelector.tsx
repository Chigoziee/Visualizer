import { useConnections } from "../../hooks/useConnections";

export function DataSourceSelector({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (id: number) => void;
}) {
  const { data: connections } = useConnections();

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium">
      <span className="material-symbols-outlined text-indigo-600 text-[16px]">database</span>
      <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">Source:</span>
      <select
        className="bg-transparent font-mono text-slate-800 font-semibold focus:outline-none max-w-[160px]"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="" disabled>
          Select...
        </option>
        {connections?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
