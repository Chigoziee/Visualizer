from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import connection, history, provider_credential  # noqa: F401  (registers tables on Base.metadata)

app = FastAPI(title="Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    _warm_matplotlib_font_cache()


def _warm_matplotlib_font_cache() -> None:
    """Matplotlib builds its font cache on first import in a fresh environment,
    which can take longer than the sandbox execution timeout. Trigger it here,
    in-process at startup, instead of on a user's first /visualize request in
    the sandboxed subprocess.
    """
    import matplotlib.font_manager  # noqa: F401


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Frontend static serving must be registered LAST: the SPA fallback below is a
# catch-all GET route, and Starlette matches routes in registration order, so
# anything registered after it (including /health) would never be reached.
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend_dist"

if FRONTEND_DIST.is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="frontend-assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_fallback(full_path: str) -> FileResponse:
        candidate = FRONTEND_DIST / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(FRONTEND_DIST / "index.html")
