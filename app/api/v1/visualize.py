from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.visualization import VisualizeRequest, VisualizeResponse
from app.services import visualization_service
from app.services.connection_service import ConnectionNotFoundError

router = APIRouter(tags=["visualize"])


@router.post("/visualize", response_model=VisualizeResponse)
def visualize(request: VisualizeRequest, db: Session = Depends(get_db)) -> VisualizeResponse:
    try:
        return visualization_service.generate_visualization(db, request)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
