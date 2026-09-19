from pathlib import Path

import pandas as pd

from app.connectors.base import BaseConnector
from app.schemas.datasource import ColumnInfo, TableInfo


class CSVConnector(BaseConnector):
    """CSV connections have no live connection; config = {file_path, original_filename}.

    table_name is ignored (a CSV connection always refers to the one file
    it was created from) but accepted for interface compatibility.
    """

    def _path(self) -> Path:
        return Path(self.config["file_path"])

    def _display_name(self) -> str:
        original = self.config.get("original_filename")
        return Path(original).stem if original else self._path().stem

    def test_connection(self) -> tuple[bool, str]:
        path = self._path()
        if not path.exists():
            return False, f"File not found: {path}"
        try:
            pd.read_csv(path, nrows=1)
            return True, "File is readable"
        except Exception as exc:  # noqa: BLE001
            return False, str(exc)

    def list_tables(self) -> list[TableInfo]:
        return [TableInfo(name=self._display_name())]

    def get_schema(self, table_name: str) -> list[ColumnInfo]:
        df = pd.read_csv(self._path(), nrows=0)
        return [ColumnInfo(name=col, dtype=str(dtype)) for col, dtype in df.dtypes.items()]

    def sample_rows(self, table_name: str, n: int = 5) -> pd.DataFrame:
        return pd.read_csv(self._path(), nrows=n)

    def load_dataframe(self, table_name: str, query: str | dict | None, row_limit: int) -> pd.DataFrame:
        return pd.read_csv(self._path(), nrows=row_limit)
