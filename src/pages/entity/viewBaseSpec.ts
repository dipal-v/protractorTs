import { EventAggregator } from 'aurelia-event-aggregator';
import { Entity } from '../../models/entity';
import { Messenger } from '../../services/messenger';
import { ViewBase } from './viewBase';

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
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.activate({ id: 1 });
        await view.attached();
        expect(view.entity.legalEntityCode).toBe(DUMMY_DATA.legalEntityCode);
    });

    it('handles errr', async () => {
        entityService.getById.mockReturnValueOnce(BAD_PROMISE);
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        const expected = { text: ERROR_MESSAGE, type: 'error' };
        ea.subscribe('messages', (response) => {
            const resp = response;
            expect(resp.text).toBe(expected.text);
            expect(resp.type).toBe(expected.type);
        });
        view.activate({ id: 1 });
        await view.attached();
    });

    it('should check deactivate', async () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = null;
        view.update = jest.fn();
        view.deactivateEntity();
        expect(view.entity.endDate).not.toBeNull();
    });

    it('should check activate', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.details = jest.fn();
        view.entity.endDate = '2017-10-10';
        view.update = jest.fn();
        view.entityService.update = jest.fn();
        view.activateEntity();
        expect(view.entity.endDate).toBeNull();
    });

    it('should check get contact', () => {
        const testContacts = [
            {
                id: 1,
                surname: 'test',
                givenName: 'user'
            },
            {
                id: 2,
                surname: 'test2',
                givenName: 'user2'
            }
        ];
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.contacts = testContacts;
        view.updateContact = jest.fn();
        view.getContact({ data: '1' });
        expect(view.updateContact.mock.calls[0][0]).toBe(testContacts[0]);
    });

    it('should check add account', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.updateAccounts = jest.fn();
        view.entity = jest.fn();
        view.entity.contacts = {};
        view.entity.addresses = {};
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb({ wasCancelled: false }));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.addAccount();
        expect(view.updateAccounts.mock.calls.length).toBe(1);
    });

    it('should update account', () => {
        const dialogResponse = {
            wasCancelled: false,
            output: {
                id: 1
            }
        };
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity({ accounts: [{ accountNumber: 1 }] });
        view.updateAccounts = jest.fn();
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb(dialogResponse));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.updateAccount({ accountNumber: 1 });
        expect(view.updateAccounts.mock.calls.length).toBe(1);
    });

    it('should get account', () => {
        const fakeAccount = { accountNumber: 1 };
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity({ accounts: [fakeAccount] });
        view.updateAccount = jest.fn();
        view.getAccount({ data: '1' });
        expect(view.updateAccount.mock.calls[0][0].account.accountNumber).toEqual(fakeAccount.accountNumber);
    });

    it('should add site', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.updateSites = jest.fn();
        view.entity = jest.fn();
        view.entity.contacts = {};
        view.entity.addresses = {};
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb({ wasCancelled: false }));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.addSite();
        expect(view.updateSites.mock.calls.length).toBe(1);
    });

    it('should update site', () => {
        const dialogResponse = {
            wasCancelled: false,
            output: {
                id: 1
            }
        };
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity({ sites: [{ id: 1 }] });
        view.updateSites = jest.fn();
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb(dialogResponse));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.updateSite({ id: 1 });
        expect(view.updateSites.mock.calls.length).toBe(1);
    });

    it('should get site', () => {
        const fakeSite = { id: 1 };
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity({ sites: [fakeSite] });
        view.updateSite = jest.fn();
        view.getSite({ data: '1' });
        expect(view.updateSite.mock.calls[0][0].site.id).toEqual(fakeSite.id);
    });

    it('should check add contact', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.updateContacts = jest.fn();
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb({ wasCancelled: false }));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.addContact();
        expect(view.updateContacts.mock.calls.length).toBe(1);
    });

    it('should check presave contact', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        const contact = {
            id: 1,
            surname: 'test',
            givenName: 'user',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.preSave(contact);
        expect(contact.startDate).toBeDefined();
        expect(contact.endDate).toBeNull();
        contact.endDate = '15-Sep-2017';
        view.preSave(contact);
        expect(contact.endDate).toBeDefined();
    });

    it('should check get address', () => {
        const testAddresses = [
            {
                id: 2,
                addressLine1: 'Temple Road',
                city: 'Chennai',
                country: 'India',
                startDate: '14-Sep-2017',
                endDate: null
            },
            {
                id: 1,
                addressLine1: 'Temple Road',
                city: 'Chennai',
                country: 'India',
                startDate: '14-Sep-2017',
                endDate: null
            }
        ];
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = jest.fn();
        view.entity.addresses = testAddresses;
        view.updateAddress = jest.fn();
        view.getAddress({ data: '2' });
        expect(view.updateAddress.mock.calls[0][0]).toBe(testAddresses[0]);
    });

    it('should check add address', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.addAddress();
    });

    it('should check presave address', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        const address = {
            id: 1,
            addressLine1: 'Temple Road',
            city: 'Chennai',
            country: 'India',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.preSave(address);
        expect(address.startDate).toBeDefined();
        expect(address.endDate).toBeNull();
        address.endDate = '15-Sep-2017';
        view.preSave(address);
        expect(address.endDate).toBeDefined();
    });

    it('should deactivate entity via dialog', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.activateEntity = jest.fn();
        view.deactivateEntity = jest.fn();
        view.entity = jest.fn();
        view.entity.endDate = null;
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb({ wasCancelled: false }));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.openConfirm();
        expect(view.deactivateEntity.mock.calls.length).toBe(1);
        expect(view.activateEntity.mock.calls.length).toBe(0);
    });

    it('should activate entity via dialog', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.activateEntity = jest.fn();
        view.deactivateEntity = jest.fn();
        view.entity = jest.fn();
        view.entity.endDate = '2017-09-14T10:45:20.103Z';
        const tempDialog = jest.fn();
        tempDialog.whenClosed = jest.fn();
        tempDialog.whenClosed.mockImplementationOnce((cb) => cb({ wasCancelled: false }));
        dialogService.open.mockReturnValueOnce(tempDialog);
        view.openConfirm();
        expect(view.deactivateEntity.mock.calls.length).toBe(0);
        expect(view.activateEntity.mock.calls.length).toBe(1);
    });

    it('update an entity', async () => {
        const testId = 'catchMe';
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = { id: 1, legalEntityCode: testId };
        await view.update();
        expect(view.entity.legalEntityCode).not.toBe(DUMMY_DATA.legalEntityCode);
        expect(view.entity.legalEntityCode).toBe(testId);
    });

    it('handle update errr', async () => {
        entityService.update.mockReturnValueOnce(BAD_PROMISE);
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
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

    it('should check update accounts', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity();
        view.accountsGrid = jest.fn();
        view.accountsGrid.setRowData = jest.fn();
        const contact = {
            id: 1,
            surname: 'test',
            givenName: 'user',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.entity.accounts = [
            {
                id: 1,
                surname: 'test',
                givenName: 'user'
            },
            {
                id: 2,
                surname: 'test2',
                givenName: 'user2'
            }
        ];
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view.updateAccounts(contact);
        expect(view.entity.accounts.length).toBe(3);
    });

    it('should check update sites', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity();
        const contact = {
            id: 1,
            surname: 'test',
            givenName: 'user',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.entity.sites = [
            {
                id: 1,
                surname: 'test',
                givenName: 'user'
            },
            {
                id: 2,
                surname: 'test2',
                givenName: 'user2'
            }
        ];
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view.updateSites(contact);
        expect(view.entity.sites.length).toBe(3);
    });

    it('should check update contacts', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity();
        view.contactsGrid = jest.fn();
        view.contactsGrid.setRowData = jest.fn();
        const contact = {
            id: 1,
            surname: 'test',
            givenName: 'user',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.entity.contacts = [
            {
                id: 1,
                surname: 'test',
                givenName: 'user'
            },
            {
                id: 2,
                surname: 'test2',
                givenName: 'user2'
            }
        ];
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view.updateContacts(contact);
        expect(view.entity.contacts.length).toBe(3);
    });

    it('should check update addresses', () => {
        view = new ViewBase(ea, entityService, messenger, router, dialogService, i18n);
        view.entity = new Entity();
        view.addressesGrid = jest.fn();
        view.addressesGrid.setRowData = jest.fn();
        const address = {
            id: 2,
            addressLine1: 'Temple Road',
            city: 'Chennai',
            country: 'India',
            startDate: '14-Sep-2017',
            endDate: null
        };
        view.entity.addresses = [
            {
                id: 1,
                addressLine1: 'Temple Road',
                city: 'Chennai',
                country: 'India',
                startDate: '14-Sep-2017',
                endDate: null
            }
        ];
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        view.updateAddresses(address);
        expect(view.entity.addresses.length).toBe(2);
    });
});
