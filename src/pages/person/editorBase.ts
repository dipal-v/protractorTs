import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { NewMediumDialog } from '../../dialogs/medium/newMediumDialog';
import { Details } from '../../models/details';
import { Entity } from '../../models/entity';
import { Medium } from '../../models/medium';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';

@inject(EventAggregator, Messenger, EntityService,
    Router, ValidationControllerFactory, ReferenceDataService, I18N, DialogService)
export class EditorBase {
    public person: Entity;

    public languageOptions;

    protected mediumDropdownOptions;

    protected mediumOptions;

    protected mediumsGrid: AureliaGrid;

    protected prefixes;

    protected chosenMediumType: string;

    constructor(
        protected ea: EventAggregator, protected messenger: Messenger,
        protected entityService: EntityService, protected router: Router,
        protected validationControllerFactory: ValidationControllerFactory,
        protected referenceDataService: ReferenceDataService, protected i18n: I18N,
        protected dialogService: DialogService
    ) {
        this.languageOptions = [];
        this.mediumDropdownOptions = [];
        this.mediumsGrid = new AureliaGrid();
        this.mediumsGrid.addCellClickWithoutRouter();
        this.mediumsGrid.gridOptions.pagination = false;
        ValidationRules
            .ensure('collector').required()
            .ensure('alias').required().maxLength(200)
            .ensure('language').required()
            .ensure('startDate').required()
            .ensure('legalEntityCode').displayName(i18n.tr('entity.legalEntityCode')).required()
            .ensure('type').displayName(i18n.tr('entity.type')).required()
            .on(Entity);
        ValidationRules
            .ensure('type').required()
            .ensure('surname').required()
            .ensure('givenName').required()
            .ensure('preferredContactMedium').required()
            .on(Details);
    }

    public async attached() {
        try {
            this.prefixes = await this.referenceDataService.getPrefixes();
            this.languageOptions = await this.referenceDataService.getLanguages();
        } catch (err) {
            this.messenger.error(err.message);
        }

        this.ea.subscribe('deleteMedium', (data) => {
            this.deleteMedium(data[Constants.DATA_STR]);
        });
    }

    public activate(params) {
        this.referenceDataService.getMediums().then((media) => {
            this.mediumOptions = media;
            this.mediumOptions.forEach((medium) => {
                this.mediumDropdownOptions.push(medium);
            });
            this.sortMediumDropDownOptions();
        }).catch((err) => {
            this.messenger.error(err.message);
        });
    }

    public showMediumDialog() {
        let mediumType;
        this.mediumDropdownOptions.forEach((medium) => {
            if (medium.value === this.chosenMediumType) {
                mediumType = medium.key;
            }
        });
        this.dialogService.open({
            viewModel: NewMediumDialog,
            model: { mediumType, medium: this.chosenMediumType }
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.updateMediums(response.output);
            }
        });
    }

    public updateMediums(medium: Medium) {
        const mediums = this.person.details.mediums;
        mediums.push(medium);
        this.mediumsGrid.gridApi.setRowData(mediums);
        this.mediumDropdownOptions = _.filter(this.mediumDropdownOptions, (option) => {
            return option[Constants.VALUE_STR] !== medium.type;
        });
    }

    public preSave() {
        this.person.alias = this.person.alias.trim();
        this.person.details.givenName = this.person.details.givenName.trim();
        this.person.details.surname = this.person.details.surname.trim();
        if (this.person.details.suffix) {
            this.person.details.suffix = this.person.details.suffix.trim();
        }
        if (this.person.details.jobTitle) {
            this.person.details.jobTitle = this.person.details.jobTitle.trim();
        }
        this.person.startDate = moment(this.person.startDate).utc().format(Constants.UTC_DATE_FORMAT);
    }

    protected sortMediumDropDownOptions() {
        this.mediumDropdownOptions = _.sortBy(this.mediumDropdownOptions, Constants.VALUE_STR);
    }

    private deleteMedium(mediumName) {
        this.person.details.mediums = _.filter(this.person.details.mediums, (currentMedium) => {
            return currentMedium.type !== mediumName;
        });
        const lostMedium = _.findWhere(this.mediumOptions, {
            value: mediumName
        });
        this.mediumDropdownOptions.push(lostMedium);
        this.sortMediumDropDownOptions();
        this.mediumsGrid.gridApi.setRowData(this.person.details.mediums);
    }

}
