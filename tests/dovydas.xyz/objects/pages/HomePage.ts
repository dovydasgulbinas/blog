import { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly linkResumeHTML: Locator
  readonly linkResumePDF: Locator
  readonly pageHeading: Locator

  constructor(page: Page) {
    this.page = page
    this.linkResumeHTML = page.locator('#resume > h3:nth-child(1) > a:nth-child(1)')
    this.linkResumePDF = page.locator('#resume > h3:nth-child(1) > a:nth-child(2)')
    this.pageHeading = page.locator('.landing > header:nth-child(1) > h1:nth-child(1)')
  }

  async visit() {
    // TODO: Create dynamic url selection if local env use localhost else ... public
    //await this.page.goto('https://dovydas.xyz')
    await this.page.goto('http://localhost:5000')
  }

  async clickOnResumeHTML() {
    await this.linkResumeHTML.click()
  }

  async clickOnResumePDF() {
    await this.linkResumePDF.click()
  }

}