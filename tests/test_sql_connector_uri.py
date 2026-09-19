from app.connectors.postgres import PostgresConnector
from app.connectors.mysql import MySQLConnector


def test_postgres_builds_url_from_fields():
    connector = PostgresConnector(
        {"host": "db.example.com", "port": 5432, "database": "mydb", "username": "alice", "password": "secret"}
    )
    assert connector._build_url() == "postgresql+psycopg2://alice:secret@db.example.com:5432/mydb"


def test_postgres_pins_driver_when_uri_is_bare():
    connector = PostgresConnector({"uri": "postgresql://alice:secret@db.example.com:5432/mydb"})
    assert connector._build_url() == "postgresql+psycopg2://alice:secret@db.example.com:5432/mydb"


def test_postgres_respects_explicit_driver_in_uri():
    connector = PostgresConnector({"uri": "postgresql+psycopg2://alice:secret@db.example.com:5432/mydb"})
    assert connector._build_url() == "postgresql+psycopg2://alice:secret@db.example.com:5432/mydb"


def test_mysql_pins_driver_when_uri_is_bare():
    connector = MySQLConnector({"uri": "mysql://alice:secret@db.example.com:3306/mydb"})
    assert connector._build_url() == "mysql+pymysql://alice:secret@db.example.com:3306/mydb"
