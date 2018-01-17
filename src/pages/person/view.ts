import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { AureliaGrid } from '../../components/aureliaGrid';
import { Confirm } from '../../components/modal/confirm';
import { Constants } from '../../constants';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ViewBase } from '../entity/viewBase';

@inject(EventAggregator, EntityService, Messenger, Router, DialogService, I18N)
export class View extends ViewBase {
    private mediumsGrid: AureliaGrid;

    constructor(
        ea: EventAggregator,
        entityService: EntityService,
        messenger: Messenger,
        router: Router, dialogService: DialogService, i18n: I18N) {
        super(ea, entityService, messenger, router, dialogService, i18n);
        this.mediumsGrid = new AureliaGrid();
        this.mediumsGrid.addCellClickWithoutRouter();
        this.mediumsGrid.gridOptions.pagination = false;
        this.viewPage = Constants.VIEW_PERSON;
    }

    public async attached() {
        await super.attached();
        try {
            this.mediumsGrid.setRowData(this.entity.details.mediums);
        } catch (error) {
            this.messenger.error(error);
        }
    }
}
