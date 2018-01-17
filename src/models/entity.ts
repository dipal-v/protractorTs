import * as moment from 'moment';
import { Constants } from '../constants';
import { Account } from './account';
import { Address } from './address';
import { Contact } from './contact';
import { Details } from './details';
import { Site } from './site';

export class Entity {
    public id: number;

    public legalEntityCode: string;

    public startDate = moment().format(Constants.UI_DATE_FORMAT);

    public endDate = null;

    public createdDate: string;

    public createdBy: string;

    public lastModifiedDate: string;

    public lastModifiedBy: string;

    public language = 'English';

    public type = Constants.ORGANISATION_TYPE;

    public alias: string;

    public details: Details = new Details();

    public contacts: Contact[];

    public accounts: Account[];

    public addresses: Address[];

    public sites: Site[];

    public personas;

    // Organization Specific Attributes
    public collector: string;

    public parent: string;

    public parentName: string;

    public parentCode: string;

    constructor(data?) {

        if (data === null) {
            return;
        }
        Object.assign(this, data);
        if (typeof this.personas === Constants.UNDEFINED || !this.personas) {
            this.personas = [];
        }
        this.contacts = this.setArrays<Contact>(this.contacts);
        this.accounts = this.setArrays<Account>(this.accounts);
        this.addresses = this.setArrays<Address>(this.addresses);
        this.sites = this.setArrays<Site>(this.sites);
    }

    private setArrays<T>(array: T[]) {
        if (typeof array === Constants.UNDEFINED || !array) {
            array = [] as T[];
        } else {
            const newArray = new Array<T>();
            array.forEach((arrayObj) => {
                newArray.push(arrayObj as T);
            });
            array = newArray;
        }
        return array;
    }
}
