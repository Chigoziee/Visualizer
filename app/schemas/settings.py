from pydantic import BaseModel


class ExecutionSettings(BaseModel):
    execution_timeout_seconds: int
    execution_max_rows: int
