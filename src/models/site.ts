import * as moment from 'moment';
import { Constants } from '../constants';

export class Site {
    public id: number;

    public name: string;

    public type = 'Aircraft';

    public subType: string;

    public imoNumber: string;

    public mmsi: string;

    public tailNumber: string;

    public icaoNumber: string;

    public callSign: string;

    public country = Constants.DEFAULT_ISO_COUNTRY_CODE;

    public startDate = moment().format(Constants.UI_DATE_FORMAT);

    public endDate: string;

    public address: any;

    public contacts: any[];

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }

}
