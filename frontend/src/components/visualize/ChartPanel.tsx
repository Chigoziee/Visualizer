import { useState } from "react";

export function ChartPanel({
  imageBase64,
  onToggleCode,
  codeVisible,
}: {
  imageBase64: string;
  onToggleCode: () => void;
  codeVisible: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  async function handleCopyImage() {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard image write unsupported in this browser; ignore
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col shrink-0">
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-sm font-bold text-slate-900">Generated Chart</h1>
        <div className="flex items-center gap-2">
          <a
            href={dataUrl}
            download="chart.png"
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">download</span>
            <span>Download PNG</span>
          </a>
          <button
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            onClick={handleCopyImage}
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">content_copy</span>
            <span>{copied ? "Copied!" : "Copy Image"}</span>
          </button>
          <button
            className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              codeVisible ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            onClick={onToggleCode}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>View Code</span>
          </button>
        </div>
      </div>
      <div className="p-6 flex items-center justify-center bg-white">
        <img src={dataUrl} alt="Generated chart" className="max-w-full rounded-lg border border-slate-100" />
      </div>
    </div>
  );
}
