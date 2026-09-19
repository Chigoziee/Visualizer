import { useMutation, useQueryClient } from "@tanstack/react-query";

import { runVisualize } from "../api/visualize";
import type { VisualizeRequest } from "../types/visualization";

export function useVisualizeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VisualizeRequest) => runVisualize(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}
