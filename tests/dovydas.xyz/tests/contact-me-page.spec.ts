import { test, expect } from '@playwright/test'
import { ContactMeLink, ContactMePage } from '../objects/pages/ContactMePage'

test.describe('Contact Me page suite', () => {
  let targetPage: ContactMePage

  test.beforeEach(async ({ page }) => {
    targetPage = new ContactMePage(page)
    await targetPage.visit()
  })

  // TODO: parameterize thes tests from enum values
  test('Blog RSS link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.blogFeed, 'href','../feed.xml')
    await targetPage.assertLinkText(ContactMeLink.blogFeed, 'feed')
    await targetPage.clickOnLink(ContactMeLink.blogFeed)
  })

  test('Pixelfed profile link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.pixelfedProfile, 'href','https://pixelfed.social/Trismegistus')
    await targetPage.assertLinkText(ContactMeLink.pixelfedProfile, 'profile')
    // await targetPage.clickOnLink(ContactMeLink.pixelfedProfile)
  })

  test('Pixelfed RSS link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.pixelfedFeed, 'href','https://pixelfed.social/users/Trismegistus.atom')
    await targetPage.assertLinkText(ContactMeLink.pixelfedFeed, 'feed')
    // await targetPage.clickOnLink(ContactMeLink.pixelfedFeed)
  })
  
  test('Mastodon profile link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.mastodonProfile, 'href','https://mastodon.social/@dovydas')
    await targetPage.assertLinkText(ContactMeLink.mastodonProfile, 'profile')
    // await targetPage.clickOnLink(ContactMeLink.mastodonProfile)
  })

  test('Mastodon RSS link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.mastodonFeed, 'href','https://mastodon.social/@dovydas.rss')
    await targetPage.assertLinkText(ContactMeLink.mastodonFeed, 'feed')
    // await targetPage.clickOnLink(ContactMeLink.mastodonFeed)
  })

  test('Contact Info link works.', async ({ page }) => {
    await targetPage.assertAttributeValue(ContactMeLink.emailAndPhone, 'href','../resume/dovydas-gulbinas-resume.pdf')
    await targetPage.assertLinkText(ContactMeLink.emailAndPhone, 'in the resume')
    await targetPage.clickOnLink(ContactMeLink.emailAndPhone)
  })

})
