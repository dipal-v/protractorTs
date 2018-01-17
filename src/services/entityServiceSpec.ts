import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Entity } from '../models/entity';
import { SearchParam } from '../pages/entity/search-param';
import { EntityService } from './entityService';
import { ServiceConfig } from './serviceConfig';

const DUMMY_DATA = [{
    addresses: null,
    alias: 'Testy Explore',
    contacts: null,
    createdBy: 'Natalie Payne',
    createdDate: '2017-09-14T10:45:20.103Z'
}];

const ENTITY_DATA = {
    language: 'English',
    type: 'Organisation',
    details: {
        orderingBlock: false,
        deliveryBlock: false,
        postingBlock: false,
        billingBlock: false,
        creditStatus: 'Regular',
        serviceLevelAgreement: 'Standard',
        primaryName: 'gsdggdsgdsgsdg',
        creditRegion: 'APAC',
        type: 'Corporation',
        legalName: 'gdsgdsgds'
    },
    legalEntityCode: 'dgdsgdsg',
    parent: 'gdsg',
    alias: 'gdsgdsg',
    collector: 'gdsgdsg',
    startDate: '2017-10-19T23:00:00+0000',
    endDate: '2017-10-19T16:51:43+0000'
};

const GOOD_PROMISE = new Promise((resolve, reject) => {
    resolve(DUMMY_DATA);
});

const GOOD_PROMISE_WITH_SINGLE_RESPONSE = new Promise((resolve, reject) => {
    resolve(DUMMY_DATA[0]);
});

const ERROR_MESSAGE = 'bad promise';

const BAD_PROMISE = new Promise((resolve, reject) => {
    reject({ message: ERROR_MESSAGE });
});


describe('entity service', () => {
    let api;
    let entityService;
    let serviceConfig;
    beforeEach(() => {
        api = jest.fn();
        api.get = jest.fn();
        api.post = jest.fn();
        api.patch = jest.fn();
        serviceConfig = new ServiceConfig();
        serviceConfig.legalEntityEndPoint = 'identity/legalentity';
        entityService = new EntityService(api, serviceConfig);
    });

    it('should get all', async () => {
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        const entities = await entityService.getAll();
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
    });

    it('should handle error in get all', async () => {
        try {
            api.get.mockReturnValueOnce(BAD_PROMISE);
            await entityService.getAll();
        } catch (error) {
            expect(error.message).toBe('bad promise');
        }
    });

    it('should handle do advanced search', async () => {
        serviceConfig.searchParamsTemplateString = '<%= key %>=<%= value %>';
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        entityService.setCurrentPage(1);
        entityService.setPageSize(2);
        const entities = await entityService.advancedSearch(
            [new SearchParam('field', 'value', false)]);
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe('identity/legalentity?field=value&partialMatch&page=0&pageSize=2');
    });

    it('should handle do advanced regular expression search', async () => {
        serviceConfig.searchParamsTemplateString = '<%= key %>=<%= value %>';
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        entityService.setCurrentPage(1);
        entityService.setPageSize(2);
        const entities = await entityService.advancedSearch(
            [new SearchParam('field', 'value', true)]);
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe('identity/legalentity?field=value&page=0&pageSize=2');
    });

    it('should handle do search', async () => {
        serviceConfig.searchParamsTemplateString = 'field=<%= key %>&value=<%= value %>';
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        const entities = await entityService.search('field', 'value');
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe('identity/legalentity?field=field&value=value&partialMatch');
    });

    it('should handle do search with alterate search syntax', async () => {
        serviceConfig.searchParamsTemplateString = '<%= key %>=<%= value %>';
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        const entities = await entityService.search('field1', 'value1');
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe('identity/legalentity?field1=value1&partialMatch');
    });

    it('should get by id', async () => {
        const testId = 'BT';
        api.get.mockReturnValueOnce(GOOD_PROMISE_WITH_SINGLE_RESPONSE);
        const entity = await entityService.getById(testId);
        expect(entity.details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe(`identity/legalentity/${testId}`);
    });

    it('should handle error in get by id', async () => {
        try {
            api.get.mockReturnValueOnce(BAD_PROMISE);
            await entityService.getById('negative');
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        }
    });

    it('should use default search syntax', async () => {
        api.get.mockReturnValueOnce(GOOD_PROMISE);
        const entities = await entityService.search('field2', 'value2');
        expect(entities[0].details.serviceLevelAgreement).toBe('Standard');
        expect(api.get.mock.calls[0][0]).toBe('identity/legalentity?field=field2&value=value2&partialMatch');
    });
});

describe('with validation', () => {
    let api;
    let entityService;

    beforeEach(() => {
        api = jest.fn();
        api.get = jest.fn();
        api.post = jest.fn();
        api.patch = jest.fn();
        const serviceConfig = new ServiceConfig();
        entityService = new EntityService(api, serviceConfig);
    });

    it('should save', async () => {
        const entity = new Entity(ENTITY_DATA);
        api.post.mockReturnValueOnce(GOOD_PROMISE_WITH_SINGLE_RESPONSE);
        const result = await entityService.save(entity);
        expect(result.details.creditStatus).toBe('Regular');
    });

    it('should error in saving', async () => {
        try {
            api.post.mockReturnValueOnce(BAD_PROMISE);
            await entityService.save(new Entity(ENTITY_DATA));
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        }
    });

    it('should update', async () => {
        api.patch.mockReturnValueOnce(GOOD_PROMISE_WITH_SINGLE_RESPONSE);
        const result = await entityService.update(new Entity(ENTITY_DATA));
        expect(result.details.creditStatus).toBe('Regular');
    });

    it('should error in update', async () => {
        try {
            api.patch.mockReturnValueOnce(BAD_PROMISE);
            await entityService.update(new Entity(ENTITY_DATA));
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        }
    });

    it('should set current page', () => {
        entityService.setCurrentPage(2);
        expect(entityService.currentPage).toBe(1);
    });

    it('should set page size', () => {
        entityService.setPageSize(2);
        expect(entityService.pageSize).toBe(2);
    });

});
