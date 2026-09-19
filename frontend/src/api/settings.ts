import { apiGet } from "./client";
import type { ExecutionSettings } from "../types/settings";

export function getExecutionSettings() {
  return apiGet<ExecutionSettings>("/settings/execution");
}
