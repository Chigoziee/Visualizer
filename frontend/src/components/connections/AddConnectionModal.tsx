import { useState } from "react";

import {
  useCreateConnection,
  useDeleteConnection,
  useTestConnection,
  useUpdateConnection,
  useUploadCsv,
} from "../../hooks/useConnections";
import type { ConnectionOut, ConnectionTestResult, ConnectionType } from "../../types/connection";
import { ConnectionForm, type ConnectionFormValues } from "./ConnectionForm";
import { ConnectionTypeTabs } from "./ConnectionTypeTabs";

export function AddConnectionModal({
  editingConnection,
  onClose,
}: {
  editingConnection: ConnectionOut | null;
  onClose: () => void;
}) {
  const isEditing = editingConnection !== null;
  const [type, setType] = useState<ConnectionType>(editingConnection?.type ?? "postgres");
  const [sqlValues, setSqlValues] = useState<ConnectionFormValues | null>(null);
  const [csvName, setCsvName] = useState(editingConnection?.name ?? "");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createConnection = useCreateConnection();
  const updateConnection = useUpdateConnection();
  const uploadCsv = useUploadCsv();
  const testConnection = useTestConnection();
  const deleteConnection = useDeleteConnection();

  const isSaving =
    createConnection.isPending || updateConnection.isPending || uploadCsv.isPending || testConnection.isPending;

  async function handleSave() {
    setError(null);
    try {
      let id: number;
      if (type === "csv") {
        if (isEditing) {
          const updated = await updateConnection.mutateAsync({
            id: editingConnection.id,
            data: { name: csvName },
          });
          id = updated.id;
        } else {
          if (!csvFile) {
            setError("Please choose a CSV file to upload.");
            return;
          }
          const created = await uploadCsv.mutateAsync({ name: csvName, file: csvFile });
          id = created.id;
        }
      } else {
        if (!sqlValues) {
          setError("Please fill in the connection fields.");
          return;
        }
        if (isEditing) {
          const updated = await updateConnection.mutateAsync({
            id: editingConnection.id,
            data: { name: sqlValues.name, config: sqlValues.config },
          });
          id = updated.id;
        } else {
          const created = await createConnection.mutateAsync({
            name: sqlValues.name,
            type,
            config: sqlValues.config,
          });
          id = created.id;
        }
      }

      setSavedId(id);

      if (type !== "csv") {
        const result = await testConnection.mutateAsync(id);
        setTestResult(result);
        if (result.success) {
          setTimeout(onClose, 1200);
        }
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function handleDeleteAndRetry() {
    if (savedId === null) return;
    await deleteConnection.mutateAsync(savedId);
    setSavedId(null);
    setTestResult(null);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            {isEditing ? "Edit Connection" : "Add Connection"}
          </h2>
          <button className="text-slate-400 hover:text-slate-700" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-5">
          <ConnectionTypeTabs value={type} onChange={setType} disabled={isEditing} />

          {type === "csv" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Connection Name</label>
                <input
                  className="w-full bg-white text-slate-900 text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  placeholder="e.g. Q3 Financial Modeling"
                  value={csvName}
                  onChange={(e) => setCsvName(e.target.value)}
                />
              </div>
              {!isEditing && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-xs file:font-medium hover:file:bg-indigo-100"
                    onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              )}
            </div>
          ) : (
            <ConnectionForm
              type={type}
              initial={
                isEditing
                  ? {
                      name: editingConnection.name,
                      config: {
                        host: editingConnection.host ?? "",
                        port: editingConnection.port ?? 0,
                        database: editingConnection.database ?? "",
                        username: editingConnection.username ?? "",
                        password: "",
                      },
                    }
                  : undefined
              }
              onChange={setSqlValues}
            />
          )}

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          {testResult && (
            <div
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-xs font-mono ${
                testResult.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <span>{testResult.message}</span>
              {!testResult.success && (
                <button
                  className="shrink-0 px-2 py-1 bg-white border border-red-200 hover:bg-red-50 rounded text-red-700 font-sans font-medium"
                  onClick={handleDeleteAndRetry}
                >
                  Delete &amp; Retry
                </button>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            className="h-8.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save & Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
