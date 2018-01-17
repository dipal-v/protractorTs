import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { AccountDialog } from '../page/account.po';
import { EntityPage } from '../page/entity.po';

defineSupportCode(({ Given, When, Then }) => {
    const entityPage = new EntityPage();
    const accountDialog = new AccountDialog();

    When('I click New Account button', () => {
        accountDialog.clickHiddenButton('addAccount');
    });

    When('I click the account dialog button', () => {
        accountDialog.clickAccountDialogButton();
    });

    When('I fill the account details with name {string}', (name) => {
        accountDialog.fillAccountDialogForm(name);
    });

    When('I click edit button in the grid for account', () => {
        entityPage.clickHiddenButtonWithClassAndIndex('#accountsGrid .editButton', 0);
    });

    Then('I see account name {string} on the entity page', (name, callback) => {
        browser.executeScript('window.scrollTo(0,10000);').then(() => {
            expect(entityPage.getAccountElement(name)).to.not.equal(null);
            callback();
        });
    });
});
