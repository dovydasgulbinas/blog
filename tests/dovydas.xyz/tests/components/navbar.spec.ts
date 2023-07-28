import { test, expect, Locator } from '@playwright/test'
import { HomePage } from '../../objects/pages/HomePage'
import { NavbarComponent, NavbarLocator } from '../../objects/pages/components/Navbar'

test.describe('Navbar component suite', () => {
  let targetComponent: NavbarComponent
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    targetComponent = new NavbarComponent(page)
    homePage = new HomePage(page)
    await homePage.visit()
    await page.waitForSelector(NavbarComponent.containerSelector)
    await page.hover(NavbarComponent.containerSelector)
  })

  test('Navbar container is visible', async ({ page }) => {
    await targetComponent.assertVisible(NavbarLocator.container)
  })
  
  test('Navbar component link "Home" is clickable', async ({ page }) => {
    await targetComponent.assertAttributeValue(NavbarLocator.home, 'href', '/')
    await targetComponent.clickOnLink(NavbarLocator.home)
  })

  test('Navbar component link "Blog" is clickable', async ({ page }) => {
    await targetComponent.assertAttributeValue(NavbarLocator.blog, 'href', 'blog/')
    await targetComponent.clickOnLink(NavbarLocator.blog)
  })

  test('Navbar component link "Projects" is clickable', async ({ page }) => {
    await targetComponent.assertAttributeValue(NavbarLocator.projects, 'href', 'projects/')
    await targetComponent.clickOnLink(NavbarLocator.projects)
  })

  test('Navbar component link "Contact Me" is clickable', async ({ page }) => {
    await targetComponent.assertAttributeValue(NavbarLocator.contactMe, 'href', 'contact-me/')
    await targetComponent.clickOnLink(NavbarLocator.contactMe)
  })

  test('Navbar component link "Music" is clickable', async ({ page }) => {
    await targetComponent.assertAttributeValue(NavbarLocator.music, 'href', 'music/')
    await targetComponent.clickOnLink(NavbarLocator.music)
  })

})
