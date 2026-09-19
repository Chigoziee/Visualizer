from fastapi import APIRouter

from app.api.v1 import connections, history, llm, settings, visualize

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(connections.router)
api_router.include_router(llm.router)
api_router.include_router(visualize.router)
api_router.include_router(history.router)
api_router.include_router(settings.router)
