import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { BasePage } from '../page/base.po';

defineSupportCode(({ setDefaultTimeout }) => {
    setDefaultTimeout(60 * 1000);
});

defineSupportCode(({ Given, When, Then }) => {
    const basePage = new BasePage();

    Given('I login', (next) => {
        browser.ignoreSynchronization = true;
        basePage.getURL('/');
        browser.sleep(8000).then(() => {
            browser.ignoreSynchronization = false;
            next();
        });
    });

    When('I click the cancel button', () => {
        basePage.clickButton('cancelButton');
    });

    When('I click the back button', () => {
        basePage.clickButton('backButton');
    });

    When('I click cancel buton in the dialog', () => {
        basePage.clickDialogCancelButton();
    });

    Given('I am on organisations home page', () => {
        basePage.getURL('/');
        basePage.getElementByCSSContainingText('h1', 'All Customers');
    });

    When('I click on {string}', (text) => {
        return basePage.clickAnchorByLinkText(text);
    });

    Then('I should see {string}', (text) => {
        basePage.findTextByXPath(text);
    });

    Then('I should see {string} dialog', (dialogTitle, callback) => {
        const titleElement = basePage.getDialogHeader();
        basePage.checkTextInElement(titleElement, dialogTitle, callback);
    });
});
