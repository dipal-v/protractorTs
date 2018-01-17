import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { EntityPage } from './entity.po';

export class OrganisationPage extends EntityPage {
    public getPage() {
        const url = '/#/createOrganization';
        super.getURL(url);
        this.waitSelectionPopulated('language');
    }

    public fillCreateOrganizationForm(name, entityCode, isChild) {
        this.fillInputFieldWith('primaryName', name);
        this.fillInputFieldWith('entityCode', entityCode);
        this.selectDropdownItem('organizationType', 2);
        if (isChild) {
            this.fillInputFieldWith('parent', '');
        }
        this.fillInputFieldWith('alias', 'TO');
        this.fillInputFieldWith('legalName', name);
        this.selectDropdownItem('language', 13);
        this.selectDropdownItem('creditRegion', 2);
        this.fillInputFieldWith('collector', 'Test user');
        this.selectDropdownItem('creditStatus', 3);
        this.selectDropdownItem('serviceLevelAgreement', 3);
    }

    public fillUpdateOrganizationForm(name) {
        this.fillInputFieldWith('primaryName', name);
        this.selectDropdownItem('organizationType', 2);
        this.fillInputFieldWith('alias', 'TO');
        this.fillInputFieldWith('legalName', name);
        this.selectDropdownItem('language', 13);
        this.selectDropdownItem('creditRegion', 2);
        this.fillInputFieldWith('collector', 'Test user');
        this.selectDropdownItem('creditStatus', 3);
        this.selectDropdownItem('serviceLevelAgreement', 3);
        this.clickHiddenButton('orderingBlock');
        this.clickHiddenButton('deliveryBlock');
        this.clickHiddenButton('postingBlock');
        this.clickHiddenButton('billingBlock');
    }

    public searchForParent(query) {
        this.fillInputFieldWith('parent', query);
    }

    public getPrimaryName(text) {
        return this.getGridCellByIdAndText('details.primaryName', text);
    }

    public viewEntity(code) {
        const url = '/#/viewOrganisation/' + code;
        super.getURL(url);
    }

    public clickCreateChildButton() {
        this.clickHiddenButton('createChildButton');
    }

    public getParentName() {
        return this.getElementById('parentValue');
    }
}
