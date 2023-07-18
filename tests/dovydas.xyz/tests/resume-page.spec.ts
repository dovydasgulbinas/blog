import { test, expect } from '@playwright/test'
import { ResumePage, PageLink } from '../objects/pages/ResumePage'

test.describe('Resume page suite', () => {
  let resumePage: ResumePage

  test.beforeEach(async ({ page }) => {
    resumePage = new ResumePage(page)
    await resumePage.visit()
  })

  // TODO: parameterize thes tests from enum values
  test('Resume email link is visible.', async ({ page }) => {
    await resumePage.assertAttributeValue(PageLink.email, 'href','mailto:dovydas.gulbinas@protonmail.com')
  })

  test('Resume phone link is visible.', async ({ page }) => {
    await resumePage.assertAttributeValue(PageLink.phone, 'href', 'tel:0037060243562')
  })

  test('Resume Github link is visible.', async ({ page }) => {
    await resumePage.assertAttributeValue(PageLink.github,'href', 'https://github.com/dovydasgulbinas/')
  })

  test('Resume LinkedIn link is visible.', async ({ page }) => {
    await resumePage.assertAttributeValue(PageLink.linkedin, 'href', 'https://www.linkedin.com/in/dovydas-gulbinas-b09126104/')
  })
  test('Resume Blog link is visible.', async ({ page }) => {
    await resumePage.assertAttributeValue(PageLink.blog, 'href', 'https://dovydas.xyz')
  })

})
