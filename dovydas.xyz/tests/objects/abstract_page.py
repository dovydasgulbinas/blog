from playwright.async_api import Page, Locator, expect
import re
from abc import ABC, abstractproperty

class AbstractPage:
    def __init__(self, page: Page, page_name: str, page_path: str):
        self.page = page

    @abstractproperty
    def page_name() -> str: ...

    @abstractproperty
    def page_path() -> str: ...
        

    async def wait(self, time: int):
        await self.page.wait_for_timeout(time)

    def get_snapshot_name(self) -> str:
        return f"{self.page_name}.png"

    async def visit(self):
        await self.page.goto(self.page_path)

    def throw_on_missing_case(self, locator_constant: any):
        raise ValueError(f"Non-existent locator: {locator_constant}")

    def select_locator(self, locator_constant: any) -> Locator:
        raise NotImplementedError("Subclasses should implement this method.")

    async def click_on_link(self, locator_constant: any):
        await self.select_locator(locator_constant).click()

    async def assert_attribute_value(self, locator_constant: any, attribute: str, value_expected: str):
        await expect(self.select_locator(locator_constant)).to_have_attribute(attribute, value_expected)

    async def assert_link_text(self, locator_constant: any, value_expected: str):
        await expect(self.select_locator(locator_constant)).to_have_text(value_expected)

    async def assert_regex_pattern_matches(self, locator_constant: any, regex: re.Pattern):
        text = await self.select_locator(locator_constant).text_content()
        assert re.search(regex, text) is not None, f"Text '{text}' does not match regex '{regex}'"

    async def assert_visible(self, locator_constant: any):
        await expect(self.select_locator(locator_constant)).to_be_visible()
