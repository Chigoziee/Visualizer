import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as llmApi from "../api/llm";
import type { ApiKeyUpdate, LLMDefault, LLMProviderName } from "../types/llm";

export function useLlmProviders() {
  return useQuery({ queryKey: ["llm-providers"], queryFn: llmApi.listProviders });
}

export function useLlmDefault() {
  return useQuery({ queryKey: ["llm-default"], queryFn: llmApi.getDefaultLlm });
}

export function useSetLlmDefault() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LLMDefault) => llmApi.setDefaultLlm(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["llm-default"] }),
  });
}

function invalidateApiKeyQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["api-keys"] });
  queryClient.invalidateQueries({ queryKey: ["llm-providers"] });
}

export function useApiKeys() {
  return useQuery({ queryKey: ["api-keys"], queryFn: llmApi.listApiKeys });
}

export function useSetApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ provider, data }: { provider: LLMProviderName; data: ApiKeyUpdate }) =>
      llmApi.setApiKey(provider, data),
    onSuccess: () => invalidateApiKeyQueries(queryClient),
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (provider: LLMProviderName) => llmApi.deleteApiKey(provider),
    onSuccess: () => invalidateApiKeyQueries(queryClient),
  });
}
