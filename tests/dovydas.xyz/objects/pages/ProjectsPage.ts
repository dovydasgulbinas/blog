import { Locator, Page, expect } from '@playwright/test'
import { AbstractPage } from './AbstractPage'


export enum ProjectsLink {
    hilbertCurve,
    haikuMixer,
    tagHaiku,
    tagSFC
  }


export class ProjectsPage extends AbstractPage {
  readonly linkHilbertCurve: Locator
  readonly linkHaikuMixer: Locator
  readonly linkTagHaiku: Locator
  readonly linkTagSFC: Locator


  constructor(page: Page) {
    super(page, 'ProjectsPage', '/projects')
    this.linkHilbertCurve = page.getByRole('link', { name: 'Hilbert Curve Generator' })
    this.linkHaikuMixer = page.getByRole('link', { name: 'Haiku Mixer' })
    this.linkTagHaiku = page.getByRole('link', { name: 'haiku', exact: true})
    this.linkTagSFC = page.getByRole('link', { name: 'SFC' })

  }


selectLocator(locatorConstant: ProjectsLink): Locator {
    switch (locatorConstant){
      case ProjectsLink.hilbertCurve:
        return this.linkHilbertCurve
      case ProjectsLink.haikuMixer:
        return this.linkHaikuMixer
      case ProjectsLink.tagHaiku:
        return this.linkTagHaiku
      case ProjectsLink.tagSFC:
        return this.linkTagSFC
      default:
        this.throwOnMissingCase(locatorConstant)
    }
  }

}