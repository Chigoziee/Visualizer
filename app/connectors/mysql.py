from app.connectors.sql_base import SQLConnector


class MySQLConnector(SQLConnector):
    drivername = "mysql+pymysql"
