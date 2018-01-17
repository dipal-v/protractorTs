import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Contact } from '../../models/contact';
import { Medium } from '../../models/medium';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';

@inject(DialogController, ValidationControllerFactory, ReferenceDataService, Messenger, EventAggregator)
export class ContactDialog {
    public validationController = null;

    public isUpdate = false;

    protected contact: Contact;

    protected mediumOptions;

    protected mediumsGrid: AureliaGrid;

    protected mediumDropdownOptions;

    private showMediumPanel: boolean;

    private showAddPanel: boolean;

    private currentMedium: Medium;

    private chosenMediumType: string;

    private languageOptions;

    private prefixes;

    constructor(
        private controller, private validationFactory: ValidationControllerFactory,
        protected referenceDataService: ReferenceDataService, protected messenger: Messenger,
        private ea: EventAggregator) {
        // setup contact validation rule
        ValidationRules
            .ensure('surname').required()
            .ensure('givenName').required()
            .ensure('startDate').required()
            .ensure('preferredContactMedium').required()
            .on(Contact);
        this.contact = new Contact();
        this.mediumOptions = [];
        this.mediumsGrid = new AureliaGrid();
        this.mediumsGrid.addCellClickWithoutRouter();
        this.mediumsGrid.gridOptions.pagination = false;
        this.showMediumPanel = false;
        this.showAddPanel = true;
        this.chosenMediumType = '';
        this.currentMedium = new Medium();
        this.validationController = this.validationFactory.createForCurrentScope();
        this.validationController.validateTrigger = validateTrigger.manual;
        this.validationController.addRenderer(new BootstrapValidationRenderer());
        this.mediumOptions = new Array<Medium>();
        this.mediumDropdownOptions = new Array<Medium>();
    }

    public async attached() {
        try {
            this.prefixes = await this.referenceDataService.getPrefixes();
            this.languageOptions = await this.referenceDataService.getLanguages();
        } catch (error) {
            this.messenger.error(error);
        }
        this.ea.subscribe('deleteMedium', (data) => {
            this.deleteMedium(data[Constants.DATA_STR]);
        });
    }

    public async activate(data) {
        try {
            const media = await this.referenceDataService.getMediums();
            this.prepareMediums(media);
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public prepareMediums(media) {
        this.mediumOptions = media;
        this.mediumOptions.forEach((medium) => {
            this.mediumDropdownOptions.push(medium);
        });
        this.sortMediumDropDownOptions();
    }

    public deleteMedium(mediaName) {
        this.contact.mediums = _.filter(this.contact.mediums, (currentMedium) => {
            return currentMedium.type !== mediaName;
        });
        const lostMedium = _.findWhere(this.mediumOptions, {
            value: mediaName
        });
        this.mediumDropdownOptions.push(lostMedium);
        this.sortMediumDropDownOptions();
        this.mediumsGrid.gridOptions.api.setRowData(this.contact.mediums);
    }

    public showMedium() {
        this.showMediumPanel = true;
        this.showAddPanel = false;
        let mediumType = Constants.EMAIL;
        this.mediumDropdownOptions.forEach((medium) => {
            if (medium.value === this.chosenMediumType) {
                mediumType = medium.key;
            }
        });
        this.currentMedium.type = mediumType;
    }

    public hideMedium(event) {
        this.showMediumPanel = false;
        this.showAddPanel = true;
    }

    public addMedium(event) {
        const medium = new Medium(event.detail);
        this.contact.mediums.push(medium);
        this.hideMedium(event);
        this.mediumsGrid.gridOptions.api.setRowData(this.contact.mediums);
        this.mediumDropdownOptions = _.filter(this.mediumDropdownOptions, (option) => {
            return option[Constants.VALUE_STR] !== medium.type;
        });
    }

    public async submit() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            this.contact.findEmail();
            this.contact.findTelephone();
            this.controller.ok(this.contact);
        }
    }

    private sortMediumDropDownOptions() {
        this.mediumDropdownOptions.sort((a, b) => {
            return a[Constants.VALUE_STR] > b[Constants.VALUE_STR];
        });
    }
}
