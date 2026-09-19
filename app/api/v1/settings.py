from fastapi import APIRouter

from app.core.config import settings as app_settings
from app.schemas.settings import ExecutionSettings

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/execution", response_model=ExecutionSettings)
def get_execution_settings() -> ExecutionSettings:
    return ExecutionSettings(
        execution_timeout_seconds=app_settings.execution_timeout_seconds,
        execution_max_rows=app_settings.execution_max_rows,
    )
