import nox


nox.options.default_venv_backend = "venv"
nox.options.reuse_existing_virtualenvs = True


@nox.session(python=["3.12"])
def test(session: nox.Session) -> None:
    session.install("-U", "pip")
    session.install("-r", "requirements.txt")
    session.install(".")

    session.run(
        "mypy",
        "--pretty",
        "tests",
    )
    session.run(
        "flake8",
        "tests",
    )
    session.run("lint-imports")
    session.run("pip-audit")
    session.run("pytest", "--durations=10", *session.posargs)
