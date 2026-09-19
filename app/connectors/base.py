from abc import ABC, abstractmethod

import pandas as pd

from app.schemas.datasource import ColumnInfo, TableInfo


class BaseConnector(ABC):
    """Common interface every data source connector implements.

    Connectors are always constructed with an already-decrypted config dict --
    they never see encrypted blobs or raw DB rows.
    """

    def __init__(self, config: dict):
        self.config = config

    @abstractmethod
    def test_connection(self) -> tuple[bool, str]:
        """Return (success, message)."""

    @abstractmethod
    def list_tables(self) -> list[TableInfo]:
        """List tables (or collections, for Mongo)."""

    @abstractmethod
    def get_schema(self, table_name: str) -> list[ColumnInfo]:
        """Return column name/dtype pairs for a table."""

    @abstractmethod
    def sample_rows(self, table_name: str, n: int = 5) -> pd.DataFrame:
        """Return a small sample of rows for prompt context."""

    @abstractmethod
    def load_dataframe(self, table_name: str, query: str | dict | None, row_limit: int) -> pd.DataFrame:
        """Load data into a DataFrame, capped at row_limit rows."""
