from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.history import HistoryDetail, HistoryListItem
from app.services import history_service
from app.services.history_service import HistoryNotFoundError

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryListItem])
def list_history(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)) -> list[HistoryListItem]:
    return history_service.list_history(db, limit=limit, offset=offset)


@router.get("/{history_id}", response_model=HistoryDetail)
def get_history(history_id: int, db: Session = Depends(get_db)) -> HistoryDetail:
    try:
        return history_service.get_history_entry(db, history_id)
    except HistoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{history_id}/image")
def get_history_image(history_id: int, db: Session = Depends(get_db)) -> FileResponse:
    try:
        path = history_service.get_history_image_path(db, history_id)
    except HistoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    if path is None or not path.exists():
        raise HTTPException(status_code=404, detail="No chart image for this history entry")
    return FileResponse(path, media_type="image/png")


@router.delete("/{history_id}", status_code=204)
def delete_history(history_id: int, db: Session = Depends(get_db)) -> None:
    try:
        history_service.delete_history_entry(db, history_id)
    except HistoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
