import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';
import { EditorBase } from './editorBase';

export class CreatePerson extends EditorBase {
    public validationController = null;

    constructor(
        ea: EventAggregator, messenger: Messenger,
        entityService: EntityService, router: Router,
        validationControllerFactory: ValidationControllerFactory,
        referenceDataService: ReferenceDataService, i18n: I18N, dialogService: DialogService) {
        super(ea, messenger, entityService, router,
            validationControllerFactory, referenceDataService, i18n, dialogService);
        this.validationController = validationControllerFactory.createForCurrentScope();
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public async attached() {
        await super.attached();
        this.person = new Entity();
        this.person.type = Constants.PERSON_TYPE;
    }

    public async save() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            this.preSave();
            try {
                await this.entityService.save(this.person);
                this.router.navigateToRoute(Constants.VIEW_PERSON, { id: this.person.legalEntityCode });
            } catch (error) {
                this.messenger.error(error);
            }
        } else {
            this.messenger.error(this.i18n.tr('messages.validation-error'));
        }
    }

}
