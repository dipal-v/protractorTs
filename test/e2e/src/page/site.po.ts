import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { BasePage } from './base.po';

export class SiteDialog extends BasePage {
    public fillSiteDialogForm(name, isVessel) {
        this.fillInputFieldWith('siteName', name);
        this.fillInputFieldWith('callSign', name);
        if (isVessel) {
            this.selectDropdownItem('type', 1);
            this.selectDropdownItem('subType', 1);
            this.fillInputFieldWith('imoNumber', '123456');
            this.fillInputFieldWith('mmsi', '123456');
        } else {
            this.fillInputFieldWith('tailNumber', '123456');
            this.fillInputFieldWith('icaoNumber', '123456');
        }
        this.clickSiteDialogButton();
    }

    public clickSiteDialogButton() {
        this.clickHiddenButton('siteDialogButton');
    }
}
