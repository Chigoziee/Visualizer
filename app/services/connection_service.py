from datetime import datetime, timezone
from urllib.parse import urlsplit

from sqlalchemy.orm import Session

from app.connectors.base import BaseConnector
from app.connectors.factory import get_connector
from app.core.security import decrypt_config, encrypt_config
from app.models.connection import DataSourceConnection
from app.schemas.connection import ConnectionCreate, ConnectionOut, ConnectionUpdate


class ConnectionNotFoundError(LookupError):
    pass


def _display_fields(config: dict) -> dict:
    """Non-secret fields to show on a connection card.

    A connection can be configured either via discrete host/port/database/username
    fields, or by pasting a full connection URI (needed for e.g. MongoDB Atlas'
    mongodb+srv:// strings, which have no separate host/port). Parsing the URI here
    is string-only (urlsplit does no I/O / DNS lookups) so both shapes render the
    same way on a connection card without ever exposing the embedded password.
    """
    if config.get("uri"):
        parts = urlsplit(config["uri"])
        return {
            "host": parts.hostname,
            "port": parts.port,
            "database": config.get("database") or (parts.path.lstrip("/") or None),
            "username": parts.username,
        }
    return {
        "host": config.get("host"),
        "port": config.get("port"),
        "database": config.get("database"),
        "username": config.get("username"),
    }


def _to_out(conn: DataSourceConnection) -> ConnectionOut:
    config = decrypt_config(conn.config_encrypted)
    display = _display_fields(config)
    return ConnectionOut(
        id=conn.id,
        name=conn.name,
        type=conn.type,
        host=display["host"],
        port=display["port"],
        database=display["database"],
        username=display["username"],
        file_name=config.get("original_filename") if conn.type == "csv" else None,
        created_at=conn.created_at,
        updated_at=conn.updated_at,
        last_tested_at=conn.last_tested_at,
        last_test_status=conn.last_test_status,
    )


def create_connection(db: Session, data: ConnectionCreate) -> ConnectionOut:
    conn = DataSourceConnection(
        name=data.name,
        type=data.type,
        config_encrypted=encrypt_config(data.config),
    )
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return _to_out(conn)


def create_csv_connection(db: Session, name: str, file_path: str, original_filename: str) -> ConnectionOut:
    conn = DataSourceConnection(
        name=name,
        type="csv",
        config_encrypted=encrypt_config({"file_path": file_path, "original_filename": original_filename}),
    )
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return _to_out(conn)


def list_connections(db: Session) -> list[ConnectionOut]:
    conns = db.query(DataSourceConnection).order_by(DataSourceConnection.created_at.desc()).all()
    return [_to_out(c) for c in conns]


def _get_or_raise(db: Session, connection_id: int) -> DataSourceConnection:
    conn = db.get(DataSourceConnection, connection_id)
    if conn is None:
        raise ConnectionNotFoundError(f"Connection {connection_id} not found")
    return conn


def get_connection(db: Session, connection_id: int) -> ConnectionOut:
    return _to_out(_get_or_raise(db, connection_id))


def update_connection(db: Session, connection_id: int, data: ConnectionUpdate) -> ConnectionOut:
    conn = _get_or_raise(db, connection_id)
    if data.name is not None:
        conn.name = data.name
    if data.config is not None:
        conn.config_encrypted = encrypt_config(data.config)
    db.commit()
    db.refresh(conn)
    return _to_out(conn)


def delete_connection(db: Session, connection_id: int) -> None:
    conn = _get_or_raise(db, connection_id)
    db.delete(conn)
    db.commit()


def build_connector(db: Session, connection_id: int) -> tuple[DataSourceConnection, BaseConnector]:
    conn = _get_or_raise(db, connection_id)
    config = decrypt_config(conn.config_encrypted)
    return conn, get_connector(conn.type, config)


def test_connection(db: Session, connection_id: int) -> tuple[bool, str]:
    conn, connector = build_connector(db, connection_id)
    success, message = connector.test_connection()
    conn.last_tested_at = datetime.now(timezone.utc)
    conn.last_test_status = "success" if success else "error"
    db.commit()
    return success, message
