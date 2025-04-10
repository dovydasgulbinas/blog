import re

from abc import abstractmethod
from enum import Enum
from typing import Any, Pattern

from playwright.async_api import Locator, Page, expect


class AbstractPage:
    def __init__(self, page: Page) -> None:
        self.page = page

    @property
    @abstractmethod
    def page_name(self) -> str: ...

    @property
    @abstractmethod
    def page_path(self) -> str: ...

    @abstractmethod
    def select_locator(self, locator_constant: Any) -> Locator: ...

    async def wait(self, time: int) -> None:
        await self.page.wait_for_timeout(time)

    def get_snapshot_name(self) -> str:
        return f"{self.page_name}.png"

    async def visit(self) -> None:
        await self.page.goto(self.page_path)

    def throw_on_missing_case(self, locator_constant: Any) -> None:
        raise ValueError(f"Non-existent locator: {locator_constant}")

    async def click_on_link(self, locator_constant: Any) -> None:
        await self.select_locator(locator_constant).click()

    async def assert_attribute_value(self, locator_constant: Any, attribute: str, value_expected: str) -> None:
        await expect(self.select_locator(locator_constant)).to_have_attribute(attribute, value_expected)

    async def assert_link_text(self, locator_constant: Any, value_expected: str) -> None:
        await expect(self.select_locator(locator_constant)).to_have_text(value_expected)

    async def assert_regex_pattern_matches(self, locator_constant: Any, regex: Pattern[str]) -> None:
        text = await self.select_locator(locator_constant).text_content()
        assert text
        assert re.search(regex, text), f"Text '{text}' does not match regex '{regex}'"

    async def assert_visible(self, locator_constant: Any) -> None:
        await expect(self.select_locator(locator_constant)).to_be_visible()
