import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { Promise } from 'bluebird';
import { Entity } from '../../models/entity';
import { ReferenceDataService } from '../../services/referenceDataService';
import { EditorBase } from './editorBase';

describe('entity model', () => {
    let ea;
    let referenceDataService;
    let messenger;
    let entityService;
    let router;
    let container;
    let validationControllerFactory;
    let serviceConfig;
    let component;
    let EE;
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

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        ea = new EventAggregator();
        messenger = jest.fn();
        messenger.error = jest.fn();
        entityService = jest.fn();
        entityService.search = jest.fn();
        router = jest.fn();
        container = new Container().makeGlobal();
        i18n = container.get(I18N);
        validationControllerFactory = new ValidationControllerFactory(container);
        serviceConfig = jest.fn();
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), serviceConfig);
        referenceDataService.getReferenceData = jest.fn();
        EE = new EditorBase(ea, messenger, entityService, router, serviceConfig,
            validationControllerFactory, referenceDataService, i18n);
        EE.entity = new Entity();
    });

    it('check the get entities by primary name', () => {
        const entities = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        entityService.search.mockReturnValueOnce(entities);
        EE.getEntittiesByPrimaryName('test', 10);
    });

    it('check get reference data', () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        EE.attached();
    });

    it('check the model with pre save data', () => {
        EE.entity = DUMMY_DATA;
        EE.preSave();
        expect(EE.entity.startDate).toBeDefined();
    });
});
