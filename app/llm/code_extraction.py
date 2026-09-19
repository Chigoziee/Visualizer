import ast
import re

_FENCE_RE = re.compile(r"```(?:python)?\s*\n(.*?)```", re.DOTALL)


class CodeExtractionError(ValueError):
    pass


def extract_code(llm_response: str) -> str:
    match = _FENCE_RE.search(llm_response)
    if not match:
        raise CodeExtractionError("No fenced code block found in the LLM response.")
    return match.group(1).strip()


def _target_names(target: ast.expr) -> list[str]:
    if isinstance(target, ast.Name):
        return [target.id]
    if isinstance(target, (ast.Tuple, ast.List)):
        names = []
        for elt in target.elts:
            names.extend(_target_names(elt))
        return names
    return []


def assert_assigns_fig(code: str) -> None:
    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        raise CodeExtractionError(f"Generated code has a syntax error: {exc}") from exc

    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if "fig" in _target_names(target):
                    return

    raise CodeExtractionError("Generated code does not assign a `fig` variable.")
