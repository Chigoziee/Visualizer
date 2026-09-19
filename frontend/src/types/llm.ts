export type LLMProviderName = "openai" | "anthropic" | "litellm";

export interface ProviderModels {
  provider: LLMProviderName;
  models: string[];
  configured: boolean;
}

export interface LLMDefault {
  provider: LLMProviderName;
  model: string;
}

export interface ApiKeyStatus {
  provider: LLMProviderName;
  configured: boolean;
  source: "database" | "environment" | "none";
  api_base: string | null;
}

export interface ApiKeyUpdate {
  api_key: string;
  api_base?: string;
}
