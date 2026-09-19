import pandas as pd
import pytest

from app.execution.ast_guard import UnsafeCodeError
from app.execution.sandbox import run_generated_code


@pytest.fixture
def sample_df() -> pd.DataFrame:
    return pd.DataFrame({"category": ["a", "b", "c"], "value": [1, 2, 3]})


def test_rejects_import(sample_df):
    code = "import os\nfig = plt.figure()"
    with pytest.raises(UnsafeCodeError):
        run_generated_code(code, sample_df)


def test_rejects_dunder_escape(sample_df):
    code = "x = ().__class__\nfig = plt.figure()"
    with pytest.raises(UnsafeCodeError):
        run_generated_code(code, sample_df)


def test_rejects_eval_call(sample_df):
    code = "eval('1')\nfig = plt.figure()"
    with pytest.raises(UnsafeCodeError):
        run_generated_code(code, sample_df)


def test_successful_chart_produces_image(sample_df):
    code = (
        "fig, ax = plt.subplots()\n"
        "ax.bar(df['category'], df['value'])\n"
    )
    result = run_generated_code(code, sample_df)
    assert result.status == "success"
    assert result.image_base64
    assert len(result.image_base64) > 100


def test_missing_fig_reports_error(sample_df):
    code = "x = df['value'].sum()\n"
    result = run_generated_code(code, sample_df)
    assert result.status == "error"
    assert "fig" in result.error_message.lower()


def test_infinite_loop_times_out(sample_df, monkeypatch):
    from app.core import config

    monkeypatch.setattr(config.settings, "execution_timeout_seconds", 2)
    code = "while True:\n    pass\n"
    result = run_generated_code(code, sample_df)
    assert result.status == "timeout"
