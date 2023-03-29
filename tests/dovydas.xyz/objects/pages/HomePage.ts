import { Locator, Page } from '@playwright/test'
import { AbstractPage } from './AbstractPage'


export enum HomePageLocator {
    resumeHTML,
    resumePDF,
    pageHeading,
    imagePortrait,
  }

export class HomePage extends AbstractPage {
  readonly linkResumeHTML: Locator
  readonly linkResumePDF: Locator
  readonly pageHeading: Locator
  readonly imagePortrait: Locator

  constructor(page: Page) {
    super(page, 'HomePage', '/')

    // you can only assign to RO props via constructor
    this.linkResumeHTML = page.getByRole('link', { name: 'html' })
    this.linkResumePDF = page.getByRole('link', { name: 'pdf' })
    this.pageHeading = page.getByRole('heading', { name: 'Dovydas Gulbinas' })
    this.imagePortrait = page.getByRole('img', { name: 'D.G.' })
  }


  selectLocator(locatorConstant: HomePageLocator): Locator {
    switch (locatorConstant){
      case HomePageLocator.resumeHTML:
        return this.linkResumeHTML
      case HomePageLocator.resumePDF:
        return this.linkResumePDF
      case HomePageLocator.pageHeading:
        return this.pageHeading
      case HomePageLocator.imagePortrait:
        return this.imagePortrait
      default:
        this.throwOnMissingCase(locatorConstant)
    }
  }

  async clickOnResumeHTML() {
    await this.clickOnLink(HomePageLocator.resumeHTML)
  }

  async clickOnResumePDF() {
    await this.clickOnLink(HomePageLocator.resumePDF)
  }

}