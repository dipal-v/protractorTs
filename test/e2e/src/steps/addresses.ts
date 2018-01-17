import { browser, by, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';
import { defineSupportCode } from 'cucumber';
import { AddressDialog } from '../page/address.po';
import { EntityPage } from '../page/entity.po';

defineSupportCode(({ Given, When, Then }) => {
    const entityPage = new EntityPage();
    const addressDialog = new AddressDialog();

    When('I click New Address button', () => {
        entityPage.clickHiddenButton('addAddress');
    });

    When('I click the address dialog button', () => {
        addressDialog.clickAddressDialogButton();
    });

    When('I fill the address details with city as {string}', (city) => {
        addressDialog.fillAddressDialogForm(city);
    });

    Then('I should see the state as {string}', (state, callback) => {
        addressDialog.checkSelectBoxOptionTextByIndex('stateOptions', 0, state, callback);
    });

    When('I click edit button in the grid for address', () => {
        entityPage.clickHiddenButtonWithClassAndIndex('#addressesGrid .editButton', 0);
    });

    When('I change the country to Afghanistan', () => {
        addressDialog.selectDropdownItem('isoCountryCode', 0);
    });

    Then('I see city {string} on the entity page', (city, callback) => {
        browser.executeScript('window.scrollTo(0,10000);').then(() => {
            expect(entityPage.getAddressElement(city)).to.not.equal(null);
            callback();
        });
    });

});
