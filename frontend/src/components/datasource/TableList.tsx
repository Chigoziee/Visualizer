import { useState } from "react";

import type { TableInfo } from "../../types/datasource";

export function TableList({
  tables,
  selected,
  onSelect,
}: {
  tables: TableInfo[];
  selected: string | undefined;
  onSelect: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = tables.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-64 shrink-0 bg-white border border-slate-200 rounded-xl p-3 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="font-semibold text-slate-900 text-sm">Tables &amp; Views</span>
      </div>
      <input
        className="w-full h-8 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs font-mono focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all mb-2"
        placeholder="Search tables..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <nav className="flex flex-col gap-1 overflow-y-auto">
        {filtered.map((table) => (
          <button
            key={table.name}
            onClick={() => onSelect(table.name)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-colors ${
              selected === table.name
                ? "bg-indigo-50/80 border border-indigo-200/90 text-indigo-950 font-medium"
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-slate-400">table_chart</span>
            <span className="truncate font-mono text-xs">{table.name}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-xs text-slate-400 px-2 py-4 text-center">No tables found</p>}
      </nav>
    </div>
  );
}
