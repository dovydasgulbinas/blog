import { test, expect } from '@playwright/test'
import { HomePage } from '../../objects/pages/HomePage'
import { NavbarComponent, NavbarLocator } from '../../objects/pages/components/Navbar'

test.describe('Navbar component suite', () => {
  let navbarComponent: NavbarComponent
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    navbarComponent = new NavbarComponent(page)
    homePage = new HomePage(page)
    await homePage.visit()
  })


  test('Navbar component link "Home" is clickable', async ({ page }) => {
    await navbarComponent.clickOnLink(NavbarLocator.home)
  })

  test('Navbar component link "Blog" is clickable', async ({ page }) => {
    await navbarComponent.clickOnLink(NavbarLocator.blog)
  })

  test('Navbar component link "Projects" is clickable', async ({ page }) => {
    await navbarComponent.clickOnLink(NavbarLocator.projects)
  })

  test('Navbar component link "Contact Me" is clickable', async ({ page }) => {
    await navbarComponent.clickOnLink(NavbarLocator.projects)
  })


})
