import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteConnection, useTestConnection } from "../../hooks/useConnections";
import { connectionTypeLabel, formatRelativeTime } from "../../lib/format";
import type { ConnectionOut } from "../../types/connection";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { StatusDot } from "../common/StatusDot";

const TYPE_ICONS: Record<string, string> = {
  postgres: "database",
  mysql: "dns",
  mongodb: "hub",
  csv: "description",
};

export function ConnectionCard({
  connection,
  onEdit,
}: {
  connection: ConnectionOut;
  onEdit: (connection: ConnectionOut) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const testConnection = useTestConnection();
  const deleteConnection = useDeleteConnection();
  const navigate = useNavigate();

  const detailLine =
    connection.type === "csv"
      ? connection.file_name
      : `${connection.host}:${connection.port}/${connection.database}`;

  return (
    <div className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between relative">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">{TYPE_ICONS[connection.type]}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm tracking-tight truncate">{connection.name}</h3>
                <span className="font-mono text-[11px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                  {connectionTypeLabel(connection.type)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-slate-500 text-xs font-mono">
                <span className="truncate">{detailLine}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-44 bg-white border border-slate-200 rounded-lg p-1 shadow-lg z-30 flex flex-col gap-0.5">
                <button
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    testConnection.mutate(connection.id);
                  }}
                >
                  <span className="material-symbols-outlined text-indigo-600 text-[16px]">bolt</span>
                  <span>Test Connection</span>
                </button>
                <button
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(connection);
                  }}
                >
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">edit</span>
                  <span>Edit Details</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmingDelete(true);
                  }}
                >
                  <span className="material-symbols-outlined text-red-500 text-[16px]">delete</span>
                  <span>Delete Source</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg mb-4">
          <div className="flex items-center gap-2 text-xs min-w-0">
            <StatusDot status={connection.last_test_status} />
            <span className="font-mono font-semibold text-slate-700 capitalize">
              {connection.last_test_status ?? "Untested"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 truncate">
              {connection.last_tested_at ? `tested ${formatRelativeTime(connection.last_tested_at)}` : "never tested"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-3 border-t border-slate-100">
        <button
          className="font-mono text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 rounded-md transition-colors flex items-center gap-1 font-medium shadow-2xs"
          onClick={() => navigate(`/data-sources/${connection.id}`)}
        >
          <span className="material-symbols-outlined text-[15px]">schema</span>
          <span>Browse</span>
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete data source"
          message={`Are you sure you want to delete "${connection.name}"? This cannot be undone.`}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            deleteConnection.mutate(connection.id);
          }}
        />
      )}
    </div>
  );
}
