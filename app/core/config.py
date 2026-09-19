from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
STORAGE_DIR = BASE_DIR / "storage"
CSV_UPLOAD_DIR = STORAGE_DIR / "uploaded_csv"
CHARTS_DIR = STORAGE_DIR / "charts"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_encryption_key: str = ""

    database_url: str = f"sqlite:///{(DATA_DIR / 'app.db').as_posix()}"

    openai_api_key: str = ""
    anthropic_api_key: str = ""
    litellm_api_key: str = ""
    litellm_api_base: str = ""

    execution_timeout_seconds: int = 15
    execution_max_rows: int = 50_000

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]


settings = Settings()

for directory in (DATA_DIR, STORAGE_DIR, CSV_UPLOAD_DIR, CHARTS_DIR):
    directory.mkdir(parents=True, exist_ok=True)
