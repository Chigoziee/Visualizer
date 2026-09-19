from typing import Literal

from pydantic import BaseModel

LLMProviderName = Literal["openai", "anthropic", "litellm"]


class ProviderModels(BaseModel):
    provider: LLMProviderName
    models: list[str]
    configured: bool


class LLMDefault(BaseModel):
    provider: LLMProviderName
    model: str


class ApiKeyStatus(BaseModel):
    provider: LLMProviderName
    configured: bool
    source: Literal["database", "environment", "none"]
    api_base: str | None = None


class ApiKeyUpdate(BaseModel):
    api_key: str
    api_base: str | None = None
