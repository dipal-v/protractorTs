import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { Entity } from '../../models/entity';
import { Medium } from '../../models/medium';
import { ReferenceDataService } from '../../services/referenceDataService';
import { CreatePerson } from './create';

describe('create person controller', () => {
    let ea;
    let referenceDataService;
    let messenger;
    let entityService;
    let router;
    let creator;

    const DUMMY_DATA = {
        details: {
            surname: 'test',
            givenName: 'test',
            prefix: 'Mr',
            suffix: 'Jr',
            jobTitle: 'Web Developer'
        },
        type: 'Person',
        language: 'Danish',
        legalEntityCode: 'LE12',
        startDate: '2017-10-05',
        endDate: '2017-10-12',
        id: 10,
        alias: 'test'
    };

    beforeAll((done) => {
        const component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        ea = new EventAggregator();
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        const dialogService = jest.fn();
        messenger = jest.fn();
        messenger.error = jest.fn();
        entityService = jest.fn();
        entityService.save = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        const container = new Container().makeGlobal();
        const i18n = container.get(I18N);
        const validationControllerFactory = new ValidationControllerFactory(container);
        const serviceConfig = jest.fn();
        creator = new CreatePerson(ea, messenger, entityService, router,
            validationControllerFactory, referenceDataService, i18n, dialogService);
        creator.person = new Entity();
    });

    it('should validate the model with data', async () => {
        const validationPromise = new Promise((resolve, reject) => {
            resolve({ valid: true });
        });

        const savePromise = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });

        creator.validationController.validate = jest.fn();
        creator.validationController.validate.mockReturnValueOnce(validationPromise);

        entityService.save = jest.fn();
        entityService.save.mockReturnValueOnce(savePromise);
        router.navigateToRoute = jest.fn();

        creator.person = DUMMY_DATA;
        creator.person.alias = '';
        creator.preSave();
        const status = await creator.save();
        expect(router.navigateToRoute.mock.calls.length).toBe(1);
    });

    it('should handle error during saving', async () => {
        const errorMsg = 'failed to save';

        const validationPromise = new Promise((resolve, reject) => {
            resolve({ valid: true });
        });

        const savePromise = new Promise((resolve, reject) => {
            reject({ message: errorMsg });
        });
        try {
            creator.validationController.validate = jest.fn();
            creator.validationController.validate.mockReturnValueOnce(validationPromise);

            entityService.save = jest.fn()

            entityService.save.mockReturnValueOnce(savePromise);
            creator.person = DUMMY_DATA;
            creator.person.alias = '';
            creator.preSave();
            const status = await creator.save();
        } catch (error) {
            expect(error.message).toBe(errorMsg);
        }
    });

    it('should capture validation errors', async () => {
        const errorMsg = 'validation failed';

        const validationPromise = new Promise((resolve, reject) => {
            resolve({ valid: false });
        });

        try {
            creator.validationController.validate = jest.fn();
            creator.validationController.validate.mockReturnValueOnce(validationPromise);

            creator.person = DUMMY_DATA;
            creator.person.alias = '';
            creator.preSave();
            const status = await creator.save();
        } catch (error) {
            expect(error).toBe(errorMsg);
        }
    });

    it('checks attachment', async () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        // fixme later
        await creator.attached();
        expect(creator.prefixes).toBe(DUMMY_DATA);
        expect(creator.languageOptions).toBe(DUMMY_DATA);
    });

});
