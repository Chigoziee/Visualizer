import json

from app.core.config import DATA_DIR
from app.llm.factory import PROVIDER_MODELS
from app.schemas.llm import LLMDefault

_SETTINGS_FILE = DATA_DIR / "app_settings.json"
_DEFAULT = LLMDefault(provider="anthropic", model="claude-sonnet-5")


def get_default_llm() -> LLMDefault:
    if not _SETTINGS_FILE.exists():
        return _DEFAULT
    data = json.loads(_SETTINGS_FILE.read_text(encoding="utf-8"))
    return LLMDefault(**data)


def set_default_llm(default: LLMDefault) -> LLMDefault:
    if default.provider not in PROVIDER_MODELS:
        raise ValueError(f"Unknown LLM provider: {default.provider}")
    _SETTINGS_FILE.write_text(default.model_dump_json(), encoding="utf-8")
    return default
