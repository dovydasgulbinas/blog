test: test-dovydas-xyz nix-test

install-lektor: update-apt install-apt-deps install-pip-deps install-dev-deps install-lektor-deps install-nodejs finish-install-nodejs install-node-deps

nix-test:
	nix flake check

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

install-nodejs:
	curl -fsSL https://fnm.vercel.app/install | bash
	source ~/.bashrc
	fnm list-remote

finish-install-nodejs:
	fnm install v18.15.0
	fnm use v18.15.0
	node --version
	npm --version

init-npm:
	cd tests && npm init

install-node-deps:
	cd tests && npm install \
		@playwright/test \
		prettier

test-dovydas-xyz:
	cd tests && \
		npm run tests:dovydas.xyz
