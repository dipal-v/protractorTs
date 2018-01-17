import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { EntityPage } from '../page/entity.po';
import { SiteDialog } from '../page/site.po';

defineSupportCode(({ Given, When, Then }) => {
    const entityPage = new EntityPage();
    const siteDialog = new SiteDialog();

    When('I click New Site button', () => {
        siteDialog.clickHiddenButton('addSite');
    });

    When('I click the site dialog button', () => {
        siteDialog.clickSiteDialogButton();
    });

    When('I fill the aircraft site details with name {string}', (name) => {
        siteDialog.fillSiteDialogForm(name, false);
    });

    When('I fill the vessel site details with name {string}', (name) => {
        siteDialog.fillSiteDialogForm(name, true);
    });

    When('I click edit button in the grid for site', () => {
        entityPage.clickHiddenButtonWithClassAndIndex('#sitesGrid .editButton', 0);
    });

    Then('I see site name {string} on the entity page', (name, callback) => {
        browser.executeScript('window.scrollTo(0,10000);').then(() => {
            expect(entityPage.getSiteElement(name)).to.not.equal(null);
            callback();
        });
    });
});
