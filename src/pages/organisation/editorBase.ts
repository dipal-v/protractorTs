import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import * as moment from 'moment';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Details } from '../../models/details';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';
import { ServiceConfig } from '../../services/serviceConfig';

@inject(EventAggregator, Messenger, EntityService,
    Router, ServiceConfig, ValidationControllerFactory, ReferenceDataService, I18N)
export class EditorBase {
    public entity: Entity;

    public legalEntityTypeOptions;

    public creditRegionOptions;

    public organizationTypeOptions;

    public creditStatusOptions;

    public serviceLevelAgreementOptions;

    public languageOptions;

    constructor(
        protected ea: EventAggregator, protected messenger: Messenger,
        protected entityService: EntityService, protected router: Router, protected serviceConfig: ServiceConfig,
        protected validationControllerFactory: ValidationControllerFactory,
        protected referenceDataService: ReferenceDataService, protected i18n: I18N) {
        this.legalEntityTypeOptions = [];
        this.creditRegionOptions = [];
        this.languageOptions = [];
        this.organizationTypeOptions = [];
        this.creditStatusOptions = [];
        this.serviceLevelAgreementOptions = [];
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
            .ensure('creditRegion').required()
            .ensure('creditStatus').required()
            .ensure('serviceLevelAgreement').required()
            .ensure('primaryName').required().maxLength(200)
            .ensure('legalName').required().maxLength(200)
            .on(Details);
    }

    public async attached() {
        try {
            this.legalEntityTypeOptions = await this.referenceDataService.getLegalEntityTypes();
            this.creditRegionOptions = await this.referenceDataService.getCreditRegions();
            this.languageOptions = await this.referenceDataService.getLanguages();
            this.organizationTypeOptions = await this.referenceDataService.getOrganizationTypes();
            this.creditStatusOptions = await this.referenceDataService.getCreditStatuses();
            this.serviceLevelAgreementOptions = await this.referenceDataService.getServiceLevelAgreementTypes();
        } catch (err) {
            this.messenger.error(err.message);
        }
    }

    public getEntittiesByPrimaryName(filter, limit) {
        return this.entityService.search('details.primaryName', filter).then((data) => {
            return data;
        }).then((entities) => {
            return filter.length > 0 ? entities.filter((item) => {
                return item.details.primaryName.toLowerCase().indexOf(filter.toLowerCase()) > -1;
            }) : entities;
        }).then((entities) => {
            return limit ? entities.splice(0, limit) : entities;
        }).then((entities) => {
            return entities.map((entity) => `${entity.details.primaryName} - ${entity.legalEntityCode}`);
        }).catch((error) => {
            this.messenger.error(error);
        });
    }

    public preSave() {
        this.entity.alias = this.entity.alias.trim();
        this.entity.details.primaryName = this.entity.details.primaryName.trim();
        this.entity.details.legalName = this.entity.details.legalName.trim();
        this.entity.parentName = '';
        this.entity.parentCode = '';
        if (this.entity.parent) {
            const parent = this.entity.parent.split('-');
            this.entity.parentName = parent[0].trim();
            this.entity.parentCode = parent[1].trim();
        }
        this.entity.startDate = moment(this.entity.startDate).utc().format(Constants.UTC_DATE_FORMAT);
    }
}
