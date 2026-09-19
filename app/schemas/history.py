from datetime import datetime

from pydantic import BaseModel


class HistoryListItem(BaseModel):
    id: int
    data_source_name: str
    table_name: str | None
    prompt: str
    llm_provider: str
    llm_model: str
    execution_status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryDetail(HistoryListItem):
    generated_code: str | None
    error_message: str | None
    has_image: bool
    duration_ms: int
