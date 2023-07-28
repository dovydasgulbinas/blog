import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from '../AbstractPage'

export enum NavbarLocator {
    container,
    home,
    blog,
    projects,
    contactMe,
    music,
  }


export class NavbarComponent extends AbstractPage {
  readonly page: Page
  // FIXME: candidates for abstract component
  static containerSelector: string = 'nav'
  readonly container: Locator
  readonly linkHome: Locator
  readonly linkBlog: Locator
  readonly linkProjects: Locator
  readonly linkContactMe: Locator
  readonly linkMusic: Locator


  constructor(page: Page) {
    super(page, '', '')
    this.container = page.locator(NavbarComponent.containerSelector)
    this.linkHome = this.container.getByRole('list').getByRole('link').first() 
    this.linkBlog = this.container.getByRole('link').filter({ hasText: 'Blog' })
    this.linkProjects = this.container.getByRole('link').filter({ hasText: 'Projects' })
    this.linkContactMe = this.container.getByRole('link').filter({ hasText: 'Contact Me' })
    this.linkMusic = this.container.getByRole('link').filter({ hasText: 'Music' })
  }

  selectLocator(locator: NavbarLocator): Locator {
    switch (locator){
      case NavbarLocator.container:
        return this.container
      case NavbarLocator.home:
        return this.linkHome
      case NavbarLocator.blog:
        return this.linkBlog
      case NavbarLocator.projects:
        return this.linkProjects
      case NavbarLocator.contactMe:
        return this.linkContactMe
      case NavbarLocator.music:
        return this.linkMusic
      default:
        this.throwOnMissingCase(locator)
    }
  }
}