import {test, expect} from '@playwright/test'
import { HomePage } from '../../objects/pages/HomePage'
import { ResumePage } from '../../objects/pages/ResumePage'

test.describe('Visual Regression Tests', () => {

    test('Homepage snapshot.', async ({ page }) => {
        let homePage: HomePage = new HomePage(page)
        await homePage.visit()
        expect(await page.screenshot()).toMatchSnapshot(homePage.getSnapshotName())
        
    })
    test('Resume snapshot.', async ({ page }) => {
        let resumePage: ResumePage = new ResumePage(page)
        await resumePage.visit()
        expect(await page.screenshot()).toMatchSnapshot('resume.png')
        
    })

})