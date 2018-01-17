import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { EntityPage } from '../page/entity.po';

defineSupportCode(({ Given, When, Then }) => {
    const entityPage = new EntityPage();

    Then('I click {string} on the table', (text) => {
        const entityCode = entityPage.getLegalEntityCode(text);
        entityPage.waitForVisibilityOfElement(entityCode);
        entityCode.click();
    });

    Then('I see {string} in the title', (title, callback) => {
        const ele = entityPage.getPageTitle();
        entityPage.checkTextInElement(ele, title, callback);
    });

    When('I click the deactivate button', () => {
        entityPage.clickDeactivateButton();
    });

    When('I click the activate button', () => {
        entityPage.clickActivateButton();
    });

    When('I click the yes button in confirm dialog', () => {
        entityPage.clickYesButtonInConfirmDialog();
    });

    When('I click the no button in confirm dialog', () => {
        entityPage.clickNoButtonInConfirmDialog();
    });

    Then('I should see an end date', (callback) => {
        const ele = entityPage.getEndDate();
        const condition = ExpectedConditions.not(ExpectedConditions.textToBePresentInElement(ele, 'N/A'));
        browser.wait(condition, 5000);
        ele.getText().then((text) => {
            expect(text).to.have.lengthOf(17);
            callback();
        });
    });

    Then('I see the {int} validation errors displayed', (validationCount, callback) => {
        entityPage.countElementsByClass('validation-message').then((count) => {
            expect(count).to.equal(validationCount);
            callback();
        });
    });

    Then('I should not see an end date', (callback) => {
        const ele = entityPage.getEndDate();
        entityPage.waitTextToBePresentInElement(ele, 'N/A');
        entityPage.checkTextInElement(ele, 'N/A', callback);
    });

    When('I search for {string} with {string} filter', (searchString, filter) => {
        entityPage.performSearch(searchString, filter);
    });

    When('I search for regex {string} with {string} filter', (searchString, filter) => {
        entityPage.clickById('regexCheckbox');
        entityPage.performSearch(searchString, filter);
    });

    Then('I verify {int} results in search results', (results, callback) => {
        const xPath = '//div[contains(@class, "ag-body-container")]/div[contains(@class, "ag-row")]';
        entityPage.verifyCountElementsWithXPath(xPath, results, callback);
    });

    When('I click the create button', () => {
        entityPage.clickCreateButton();
    });

    When('I click the update button', () => {
        entityPage.clickUpdateButton();
    });

    When('I click modify button', () => {
        entityPage.clickModifyButton();
    });
});
