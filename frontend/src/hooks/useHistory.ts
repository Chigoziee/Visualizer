import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as historyApi from "../api/history";

export function useHistoryList(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["history", limit, offset],
    queryFn: () => historyApi.listHistory(limit, offset),
  });
}

export function useHistoryDetail(id: number | undefined) {
  return useQuery({
    queryKey: ["history-detail", id],
    queryFn: () => historyApi.getHistory(id!),
    enabled: id !== undefined,
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => historyApi.deleteHistory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}
