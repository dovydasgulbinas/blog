import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'

export enum SongCardLocator {
    container,
    datePublished,
    trackImage,
    trackTitle,
    trackPlayer,
  }


export class SongCardComponent extends AbstractPage {

  readonly page: Page
  readonly container: Locator
  readonly datePublished: Locator
  readonly trackImage: Locator
  readonly trackTitle: Locator
  readonly trackPlayer: Locator


  constructor(page: Page) {
    super(page, '', '')
    this.container = page.locator('article').first() 
    this.datePublished = this.container.locator('#date-published')
    this.trackImage = this.container.locator('img')
    this.trackTitle = this.container.locator('.song-title')
    this.trackPlayer = this.container.locator('audio')
};

  selectLocator(locator: SongCardLocator): Locator {
    switch (locator){
      case SongCardLocator.container:
        return this.container
      case SongCardLocator.datePublished:
        return this.datePublished
      case SongCardLocator.trackImage:
        return this.trackImage
      case SongCardLocator.trackTitle:
        return this.trackTitle
      case SongCardLocator.trackPlayer:
        return this.trackPlayer
      default:
        this.throwOnMissingCase(locator)
    }
  }

}