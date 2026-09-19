def test_create_postgres_connection_via_uri_derives_display_fields(client):
    response = client.post(
        "/api/v1/connections",
        json={
            "name": "Prod via URI",
            "type": "postgres",
            "config": {"uri": "postgresql://alice:secret@db.example.com:5432/mydb"},
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["host"] == "db.example.com"
    assert data["port"] == 5432
    assert data["database"] == "mydb"
    assert data["username"] == "alice"
    # the password must never be echoed back
    assert "secret" not in response.text


def test_create_mongodb_connection_via_srv_uri(client):
    response = client.post(
        "/api/v1/connections",
        json={
            "name": "Atlas Cluster",
            "type": "mongodb",
            "config": {
                "uri": "mongodb+srv://bob:hunter2@cluster0.abcde.mongodb.net",
                "database": "analytics",
            },
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["host"] == "cluster0.abcde.mongodb.net"
    assert data["port"] is None
    assert data["database"] == "analytics"
    assert data["username"] == "bob"
    assert "hunter2" not in response.text
