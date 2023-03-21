import { test, expect } from '@playwright/test'
import { HomePage } from '../objects/pages/HomePage'

test.describe('Landing page related tests.', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    homePage.visit()
  })

  test('Resume HTML link is visible.', async ({ page }) => {
    await expect(homePage.linkResumeHTML).toBeVisible()
    await expect(homePage.linkResumeHTML).toContainText('html')
    await homePage.clickOnResumeHTML()
  })

  test('Resume PDF link is visible', async ({ page }) => {
    await expect(homePage.linkResumePDF).toBeVisible()
    await expect(homePage.linkResumePDF).toContainText('pdf')
    await homePage.clickOnResumePDF()
  })
})
