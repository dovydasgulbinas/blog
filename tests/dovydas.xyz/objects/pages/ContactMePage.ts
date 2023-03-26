import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from './AbstractPage'


export enum ContactMeLink {
    blogFeed,
    pixelfedProfile,
    pixelfedFeed,
    mastodonProfile,
    mastodonFeed,
    emailAndPhone,
  }


export class ContactMePage extends AbstractPage {
  readonly locatorEnum: ContactMeLink
  readonly blogFeed: Locator
  readonly pixelfedProfile: Locator
  readonly pixelfedFeed: Locator
  readonly mastodonProfile: Locator
  readonly mastodonFeed: Locator
  readonly emailAndPhone: Locator


  constructor(page: Page) {
    super(page, 'ContactMePage', '/contact-me')
    this.blogFeed = page.getByRole('listitem').filter({ hasText: 'Blog: feed' }).getByRole('link', { name: 'feed' })
    this.pixelfedProfile = page.getByRole('listitem').filter({ hasText: 'Pixelfed: profile, feed' }).getByRole('link', { name: 'profile' })
    this.pixelfedFeed = page.getByRole('listitem').filter({ hasText: 'Pixelfed: profile, feed' }).getByRole('link', { name: 'feed' })
    this.mastodonProfile = page.getByRole('listitem').filter({ hasText: 'Mastodon: profile, feed' }).getByRole('link', { name: 'profile' })
    this.mastodonFeed = page.getByRole('listitem').filter({ hasText: 'Mastodon: profile, feed' }).getByRole('link', { name: 'feed' })
    this.emailAndPhone = page.getByRole('link', { name: 'in the resume' })
  }


  selectLocator(locatorConstant: ContactMeLink): Locator {
    switch (locatorConstant){
      case ContactMeLink.blogFeed:
        return this.blogFeed
      case ContactMeLink.pixelfedProfile:
        return this.pixelfedProfile
      case ContactMeLink.pixelfedFeed:
        return this.pixelfedFeed
      case ContactMeLink.mastodonProfile:
        return this.mastodonProfile
      case ContactMeLink.mastodonFeed:
        return this.mastodonFeed
      case ContactMeLink.emailAndPhone:
        return this.emailAndPhone
      default:
        this.throwOnMissingCase(locatorConstant)
    }
  }

}