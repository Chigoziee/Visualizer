import type { LLMProviderName } from "./llm";

export interface VisualizeRequest {
  connection_id: number;
  table_name: string;
  prompt: string;
  llm_provider?: LLMProviderName;
  llm_model?: string;
  row_limit?: number;
}

export type ExecutionStatus = "success" | "error" | "timeout";

export interface VisualizeResponse {
  history_id: number;
  execution_status: ExecutionStatus;
  image_base64: string | null;
  generated_code: string | null;
  error_message: string | null;
  duration_ms: number;
}
