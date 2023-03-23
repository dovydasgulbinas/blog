import { Locator, Page, expect } from '@playwright/test'


export enum PageLink {
    email,
    phone,
    github,
    linkedin,
  }


export class ResumePage {

  readonly page: Page
  readonly linkEmail: Locator
  readonly linkPhone: Locator
  readonly linkGithub: Locator
  readonly linkLinkedin: Locator


  constructor(page: Page) {
    this.page = page
    this.linkEmail = page.getByRole('link', { name: 'dovydas.gulbinas@protonmail.com' }) 
    this.linkPhone = page.getByRole('link', { name: '+37060243562' })
    this.linkGithub = page.getByRole('link', { name: 'GitHub' })
    this.linkLinkedin = page.locator('body > main:nth-child(2) > article:nth-child(1) > blockquote:nth-child(1) > p:nth-child(1) > a:nth-child(4)')
  }

  async assertLinkHref(pageLink: PageLink, hrefExpected: string) {
    switch (pageLink){
      case PageLink.email:
        await expect(this.linkEmail).toHaveAttribute('href', hrefExpected)
        break
      case PageLink.phone:
        await expect(this.linkPhone).toHaveAttribute('href', hrefExpected)
        break
      case PageLink.github:
        await expect(this.linkGithub).toHaveAttribute('href', hrefExpected)
        break
      case PageLink.linkedin:
        await expect(this.linkLinkedin).toHaveAttribute('href', hrefExpected)
        break
      default:
        throw new Error(`Non-existent page link: ${pageLink}`)
    }
  }

  async clickOnLink(pageLink: PageLink) {
    switch (pageLink){
      case PageLink.email:
        await this.linkEmail.click()
        break
      case PageLink.phone:
        await this.linkPhone.click()
        break
      case PageLink.github:
        await this.linkGithub.click()
        break
      case PageLink.linkedin:
        await this.linkLinkedin.click()
        break
      default:
        throw new Error(`Non-existent page link: ${pageLink}`)
    }
  }
}