from typing import Any

from pydantic import BaseModel


class TableInfo(BaseModel):
    name: str


class ColumnInfo(BaseModel):
    name: str
    dtype: str


class SchemaOut(BaseModel):
    table_name: str
    columns: list[ColumnInfo]


class SampleRowsOut(BaseModel):
    table_name: str
    rows: list[dict[str, Any]]
