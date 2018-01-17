import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { MediumDialog } from '../page/medium.po';
import { PersonPage } from '../page/person.po';

defineSupportCode(({ Given, When, Then }) => {
    const personPage = new PersonPage();
    const mediumDialog = new MediumDialog();

    Given('I am on persons home page', () => {
        personPage.getURL('/#/persons');
        personPage.getElementByCSSContainingText('h1', 'All Persons');
    });

    Then('I see {string} from the back end in persons page', (name) => {
        personPage.getElementByCSSContainingText('h1', 'All Persons');
        const nameElement = personPage.getGivenName(name);
    });

    When('I click create person page', (callback) => {
        personPage.clickCreateByType('createPerson');
        personPage.getElementByCSSContainingText('p', 'New Person');
        callback();
    });

    When('I create a person details with full name {string}', (fullname) => {
        personPage.fillPersonForm(fullname);
        mediumDialog.addMedium();
        personPage.clickCreateButton();
    });

    Given('I have an existing person entity with legal entity code {string}', (legalEntityCode) => {
        personPage.viewPerson(legalEntityCode);
    });

    When('I modify its job title as {string}', (jobTitle) => {
        personPage.fillInputFieldWith('jobTitle', jobTitle);
        this.personJobTitle = jobTitle;
        personPage.clickButton('updateButton');
    });

    Then('I should see the job title in its view page', () => {
        personPage.getElementByCSSContainingText('label', this.personJobTitle);
    });

    Given('I am on create person page', () => {
        personPage.getPage();
        personPage.getElementByCSSContainingText('p', 'New Person');
    });

    Then('I should view invalid {string} validation message', (mediumType, callback) => {
        mediumDialog.checkValidationMessageForMedium(mediumType, callback);
    });

    When('I select {string} and enter invalid {string} and click add medium button', (mediumType, input) => {
        switch (mediumType) {
            case 'email':
                mediumDialog.addEmailMedium(input);
                break;
            case 'web address':
                mediumDialog.addWebAddressMedium(input);
                break;
            default:
                mediumDialog.addPhoneMedium(input);
                break;
        }
    });
});
