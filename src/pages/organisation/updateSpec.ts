import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { ModelObserver } from '../../models/modelObserver';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdateOrganisation } from './update';

describe('update entity model', () => {
    let ea;
    let messenger;
    let entityService;
    let router;
    let updateController;
    let validationControllerFactory;
    let referenceDataService;
    let serviceConfig;
    let i18n;

    const DUMMY_DATA = {
        details: {
            primaryName: 'test',
            legalName: 'test',
            creditRegion: 'APAC',
            type: 'National Account'
        },
        type: 'Organisation',
        language: 'Danish',
        legalEntityCode: 'LE12',
        startDate: '2017-10-05',
        endDate: '2017-10-12',
        id: 10,
        alias: 'test',
        parentName: '',
        parentCode: ''
    };
    const GOOD_PROMISE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const ERROR_MESSAGE = 'something wrong happened';
    const BAD_PROMISE = new Promise((resolve, reject) => {
        reject({ message: ERROR_MESSAGE });
    });
    const VALIDATION_PROMISE = new Promise((resolve, reject) => {
        resolve({ valid: true });
    });
    const TEST_ENTITY = { legalEntityCode: 'fine' };

    beforeAll((done) => {
        const component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        ea = new EventAggregator();
        messenger = jest.fn();
        messenger.error = jest.fn();
        entityService = jest.fn();
        entityService.getById = jest.fn();
        entityService.update = jest.fn();
        entityService.search = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        const container = new Container().makeGlobal();
        validationControllerFactory = new ValidationControllerFactory(container);
        const modelObserver = container.get(ModelObserver);
        serviceConfig = jest.fn();
        i18n = container.get(I18N);
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), serviceConfig);
        referenceDataService.getReferenceData = jest.fn();
        updateController = new UpdateOrganisation(ea, messenger, entityService, router, serviceConfig,
            validationControllerFactory, referenceDataService, i18n, modelObserver);
        updateController.entity = TEST_ENTITY;
    });

    it('activate with data id', async () => {
        entityService.getById.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getReferenceData.mockReturnValue(GOOD_PROMISE);
        updateController.prepareView = jest.fn();
        updateController.activate({ id: 10 });
        await updateController.attached();
        expect(updateController.prepareView.mock.calls[0][0]).toBe(DUMMY_DATA);
        expect(messenger.error.mock.calls.length).toBe(0);
    });

    it('activate but failed with message', async () => {
        updateController.messenger.error = jest.fn();
        try {
            entityService.getById.mockReturnValueOnce(BAD_PROMISE);
            updateController.activate({ id: 10 });
            await updateController.attached();
        } catch (error) {
            expect(updateController.messenger.error).toBe({ mesage: ERROR_MESSAGE });
        }
    });

    it('check the model with update data', async () => {
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        updateController.validate = jest.fn();
        updateController.validate.mockReturnValueOnce(VALIDATION_PROMISE);
        router.navigateToRoute = jest.fn();
        updateController.preSave = jest.fn();
        await updateController.update();
        expect(router.navigateToRoute.mock.calls[0][1]).toEqual({ id: TEST_ENTITY['legalEntityCode'] });
    });

    it('check prepare update view', () => {
        DUMMY_DATA.parentCode = '345612';
        DUMMY_DATA.parentName = 'Test';
        updateController.prepareView(DUMMY_DATA);
        expect(updateController.disableStatus).toBeTruthy();
        expect(updateController.entity.parent).toBe('Test - 345612');
    });

    it('check prepare update view when end date is null', () => {
        DUMMY_DATA.endDate = null;
        updateController.prepareView(DUMMY_DATA);
        expect(updateController.disableStatus).toBeFalsy();
    });

    it('should cleanse data', () => {
        const testObj = {
            alias: 'a   ',
            parent: '1 - 2',
            details: {
                primaryName: 'b  ',
                legalName: '      c',
            }
        }
        updateController.cleanseData(testObj);
        const expected = {
            alias: "a",
            details: {
                legalName: "c",
                primaryName: "b",
            },
            parent: "1 - 2",
            parentCode: "2",
            parentName: "1",
        }

        expect(testObj).toEqual(expected);
    });

});
