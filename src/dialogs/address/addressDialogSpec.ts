import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { ReferenceDataService } from '../../services/referenceDataService';
import { AddressDialog } from './addressDialog';

describe('new address dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;
    let validationControllerFactory;
    const DUMMY_COUNTRY = [
        {
            key: 'GB',
            value: 'Great Britain'
        },
        {
            key: 'USA',
            value: 'United States of America'
        }
    ];
    const DUMMY_STATES = [
        {
            key: 'LND',
            value: 'London'
        },
        {
            key: 'OXF',
            value: 'Oxford'
        }
    ];

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        referenceDataService.getCountries = jest.fn();
        referenceDataService.getStates = jest.fn();
        container = new Container().makeGlobal();
        validationControllerFactory = new ValidationControllerFactory(container);
        dialog = new AddressDialog(jest.fn(), validationControllerFactory, referenceDataService,
                    jest.fn(), jest.fn());
        dialog.referenceDataService = referenceDataService;
    });

    it('check get reference data', () => {
        const countries = new Promise((resolve, reject) => {
            resolve(DUMMY_COUNTRY);
        });
        const states = new Promise((resolve, reject) => {
            resolve(DUMMY_COUNTRY);
        });
        referenceDataService.getCountries.mockReturnValue(countries);
        referenceDataService.getStates.mockReturnValue(states);
        dialog.address = {
            isoCountryCode: 'GB'
        };
        dialog.attached();
    });

    it('check pre save address', () => {
        dialog.address = {
            isoCountryCode: 'GB',
            isoStateProvince: 'LND',
            country: 'Unitest States of America',
            stateProvince: 'Texas'
        };
        dialog.countryOptions = DUMMY_COUNTRY;
        dialog.stateOptions = DUMMY_STATES;
        dialog.preSave();
        dialog.submit();
        expect(dialog.address.country).toBe('Great Britain');
        expect(dialog.address.stateProvince).toBe('London');
    });

});
