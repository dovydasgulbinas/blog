import { Locator, Page } from '@playwright/test'
import { AbstractPage } from './AbstractPage'


export enum HomePageLocator {
    resumeHTML,
    resumePDF,
    pageHeading,
  }

export class HomePage extends AbstractPage {
  readonly linkResumeHTML: Locator
  readonly linkResumePDF: Locator
  readonly pageHeading: Locator

  constructor(page: Page) {
    super(page, 'HomePage', '/')

    // you can only assign to RO props via constructor
    this.linkResumeHTML = page.locator('#resume > h3:nth-child(1) > a:nth-child(1)')
    this.linkResumePDF = page.locator('#resume > h3:nth-child(1) > a:nth-child(2)')
    this.pageHeading = page.locator('.landing > header:nth-child(1) > h1:nth-child(1)')
  }


  selectLocator(locatorConstant: HomePageLocator): Locator {
    switch (locatorConstant){
      case HomePageLocator.resumeHTML:
        return this.linkResumeHTML
      case HomePageLocator.resumePDF:
        return this.linkResumePDF
      case HomePageLocator.pageHeading:
        return this.pageHeading
      default:
        throw new Error(`Non-existent locator: ${locatorConstant}`)
    }
  }

  async clickOnResumeHTML() {
    await this.clickOnLink(HomePageLocator.resumeHTML)
  }

  async clickOnResumePDF() {
    await this.clickOnLink(HomePageLocator.resumePDF)
  }

}