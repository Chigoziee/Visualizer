import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ChartPanel } from "../components/visualize/ChartPanel";
import { ChatMessage, type Exchange } from "../components/visualize/ChatMessage";
import { CodePanel } from "../components/visualize/CodePanel";
import { DataSourceSelector } from "../components/visualize/DataSourceSelector";
import { LlmSelector } from "../components/visualize/LlmSelector";
import { PromptComposer } from "../components/visualize/PromptComposer";
import { TableSelector } from "../components/visualize/TableSelector";
import { EmptyState } from "../components/common/EmptyState";
import { useLlmDefault } from "../hooks/useLlm";
import { useVisualizeMutation } from "../hooks/useVisualize";
import { TopBar } from "../layout/TopBar";
import type { LLMProviderName } from "../types/llm";

export function VisualizePage() {
  const [searchParams] = useSearchParams();
  const [connectionId, setConnectionId] = useState<number | undefined>(
    searchParams.get("connection") ? Number(searchParams.get("connection")) : undefined,
  );
  const [tableName, setTableName] = useState<string | undefined>(searchParams.get("table") ?? undefined);
  const [llmProvider, setLlmProvider] = useState<LLMProviderName | undefined>(undefined);
  const [llmModel, setLlmModel] = useState<string | undefined>(undefined);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [codeVisible, setCodeVisible] = useState(false);

  const { data: defaultLlm } = useLlmDefault();
  const visualize = useVisualizeMutation();

  useEffect(() => {
    if (defaultLlm && !llmProvider) {
      setLlmProvider(defaultLlm.provider);
      setLlmModel(defaultLlm.model);
    }
  }, [defaultLlm, llmProvider]);

  const activeExchange = exchanges.find((e) => e.id === activeId);
  const canSubmit = connectionId !== undefined && tableName !== undefined && llmProvider !== undefined;

  function submitPrompt(prompt: string) {
    if (!canSubmit) return;
    const id = crypto.randomUUID();
    setExchanges((prev) => [...prev, { id, prompt, status: "pending" }]);

    visualize.mutate(
      {
        connection_id: connectionId!,
        table_name: tableName!,
        prompt,
        llm_provider: llmProvider,
        llm_model: llmModel,
      },
      {
        onSuccess: (response) => {
          setExchanges((prev) => prev.map((e) => (e.id === id ? { ...e, status: "done", response } : e)));
          if (response.execution_status === "success") {
            setActiveId(id);
            setCodeVisible(false);
          }
        },
        onError: (error) => {
          setExchanges((prev) =>
            prev.map((e) =>
              e.id === id ? { ...e, status: "failed", error: error instanceof Error ? error.message : "Request failed" } : e,
            ),
          );
        },
      },
    );
  }

  return (
    <>
      <TopBar
        title="Visualize"
        breadcrumb={["Visualizer", tableName ?? "Visualize"]}
        right={
          <div className="flex items-center gap-2">
            <DataSourceSelector
              value={connectionId}
              onChange={(id) => {
                setConnectionId(id);
                setTableName(undefined);
              }}
            />
            <TableSelector connectionId={connectionId} value={tableName} onChange={setTableName} />
            <div className="h-4 w-px bg-slate-200" />
            <LlmSelector
              provider={llmProvider}
              model={llmModel}
              onChange={(p, m) => {
                setLlmProvider(p);
                setLlmModel(m);
              }}
            />
          </div>
        }
      />
      <div className="flex-1 p-5 overflow-hidden flex gap-5">
        <section className="w-[42%] max-w-[560px] min-w-[380px] bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[17px]">chat</span>
            </div>
            <h2 className="text-xs font-semibold text-slate-800">Prompt History</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {exchanges.length === 0 && (
              <EmptyState
                icon="chat"
                title="Ask for a chart"
                description="Pick a data source and table above, then describe the chart you want."
              />
            )}
            {exchanges.map((exchange) => (
              <ChatMessage
                key={exchange.id}
                exchange={exchange}
                isActive={exchange.id === activeId}
                onSelect={() => {
                  setActiveId(exchange.id);
                  setCodeVisible(false);
                }}
                onRetry={() => submitPrompt(exchange.prompt)}
              />
            ))}
          </div>

          <PromptComposer disabled={!canSubmit} onSubmit={submitPrompt} />
        </section>

        <section className="flex-1 flex flex-col gap-4 overflow-y-auto min-w-0 pr-1">
          {!activeExchange?.response?.image_base64 && (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon="insights"
                title="No chart yet"
                description="Generate a chart from the prompt panel to see it here."
              />
            </div>
          )}
          {activeExchange?.response?.image_base64 && (
            <>
              <ChartPanel
                imageBase64={activeExchange.response.image_base64}
                codeVisible={codeVisible}
                onToggleCode={() => setCodeVisible((v) => !v)}
              />
              {codeVisible && activeExchange.response.generated_code && (
                <CodePanel
                  code={activeExchange.response.generated_code}
                  durationMs={activeExchange.response.duration_ms}
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
