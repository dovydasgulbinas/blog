import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from './AbstractPage'


export enum PageLink {
    email,
    phone,
    github,
    linkedin,
    blog,
  }


export class ResumePage extends AbstractPage {
  readonly linkEmail: Locator
  readonly linkPhone: Locator
  readonly linkGithub: Locator
  readonly linkLinkedin: Locator
  readonly linkBlog: Locator


  constructor(page: Page) {
    super(page, 'ResumePage', '/resume')
    this.linkEmail = page.getByRole('link', { name: 'dovydas.gulbinas@protonmail.com' }) 
    this.linkPhone = page.getByRole('link', { name: '+37060243562' })
    this.linkGithub = page.getByRole('link', { name: 'GitHub' })
    this.linkLinkedin = page.locator('body > main:nth-child(2) > article:nth-child(1) > blockquote:nth-child(1) > p:nth-child(1) > a:nth-child(4)')
    this.linkBlog = page.getByRole('link', { name: 'Blog' })
  }


selectLocator(locatorConstant: PageLink): Locator {
    switch (locatorConstant){
      case PageLink.email:
        return this.linkEmail
      case PageLink.phone:
        return this.linkPhone
      case PageLink.github:
        return this.linkGithub
      case PageLink.linkedin:
        return this.linkLinkedin
      case PageLink.blog:
        return this.linkBlog
      default:
        this.throwOnMissingCase(locatorConstant)
    }
  }

}