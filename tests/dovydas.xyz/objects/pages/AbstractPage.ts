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

  throwOnMissingCase(locatorConstant: any){
    throw new Error(`Non-existent locator: ${locatorConstant}`)
  }
  

  abstract selectLocator(locatorConstant: any): Locator

  async clickOnLink(locatorConstant: any){
    await this.selectLocator(locatorConstant).click()
  }

  async assertAttributeValue(locatorConstant: any, attribute: string, valueExpected: string) {
    await expect(this.selectLocator(locatorConstant)).toHaveAttribute(attribute, valueExpected)
  }

  async assertLinkText(locatorConstant: any, valueExpected: string){
    await expect(this.selectLocator(locatorConstant)).toHaveText(valueExpected)
  }

  async assertRegexPatternMatches(locatorConstant: any, regex: RegExp){
    const text = await this.selectLocator(locatorConstant).textContent()
    expect(text).toEqual(expect.stringMatching(regex))
  }

  async assertVisible(locatorConstant: any){
    await expect(this.selectLocator(locatorConstant)).toBeVisible()
  }


}
