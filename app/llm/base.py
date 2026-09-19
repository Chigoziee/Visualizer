from abc import ABC, abstractmethod


class BaseLLMProvider(ABC):
    @abstractmethod
    def generate_code(self, system_prompt: str, user_prompt: str, model: str) -> str:
        """Return the raw LLM text response (not yet fence-extracted)."""

    @abstractmethod
    def list_models(self) -> list[str]:
        """Return a list of model ids this provider can be called with."""
