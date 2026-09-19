import pandas as pd
from sqlalchemy.orm import Session

from app.schemas.datasource import ColumnInfo, SampleRowsOut, SchemaOut, TableInfo
from app.services.connection_service import build_connector


def list_tables(db: Session, connection_id: int) -> list[TableInfo]:
    _, connector = build_connector(db, connection_id)
    return connector.list_tables()


def get_schema(db: Session, connection_id: int, table_name: str) -> SchemaOut:
    _, connector = build_connector(db, connection_id)
    columns: list[ColumnInfo] = connector.get_schema(table_name)
    return SchemaOut(table_name=table_name, columns=columns)


def get_sample_rows(db: Session, connection_id: int, table_name: str, n: int = 5) -> SampleRowsOut:
    _, connector = build_connector(db, connection_id)
    df: pd.DataFrame = connector.sample_rows(table_name, n)
    return SampleRowsOut(table_name=table_name, rows=df.to_dict(orient="records"))
