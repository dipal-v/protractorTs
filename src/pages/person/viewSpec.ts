import { EventAggregator } from 'aurelia-event-aggregator';
import { Entity } from '../../models/entity';
import { Messenger } from '../../services/messenger';
import { View } from './view';

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

jest.useFakeTimers();

describe('the entity view', () => {
    let ea;
    let entityService;
    let messenger;
    let view;
    let router;
    let dialogService;
    let i18n;

    beforeEach(() => {
        ea = new EventAggregator();
        entityService = jest.fn();
        entityService.getById = jest.fn();
        entityService.update = jest.fn();
        messenger = new Messenger(ea);
        dialogService = jest.fn();
        dialogService.open = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        i18n = jest.fn();
        i18n.tr = jest.fn();
    });

    it('get an entity', async () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        entityService.getById.mockReturnValueOnce(good);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.activate({ id: 1 });
        await view.attached();
        expect(view.entity.alias).toBe('Testy Explore');
    });

    it('handles error', async () => {
        const errorMsg = 'something wrong';
        const bad = new Promise((resolve, reject) => { reject(errorMsg); });
        entityService.getById.mockReturnValueOnce(bad);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        const expected = { text: errorMsg, type: 'error' };
        ea.subscribe('messages', (response) => {
            const resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        await view.activate({ id: 1 });
    });

    it('update an entity', async () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        entityService.update.mockReturnValueOnce(good);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = { legalEntityCode: 'test' };
        router.navigateToRoute = jest.fn();
        await view.update({ id: 1 });
        expect(router.navigateToRoute.mock.calls[0][0]).toBe('viewPerson');
        expect(router.navigateToRoute.mock.calls[0][1]).toEqual({ id: 'test' });

    });

    it('handle update errr', () => {
        const errorMsg = 'something wrong';
        const bad = new Promise((resolve, reject) => { reject(errorMsg); });
        entityService.update.mockReturnValueOnce(bad);
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        const expected = { text: errorMsg, type: 'error' };
        ea.subscribe('messages', (response) => {
            const resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        view.update({ id: 1 });
        expect(router.navigateToRoute.mock.calls.length).toBe(0);
    });

    it('should check deactivate', async () => {
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = null;
        view.update = jest.fn();
        view.deactivateEntity();
        expect(view.entity.endDate).not.toBeNull();
    });

    it('should check activate', () => {
        view = new View(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = '2017-10-10';
        view.update = jest.fn();
        view.entityService.update = jest.fn();
        view.activateEntity();
        expect(view.entity.endDate).toBeNull();
    });
});
