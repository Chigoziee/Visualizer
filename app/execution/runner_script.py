"""Entrypoint executed in an isolated child interpreter (see sandbox.py).

Invoked as: python -I runner_script.py <df_parquet_path> <code_path> <output_path>

Reads a DataFrame + generated code from disk, executes the code against a
restricted namespace, and writes a JSON result (chart PNG as base64, or an
error) to the output path. Communicating via files rather than stdout avoids
any ambiguity from library print()/warning noise mixing into the result.
"""

import base64
import builtins
import io
import json
import sys
import traceback

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

_ALLOWED_BUILTIN_NAMES = {
    "len", "range", "str", "int", "float", "bool", "list", "dict", "set", "tuple",
    "min", "max", "sum", "sorted", "enumerate", "zip", "abs", "round", "map", "filter",
    "isinstance", "print", "reversed", "any", "all", "frozenset", "slice", "type",
    "Exception", "ValueError", "TypeError", "KeyError", "IndexError", "StopIteration",
    "ZeroDivisionError", "AttributeError", "RuntimeError", "None", "True", "False",
}


def write_result(output_path: str, result: dict) -> None:
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f)


def main() -> None:
    df_path, code_path, output_path = sys.argv[1], sys.argv[2], sys.argv[3]

    try:
        df = pd.read_parquet(df_path)
        with open(code_path, encoding="utf-8") as f:
            code = f.read()

        safe_builtins = {name: getattr(builtins, name) for name in _ALLOWED_BUILTIN_NAMES if hasattr(builtins, name)}
        restricted_globals = {
            "__builtins__": safe_builtins,
            "pd": pd,
            "plt": plt,
            "np": np,
            "df": df,
        }

        compiled = compile(code, "<generated_chart_code>", "exec")
        exec(compiled, restricted_globals)  # noqa: S102

        fig = restricted_globals.get("fig")
        if not isinstance(fig, matplotlib.figure.Figure):
            write_result(output_path, {"success": False, "error": "Generated code did not produce a matplotlib Figure named 'fig'."})
            return

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=150, bbox_inches="tight")
        image_base64 = base64.b64encode(buf.getvalue()).decode("ascii")

        write_result(output_path, {"success": True, "image_base64": image_base64})

    except Exception as exc:  # noqa: BLE001
        write_result(
            output_path,
            {"success": False, "error": f"{type(exc).__name__}: {exc}", "traceback": traceback.format_exc(limit=3)},
        )


if __name__ == "__main__":
    main()
