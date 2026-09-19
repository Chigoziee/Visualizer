import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex bg-slate-50 text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">{children}</div>
    </div>
  );
}
