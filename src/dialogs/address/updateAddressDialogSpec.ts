import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdateAddressDialog } from './updateAddressDialog';

describe('update address dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;

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
        dialog = container.get(UpdateAddressDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('check get reference data', () => {
        const good = new Promise((resolve, reject) => {
            resolve({});
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        dialog.activate({
            addressLine1: 'Temple Road',
            city: 'Chennai',
            country: 'India'
        });
        expect(dialog.address.city).toBe('Chennai');
    });

    it('check get end date null', () => {
        const good = new Promise((resolve, reject) => {
            resolve({});
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        dialog.activate({
            addressLine1: 'Temple Road',
            city: 'Chennai',
            country: 'India',
            endDate: null
        });
        expect(dialog.address.city).toBe('Chennai');
    });
});
