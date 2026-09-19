from pydantic import BaseModel

from app.schemas.llm import LLMProviderName


class VisualizeRequest(BaseModel):
    connection_id: int
    table_name: str
    prompt: str
    llm_provider: LLMProviderName | None = None
    llm_model: str | None = None
    row_limit: int | None = None


class VisualizeResponse(BaseModel):
    history_id: int
    execution_status: str
    image_base64: str | None = None
    generated_code: str | None = None
    error_message: str | None = None
    duration_ms: int
