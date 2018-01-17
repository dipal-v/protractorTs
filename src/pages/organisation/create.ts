import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import * as moment from 'moment';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import {Constants} from '../../constants';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';
import { ServiceConfig } from '../../services/serviceConfig';
import { EditorBase } from './editorBase';

@inject(EventAggregator, Messenger, EntityService, Router,
    ServiceConfig, ValidationControllerFactory, ReferenceDataService, I18N)
export class CreateOrganisation extends EditorBase {
    public validationController = null;

    private params;

    constructor(
        ea: EventAggregator, messenger: Messenger,
        entityService: EntityService, router: Router, serviceConfig: ServiceConfig,
        validationControllerFactory: ValidationControllerFactory,
        referenceDataService: ReferenceDataService, i18n: I18N) {
        super(ea, messenger, entityService, router,
            serviceConfig, validationControllerFactory, referenceDataService, i18n);
        this.validationController = validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public activate(params, routeConfig, navigationInstruction) {
        this.params = params;
    }

    public async attached() {
        super.attached();
        this.entity = new Entity();
        if (this.params && this.params.parentCode) {
            this.entity.parent = `${this.params.parentName} - ${this.params.parentCode}`;
            this.entity.parentName = this.params.parentName;
        }
    }

    public async save() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            this.preSave();
            try {
                await this.entityService.save(this.entity);
                this.router.navigateToRoute(Constants.VIEW_ORGANISATION, { id: this.entity.legalEntityCode });
            } catch (error) {
                this.messenger.error(error);
            }
        }
    }
}
