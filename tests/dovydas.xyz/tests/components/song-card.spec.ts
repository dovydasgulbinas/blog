import { test, expect, Locator } from '@playwright/test'
import { MusicPage } from '../../objects/pages/MusicPage'
import { SongCardComponent, SongCardLocator  } from '../../objects/pages/components/SongCard'

test.describe('Song card component suite', () => {
  let targetComponent: SongCardComponent
  let parentPage: MusicPage

  test.beforeEach(async ({ page }) => {
    targetComponent = new SongCardComponent(page)
    parentPage = new MusicPage(page)
    // last page post is guaranteed to have a created and updated date
    await parentPage.visit()
    const lastPage: Number|null = await parentPage.getLastPageNumber()
    await parentPage.visitPage(lastPage)
  })

  test('Song container is visible.', async ({ page }) => {
    await targetComponent.assertVisible(SongCardLocator.container)
  })

  test('Song card items are visible.', async ({ page }) => {
    await targetComponent.assertVisible(SongCardLocator.datePublished)
    await targetComponent.assertVisible(SongCardLocator.trackImage)
    await targetComponent.assertVisible(SongCardLocator.trackPlayer)
    await targetComponent.assertVisible(SongCardLocator.trackTitle)
  })


})
