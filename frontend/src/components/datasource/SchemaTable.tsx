import type { ColumnInfo } from "../../types/datasource";

export function SchemaTable({ columns }: { columns: ColumnInfo[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Table Schema</h2>
        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[11px]">
          {columns.length} columns
        </span>
      </div>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="px-4 py-2 font-medium text-slate-500">Column</th>
            <th className="px-4 py-2 font-medium text-slate-500">Type</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => (
            <tr key={col.name} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-2 font-mono text-slate-800">{col.name}</td>
              <td className="px-4 py-2 font-mono text-slate-500">{col.dtype}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
