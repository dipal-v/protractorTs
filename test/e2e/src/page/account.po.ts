import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class AccountDialog extends BasePage {
    public fillAccountDialogForm(name) {
        this.fillInputFieldWith('accountName', name);
        this.fillInputFieldWith('postingAccount', 123456);
        this.selectDropdownItem('type', 1);
        this.addShippingDetails();
        this.clickAccountDialogButton();
    }

    public addShippingDetails() {
        this.clickHiddenButton('addShippingDetails');
        this.clickHiddenButton('addShippingDetail');
    }

    public clickAccountDialogButton() {
        this.clickHiddenButton('accountDialogButton');
    }
}
