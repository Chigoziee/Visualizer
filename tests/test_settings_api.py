from app.core.config import settings as app_settings


def test_get_execution_settings(client):
    response = client.get("/api/v1/settings/execution")
    assert response.status_code == 200
    data = response.json()
    assert data == {
        "execution_timeout_seconds": app_settings.execution_timeout_seconds,
        "execution_max_rows": app_settings.execution_max_rows,
    }


def test_execution_settings_is_read_only(client):
    response = client.post("/api/v1/settings/execution")
    assert response.status_code == 405
