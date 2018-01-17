import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import * as moment from 'moment';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Details } from '../../models/details';
import { Entity } from '../../models/entity';
import { ModelObserver } from '../../models/modelObserver';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';
import { ServiceConfig } from '../../services/serviceConfig';
import { EditorBase } from './editorBase';

@inject(EventAggregator, Messenger, EntityService,
    Router, ServiceConfig, ValidationControllerFactory, ReferenceDataService, I18N,
    ModelObserver)
export class UpdateOrganisation extends EditorBase {
    /**
     * Create new record heading
     */
    public heading: string;

    public validationController = null;

    public disableStatus: boolean;

    private id: string;

    constructor(
        ea: EventAggregator, messenger: Messenger,
        entityService: EntityService, router: Router, serviceConfig: ServiceConfig,
        validationControllerFactory: ValidationControllerFactory,
        referenceDataService: ReferenceDataService, i18n: I18N, private modelObserver: ModelObserver) {
        super(ea, messenger, entityService, router,
            serviceConfig, validationControllerFactory, referenceDataService, i18n);
        this.validationController = validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new BootstrapValidationRenderer());
        this.id = null;
    }

    public prepareView(data) {
        this.entity = new Entity(data);
        if (this.entity.parentCode) {
            this.entity.parent = `${this.entity.parentName} - ${this.entity.parentCode}`;
        }
        this.disableStatus = false;
        if (this.entity.endDate) {
            this.disableStatus = true;
        }
        this.entity.details = new Details(data.details);
        this.heading = `${this.i18n.tr('page.modifyEntity.heading')} ${this.entity.details.primaryName}`;
        this.modelObserver.observe(
            this.entity,
            [
                'type', 'parent', 'alias', 'language', 'collector', 'details'
            ]);
    }

    public activate(params) {
        this.id = params.id;
    }

    public async attached() {
        try {
            await super.attached();
            const data = await this.entityService.getById(this.id);
            this.prepareView(data);
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public async update() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            const delta = this.modelObserver.changes(this.entity);
            delta[Constants.LEGAL_ENTITY_CODE] = this.entity.legalEntityCode;
            this.cleanseData(delta);
            try {
                const result = await this.entityService.update(delta);
                this.router.navigateToRoute(Constants.VIEW_ORGANISATION, { id: this.entity.legalEntityCode });
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

        if (data.parent) {
            const parent = data.parent.split('-');
            data.parentName = parent[0].trim();
            data.parentCode = parent[1].trim();
        }

        if (data.details) {
            if (data.details.primaryName) {
                data.details.primaryName = data.details.primaryName.trim();
            }
            if (data.details.legalName) {
                data.details.legalName = data.details.legalName.trim();
            }
        }
    }
}
