import anthropic

from app.llm.base import BaseLLMProvider

DEFAULT_MODELS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5-20251001"]
DEFAULT_MAX_TOKENS = 4096


class AnthropicProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def list_models(self) -> list[str]:
        return DEFAULT_MODELS

    def generate_code(self, system_prompt: str, user_prompt: str, model: str) -> str:
        client = anthropic.Anthropic(api_key=self.api_key)
        response = client.messages.create(
            model=model,
            max_tokens=DEFAULT_MAX_TOKENS,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )

        if response.stop_reason == "refusal":
            raise ValueError("The model declined to generate code for this request.")

        text_blocks = [block.text for block in response.content if block.type == "text"]
        return "".join(text_blocks)
