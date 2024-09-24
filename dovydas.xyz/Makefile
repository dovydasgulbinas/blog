SHELL:=/bin/bash
export PLAYWRIGHT_BROWSERS_PATH = 0

VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python
PIP := $(VENV_DIR)/bin/pip
AENV := $(VENV_DIR)/bin/activate

PLAYWRIGHT := $(VENV_DIR)/bin/playwright
PYTEST := $(VENV_DIR)/bin/pytest
LEKTOR := $(VENV_DIR)/bin/lektor
MYPY := $(VENV_DIR)/bin/mypy

.PHONY: clean purge run test freeze upgrade


test: $(PYTHON)
	$(PYTEST) tests

mypy: $(PYTHON)
	$(MYPY) tests

serve: $(PYTHON)
	$(LEKTOR) serve

freeze:
	$(PIP) freeze > requirements.txt

init: $(PYTHON) init-playwright

init-playwright: $(PYTHON)
	$(PLAYWRIGHT) install --with-deps


$(PYTHON):
	python -m venv $(VENV_DIR)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	$(PIP) check
	pre-commit install

upgrade: $(PYTHON)
	pre-commit autoupdate
	#$(PIP) install --upgrade pip-tools pip wheel
	#$(PYTHON) -m piptools compile --upgrade -o requirements.txt

clean:
	rm -rf .nox build dist .nox .mypy_cache .pytest_cache *.egg-info
	find . -type f -name '*.py[co]' -delete -o -type d -name __pycache__ -delete

purge: clean
	rm -rf $(VENV_DIR)
