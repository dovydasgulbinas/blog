import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from './AbstractPage'



export enum BlogLocator {
    textHeading,
    linkNext,
    linkPrevious,
    textNumberOfPages,
  }


export class BlogPage extends AbstractPage {
    readonly textHeading: Locator
    readonly linkNext: Locator
    readonly linkPrevious: Locator
    readonly textNumberOfPages: Locator

  constructor(page: Page) {
    super(page, 'BlogPage', '/blog')
    this.textHeading = page.getByRole('heading', { name: 'Blog' }).getByText('Blog')
    this.linkNext = page.getByRole('link', { name: 'Next', exact: true })
    this.linkPrevious = page.getByRole('link', { name: 'Previous' })
    this.textNumberOfPages = page.locator('#page-enumeration')
  }

  async visitPage(n: Number){
    if (n == 1){
      // first page is the same as blog page and format `.../page/1` does not exist
      await this.visit()
      return
    }
    await this.page.goto(`${this.pagePath}/page/${n}/`)
  }

  async getLastPageNumber(): Promise<Number|null>{
    let pattern = /\d+ of (\d+)/
    const txt = await this.selectLocator(BlogLocator.textNumberOfPages).textContent()
    if (txt == null){
      return null  
    }
    const numberString = txt.match(pattern) 
    if (numberString == null || numberString[1] == null){
      return null
    }

    return Number(numberString[1])
  }


  selectLocator(locatorConstant: BlogLocator): Locator {
      switch (locatorConstant){
        case BlogLocator.textHeading:
          return this.textHeading
        case BlogLocator.linkNext:
          return this.linkNext
        case BlogLocator.linkPrevious:
          return this.linkPrevious
        case BlogLocator.textNumberOfPages:
          return this.textNumberOfPages
        default:
          this.throwOnMissingCase(locatorConstant)
        }
  }
}