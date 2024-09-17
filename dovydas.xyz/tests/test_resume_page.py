import pytest
from playwright.async_api import Page
from .objects.resume_page import ResumePage, PageLink  # Adjust the import based on your project structure




@pytest.fixture
async def page() -> Page:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()
        yield page
        await browser.close()


@pytest.fixture(autouse=False)
async def resume_page(page: Page):
    resume_page = ResumePage(page)
    await resume_page.visit()
    yield resume_page


@pytest.mark.asyncio
class TestResumePage:
    # TODO: port back the IDs the labels of the each entry
    @pytest.mark.parametrize("link, expected_href", [
        (PageLink.email, 'mailto:dovydas.gulbinas@protonmail.com'),
        (PageLink.phone, 'tel:0037060243562'),
        (PageLink.github, 'https://github.com/dovydasgulbinas/'),
        (PageLink.linkedin, 'https://www.linkedin.com/in/dovydas-gulbinas-b09126104/'),
        (PageLink.blog, 'https://dovydas.xyz')
    ])
    async def test_resume_link_is_visible(self, resume_page, link: PageLink, expected_href: str):
        await resume_page.assert_attribute_value(link, 'href', expected_href)
