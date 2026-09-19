import { useEffect, useState } from "react";

import type { ConnectionType } from "../../types/connection";

const DEFAULT_PORTS: Record<string, number> = { postgres: 5432, mysql: 3306, mongodb: 27017 };

const URI_PLACEHOLDERS: Record<string, string> = {
  postgres: "postgresql://user:password@host:5432/database",
  mysql: "mysql://user:password@host:3306/database",
  mongodb: "mongodb+srv://user:password@cluster0.xxxxx.mongodb.net",
};

export interface ConnectionFormValues {
  name: string;
  config: Record<string, unknown>;
}

export function ConnectionForm({
  type,
  initial,
  onChange,
}: {
  type: Exclude<ConnectionType, "csv">;
  initial?: { name?: string; config?: Record<string, unknown> };
  onChange: (values: ConnectionFormValues) => void;
}) {
  const initialConfig = initial?.config ?? {};
  const [mode, setMode] = useState<"fields" | "uri">(initialConfig.uri ? "uri" : "fields");
  const [name, setName] = useState(initial?.name ?? "");
  const [host, setHost] = useState(String(initialConfig.host ?? ""));
  const [port, setPort] = useState(Number(initialConfig.port ?? DEFAULT_PORTS[type]));
  const [database, setDatabase] = useState(String(initialConfig.database ?? ""));
  const [username, setUsername] = useState(String(initialConfig.username ?? ""));
  const [password, setPassword] = useState(String(initialConfig.password ?? ""));
  const [uri, setUri] = useState(String(initialConfig.uri ?? ""));
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const config: Record<string, unknown> =
      mode === "uri"
        ? type === "mongodb"
          ? { uri, database }
          : { uri }
        : { host, port, database, username, password };
    onChange({ name, config });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, name, host, port, database, username, password, uri]);

  const inputClass =
    "w-full bg-white text-slate-900 font-mono text-xs px-3.5 py-2 rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700">Connection Name</label>
        <input
          className="w-full bg-white text-slate-900 text-sm px-3.5 py-2 rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          placeholder="e.g. Production Read Replica"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("fields")}
          className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
            mode === "fields" ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-500"
          }`}
        >
          Host &amp; Port
        </button>
        <button
          type="button"
          onClick={() => setMode("uri")}
          className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
            mode === "uri" ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-500"
          }`}
        >
          Connection URI
        </button>
      </div>

      {mode === "fields" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Host Address</label>
              <input
                className={inputClass}
                placeholder="hostname or IP"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Port</label>
              <input
                className={inputClass}
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Database Name</label>
              <input
                className={inputClass}
                placeholder="database_name"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Username</label>
              <input
                className={inputClass}
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showSecret ? "text" : "password"}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                onClick={() => setShowSecret((v) => !v)}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showSecret ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Connection URI</label>
            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                type={showSecret ? "text" : "password"}
                placeholder={URI_PLACEHOLDERS[type]}
                value={uri}
                onChange={(e) => setUri(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                onClick={() => setShowSecret((v) => !v)}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showSecret ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {type === "mongodb"
                ? "Paste a full mongodb:// or mongodb+srv:// URI, including credentials. Use this for MongoDB Atlas."
                : "Paste a full connection string, including credentials and database name."}
            </p>
          </div>

          {type === "mongodb" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Database Name</label>
              <input
                className={inputClass}
                placeholder="database_name"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
