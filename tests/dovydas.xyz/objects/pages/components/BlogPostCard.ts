import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'

export enum PostCardLocator {
    container,
    cardImage,
    cardHeading,
    datePublished,
    dateUpdated,
    textSummary,
    linkMore,
  }


export class PostCardComponent extends AbstractPage {

  readonly page: Page
  readonly container: Locator
  readonly cardImage: Locator
  readonly cardHeading: Locator
  readonly datePublished: Locator
  readonly dateUpdated: Locator
  readonly textSummary: Locator
  readonly linkMore: Locator


  constructor(page: Page) {
    super(page, '', '')
    this.container = page.locator('article').first() 
    this.cardImage = this.container.getByRole('img')
    this.cardHeading = this.container.getByRole('heading')
    this.datePublished = this.container.locator('.post-meta div')
    // this.dateUpdated = this.containerCard.
    // this.textSummary = this.containerCard.
    // this.linkMore = this.containerCard.
  }

  selectLocator(locator: PostCardLocator): Locator {
    switch (locator){
      case PostCardLocator.container:
        return this.container
      case PostCardLocator.cardImage:
        return this.cardImage
      case PostCardLocator.cardHeading:
        return this.cardHeading
      case PostCardLocator.datePublished:
        return this.datePublished
      case PostCardLocator.dateUpdated:
        return this.dateUpdated
      case PostCardLocator.textSummary:
        return this.textSummary
      case PostCardLocator.linkMore:
        return this.linkMore
      default:
        this.throwOnMissingCase(locator)
    }
  }

}