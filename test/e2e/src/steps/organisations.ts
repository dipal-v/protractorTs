import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { OrganisationPage } from '../page/organisation.po';

defineSupportCode(({ Given, When, Then }) => {
    const organisationPage = new OrganisationPage();

    Then('I see {string} from the back end in organisations page', (name) => {
        organisationPage.getElementByCSSContainingText('h1', 'All Customers');
        const nameElement = organisationPage.getPrimaryName(name);
    });

    Given('I am on create organisation page', () => {
        organisationPage.getPage();
        organisationPage.getElementByCSSContainingText('p', 'New Organisation');
    });

    Given('I have an existing entity with legal entity code {string}', (legalEntityCode) => {
        organisationPage.viewEntity(legalEntityCode);
    });

    Then('I should see parent name as {string}', (parentName, callback) => {
        const ele = organisationPage.getParentName();
        organisationPage.checkTextInElement(ele, parentName, callback);
    });

    When('I click create organization page', () => {
        organisationPage.clickCreateByType('createOrganization');
    });

    When('I click the create child button', () => {
        organisationPage.clickCreateChildButton();
    });

    When('I fill the organization form with name {string} and entity code {string}',
        (name, entityCode) => {
            organisationPage.fillCreateOrganizationForm(name, entityCode, true);
        }
    );

    When('I fill create child organization form with name {string} and entity code {string}',
        (name, entityCode) => {
            organisationPage.fillCreateOrganizationForm(name, entityCode, false);
        }
    );

    When('I update the organization form with name {string}', (name) => {
        organisationPage.fillUpdateOrganizationForm(name);
    });

    When('I search for parent entity {string}', (searchString) => {
        organisationPage.searchForParent(searchString);
    });

    Then('I verify {int} results in the populated list', (results, callback) => {
        const xPath = '//div[contains(@class, "open")]/ul[contains(@class, "dropdown-menu")]' +
            '/li[not(contains(@class, "aurelia-hide"))]';
        organisationPage.verifyCountElementsWithXPath(xPath, results, callback);
    });
});
