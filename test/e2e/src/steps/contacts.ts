import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { ContactDialog } from '../page/contact.po';
import { EntityPage } from '../page/entity.po';
import { MediumDialog } from '../page/medium.po';

defineSupportCode(({ Given, When, Then }) => {
    const entityPage = new EntityPage();
    const contactDialog = new ContactDialog();
    const mediumDialog = new MediumDialog();

    Then('I click New Contact button', () => {
        entityPage.clickHiddenButton('addContact');
    });

    Then('I fill the contact details with surname {string} and given name {string}',
        (surname, givenName) => {
            contactDialog.fillContactDialogForm(surname, givenName);
        });

    Then('I see surname {string} on the entity page', (surname, callback) => {
        browser.executeScript('window.scrollTo(0,10000);').then(() => {
            expect(entityPage.getContactElement(surname)).to.not.equal(null);
            callback();
        });
    });

    When('I click the contact dialog button', () => {
        contactDialog.clickContactDialogButton();
    });

    When('I select {string} and click add medium button', (mediumType) => {
        let index = 0;
        switch (mediumType) {
            case 'email':
                index = 3;
                break;
            case 'web address':
                index = 4;
                break;
            default:
                break;
        }
        mediumDialog.selectMediumInContactDialog(index);
    });

    When('I enter invalid {string} and click add button', (input) => {
        mediumDialog.fillMediumFormInContactDialog(input);
    });

    When('I click edit button in the grid for contact', () => {
        entityPage.clickHiddenButtonWithClassAndIndex('#contactsGrid .editButton', 0);
    });

});
