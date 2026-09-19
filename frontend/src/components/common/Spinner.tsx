export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block w-3.5 h-3.5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin ${className}`}
    />
  );
}
