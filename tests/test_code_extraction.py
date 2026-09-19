import pytest

from app.llm.code_extraction import CodeExtractionError, assert_assigns_fig, extract_code


def test_extract_code_from_fenced_block():
    response = "Here you go:\n```python\nfig = plt.figure()\n```\n"
    assert extract_code(response) == "fig = plt.figure()"


def test_extract_code_raises_without_fence():
    with pytest.raises(CodeExtractionError):
        extract_code("fig = plt.figure()")


def test_assert_assigns_fig_plain_assignment():
    assert_assigns_fig("fig = plt.figure()")


def test_assert_assigns_fig_tuple_unpacking():
    assert_assigns_fig("fig, ax = plt.subplots()")


def test_assert_assigns_fig_nested_tuple_unpacking():
    assert_assigns_fig("(fig, (ax1, ax2)) = plt.subplots(1, 2)")


def test_assert_assigns_fig_missing_raises():
    with pytest.raises(CodeExtractionError):
        assert_assigns_fig("x = plt.figure()")


def test_assert_assigns_fig_syntax_error_raises():
    with pytest.raises(CodeExtractionError):
        assert_assigns_fig("fig = plt.figure(")
