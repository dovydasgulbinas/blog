import { test, expect } from '@playwright/test'
import { ProjectsPage, ProjectsLink } from '../objects/pages/ProjectsPage'

test.describe.parallel('Projects page suite', () => {
  let projectsPage: ProjectsPage

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page)
    await projectsPage.visit()
  })

  test('Project link "Hilbert Curve Generator" is clickable.', async ({ page }) => {
    await projectsPage.assertLinkText(ProjectsLink.hilbertCurve, "Hilbert Curve Generator")
    await projectsPage.clickOnLink(ProjectsLink.hilbertCurve)
  })

  test('Project link "Haiku Mixer" exists.', async ({ page }) => {
    await projectsPage.assertLinkText(ProjectsLink.haikuMixer, "Haiku Mixer")
    await projectsPage.clickOnLink(ProjectsLink.haikuMixer)
  })

  test('Project tag "haiku" works.', async ({ page }) => {
    await projectsPage.assertLinkText(ProjectsLink.tagHaiku, "haiku")
    await projectsPage.clickOnLink(ProjectsLink.tagHaiku)
    // the selectors for tag list and project link are abstract and Identical that is why they are reused
    await projectsPage.assertLinkText(ProjectsLink.haikuMixer, "Haiku Mixer")
    await projectsPage.clickOnLink(ProjectsLink.haikuMixer)
  })

  test('Project tag "SFC" works.', async ({ page }) => {
    await projectsPage.assertLinkText(ProjectsLink.tagSFC, "SFC")
    await projectsPage.clickOnLink(ProjectsLink.tagSFC)
    // the selectors for tag list and project link are abstract and Identical that is why they are reused
    await projectsPage.assertLinkText(ProjectsLink.hilbertCurve, "Hilbert Curve Generator")
    await projectsPage.clickOnLink(ProjectsLink.hilbertCurve)
  })




})
