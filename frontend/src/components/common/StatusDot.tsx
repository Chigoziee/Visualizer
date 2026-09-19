const COLORS: Record<string, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  timeout: "bg-amber-500",
  untested: "bg-slate-400",
};

export function StatusDot({ status }: { status: string | null }) {
  const color = COLORS[status ?? "untested"] ?? COLORS.untested;
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} />;
}
