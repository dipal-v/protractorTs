import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class EntityPage extends BasePage {

    public getLegalEntityCode(text) {
        return this.getGridCellByIdAndText('legalEntityCode', text);
    }

    public clickCreateByType(type) {
        const createTypeButton = this.getElementById(type);
        createTypeButton.click();
    }

    public clickCreateButton() {
        const saveButton = this.getElementById('createButton');
        saveButton.click();
    }

    public clickUpdateButton() {
        const updateButton = this.getElementById('updateButton');
        updateButton.click();
    }

    public getContactElement(text) {
        return this.getGridCellByIdAndText('surname', text);
    }

    public getAddressElement(text) {
        return this.getGridCellByIdAndText('city', text);
    }

    public getAccountElement(text) {
        return this.getGridCellByIdAndText('name', text);
    }

    public getSiteElement(text) {
        return this.getGridCellByIdAndText('name', text);
    }

    public clickModifyButton() {
        const modifyButton = this.getElementById('modifyButton');
        modifyButton.click();
    }

    public clickDeactivateButton() {
        const deactivateButton = this.getElementById('updateEndDate');
        deactivateButton.click();
    }

    public clickActivateButton() {
        const activateButton = this.getElementById('updateEndDate');
        activateButton.click();
    }

    public clickYesButtonInConfirmDialog() {
        const yesButton = this.getElementById('yesButton');
        yesButton.click();
    }

    public clickNoButtonInConfirmDialog() {
        const noButton = this.getElementById('noButton');
        noButton.click();
    }

    public getEndDate() {
        return this.getElementById('endDateValue');
    }

    public performSearch(searchString, filter) {
        const mydict = {
            'credit region': 2,
            'primary name': 1,
            'given name': 1,
            'surname': 2
        };

        if (filter in mydict) {
            this.selectDropdownItem('searchFilter', mydict[filter]);
        }
        this.fillInputFieldWith('searchValue', searchString);
        this.clickButton('searchButton');
    }
}
