import type { ConnectionType } from "../../types/connection";

const TABS: { type: ConnectionType; label: string; icon: string }[] = [
  { type: "postgres", label: "PostgreSQL", icon: "database" },
  { type: "mysql", label: "MySQL", icon: "dns" },
  { type: "mongodb", label: "MongoDB", icon: "hub" },
  { type: "csv", label: "CSV / File", icon: "description" },
];

export function ConnectionTypeTabs({
  value,
  onChange,
  disabled,
}: {
  value: ConnectionType;
  onChange: (type: ConnectionType) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg">
      {TABS.map((tab) => (
        <button
          key={tab.type}
          type="button"
          disabled={disabled}
          onClick={() => onChange(tab.type)}
          className={`flex flex-col items-center justify-center gap-1 py-2 rounded-md text-[11px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            value === tab.type ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
          <span className="truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
