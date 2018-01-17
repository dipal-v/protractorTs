import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import * as moment from 'moment';
import { ViewBase } from 'pages/entity/viewBase';
import { AureliaGrid } from '../../components/aureliaGrid';
import { Constants } from '../../constants';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';

/**
 * View Entity Class
 */
@inject(EventAggregator, EntityService, Messenger, Router, DialogService, I18N)
export class View extends ViewBase {

    private childrenGrid: AureliaGrid;

    constructor(
        ea: EventAggregator,
        entityService: EntityService,
        messenger: Messenger,
        router: Router, dialogService: DialogService, i18n: I18N) {
        super(ea, entityService, messenger, router, dialogService, i18n);
        this.childrenGrid = new AureliaGrid();
        this.childrenGrid.addCellClickWithRouter(router, this.routeOptions, 'legalEntityCode');
        this.childrenGrid.setPageSize(Constants.DEFAULT_SUB_ENTITY_PAGE_SIZE);
        this.viewPage = Constants.VIEW_ORGANISATION;
    }

    public async activate(params) {
        super.activate(params);
        try {
            const data = await this.entityService.search('parentCode', this.id);
            this.childrenGrid.setRowData(data);
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public deactivateEntity() {
        this.activateOrDeactivateOrganisation(moment().utc().format(Constants.UTC_DATE_FORMAT), true);
    }

    public activateEntity() {
        this.activateOrDeactivateOrganisation(null, false);
    }

    public activateOrDeactivateOrganisation(date, state) {
        this.entity.endDate = date;
        this.entity.details.billingBlock = state;
        this.entity.details.deliveryBlock = state;
        this.entity.details.orderingBlock = state;
        this.entity.details.postingBlock = state;
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            endDate: this.entity.endDate,
            details: this.entity.details
        };
        patchEntity.details.billingBlock = this.entity.details.billingBlock;
        patchEntity.details.deliveryBlock = this.entity.details.deliveryBlock;
        patchEntity.details.orderingBlock = this.entity.details.orderingBlock;
        patchEntity.details.postingBlock = this.entity.details.postingBlock;
        this.update(patchEntity);
    }
}
