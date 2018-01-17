import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class ContactDialog extends BasePage {
    public fillContactDialogForm(surname, givenName) {
        this.fillInputFieldWith('surname', surname);
        this.fillInputFieldWith('givenName', givenName);
        this.clickButton('addMedium');
        this.fillInputFieldWith('mediumValue', '123456789');
        this.clickButton('addMediumToList');
        this.clickContactDialogButton();
    }

    public clickContactDialogButton() {
        this.clickHiddenButton('contactDialogButton');
    }
}
