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

  async visitPage(n: number){
    if (n == 1){
      // first page is the same as blog page and format `.../page/1` does not exist
      await this.visit()
      return
    }
    await this.page.goto(`${this.pagePath}/page/${n}`)
  }

  async getLastPageNumber(){
    // await targetPage.assertRegexPatternMatches(BlogLocator.textNumberOfPages, /\d+ of \d+/)
    const text = await this.selectLocator(BlogLocator.textNumberOfPages).textContent()
    

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