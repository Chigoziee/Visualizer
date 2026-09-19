import { useState } from "react";

import { AddConnectionModal } from "../components/connections/AddConnectionModal";
import { ConnectionCard } from "../components/connections/ConnectionCard";
import { EmptyState } from "../components/common/EmptyState";
import { Spinner } from "../components/common/Spinner";
import { useConnections } from "../hooks/useConnections";
import { TopBar } from "../layout/TopBar";
import type { ConnectionOut } from "../types/connection";

export function DataSourcesPage() {
  const { data: connections, isLoading } = useConnections();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<ConnectionOut | null>(null);

  function openAddModal() {
    setEditingConnection(null);
    setModalOpen(true);
  }

  function openEditModal(connection: ConnectionOut) {
    setEditingConnection(connection);
    setModalOpen(true);
  }

  return (
    <>
      <TopBar
        title="Data Sources"
        right={
          <button
            className="h-8.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            onClick={openAddModal}
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Add Connection</span>
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-7xl mx-auto">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Data Sources</h1>
            <p className="text-sm text-slate-500 max-w-2xl mt-1.5">
              Connected databases and files ready for natural language chart generation.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-10 justify-center">
              <Spinner /> Loading connections...
            </div>
          )}

          {!isLoading && connections?.length === 0 && (
            <EmptyState
              icon="database"
              title="No data sources yet"
              description="Connect a database or upload a CSV file to start generating charts."
              action={
                <button
                  className="h-8.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  onClick={openAddModal}
                >
                  <span className="material-symbols-outlined text-[17px]">add</span>
                  <span>Add Connection</span>
                </button>
              }
            />
          )}

          {!isLoading && connections && connections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {connections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} onEdit={openEditModal} />
              ))}
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <AddConnectionModal editingConnection={editingConnection} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
