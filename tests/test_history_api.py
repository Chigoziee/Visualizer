import base64

from app.core.config import CHARTS_DIR
from app.services.history_service import create_history_entry

TINY_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


def _make_entry(db_session, *, status: str, with_image: bool):
    chart_image_path = None
    entry = create_history_entry(
        db_session,
        connection_id=None,
        data_source_name="test source",
        table_name="orders",
        prompt="show revenue",
        llm_provider="anthropic",
        llm_model="claude-sonnet-5",
        generated_code="fig = plt.figure()" if with_image else None,
        execution_status=status,
        error_message=None if status == "success" else "boom",
        chart_image_path=chart_image_path,
        duration_ms=123,
    )
    if with_image:
        path = CHARTS_DIR / f"{entry.id}.png"
        path.write_bytes(TINY_PNG)
        entry.chart_image_path = str(path)
        db_session.commit()
    return entry


def test_get_history_image_success(client, db_session):
    entry = _make_entry(db_session, status="success", with_image=True)

    response = client.get(f"/api/v1/history/{entry.id}/image")

    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.content == TINY_PNG

    path = CHARTS_DIR / f"{entry.id}.png"
    path.unlink(missing_ok=True)


def test_get_history_image_missing_for_error_entry(client, db_session):
    entry = _make_entry(db_session, status="error", with_image=False)

    response = client.get(f"/api/v1/history/{entry.id}/image")

    assert response.status_code == 404


def test_get_history_image_missing_file_on_disk(client, db_session):
    entry = _make_entry(db_session, status="success", with_image=True)
    path = CHARTS_DIR / f"{entry.id}.png"
    path.unlink()

    response = client.get(f"/api/v1/history/{entry.id}/image")

    assert response.status_code == 404


def test_get_history_image_nonexistent_id(client):
    response = client.get("/api/v1/history/999999/image")
    assert response.status_code == 404


def test_history_detail_does_not_leak_filesystem_path(client, db_session):
    entry = _make_entry(db_session, status="success", with_image=True)

    response = client.get(f"/api/v1/history/{entry.id}")

    assert response.status_code == 200
    data = response.json()
    assert "chart_image_path" not in data
    assert data["has_image"] is True

    path = CHARTS_DIR / f"{entry.id}.png"
    path.unlink(missing_ok=True)
