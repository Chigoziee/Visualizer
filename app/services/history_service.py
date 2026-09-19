from pathlib import Path

from sqlalchemy.orm import Session

from app.models.history import QueryHistory


class HistoryNotFoundError(LookupError):
    pass


def create_history_entry(
    db: Session,
    *,
    connection_id: int | None,
    data_source_name: str,
    table_name: str | None,
    prompt: str,
    llm_provider: str,
    llm_model: str,
    generated_code: str | None,
    execution_status: str,
    error_message: str | None,
    chart_image_path: str | None,
    duration_ms: int,
) -> QueryHistory:
    entry = QueryHistory(
        connection_id=connection_id,
        data_source_name=data_source_name,
        table_name=table_name,
        prompt=prompt,
        llm_provider=llm_provider,
        llm_model=llm_model,
        generated_code=generated_code,
        execution_status=execution_status,
        error_message=error_message,
        chart_image_path=chart_image_path,
        duration_ms=duration_ms,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def list_history(db: Session, limit: int = 50, offset: int = 0) -> list[QueryHistory]:
    return (
        db.query(QueryHistory)
        .order_by(QueryHistory.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_history_entry(db: Session, history_id: int) -> QueryHistory:
    entry = db.get(QueryHistory, history_id)
    if entry is None:
        raise HistoryNotFoundError(f"History entry {history_id} not found")
    return entry


def delete_history_entry(db: Session, history_id: int) -> None:
    entry = get_history_entry(db, history_id)
    db.delete(entry)
    db.commit()


def get_history_image_path(db: Session, history_id: int) -> Path | None:
    entry = get_history_entry(db, history_id)
    return Path(entry.chart_image_path) if entry.chart_image_path else None
