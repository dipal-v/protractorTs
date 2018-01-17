import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Messenger } from '../../services/messenger';
import { ListBase } from './listBase';

describe('the entity list', () => {
    let ea;
    let entityService;
    let messenger;
    let resp;
    let entities;
    let router;
    let i18n;
    const DUMMY_DATA = [
        {
            addresses: null,
            alias: 'Testy Explore',
            contacts: null,
            createdBy: 'Natalie Payne',
            createdDate: '2017-09-14T10:45:20.103Z',
            details: {
                billingBlock: null,
                creditRegion: 'APAC',
                creditStatus: null,
                deliveryBlock: null,
                givenName: null,
                jobTitle: null,
                legalName: 'Testy Explore',
                mediums: null,
                nielsenInd: null,
                orderingBlock: null,
                postingBlock: null,
                preferredContactMedium: null,
                prefix: null,
                primaryName: 'Testy Explore',
                serviceLevelAgreement: null,
                suffix: null,
                surname: null,
                type: 'National Account'
            },
            endDate: null,
            id: null,
            language: 'English',
            lastModifiedBy: 'Natalie Payne',
            lastModifiedDate: '2017-09-14T10:45:20.103Z',
            legalEntityCode: 'NIPP003',
            mainAddress: null,
            mainContact: null,
            parent: null,
            personas: null,
            search: null,
            startDate: '2006-12-01T09:45:20.103Z',
            type: 'Organisation'
        }];
    const GOOD_PROMISE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const ERROR_MESSAGE = 'something wrong';
    const BAD_PROMISE = new Promise((resolve, reject) => {
        reject(ERROR_MESSAGE);
    });

    beforeEach(() => {
        ea = new EventAggregator();
        entityService = jest.fn();
        entityService.getAll = jest.fn();
        entityService.search = jest.fn();
        entityService.pageCount = jest.fn();
        entityService.setCurrentPage = jest.fn();
        entityService.setPageSize = jest.fn();
        entityService.advancedSearch = jest.fn();
        const container = new Container().makeGlobal();
        i18n = container.get(I18N);
        messenger = new Messenger(ea);
        router = jest.fn();
        router.navigateToRoute = jest.fn();
    });

    it('get all entites', async () => {
        entityService.advancedSearch.mockReturnValueOnce(GOOD_PROMISE);
        entityService.pageCount.mockReturnValueOnce(GOOD_PROMISE);
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        await entities.attached();
        expect(entities.entitiesGird.data).toBe(DUMMY_DATA);
    });

    it('should do search reset', async () => {
        entityService.advancedSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        await entities.doSearchReset();
        expect(entities.entitiesGird.data).toBe(DUMMY_DATA);
    });

    it('searches for entites', async () => {
        entityService.advancedSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        entities.searchField = 'abc';
        entities.searchValue = 'a';
        await entities.doSearch();
        expect(entities.entitiesGird.data.length).toBe(1);
    });

    it('should catch errors', async () => {
        entityService.getAll.mockReturnValueOnce(BAD_PROMISE);
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        const expected = { text: ERROR_MESSAGE, type: 'error' };
        ea.subscribe('messages', (response) => {
            resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        await entities.attached();
    });

    it('should turn to next page', async () => {
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        entities.doSearch = jest.fn();
        entities.doSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities.currentPage = 2
        await entities.nextPage()
        expect(entities.currentPage).toBe(3);
    });

    it('should turn to previous page', async () => {
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        entities.doSearch = jest.fn();
        entities.doSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities.currentPage = 2
        await entities.prevPage()
        expect(entities.currentPage).toBe(1);
    });

    it('should turn to first page', async () => {
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        entities.doSearch = jest.fn();
        entities.doSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities.currentPage = 2
        await entities.firstPage()
        expect(entities.currentPage).toBe(1);
    });

    it('should turn to last page', async () => {
        entities = new ListBase(ea, entityService, messenger, router, i18n);
        entities.doSearch = jest.fn();
        entities.doSearch.mockReturnValueOnce(GOOD_PROMISE);
        entities.totalPages = 10
        entities.currentPage = 2
        await entities.lastPage()
        expect(entities.currentPage).toBe(10);
    });

});
