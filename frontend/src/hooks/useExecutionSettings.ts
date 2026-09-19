import { useQuery } from "@tanstack/react-query";

import { getExecutionSettings } from "../api/settings";

export function useExecutionSettings() {
  return useQuery({ queryKey: ["execution-settings"], queryFn: getExecutionSettings });
}
