import { Page, Locator, expect } from '@playwright/test'


export abstract class AbstractPage {
  readonly page: Page
  readonly pageName: string
  readonly pagePath: string

  constructor(page: Page, pageName: string, pagePath: string) {
    this.page = page
    this.pageName = pageName
    this.pagePath = pagePath
  }

  async wait(time: number) {
    await this.page.waitForTimeout(time)
  }

  getSnapshotName(): string {
    return `${this.pageName}.png`
  }

  async visit() {
    await this.page.goto(this.pagePath)
  }

  abstract selectLocator(locatorConstant: any): Locator

  async clickOnLink(locatorConstant: any){
        await this.selectLocator(locatorConstant).click()
  }

  async assertAttributeValue(locatorConstant: any, attribute: string, valueExpected: string) {
        await expect(this.selectLocator(locatorConstant)).toHaveAttribute(attribute, valueExpected)
  }
}
