import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from './AbstractPage'



export enum MusicLocator {
    textHeading,
    linkNext,
    linkPrevious,
    textNumberOfPages,
  }


export class MusicPage extends AbstractPage {
    readonly textHeading: Locator
    readonly linkNext: Locator
    readonly linkPrevious: Locator
    readonly textNumberOfPages: Locator

  constructor(page: Page) {
    super(page, 'MusicPage', '/music')
    this.textHeading = page.getByRole('heading', { name: 'Music' }).getByText('Music')
    this.linkNext = page.getByRole('link', { name: 'Next', exact: true })
    this.linkPrevious = page.getByRole('link', { name: 'Previous' })
    this.textNumberOfPages = page.locator('#page-enumeration')
  }
  // FIXME: page visiting methods could be done in AbstractPaginatedPage, or mixin
  async visitPage(n: Number | null){
    if (n == null){
      throw new Error('Page number is null')
    }
    if (n == 1){
      // first page is the same as blog page and format `.../page/1` does not exist
      await this.visit()
      return
    }
    await this.page.goto(`${this.pagePath}/page/${n}/`)
  }

  async getLastPageNumber(): Promise<Number|null>{
    let pattern = /\d+ of (\d+)/
    const txt = await this.selectLocator(MusicLocator.textNumberOfPages).textContent()
    if (txt == null){
      return null  
    }
    const numberString = txt.match(pattern) 
    if (numberString == null || numberString[1] == null){
      return null
    }

    return Number(numberString[1])
  }


  selectLocator(locatorConstant: MusicLocator): Locator {
      switch (locatorConstant){
        case MusicLocator.textHeading:
          return this.textHeading
        case MusicLocator.linkNext:
          return this.linkNext
        case MusicLocator.linkPrevious:
          return this.linkPrevious
        case MusicLocator.textNumberOfPages:
          return this.textNumberOfPages
        default:
          this.throwOnMissingCase(locatorConstant)
        }
  }
}