import pandas as pd
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import Engine, make_url

from app.connectors.base import BaseConnector
from app.schemas.datasource import ColumnInfo, TableInfo


class SQLConnector(BaseConnector):
    """Shared logic for SQLAlchemy-backed connectors (Postgres, MySQL)."""

    drivername: str  # e.g. "postgresql+psycopg2" or "mysql+pymysql"

    def _build_url(self) -> str:
        if self.config.get("uri"):
            url = make_url(self.config["uri"])
            if "+" not in url.drivername:
                # A bare "postgresql://"/"mysql://" would fall back to whatever DBAPI
                # SQLAlchemy finds installed; pin it to the driver we actually ship.
                url = url.set(drivername=self.drivername)
            # str(url) masks the password by default -- render_as_string(hide_password=False)
            # is required or the returned URL silently can't authenticate.
            return url.render_as_string(hide_password=False)

        c = self.config
        return (
            f"{self.drivername}://{c['username']}:{c['password']}"
            f"@{c['host']}:{c['port']}/{c['database']}"
        )

    def _engine(self) -> Engine:
        return create_engine(self._build_url(), pool_pre_ping=True)

    def _quote_ident(self, engine: Engine, identifier: str) -> str:
        return engine.dialect.identifier_preparer.quote(identifier)

    def test_connection(self) -> tuple[bool, str]:
        try:
            engine = self._engine()
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True, "Connection successful"
        except Exception as exc:  # noqa: BLE001
            return False, str(exc)

    def list_tables(self) -> list[TableInfo]:
        engine = self._engine()
        inspector = inspect(engine)
        return [TableInfo(name=t) for t in inspector.get_table_names()]

    def get_schema(self, table_name: str) -> list[ColumnInfo]:
        engine = self._engine()
        inspector = inspect(engine)
        columns = inspector.get_columns(table_name)
        return [ColumnInfo(name=col["name"], dtype=str(col["type"])) for col in columns]

    def sample_rows(self, table_name: str, n: int = 5) -> pd.DataFrame:
        engine = self._engine()
        quoted = self._quote_ident(engine, table_name)
        return pd.read_sql(text(f"SELECT * FROM {quoted} LIMIT :n"), engine, params={"n": n})

    def load_dataframe(self, table_name: str, query: str | dict | None, row_limit: int) -> pd.DataFrame:
        engine = self._engine()
        if query:
            sql = str(query)
            return pd.read_sql(text(sql), engine).head(row_limit)
        quoted = self._quote_ident(engine, table_name)
        return pd.read_sql(text(f"SELECT * FROM {quoted} LIMIT :n"), engine, params={"n": row_limit})
