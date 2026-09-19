import { apiDelete, apiGet, apiPut } from "./client";
import type { ApiKeyStatus, ApiKeyUpdate, LLMDefault, LLMProviderName, ProviderModels } from "../types/llm";

export function listProviders() {
  return apiGet<ProviderModels[]>("/llm/providers");
}

export function getDefaultLlm() {
  return apiGet<LLMDefault>("/llm/default");
}

export function setDefaultLlm(data: LLMDefault) {
  return apiPut<LLMDefault>("/llm/default", data);
}

export function listApiKeys() {
  return apiGet<ApiKeyStatus[]>("/llm/api-keys");
}

export function setApiKey(provider: LLMProviderName, data: ApiKeyUpdate) {
  return apiPut<ApiKeyStatus>(`/llm/api-keys/${provider}`, data);
}

export function deleteApiKey(provider: LLMProviderName) {
  return apiDelete(`/llm/api-keys/${provider}`);
}
