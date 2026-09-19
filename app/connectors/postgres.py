from app.connectors.sql_base import SQLConnector


class PostgresConnector(SQLConnector):
    drivername = "postgresql+psycopg2"
