import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { Entity } from '../../models/entity';
import { CreateOrganisation } from './create';

describe('create organisation controller', () => {
    let ea;
    let referenceDataService;
    let messenger;
    let entityService;
    let router;
    let createLE;
    let container;
    let validationControllerFactory;
    let serviceConfig;
    let component;
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
        endDate: '',
        id: 10,
        alias: 'test',
        parentName: '',
        parentCode: ''
    };
    const GOOD_PROMISE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const VALIDATION_PROMISE = new Promise((resolve, reject) => {
        resolve({ valid: true });
    });
    const TEST_ENTITY = { legalEntityCode: 'fine' };

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        ea = new EventAggregator();
        referenceDataService = jest.fn();
        referenceDataService.getReferenceData = jest.fn();
        referenceDataService.getLegalEntityTypes = jest.fn();
        referenceDataService.getCreditRegions = jest.fn();
        referenceDataService.getLanguages = jest.fn();
        referenceDataService.getOrganizationTypes = jest.fn();
        referenceDataService.getCreditStatuses = jest.fn();
        referenceDataService.getServiceLevelAgreementTypes = jest.fn();
        messenger = jest.fn();
        entityService = jest.fn();
        entityService.save = jest.fn();
        entityService.search = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        container = new Container().makeGlobal();
        i18n = container.get(I18N);
        validationControllerFactory = new ValidationControllerFactory(container);
        serviceConfig = jest.fn();
        createLE = new CreateOrganisation(ea, messenger, entityService, router, serviceConfig,
            validationControllerFactory, referenceDataService, i18n);
        createLE.entity = TEST_ENTITY;
    });

    it('check the model with data', async () => {
        entityService.save.mockReturnValueOnce(GOOD_PROMISE);
        createLE.activate();
        createLE.preSave = jest.fn();
        createLE.validationController.validate = jest.fn();
        createLE.validationController.validate.mockReturnValueOnce(VALIDATION_PROMISE);
        await createLE.save();
        expect(router.navigateToRoute.mock.calls[0][0]).toBe('viewOrganisation');
        expect(router.navigateToRoute.mock.calls[0][1]).toEqual({ id: TEST_ENTITY.legalEntityCode });
    });

    it('check the model with parent', async () => {
        entityService.save.mockReturnValueOnce(GOOD_PROMISE);
        const params = {
            parentName: 'parent',
            parentCode: '123456'
        };
        referenceDataService.getLegalEntityTypes.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getCreditRegions.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getLanguages.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getOrganizationTypes.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getCreditStatuses.mockReturnValueOnce(GOOD_PROMISE);
        referenceDataService.getServiceLevelAgreementTypes.mockReturnValueOnce(GOOD_PROMISE);
        createLE.activate(params);
        await createLE.attached();
        expect(createLE.entity.parent).toBe('parent - 123456');
    });
});
