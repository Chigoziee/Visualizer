import pandas as pd
from pymongo import MongoClient

from app.connectors.base import BaseConnector
from app.schemas.datasource import ColumnInfo, TableInfo

SCHEMA_SAMPLE_SIZE = 50


class MongoDBConnector(BaseConnector):
    def _build_uri(self) -> str:
        c = self.config
        if c.get("uri"):
            return c["uri"]
        auth = f"{c['username']}:{c['password']}@" if c.get("username") else ""
        return f"mongodb://{auth}{c['host']}:{c['port']}"

    def _client(self) -> MongoClient:
        return MongoClient(self._build_uri(), serverSelectionTimeoutMS=5000)

    def _db(self, client: MongoClient):
        return client[self.config["database"]]

    def test_connection(self) -> tuple[bool, str]:
        try:
            client = self._client()
            client.admin.command("ping")
            return True, "Connection successful"
        except Exception as exc:  # noqa: BLE001
            return False, str(exc)

    def list_tables(self) -> list[TableInfo]:
        client = self._client()
        db = self._db(client)
        return [TableInfo(name=c) for c in db.list_collection_names()]

    def get_schema(self, table_name: str) -> list[ColumnInfo]:
        df = self.sample_rows(table_name, n=SCHEMA_SAMPLE_SIZE)
        return [ColumnInfo(name=col, dtype=str(dtype)) for col, dtype in df.dtypes.items()]

    def sample_rows(self, table_name: str, n: int = 5) -> pd.DataFrame:
        client = self._client()
        db = self._db(client)
        docs = list(db[table_name].find().limit(n))
        for doc in docs:
            doc["_id"] = str(doc.get("_id"))
        return pd.json_normalize(docs)

    def load_dataframe(self, table_name: str, query: str | dict | None, row_limit: int) -> pd.DataFrame:
        client = self._client()
        db = self._db(client)
        filter_dict = query if isinstance(query, dict) else {}
        docs = list(db[table_name].find(filter_dict).limit(row_limit))
        for doc in docs:
            doc["_id"] = str(doc.get("_id"))
        return pd.json_normalize(docs)
