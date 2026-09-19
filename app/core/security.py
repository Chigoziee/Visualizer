import json
import logging

from cryptography.fernet import Fernet

from app.core.config import DATA_DIR, settings

logger = logging.getLogger(__name__)

_SECRET_KEY_FILE = DATA_DIR / "secret.key"
_fernet: Fernet | None = None


def _load_or_create_key() -> bytes:
    if settings.app_encryption_key:
        return settings.app_encryption_key.encode()

    if _SECRET_KEY_FILE.exists():
        return _SECRET_KEY_FILE.read_bytes()

    key = Fernet.generate_key()
    _SECRET_KEY_FILE.write_bytes(key)
    logger.warning(
        "No APP_ENCRYPTION_KEY set. Generated a new encryption key at %s. "
        "Back this file up -- losing it makes all saved connection credentials undecryptable.",
        _SECRET_KEY_FILE,
    )
    return key


def get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        _fernet = Fernet(_load_or_create_key())
    return _fernet


def encrypt_config(data: dict) -> str:
    payload = json.dumps(data).encode()
    return get_fernet().encrypt(payload).decode()


def decrypt_config(blob: str) -> dict:
    payload = get_fernet().decrypt(blob.encode())
    return json.loads(payload.decode())
