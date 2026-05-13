import pytest
from app.calculator import add, sub, mul, div


def test_add():
    assert add(2, 4) == 5


def test_sub():
    assert sub(8, 2) == 6


def test_mul():
    assert mul(4, 3) == 12


def test_div():
    assert div(10, 2) == 5


def test_divide_by_zero():
    with pytest.raises(ValueError):
        div(10, 0)
