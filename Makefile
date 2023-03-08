install-lektor: update-apt install-apt-deps install-pip-deps install-dev-deps install-lektor-deps

update-apt:
	sudo apt update

install-apt-deps:
	sudo apt install python3-venv python3-pip

install-pip-deps:
	python3 -m pip install --user pipx
	python3 -m pipx ensurepath

install-dev-deps:
	pipx install tox

install-lektor-deps:
	pipx install lektor
