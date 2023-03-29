import { test, expect } from '@playwright/test'
import { BlogPage, BlogLocator } from '../objects/pages/BlogPage'

test.describe.parallel('Projects page suite', () => {
  let targetPage: BlogPage

  test.beforeEach(async ({ page }) => {
    targetPage = new BlogPage(page)
    await targetPage.visit()
  })

  test('All expected elements are visible (on the fist page).', async ({page}) => {
    await expect(targetPage.selectLocator(BlogLocator.textHeading)).toBeVisible()
    await expect(targetPage.selectLocator(BlogLocator.linkNext)).toBeVisible()
    await expect(targetPage.selectLocator(BlogLocator.textNumberOfPages)).toBeVisible()
  })

  test('[Previous] is not visible (on the first page).', async ({ page }) => {
    await expect(targetPage.selectLocator(BlogLocator.linkPrevious)).not.toBeVisible()
  })

  test('Page enumeration is in format `x of y`', async ({ page }) => {
    await targetPage.assertRegexPatternMatches(BlogLocator.textNumberOfPages, /\d+ of \d+/)
  })

  test('[Next] not visible and [Previous] visible (on the last posts page).', async ({ page }) => {
    const n =  await targetPage.getLastPageNumber()
    await targetPage.visitPage(n)
    await expect(targetPage.selectLocator(BlogLocator.linkNext)).not.toBeVisible()
    await expect(targetPage.selectLocator(BlogLocator.linkPrevious)).toBeVisible()
  })

})