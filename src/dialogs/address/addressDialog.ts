import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject, useView } from 'aurelia-framework';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Address } from '../../models/address';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';

@inject(DialogController, ValidationControllerFactory, ReferenceDataService, Messenger, EventAggregator)
export class AddressDialog {
    public validationController = null;

    public isUpdate = false;

    protected address: Address;

    protected countryOptions;

    protected stateOptions;

    constructor(
        private controller, private validationFactory: ValidationControllerFactory,
        protected referenceDataService: ReferenceDataService, protected messenger: Messenger,
        private ea: EventAggregator) {
        // setup address validation rule
        ValidationRules
            .ensure('addressLine1').required()
            .ensure('city').required()
            .ensure('country').required()
            .ensure('isoCountryCode').required()
            .ensure('startDate').required()
            .on(Address);
        this.address = new Address();
        this.validationController = this.validationFactory.createForCurrentScope();
        this.validationController.validateTrigger = validateTrigger.manual;
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public attached() {
        this.referenceDataService.getCountries().then((data) => {
            this.countryOptions = data;
        }).catch((err) => {
            this.messenger.error(err.message);
        });
        this.getStates(this.address.isoCountryCode);
    }

    public submit() {
        this.validationController.validate().then((verdict) => {
            if (verdict.valid) {
                this.preSave();
                this.controller.ok(this.address);
            }
        });
    }

    public preSave() {
        const countryObj = _.findWhere(this.countryOptions, {key: this.address.isoCountryCode});
        this.address.country = countryObj[Constants.VALUE_STR];
        const stateObj = _.findWhere(this.stateOptions, { key: this.address.isoStateProvince });
        this.address.stateProvince = stateObj[Constants.VALUE_STR];
    }

    public getStates(isoCountryCode) {
        this.referenceDataService.getStates(isoCountryCode).then((data) => {
            this.stateOptions = data;
        }).catch((err) => {
            this.messenger.error(err.message);
        });
    }
}
