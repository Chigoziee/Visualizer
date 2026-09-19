import { apiPost } from "./client";
import type { VisualizeRequest, VisualizeResponse } from "../types/visualization";

export function runVisualize(data: VisualizeRequest) {
  return apiPost<VisualizeResponse>("/visualize", data);
}
