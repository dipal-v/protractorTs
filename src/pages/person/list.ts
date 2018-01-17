import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { Constants } from '../../constants';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { ListBase } from '../entity/listBase';

@inject(EventAggregator, EntityService, Messenger, Router, I18N)
export class Persons extends ListBase {
    protected entityType: string;

    constructor(
        ea: EventAggregator,
        entityService: EntityService,
        messenger: Messenger,
        router: Router,
        i18n: I18N) {
        super(ea, entityService, messenger, router, i18n);
        this.entityType = Constants.PERSON_TYPE;
    }

    /**
     * Set Search Default Values
     */
    public setDefaultSearchValues() {
        super.setDefaultSearchValues();
        this.searchFields = Constants.PERSON_SEARCH_FIELDS;
    }

}
