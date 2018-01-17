import { Constants } from '../constants';
import { Medium } from './medium';

export class Details {
    // Organization Specific Attributes
    public primaryName: string;

    public creditRegion: string;

    public orderingBlock = false;

    public deliveryBlock = false;

    public postingBlock = false;

    public billingBlock = false;

    public legalName: string;

    public creditStatus = 'Regular';

    public serviceLevelAgreement = 'Standard';

    public type: string;

    // Person Specific Attributes
    public surname: string;

    public givenName: string;

    public prefix = 'Mr.';

    public suffix = '';

    public jobTitle: string;

    public preferredContactMedium;

    public mediums: Medium[];

    constructor(data?) {
        if (data == null) {
            this.mediums = new Array<Medium>();
            return;
        }
        Object.assign(this, data);
        if (typeof this.mediums === Constants.UNDEFINED || !this.mediums) {
            this.mediums = new Array<Medium>();
        } else {
            const mediums = new Array<Medium>();
            this.mediums.forEach((medium) => {
                mediums.push(new Medium(medium));
            });
            this.mediums = mediums;
        }
    }
}
