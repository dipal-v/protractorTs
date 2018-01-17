import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdateSiteDialog } from './updateSiteDialog';

describe('update site dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;
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
        ],
        site: {
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
        }
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
        dialog = container.get(UpdateSiteDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('update site dailog should appear with data', async () => {
        await dialog.activate(DATA);
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
        expect(dialog.site.endDate).toBeNull();
    });

    it('update site dailog should appear with data', async () => {
        DATA.site.endDate = '20-Dec-2017';
        DATA.site.type = 'Vessel';
        await dialog.activate(DATA);
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
        expect(dialog.isAircraft).toBeFalsy();
        expect(dialog.site.endDate).toBeDefined();
    });
});
