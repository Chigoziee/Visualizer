import type { ReactNode } from "react";

export function TopBar({
  title,
  breadcrumb,
  right,
}: {
  title: string;
  breadcrumb?: string[];
  right?: ReactNode;
}) {
  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        {(breadcrumb ?? ["Visualizer"]).map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>}
            <span className={i === (breadcrumb?.length ?? 1) - 1 ? "text-slate-900 font-semibold" : ""}>
              {crumb}
            </span>
          </span>
        ))}
        {!breadcrumb && (
          <>
            <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
            <span className="text-slate-900 font-semibold">{title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">{right}</div>
    </header>
  );
}
