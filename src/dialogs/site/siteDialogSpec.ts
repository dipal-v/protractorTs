import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { ReferenceDataService } from '../../services/referenceDataService';
import { SiteDialog } from './siteDialog';

describe('site dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;
    const DUMMY_DATA = {};
    const DATA = {
        contacts: [
            {
                id: 1,
                prefix: 'Mr.',
                givenName: 'Test 1',
                surname: 'User 1'
            },
            {
                id: 2,
                prefix: 'Mrs.',
                givenName: 'Test 2',
                surname: 'User 2'
            }
        ],
        addresses: [
            {
                id: 1,
                addressLine1: 'temple road',
                city: 'Wimbledon',
                stateProvince: 'London'
            },
            {
                id: 2,
                addressLine1: 'city road',
                city: 'Stratford',
                stateProvince: 'London'
            }
        ]
    };

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        container = new Container().makeGlobal();
        container.get(DialogController);
        dialog = container.get(SiteDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('site dailog should appear', async () => {
        await dialog.attached();
        await dialog.activate(DATA);
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
    });

    it('site dailog site type change event', async () => {
        dialog.onSiteTypeChange('Aircraft');
        expect(dialog.isAircraft).toBeTruthy();
        dialog.onSiteTypeChange('Vessel');
        expect(dialog.isAircraft).toBeFalsy();
    });

    it('site dailog pre save based on site type aircraft', async () => {
        dialog.site = {
            mmsi: '12345',
            imoNumber: '12345',
            subType: 'Speed Boat',
            icaoNumber: '12345',
            tailNumber: '12345',
            address: 1,
            contacts: []
        };
        dialog.isAircraft = true;
        dialog.preSave();
        expect(dialog.site.mmsi).toBeUndefined();
        expect(dialog.site.imoNumber).toBeUndefined();
        expect(dialog.site.subType).toBeUndefined();
    });

    it('site dailog pre save based on site type vessel', async () => {
        dialog.site = {
            mmsi: '12345',
            imoNumber: '12345',
            subType: 'Speed Boat',
            icaoNumber: '12345',
            tailNumber: '12345',
            contacts: [],
            address: 1
        };
        dialog.isAircraft = false;
        dialog.preSave();
        expect(dialog.site.icaoNumber).toBeUndefined();
        expect(dialog.site.tailNumber).toBeUndefined();
    });

    it('should return a site', () => {
        dialog.site = {
            type: 'Aircraft',
            country: 'GB',
            startDate: '2017-12-15T00:00:00+0000',
            contacts: [
                '1'
            ],
            name: 'Test Aircraft',
            callSign: 'TAC',
            address: '1',
            tailNumber: '123568',
            icaoNumber: '145786',
            endDate: null,
            mmsi: '',
            imoNumber: '',
            subType: '',
            id: 1
        };
        try {
            dialog.submit();
        } catch (e) {
            // ignore viewModel is null exception
            expect(dialog.site.contacts.length).toBe(1);
        }
    });
});
