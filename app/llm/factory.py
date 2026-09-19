from sqlalchemy.orm import Session

from app.llm.anthropic_provider import DEFAULT_MODELS as ANTHROPIC_MODELS
from app.llm.anthropic_provider import AnthropicProvider
from app.llm.base import BaseLLMProvider
from app.llm.litellm_provider import DEFAULT_MODELS as LITELLM_MODELS
from app.llm.litellm_provider import LiteLLMProvider
from app.llm.openai_provider import DEFAULT_MODELS as OPENAI_MODELS
from app.llm.openai_provider import OpenAIProvider
from app.services.api_key_service import resolve_provider_config

PROVIDER_MODELS: dict[str, list[str]] = {
    "openai": OPENAI_MODELS,
    "anthropic": ANTHROPIC_MODELS,
    "litellm": LITELLM_MODELS,
}


def get_llm_provider(db: Session, provider_name: str) -> BaseLLMProvider:
    if provider_name not in PROVIDER_MODELS:
        raise ValueError(f"Unknown LLM provider: {provider_name}")

    api_key, api_base = resolve_provider_config(db, provider_name)

    if provider_name == "openai":
        return OpenAIProvider(api_key)
    if provider_name == "anthropic":
        return AnthropicProvider(api_key)
    return LiteLLMProvider(api_key, api_base)
