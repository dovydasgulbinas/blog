import { test, expect, Locator } from '@playwright/test'
import { BlogPage } from '../../objects/pages/BlogPage'
import { PostCardComponent, PostCardLocator  } from '../../objects/pages/components/BlogPostCard'

test.describe('Blog card component suite', () => {
  let targetComponent: PostCardComponent
  let parentPage: BlogPage

  test.beforeEach(async ({ page }) => {
    targetComponent = new PostCardComponent(page)
    parentPage = new BlogPage(page)
    // first last page post is guaranteed to have a created and updated date
    await parentPage.visit()
    const lastPage: Number|null = await parentPage.getLastPageNumber()
    await parentPage.visitPage(lastPage)
  })

  test('Post container is visible', async ({ page }) => {
    await targetComponent.assertVisible(PostCardLocator.container)
  })
  
  test('All card elements are avaiable', async ({ page }) => {

  })

})
