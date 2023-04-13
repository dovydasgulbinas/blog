import { test, expect, Locator } from '@playwright/test'
import { BlogPage } from '../../objects/pages/BlogPage'
import { PostCardComponent, PostCardLocator  } from '../../objects/pages/components/BlogPostCard'

test.describe('Blog card component suite', () => {
  let targetComponent: PostCardComponent
  let parentPage: BlogPage

  test.beforeEach(async ({ page }) => {
    targetComponent = new PostCardComponent(page)
    parentPage = new BlogPage(page)
    // last page post is guaranteed to have a created and updated date
    await parentPage.visit()
    const lastPage: Number|null = await parentPage.getLastPageNumber()
    await parentPage.visitPage(lastPage)
  })

  test('Post container is visible.', async ({ page }) => {
    await targetComponent.assertVisible(PostCardLocator.container)
  })

  test('Post card items are visible.', async ({ page }) => {
    await targetComponent.assertVisible(PostCardLocator.cardImage)
    await targetComponent.assertVisible(PostCardLocator.cardHeading)
    await targetComponent.assertVisible(PostCardLocator.datePublished)
    await targetComponent.assertVisible(PostCardLocator.dateEdited)
    await targetComponent.assertVisible(PostCardLocator.textExcerpt)
    await targetComponent.assertVisible(PostCardLocator.linkMore)
  })


  test('Post card `More` link is clickable.', async ({ page }) => {
    await targetComponent.assertLinkText(PostCardLocator.linkMore, "More")
    await targetComponent.clickOnLink(PostCardLocator.linkMore)
  })

  test('Post card heading is clickable.', async ({ page }) => {
    await targetComponent.clickOnLink(PostCardLocator.cardHeading)
  })

})
