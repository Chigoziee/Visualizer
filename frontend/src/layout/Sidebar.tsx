import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/data-sources", label: "Data Sources", icon: "database" },
  { to: "/visualize", label: "Visualize", icon: "insights" },
  { to: "/history", label: "History", icon: "schedule" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-slate-300 flex flex-col justify-between shrink-0 border-r border-sidebar-border select-none z-50">
      <div className="flex flex-col">
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
            <span className="material-symbols-outlined text-[20px]">insights</span>
          </div>
          <span className="font-bold text-base text-white tracking-tight">Visualizer</span>
        </div>

        <nav className="flex flex-col gap-1 px-3 mt-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600/15 text-brand-500 border border-brand-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-sidebar-border flex flex-col gap-3 bg-sidebar">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Local
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">Online</span>
        </div>
      </div>
    </aside>
  );
}
