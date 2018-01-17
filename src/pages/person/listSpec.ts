import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../../constants';
import { Messenger } from '../../services/messenger';
import { Persons } from './list';

describe('the entity list', () => {
    let ea;
    let entityService;
    let messenger;
    let resp;
    let entities;
    let router;
    let i18n;

    beforeEach(() => {
        ea = new EventAggregator();
        entityService = jest.fn();
        entityService.setCurrentPage = jest.fn();
        entityService.setPageSize = jest.fn();
        const container = new Container().makeGlobal();
        i18n = container.get(I18N);
        messenger = new Messenger(ea);
        router = jest.fn();
        router.navigateToRoute = jest.fn();
    });

    it('should set default search values', () => {
        entities = new Persons(ea, entityService, messenger, router, i18n);
        entities.setDefaultSearchValues();
        expect(entities.searchFields).toEqual(Constants.PERSON_SEARCH_FIELDS)
    });

});
