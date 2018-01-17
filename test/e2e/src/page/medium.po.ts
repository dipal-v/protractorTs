import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class MediumDialog extends BasePage {
    public addEmailMedium(value) {
        this.fillMediumDialogForm(value, 3);
    }

    public addWebAddressMedium(value) {
        this.fillMediumDialogForm(value, 4);
    }

    public addPhoneMedium(value) {
        this.fillMediumDialogForm(value, 0);
    }

    public fillMediumDialogForm(value, index) {
        this.selectMediumInContactDialog(index);
        this.fillMediumFormInContactDialog(value);
    }

    public selectMediumInContactDialog(index) {
        this.waitSelectionPopulated('mediumDropdown');
        this.selectDropdownItem('mediumDropdown', index);
        this.clickAddMediumButton();
    }

    public fillMediumFormInContactDialog(value) {
        this.getElementById('mediumValue');
        this.fillInputFieldWith('mediumValue', value);
        this.clickAddButton();
    }

    public clickAddMediumButton() {
        this.getElementById('addMedium');
        this.clickHiddenButton('addMedium');
    }

    public clickAddButton() {
        this.clickHiddenButton('addMediumToList');
    }

    public addMedium() {
        this.clickAddMediumButton();
        this.getElementByCSSContainingText('span', 'Medium Dialog');
        this.fillInputFieldWith('mediumValue', '1111111111');
        this.clickAddButton();
        this.getElementByTagName('ux-dialog', false);
        this.waitSelectionPopulated('preferredContactMedium');
    }

    public checkValidationMessageForMedium(mediumType, callback) {
        switch (mediumType) {
            case 'email':
                this.compareValidationMessage('Email is not a valid email.', callback);
                break;
            case 'web address':
                this.compareValidationMessage('Web Address is not correctly formatted.', callback);
                break;
            default:
                this.compareValidationMessage('Phone number is not correctly formatted.', callback);
                break;
        }
    }
}
