import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SampleDataTable } from "../components/datasource/SampleDataTable";
import { SchemaTable } from "../components/datasource/SchemaTable";
import { TableList } from "../components/datasource/TableList";
import { Spinner } from "../components/common/Spinner";
import { useConnection } from "../hooks/useConnections";
import { useSample, useSchema, useTables } from "../hooks/useDataSource";
import { TopBar } from "../layout/TopBar";

export function BrowseDataSourcePage() {
  const { connectionId } = useParams();
  const id = connectionId ? Number(connectionId) : undefined;
  const navigate = useNavigate();

  const { data: connection } = useConnection(id);
  const { data: tables, isLoading: tablesLoading } = useTables(id);
  const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedTable && tables && tables.length > 0) {
      setSelectedTable(tables[0].name);
    }
  }, [tables, selectedTable]);

  const { data: schema, isLoading: schemaLoading } = useSchema(id, selectedTable);
  const { data: sample, isLoading: sampleLoading } = useSample(id, selectedTable);

  return (
    <>
      <TopBar title={connection?.name ?? "Data Source"} breadcrumb={["Data Sources", connection?.name ?? "..."]} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-6xl mx-auto flex gap-5">
          {tablesLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-10">
              <Spinner /> Loading tables...
            </div>
          )}
          {tables && (
            <TableList tables={tables} selected={selectedTable} onSelect={setSelectedTable} />
          )}

          <div className="flex-1 min-w-0 space-y-5">
            {selectedTable && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-indigo-600 text-[22px]">table_rows</span>
                  <h1 className="text-sm font-semibold text-slate-900 font-mono">{selectedTable}</h1>
                </div>
                <button
                  className="h-8.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  onClick={() =>
                    navigate(`/visualize?connection=${id}&table=${encodeURIComponent(selectedTable)}`)
                  }
                >
                  <span>Visualize this table</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            )}

            {schemaLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-6">
                <Spinner /> Loading schema...
              </div>
            )}
            {schema && <SchemaTable columns={schema.columns} />}

            {sampleLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-6">
                <Spinner /> Loading sample data...
              </div>
            )}
            {sample && <SampleDataTable rows={sample.rows} />}
          </div>
        </div>
      </main>
    </>
  );
}
