import base64
import time

from sqlalchemy.orm import Session

from app.core.config import CHARTS_DIR, settings
from app.execution.ast_guard import UnsafeCodeError
from app.execution.sandbox import run_generated_code
from app.llm.code_extraction import CodeExtractionError, assert_assigns_fig, extract_code
from app.llm.factory import PROVIDER_MODELS, get_llm_provider
from app.llm.prompt import SYSTEM_PROMPT, build_user_prompt
from app.schemas.visualization import VisualizeRequest, VisualizeResponse
from app.services.connection_service import build_connector
from app.services.history_service import create_history_entry
from app.services.llm_settings_service import get_default_llm

DEFAULT_ROW_LIMIT = settings.execution_max_rows


def generate_visualization(db: Session, request: VisualizeRequest) -> VisualizeResponse:
    start = time.perf_counter()
    default = get_default_llm()
    provider_name = request.llm_provider or default.provider
    model = request.llm_model or (default.model if not request.llm_provider else PROVIDER_MODELS[provider_name][0])
    row_limit = min(request.row_limit or DEFAULT_ROW_LIMIT, settings.execution_max_rows)

    conn, connector = build_connector(db, request.connection_id)

    generated_code: str | None = None
    status = "error"
    image_base64: str | None = None
    error_message: str | None = None

    try:
        columns = connector.get_schema(request.table_name)
        sample_df = connector.sample_rows(request.table_name, n=5)
        user_prompt = build_user_prompt(
            table_name=request.table_name,
            columns=columns,
            sample_df=sample_df,
            row_count=None,
            user_request=request.prompt,
        )

        provider = get_llm_provider(db, provider_name)
        raw_response = provider.generate_code(SYSTEM_PROMPT, user_prompt, model)

        generated_code = extract_code(raw_response)
        assert_assigns_fig(generated_code)

        df = connector.load_dataframe(request.table_name, query=None, row_limit=row_limit)
        result = run_generated_code(generated_code, df)

        status = result.status
        image_base64 = result.image_base64
        error_message = result.error_message

    except (CodeExtractionError, UnsafeCodeError) as exc:
        status = "error"
        error_message = str(exc)
    except Exception as exc:  # noqa: BLE001
        status = "error"
        error_message = f"{type(exc).__name__}: {exc}"

    duration_ms = int((time.perf_counter() - start) * 1000)

    entry = create_history_entry(
        db,
        connection_id=conn.id,
        data_source_name=conn.name,
        table_name=request.table_name,
        prompt=request.prompt,
        llm_provider=provider_name,
        llm_model=model,
        generated_code=generated_code,
        execution_status=status,
        error_message=error_message,
        chart_image_path=None,
        duration_ms=duration_ms,
    )

    if image_base64:
        chart_path = CHARTS_DIR / f"{entry.id}.png"
        chart_path.write_bytes(base64.b64decode(image_base64))
        entry.chart_image_path = str(chart_path)
        db.commit()

    return VisualizeResponse(
        history_id=entry.id,
        execution_status=status,
        image_base64=image_base64,
        generated_code=generated_code,
        error_message=error_message,
        duration_ms=duration_ms,
    )
