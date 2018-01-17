import { inject, useView } from 'aurelia-framework';
import * as moment from 'moment';
import * as _ from 'underscore';
import { Constants } from '../../constants';
import { Site } from '../../models/site';
import { SiteDialog } from './siteDialog';

@useView('dialogs/site/siteDialog.html')
export class UpdateSiteDialog extends SiteDialog {

    public async activate(data) {
        super.activate(data);
        this.site = new Site(data.site);
        this.isUpdate = true;
        this.isAircraft = true;
        if (Constants.VESSEL_REGEXP.test(this.site.type)) {
            this.isAircraft = false;
        }
        if (this.site.address) {
            this.site.address = this.site.address.toString();
        }
        if (this.site.contacts && this.site.contacts.length > 0) {
            this.site.contacts = this.site.contacts.map(String);
        }
        this.site.startDate = moment(this.site.startDate).format(Constants.UI_DATE_FORMAT);
        if (this.site.endDate) {
            this.site.endDate = moment(this.site.endDate).format(Constants.UI_DATE_FORMAT);
        }
    }
}
