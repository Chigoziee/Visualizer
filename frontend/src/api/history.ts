import { apiDelete, apiGet, apiUrl } from "./client";
import type { HistoryDetail, HistoryListItem } from "../types/history";

export function listHistory(limit = 50, offset = 0) {
  return apiGet<HistoryListItem[]>(`/history?limit=${limit}&offset=${offset}`);
}

export function getHistory(id: number) {
  return apiGet<HistoryDetail>(`/history/${id}`);
}

export function deleteHistory(id: number) {
  return apiDelete(`/history/${id}`);
}

export function historyImageUrl(id: number) {
  return apiUrl(`/history/${id}/image`);
}
