import pandas as pd

from app.schemas.datasource import ColumnInfo

SYSTEM_PROMPT = """You are a data visualization assistant.

A pandas DataFrame named `df` is already loaded with the user's data. \
`pandas` (as `pd`), `matplotlib.pyplot` (as `plt`), and `numpy` (as `np`) are already imported \
-- do not import anything else, and do not attempt to import anything at all.

Write Python code that:
- transforms `df` as needed to answer the user's request
- creates a chart using matplotlib
- assigns the final chart to a variable named `fig` (a matplotlib Figure)
- does NOT call plt.show()

Return ONLY a single ```python fenced code block containing the code, and nothing else \
-- no explanation before or after it.
"""


def build_user_prompt(
    table_name: str,
    columns: list[ColumnInfo],
    sample_df: pd.DataFrame,
    row_count: int | None,
    user_request: str,
) -> str:
    column_lines = "\n".join(f"- {col.name}: {col.dtype}" for col in columns)
    sample_str = sample_df.to_string(index=False)

    parts = [
        f"Table/collection: {table_name}",
        f"Columns:\n{column_lines}",
    ]
    if row_count is not None:
        parts.append(f"Approximate row count: {row_count}")
    parts.append(f"Sample rows:\n{sample_str}")
    parts.append(f"User request: {user_request}")

    return "\n\n".join(parts)
