import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Details } from '../../models/details';
import { Entity } from '../../models/entity';
import { ModelObserver } from '../../models/modelObserver';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';
import { EditorBase } from './editorBase';

@inject(EventAggregator, Messenger, EntityService,
    Router, ValidationControllerFactory, ReferenceDataService, I18N, DialogService, ModelObserver)
export class UpdatePerson extends EditorBase {
    public heading: string;

    public validationController = null;

    constructor(
        ea: EventAggregator, messenger: Messenger,
        entityService: EntityService, router: Router,
        validationControllerFactory: ValidationControllerFactory,
        referenceDataService: ReferenceDataService, i18n: I18N, dialogService: DialogService,
        private modelObserver: ModelObserver) {
        super(ea, messenger, entityService, router,
            validationControllerFactory, referenceDataService, i18n, dialogService);
        this.validationController = validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new BootstrapValidationRenderer());
        this.mediumsGrid = new AureliaGrid();
        this.mediumsGrid.addCellClickWithoutRouter();
        this.mediumsGrid.gridOptions.pagination = false;
    }

    public prepareView(data) {
        this.person = new Entity(data);
        this.person.details = new Details(data.details);
        this.mediumsGrid.setRowData(this.person.details.mediums);
        this.heading = `${this.i18n.tr('page.modifyPerson.heading')} ${this.person.details.prefix} ` +
            `${this.person.details.givenName} ${this.person.details.surname} ${this.person.details.suffix}`;
        this.modelObserver.observe(
            this.person,
            [
                'alias', 'language', 'collector', 'details'
            ]);
    }

    public detached() {
        this.modelObserver.destroy();
    }

    public prepareMediums(media) {
        this.mediumOptions = media;
        const mediumNames = _.pluck(this.person.details.mediums, 'type');
        this.mediumOptions.forEach((medium) => {
            if (!_.contains(mediumNames, medium.value)) {
                this.mediumDropdownOptions.push(medium);
            }
        });
        this.sortMediumDropDownOptions();
    }

    public activate(params) {
        this.entityService.getById(params.id).then((data) => {
            this.prepareView(data);
            this.referenceDataService.getMediums().then((media) => {
                this.prepareMediums(media);
            }).catch((err) => {
                this.messenger.error(err.message);
            });
        }).catch((err) => {
            this.messenger.error(err.message);
        });
    }

    public async update() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            const delta = this.modelObserver.changes(this.person);
            delta[Constants.LEGAL_ENTITY_CODE] = this.person.legalEntityCode;
            this.cleanseData(delta);
            try {
                await this.entityService.update(delta);
                this.router.navigateToRoute(Constants.VIEW_PERSON, { id: this.person.legalEntityCode });
            } catch (error) {
                this.messenger.error(error);
            }
        } else {
            this.messenger.error(this.i18n.tr('messages.validation-error'));
        }
    }

    private cleanseData(data) {
        if (data.alias) {
            data.alias = data.alias.trim();
        }
        if (data.details) {
            if (data.details.givenName) {
                data.details.givenName = data.details.givenName.trim();
            }
            if (data.details.surname) {
                data.details.surname = data.details.surname.trim();
            }
            if (data.details.suffix) {
                data.details.suffix = data.details.suffix.trim();
            }
            if (data.details.jobTitle) {
                data.details.jobTitle = data.details.jobTitle.trim();
            }
        }
    }
}
