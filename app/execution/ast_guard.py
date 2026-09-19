import ast

_BANNED_CALL_NAMES = {"eval", "exec", "compile", "open", "__import__", "getattr", "setattr", "delattr", "vars", "globals", "locals"}


class UnsafeCodeError(ValueError):
    pass


def check_code_is_safe(code: str) -> None:
    """Static pre-execution checks. Not a full sandbox by itself --
    paired with the restricted-builtins subprocess runner in sandbox.py.
    """
    tree = ast.parse(code)

    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            raise UnsafeCodeError(
                "Generated code may not use import statements; "
                "pd, plt, np, and df are already provided."
            )

        if isinstance(node, ast.Attribute) and node.attr.startswith("__") and node.attr.endswith("__"):
            raise UnsafeCodeError(f"Access to dunder attribute '{node.attr}' is not allowed.")

        if isinstance(node, ast.Name) and node.id.startswith("__") and node.id.endswith("__"):
            raise UnsafeCodeError(f"Reference to dunder name '{node.id}' is not allowed.")

        if isinstance(node, ast.Call):
            func = node.func
            if isinstance(func, ast.Name) and func.id in _BANNED_CALL_NAMES:
                raise UnsafeCodeError(f"Call to '{func.id}' is not allowed.")
