from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio

from playwright.async_api import Browser, async_playwright


@pytest_asyncio.fixture()
async def browser(pytestconfig: pytest.Config) -> AsyncGenerator[Browser]:
    # FIXME: reusing the browser per module level whould be better
    browser_name = pytestconfig.getoption("browser", default="chromium")
    headless = not pytestconfig.getoption("headed", default=True)

    async with async_playwright() as apw:
        browser_type = apw.firefox
        if browser_name == "firefox":
            browser_type = apw.firefox
        elif browser_name == "webkit":
            browser_type = apw.webkit
        elif browser_name == "chromium":
            browser_type = apw.chromium
        else:
            browser_type = apw.firefox

        browser = await browser_type.launch(headless=headless)
        yield browser

        await browser.close()


@pytest.fixture(scope="session")
def tested_website(pytestconfig: pytest.Config):
    return pytestconfig.getoption("tested_website", default="https://dovydas.xyz")
