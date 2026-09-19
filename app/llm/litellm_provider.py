import litellm

from app.llm.base import BaseLLMProvider

DEFAULT_MODELS = ["anthropic/claude-sonnet-5", "openai/gpt-5", "ollama/llama3"]


class LiteLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str | None, api_base: str | None):
        self.api_key = api_key
        self.api_base = api_base

    def list_models(self) -> list[str]:
        return DEFAULT_MODELS

    def generate_code(self, system_prompt: str, user_prompt: str, model: str) -> str:
        kwargs = {}
        if self.api_key:
            kwargs["api_key"] = self.api_key
        if self.api_base:
            kwargs["api_base"] = self.api_base

        response = litellm.completion(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            **kwargs,
        )
        return response.choices[0].message.content or ""
