import {test, expect} from '@playwright/test'
import { HomePage } from '../../objects/pages/HomePage'
import { ResumePage } from '../../objects/pages/ResumePage'
import { ProjectsPage } from '../../objects/pages/ProjectsPage'
import { ContactMePage } from '../../objects/pages/ContactMePage'

test.describe.parallel('Visual Regression Tests', () => {

    test('Homepage snapshot.', async ({ page }) => {
        let testedPage: HomePage = new HomePage(page)
        await testedPage.visit()
        expect(await page.screenshot()).toMatchSnapshot(testedPage.getSnapshotName())
        
    })
    test('Resume snapshot.', async ({ page }) => {
        let testedPage: ResumePage = new ResumePage(page)
        await testedPage.visit()
        expect(await page.screenshot()).toMatchSnapshot(testedPage.getSnapshotName())
        
    })
    test('Projects snapshot.', async ({ page }) => {
        let testedPage: ProjectsPage = new ProjectsPage(page)
        await testedPage.visit()
        expect(await page.screenshot()).toMatchSnapshot(testedPage.getSnapshotName())
        
    })
    test('Contact me snapshot.', async ({ page }) => {
        let testedPage: ContactMePage = new ContactMePage(page)
        await testedPage.visit()
        expect(await page.screenshot()).toMatchSnapshot(testedPage.getSnapshotName())
        
    })

})