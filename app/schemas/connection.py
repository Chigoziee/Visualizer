from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

ConnectionType = Literal["postgres", "mysql", "mongodb", "csv"]


class ConnectionCreate(BaseModel):
    name: str
    type: ConnectionType
    config: dict[str, Any] = Field(
        description=(
            "postgres/mysql: {host, port, database, username, password}. "
            "mongodb: {host, port, database, username, password}. "
            "csv connections are created via /connections/csv-upload, not this endpoint."
        )
    )


class ConnectionUpdate(BaseModel):
    name: str | None = None
    config: dict[str, Any] | None = None


class ConnectionOut(BaseModel):
    id: int
    name: str
    type: ConnectionType
    host: str | None = None
    port: int | None = None
    database: str | None = None
    username: str | None = None
    file_name: str | None = None
    created_at: datetime
    updated_at: datetime
    last_tested_at: datetime | None = None
    last_test_status: str | None = None

    model_config = {"from_attributes": True}


class ConnectionTestResult(BaseModel):
    success: bool
    message: str
