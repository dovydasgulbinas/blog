from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio

from playwright.async_api import Browser, Page, async_playwright

from .objects.resume_page import PageLink, ResumePage


@pytest_asyncio.fixture(scope="function")
async def resume_page(browser: Browser, tested_website) -> AsyncGenerator[ResumePage]:
    # FIXME: create abstract page to mimic playwright api
    async with async_playwright():
        page = await browser.new_page()

        resume_page = ResumePage(page)
        # FIXME: this could be made nicer tested website opened by default
        await page.goto(tested_website + resume_page.page_path)
        yield resume_page

        await resume_page.page.close()


@pytest.mark.asyncio
class TestResumePage:

    @pytest.mark.parametrize(
        ("link", "expected_href"),
        [
            (PageLink.phone, "tel:0037060243562"),
            (PageLink.github, "https://github.com/dovydasgulbinas/"),
            (PageLink.email, "mailto:dovydas.gulbinas@protonmail.com"),
            (
                PageLink.linkedin,
                "https://www.linkedin.com/in/dovydas-gulbinas-b09126104/",
            ),
            (PageLink.blog, "https://dovydas.xyz"),
        ],
    )
    async def test_resume_link_is_visible(self, resume_page: ResumePage, link, expected_href) -> None:
        await resume_page.assert_attribute_value(link, "href", expected_href)
