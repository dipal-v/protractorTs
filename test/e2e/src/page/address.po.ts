import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class AddressDialog extends BasePage {
    public fillAddressDialogForm(city) {
        this.fillInputFieldWith('addressLine1', '10 Temple Road');
        this.fillInputFieldWith('city', city);
        this.fillInputFieldWith('postalCode', 'AB1 2SD');
        this.clickAddressDialogButton();
    }

    public clickAddressDialogButton() {
        this.clickHiddenButton('addressDialogButton');
    }
}
