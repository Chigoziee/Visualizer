import { useState } from "react";

import { HistoryDetailSlideOver } from "../components/history/HistoryDetailSlideOver";
import { HistoryRow } from "../components/history/HistoryRow";
import { EmptyState } from "../components/common/EmptyState";
import { Spinner } from "../components/common/Spinner";
import { useHistoryList } from "../hooks/useHistory";
import { TopBar } from "../layout/TopBar";

export function HistoryPage() {
  const { data: history, isLoading } = useHistoryList();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = (history ?? []).filter((item) => {
    const matchesSearch = item.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.execution_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <TopBar
        title="History"
        right={
          <div className="flex items-center gap-2">
            <input
              className="h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-56"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="timeout">Timeout</option>
            </select>
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-5">History</h1>

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-10 justify-center">
              <Spinner /> Loading history...
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <EmptyState icon="schedule" title="No history yet" description="Generate your first chart to see it here." />
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {filtered.map((item) => (
                <HistoryRow key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedId !== null && (
        <HistoryDetailSlideOver id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}
