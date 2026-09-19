from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decrypt_config, encrypt_config
from app.models.provider_credential import ProviderCredential

_ENV_API_KEYS: dict[str, str] = {
    "openai": settings.openai_api_key,
    "anthropic": settings.anthropic_api_key,
    "litellm": settings.litellm_api_key,
}
_ENV_API_BASES: dict[str, str | None] = {
    "litellm": settings.litellm_api_base or None,
}


def _get_row(db: Session, provider: str) -> ProviderCredential | None:
    return db.query(ProviderCredential).filter(ProviderCredential.provider == provider).first()


def resolve_provider_config(db: Session, provider: str) -> tuple[str, str | None]:
    """Returns (api_key, api_base), preferring a stored override over env vars."""
    row = _get_row(db, provider)
    if row:
        stored = decrypt_config(row.config_encrypted)
        if stored.get("api_key"):
            return stored["api_key"], stored.get("api_base")
    return _ENV_API_KEYS.get(provider, ""), _ENV_API_BASES.get(provider)


def get_api_key_status(db: Session, provider: str) -> tuple[bool, str, str | None]:
    """Returns (configured, source, api_base) without ever returning the key itself."""
    row = _get_row(db, provider)
    if row:
        stored = decrypt_config(row.config_encrypted)
        if stored.get("api_key"):
            return True, "database", stored.get("api_base")
    env_key = _ENV_API_KEYS.get(provider, "")
    if env_key:
        return True, "environment", _ENV_API_BASES.get(provider)
    return False, "none", None


def set_api_key(db: Session, provider: str, api_key: str, api_base: str | None) -> None:
    config: dict = {"api_key": api_key}
    if api_base:
        config["api_base"] = api_base

    row = _get_row(db, provider)
    if row:
        row.config_encrypted = encrypt_config(config)
    else:
        db.add(ProviderCredential(provider=provider, config_encrypted=encrypt_config(config)))
    db.commit()


def delete_api_key(db: Session, provider: str) -> None:
    row = _get_row(db, provider)
    if row:
        db.delete(row)
        db.commit()
