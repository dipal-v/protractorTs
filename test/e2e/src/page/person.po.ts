import { $, $$, browser, by, By, element, ExpectedConditions } from 'aurelia-protractor-plugin/protractor';
import { EntityPage } from './entity.po';

export class PersonPage extends EntityPage {
    public getPage() {
        const url = '/#/createPerson';
        super.getURL(url);
        this.waitSelectionPopulated('languageOption');
    }

    public getGivenName(text) {
        return this.getGridCellByIdAndText('details.givenName', text);
    }

    public fillPersonForm(fullname) {
        const names = fullname.split(' ');
        this.fillInputFieldWith('personEntityCode', '9000001');
        this.fillInputFieldWith('givenName', names[0]);
        this.fillInputFieldWith('surname', names[1]);
        this.fillInputFieldWith('collector', 'tester');
        this.fillInputFieldWith('alias', 'tester');
        this.waitSelectionPopulated('languageOption');
    }

    public viewPerson(code) {
        const url = '/#/viewPerson/' + code;
        return super.getURL(url);
    }
}
