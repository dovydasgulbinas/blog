import { test, expect } from '@playwright/test'
import { HomePage } from '../objects/pages/HomePage'
import { ResumePage, PageLink } from '../objects/pages/ResumePage'

test.describe('Resume page suite', () => {
  let resumePage: ResumePage
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    resumePage = new ResumePage(page)

    await homePage.visit()
    await homePage.clickOnResumeHTML()

  })

  // TODO: parameterize thes tests from enum values
  test('Resume email link is visible.', async ({ page }) => {
    await resumePage.assertLinkHref(PageLink.email, 'mailto:dovydas.gulbinas@protonmail.com')
  })

  test('Resume phone link is visible.', async ({ page }) => {
    await resumePage.assertLinkHref(PageLink.phone, 'tel:0037060243562')
  })

  test('Resume Github link is visible.', async ({ page }) => {
    await resumePage.assertLinkHref(PageLink.github, 'https://github.com/dovydasgulbinas/')
  })

  test('Resume LinkedIn link is visible.', async ({ page }) => {
    await resumePage.assertLinkHref(PageLink.linkedin, 'https://www.linkedin.com/in/dovydas-gulbinas-b09126104/')
  })

})
