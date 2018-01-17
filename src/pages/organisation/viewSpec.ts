import { EventAggregator } from 'aurelia-event-aggregator';
import { Entity } from '../../models/entity';
import { Messenger } from '../../services/messenger';
import { View } from './view';

describe('the entity view', () => {
    let ea;
    let entityService;
    let messenger;
    let view;
    let router;
    let dialogService;
    let i18n;
    const DUMMY_DATA = {
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
    };
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
        entityService.getById = jest.fn();
        entityService.update = jest.fn();
        entityService.search = jest.fn();
        messenger = new Messenger(ea);
        dialogService = jest.fn();
        dialogService.open = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        i18n = jest.fn();
        i18n.tr = jest.fn();
    });

    it('get an entity', async () => {
        entityService.getById.mockReturnValueOnce(GOOD_PROMISE);
        entityService.search.mockReturnValueOnce(GOOD_PROMISE);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.activate({ id: 1 });
        await view.attached();
        expect(view.entity.legalEntityCode).toBe(DUMMY_DATA.legalEntityCode);
    });

    it('handles errr', async () => {
        entityService.getById.mockReturnValueOnce(BAD_PROMISE);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        const expected = { text: ERROR_MESSAGE, type: 'error' };
        ea.subscribe('messages', (response) => {
            const resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        await view.activate({ id: 1 });
    });

    it('should check deactivate', async () => {
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = null;
        view.entity.details.billingBlock = false;
        view.entity.details.orderingBlock = false;
        view.entity.details.postingBlock = false;
        view.entity.details.deliveryBlock = false;
        view.update = jest.fn();
        view.deactivateEntity();
        expect(view.entity.endDate).not.toBeNull();
        expect(view.entity.details.orderingBlock).toBeTruthy();
        expect(view.entity.details.billingBlock).toBeTruthy();
        expect(view.entity.details.postingBlock).toBeTruthy();
        expect(view.entity.details.deliveryBlock).toBeTruthy();
    });

    it('should check activate', () => {
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = '2017-10-10';
        view.entity.details.billingBlock = true;
        view.entity.details.orderingBlock = true;
        view.entity.details.postingBlock = true;
        view.entity.details.deliveryBlock = true;
        view.update = jest.fn();
        view.entityService.update = jest.fn();
        view.activateEntity();
        expect(view.entity.endDate).toBeNull();
        expect(view.entity.details.orderingBlock).toBeFalsy();
        expect(view.entity.details.billingBlock).toBeFalsy();
        expect(view.entity.details.postingBlock).toBeFalsy();
        expect(view.entity.details.deliveryBlock).toBeFalsy();
    });

    it('update an entity', async () => {
        const testId = 'catchMe';
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = { legalEntityCode: testId };
        await view.update();
        expect(router.navigateToRoute.mock.calls[0][0]).toBe('viewOrganisation');
        expect(router.navigateToRoute.mock.calls[0][1]).toEqual({ id: testId });
    });

    it('handle update errr', async () => {
        entityService.update.mockReturnValueOnce(BAD_PROMISE);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        const expected = { text: ERROR_MESSAGE, type: 'error' };
        ea.subscribe('messages', (response) => {
            const resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        await view.update();
        // not navigated
        expect(router.navigateToRoute.mock.calls.length).toBe(0);
    });
});
