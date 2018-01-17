import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { Site } from 'models/site';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';

@inject(DialogController, ValidationControllerFactory, ReferenceDataService, Messenger, EventAggregator)
export class SiteDialog {

    public validationController = null;

    public isUpdate = false;

    protected contacts = [];

    protected addresses = [];

    protected countryOptions;

    protected siteTypeOptions;

    protected siteSubTypeOptions;

    protected site: Site;

    protected isAircraft = true;

    constructor(
    private controller, private validationFactory: ValidationControllerFactory,
    protected referenceDataService: ReferenceDataService, protected messenger: Messenger,
    private ea: EventAggregator) {
        this.site = new Site();
        this.addValidationsBySiteType();
        this.validationController = this.validationFactory.createForCurrentScope();
        this.validationController.validateTrigger = validateTrigger.manual;
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public async attached() {
        try {
            this.countryOptions = await this.referenceDataService.getCountries();
            this.siteTypeOptions = await this.referenceDataService.getSiteTypes();
            this.siteSubTypeOptions = await this.referenceDataService.getSiteSubTypes();
        } catch (err) {
            this.messenger.error(err.message);
        }
    }

    public async activate(data) {
        this.setContacts(data.contacts);
        this.setAddresses(data.addresses);
    }

    public setContacts(contacts) {
        for (const contact of contacts) {
            this.contacts.push({
                key: contact.id,
                value: `${contact.prefix} ${contact.givenName} ${contact.surname}`
            });
        }
    }

    public setAddresses(addresses) {
        for (const address of addresses) {
            this.addresses.push({
                key: address.id,
                value: `${address.addressLine1} ${address.city} ${address.stateProvince}`
            });
        }
    }

    public preSave() {
        if (this.site.address) {
            this.site.address = +(this.site.address);
        }
        if (this.site.contacts && this.site.contacts.length > 0) {
            this.site.contacts = this.site.contacts.map(Number);
        }
        if (this.isAircraft) {
            delete this.site.mmsi;
            delete this.site.imoNumber;
            delete this.site.subType;
        } else {
            delete this.site.icaoNumber;
            delete this.site.tailNumber;
        }
    }

    public addValidationsBySiteType() {
        if (Constants.VESSEL_REGEXP.test(this.site.type)) {
            ValidationRules
                .ensure('name').required()
                .ensure('type').required()
                .ensure('country').required()
                .ensure('startDate').required()
                .ensure('callSign').required()
                .ensure('imoNumber').required()
                .ensure('mmsi').required()
                .on(Site);
        } else if (Constants.AIRCRAFT_REGEXP.test(this.site.type)) {
            ValidationRules
                .ensure('name').required()
                .ensure('type').required()
                .ensure('callSign').required()
                .ensure('country').required()
                .ensure('startDate').required()
                .ensure('tailNumber').required()
                .ensure('icaoNumber').required()
                .on(Site);
        }
    }

    public onSiteTypeChange(siteType) {
        this.isAircraft = true;
        this.site.mmsi = '';
        this.site.imoNumber = '';
        this.site.subType = '';
        this.site.icaoNumber = '';
        this.site.tailNumber = '';
        if (Constants.VESSEL_REGEXP.test(siteType)) {
            this.isAircraft = false;
        }
        this.addValidationsBySiteType();
    }

    public async submit() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            this.preSave();
            this.controller.ok(this.site);
        }
    }
}
