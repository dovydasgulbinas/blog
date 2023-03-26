import { Locator, Page, expect } from '@playwright/test'

export enum NavbarLocator {
    home,
    blog,
    projects,
    contactMe,
  }


export class NavbarComponent {

  readonly page: Page
  readonly linkHome: Locator
  readonly linkBlog: Locator
  readonly linkProjects: Locator
  readonly linkContactMe: Locator


  constructor(page: Page) {
    this.page = page
    this.linkHome = page.getByRole('list').getByRole('link').first() 
    this.linkBlog = page.locator('body > nav > ul > li:nth-child(2) > a')
    this.linkProjects = page.locator('body > nav > ul > li:nth-child(3) > a')
    this.linkContactMe = page.locator('body > nav > ul > li:nth-child(4) > a')
  }

  selectLocator(locator: NavbarLocator): Locator {
    switch (locator){
      case NavbarLocator.home:
        return this.linkHome
      case NavbarLocator.blog:
        return this.linkBlog
      case NavbarLocator.projects:
        return this.linkProjects
      case NavbarLocator.contactMe:
        return this.linkContactMe
      default:
        throw new Error(`Non-existent locator: ${locator}`)
    }
  }

  // TODO: could be part of abstract page
  async clickOnLink(locator: NavbarLocator){
        await this.selectLocator(locator).click()
    
  }




}