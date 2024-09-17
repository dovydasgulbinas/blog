from playwright.async_api import Page, Locator, expect
from enum import Enum
from .abstract_page import AbstractPage  # Adjust the import based on your project structure

class PageLink(Enum):
    email = 1
    phone = 2
    github = 3
    linkedin = 4
    blog = 5

class ResumePage(AbstractPage):
    page_name = "ResumePage"
    page_path = "/resume"

    def __init__(self, page: Page):
        super().__init__(page)
        # TODO: locators sub object would be nicer
        self.link_email = page.locator('role=link[name="dovydas.gulbinas@protonmail.com"]')
        self.link_phone = page.locator('role=link[name="+37060243562"]')
        self.link_github = page.locator('role=link[name="GitHub"]')
        self.link_linkedin = page.locator('role=link[name="LinkedIn"]')
        self.link_blog = page.locator('role=link[name="Blog"]')

    def select_locator(self, locator_constant: PageLink) -> Locator:
        if locator_constant == PageLink.email:
            return self.link_email
        elif locator_constant == PageLink.phone:
            return self.link_phone
        elif locator_constant == PageLink.github:
            return self.link_github
        elif locator_constant == PageLink.linkedin:
            return self.link_linkedin
        elif locator_constant == PageLink.blog:
            return self.link_blog
        else:
            self.throw_on_missing_case(locator_constant)