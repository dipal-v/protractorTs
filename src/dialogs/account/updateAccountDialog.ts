import { inject, useView } from 'aurelia-framework';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Constants } from '../../constants';
import { Account } from '../../models/account';
import { AccountDialog } from './accountDialog';

@useView('dialogs/account/accountDialog.html')
export class UpdateAccountDialog extends AccountDialog {

    public async attached() {
        await this.loadRefereceData();
        this.account = new Account(this.dialogData.account);
        this.account.startDate = moment(this.account.startDate).format(Constants.UI_DATE_FORMAT);
        if (this.account.endDate) {
            this.account.endDate = moment(this.account.endDate).format(Constants.UI_DATE_FORMAT);
        }
        this.account.billingAddress = this.account.billingAddress.toString();
        this.account.billingContact = this.account.billingContact.toString();
        if (this.account.sites && this.account.sites.length > 0) {
            this.account.sites = this.account.sites.map(String);
        }
        this.restoreShippingGridData();
    }

    public activate(data) {
        super.activate(data);
        this.isUpdate = true;
    }

    public restoreShippingGridData() {
        for (const shippingDetail of this.account.shippingDetails) {
            const contact = _.find(this.contacts, (c) => {
                return c.key.toString() === shippingDetail.contact.toString();
            });
            const address = _.find(this.addresses, (a) => {
                return a.key.toString() === shippingDetail.address.toString();
            });
            this.shippingDetailsGridData.push({
                contact: contact.value,
                address: address.value,
                id: `${shippingDetail.address},${shippingDetail.contact}`
            });
            this.shippingDetailsGrid.setRowData(this.shippingDetailsGridData);
        }
    }
}
