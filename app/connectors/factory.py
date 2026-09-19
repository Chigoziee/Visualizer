from app.connectors.base import BaseConnector
from app.connectors.csv import CSVConnector
from app.connectors.mongodb import MongoDBConnector
from app.connectors.mysql import MySQLConnector
from app.connectors.postgres import PostgresConnector

_CONNECTOR_CLASSES: dict[str, type[BaseConnector]] = {
    "postgres": PostgresConnector,
    "mysql": MySQLConnector,
    "mongodb": MongoDBConnector,
    "csv": CSVConnector,
}


def get_connector(conn_type: str, config: dict) -> BaseConnector:
    try:
        connector_cls = _CONNECTOR_CLASSES[conn_type]
    except KeyError:
        raise ValueError(f"Unknown connection type: {conn_type}") from None
    return connector_cls(config)
