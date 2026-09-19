import json
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import pandas as pd

from app.core.config import settings
from app.execution.ast_guard import check_code_is_safe

_RUNNER_SCRIPT = Path(__file__).with_name("runner_script.py")


@dataclass
class ExecutionResult:
    status: str  # "success" | "error" | "timeout"
    image_base64: str | None = None
    error_message: str | None = None


def run_generated_code(code: str, df: pd.DataFrame) -> ExecutionResult:
    check_code_is_safe(code)  # raises UnsafeCodeError, left to the caller to handle

    df = df.head(settings.execution_max_rows)

    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        df_path = tmp_path / "df.parquet"
        code_path = tmp_path / "code.py"
        output_path = tmp_path / "result.json"

        df.to_parquet(df_path)
        code_path.write_text(code, encoding="utf-8")

        try:
            subprocess.run(
                [sys.executable, "-I", str(_RUNNER_SCRIPT), str(df_path), str(code_path), str(output_path)],
                capture_output=True,
                timeout=settings.execution_timeout_seconds,
                check=False,
            )
        except subprocess.TimeoutExpired:
            return ExecutionResult(status="timeout", error_message="Execution timed out.")

        if not output_path.exists():
            return ExecutionResult(status="error", error_message="Sandbox process produced no output.")

        result = json.loads(output_path.read_text(encoding="utf-8"))

    if result.get("success"):
        return ExecutionResult(status="success", image_base64=result["image_base64"])
    return ExecutionResult(status="error", error_message=result.get("error", "Unknown execution error."))
