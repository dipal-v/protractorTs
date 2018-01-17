import * as moment from 'moment';
import { Constants } from '../constants';

export class Account {

    public accountNumber: string;
    public postingAccount: string;
    public type: string;
    public post = false;
    public name: string;
    public comments: string;
    public invoiceReportLevel: string;
    public invoiceFormat: string;
    public paymentMethod: string;
    public statementIndicator = false;
    public invoicePrintPriority = false;
    public billingAddress: any;
    public billingContact: any;
    public shippingDetails = [];
    public shippingAddress: number;
    public shippingContact: number;
    public sites: any[];
    public startDate = moment().format(Constants.UI_DATE_FORMAT);
    public endDate: string;

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
