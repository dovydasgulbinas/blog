import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'

export enum PostCardLocator {
    container,
    cardImage,
    cardHeading,
    datePublished,
    dateEdited,
    textExcerpt,
    linkMore,
  }


export class PostCardComponent extends AbstractPage {

  readonly page: Page
  readonly container: Locator
  readonly cardImage: Locator
  readonly cardHeading: Locator
  readonly datePublished: Locator
  readonly dateEdited: Locator
  readonly textExcerpt: Locator
  readonly linkMore: Locator


  constructor(page: Page) {
    super(page, '', '')
    this.container = page.locator('article').first() 
    this.cardImage = this.container.getByRole('img')
    this.cardHeading = this.container.getByRole('heading')
    this.datePublished = this.container.locator('#date-published')
    this.dateEdited = this.container.locator('#date-edited')
    this.textExcerpt = this.container.locator('.excerpt')
    this.linkMore = this.textExcerpt.getByRole('link')
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
      case PostCardLocator.dateEdited:
        return this.dateEdited
      case PostCardLocator.textExcerpt:
        return this.textExcerpt
      case PostCardLocator.linkMore:
        return this.linkMore
      default:
        this.throwOnMissingCase(locator)
    }
  }

}