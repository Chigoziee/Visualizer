export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
      <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-[16px]">error</span>
      </div>
      <p className="font-mono text-[11px] text-rose-700/90 leading-relaxed">{message}</p>
    </div>
  );
}
