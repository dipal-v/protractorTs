import { inject, useView } from 'aurelia-framework';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Constants } from '../../constants';
import { Contact } from '../../models/contact';
import { Medium } from '../../models/medium';
import { ContactDialog } from './contactDialog';

@useView('dialogs/contact/contactDialog.html')
export class UpdateContactDialog extends ContactDialog {

    public async activate(data) {
        this.contact = new Contact(data);
        this.isUpdate = true;
        this.contact.startDate = moment(this.contact.startDate).format(Constants.UI_DATE_FORMAT);
        if (this.contact.endDate) {
            this.contact.endDate = moment(this.contact.endDate).format(Constants.UI_DATE_FORMAT);
        }
        this.mediumsGrid.gridOptions.rowData = this.contact.mediums;
        try {
            const media = await this.referenceDataService.getMediums();
            this.prepareMediums(media);
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public prepareMediums(media) {
        this.mediumOptions = media;
        const mediumNames = _.pluck(this.contact.mediums, 'type');
        this.mediumOptions.forEach((medium) => {
            if (!_.contains(mediumNames, medium.value)) {
                this.mediumDropdownOptions.push(medium);
            }
        });
        this.mediumDropdownOptions.sort((a, b) => {
            return a[Constants.VALUE_STR] > b[Constants.VALUE_STR];
        });
    }
}
