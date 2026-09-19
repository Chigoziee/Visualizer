import type { ExecutionStatus } from "./visualization";

export interface HistoryListItem {
  id: number;
  data_source_name: string;
  table_name: string | null;
  prompt: string;
  llm_provider: string;
  llm_model: string;
  execution_status: ExecutionStatus;
  created_at: string;
}

export interface HistoryDetail extends HistoryListItem {
  generated_code: string | null;
  error_message: string | null;
  has_image: boolean;
  duration_ms: number;
}
