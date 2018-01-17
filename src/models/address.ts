import * as moment from 'moment';
import { Constants } from '../constants';

export class Address {
    public id: number;
    public legacyId: number;
    public addressLine1: string;
    public addressLine2: string;
    public addressLine3: string;
    public careOfName: string;
    public city: string;
    public dist: string;
    public stateProvince: string;
    public isoStateProvince: string;
    public country = Constants.DEFAULT_COUNTRY;
    public isoCountryCode = Constants.DEFAULT_ISO_COUNTRY_CODE;
    public postalCode: string;
    public postalCodeExt: string;
    public poBox: string;
    public startDate = moment().format(Constants.UI_DATE_FORMAT);
    public endDate: string;

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
