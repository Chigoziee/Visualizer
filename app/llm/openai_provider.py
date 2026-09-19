from openai import OpenAI

from app.llm.base import BaseLLMProvider

DEFAULT_MODELS = ["gpt-5", "gpt-5-mini", "gpt-4.1"]


class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def list_models(self) -> list[str]:
        return DEFAULT_MODELS

    def generate_code(self, system_prompt: str, user_prompt: str, model: str) -> str:
        client = OpenAI(api_key=self.api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content or ""
