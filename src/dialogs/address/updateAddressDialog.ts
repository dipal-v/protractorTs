import { inject, useView } from 'aurelia-framework';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Constants } from '../../constants';
import { Address } from '../../models/address';
import { AddressDialog } from './addressDialog';

@useView('dialogs/address/addressDialog.html')
export class UpdateAddressDialog extends AddressDialog {
    public activate(data) {
        this.address = new Address(data);
        this.isUpdate = true;
        this.address.startDate = moment(this.address.startDate).format(Constants.UI_DATE_FORMAT);
        if (this.address.endDate) {
            this.address.endDate = moment(this.address.endDate).format(Constants.UI_DATE_FORMAT);
        }
    }
}
