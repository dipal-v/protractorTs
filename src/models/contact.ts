import * as moment from 'moment';
import { Constants } from '../constants';
import { Medium } from './medium';

export class Contact {
    public givenName: string;

    public id: number;

    public surname: string;

    public jobTitle: string;

    public language: string;

    public prefix: string;

    public suffix: string;

    public startDate = moment().format(Constants.UI_DATE_FORMAT);

    public endDate: string;

    public preferredContactMedium: string;

    public mediums: Medium[];

    public email: string;

    public telephone: string;

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
        if (typeof this.mediums === Constants.UNDEFINED || !this.mediums) {
            this.mediums = [] as Medium[];
        } else {
            const mediums = new Array<Medium>();
            this.mediums.forEach((medium) => {
                mediums.push(new Medium(medium));
            });
            this.mediums = mediums;
            this.findEmail();
            this.findTelephone();
        }
    }

    /**
     * Find the first email from user's mediums
     */
    public findEmail() {
        if (this.mediums) {
            this.mediums.forEach((medium) => {
                if (medium.type === Constants.EMAIL) {
                    this.email = medium.value;
                }
            });
        }
    }

    /**
     * Find the first telephone number form user's mediums
     */
    public findTelephone() {
        if (this.mediums) {
            this.mediums.forEach((medium) => {
                if (medium.type !== Constants.EMAIL) {
                    this.telephone = medium.value;
                }
            });
        }
    }
}
