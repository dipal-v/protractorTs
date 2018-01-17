import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { ModelObserver } from '../../models/modelObserver';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdatePerson } from './update';

describe('update person model', () => {
    let ea;
    let messenger;
    let entityService;
    let router;
    let updatePerson;
    let validationControllerFactory;
    let i18n;
    let referenceDataService;
    let dialogService;

    const DUMMY_DATA = {
        details: {
            surname: 'test',
            givenName: 'test',
            prefix: 'Mr',
            suffix: 'Jr',
            jobTitle: 'Web Developer',
            mediums: [
                {
                    allowContact: false,
                    type: 'Work Phone',
                    value: '555 555 5555'
                }, {
                    allowContact: true,
                    type: 'Work Email',
                    value: 'me@hotmail.com'
                }
            ],
            preferredContactMedium: 'Email'
        },
        type: 'Person',
        language: 'Danish',
        legalEntityCode: 'LE12',
        startDate: '2017-10-05',
        endDate: '2017-10-12',
        id: 10,
        alias: 'test'
    };

    const GOOD_PROMISE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const VALIDATION_PROMISE = new Promise((resolve, reject) => {
        resolve({ valid: true });
    });
    const TEST_PERSON = { legalEntityCode: 'fine' };

    beforeAll((done) => {
        const component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        dialogService = jest.fn();
        ea = new EventAggregator();
        messenger = jest.fn();
        entityService = jest.fn();
        entityService.getById = jest.fn();
        entityService.update = jest.fn();
        entityService.search = jest.fn();
        router = jest.fn();
        router.navigateToRoute = jest.fn();
        const container = new Container().makeGlobal();
        validationControllerFactory = new ValidationControllerFactory(container);
        const modelObserver = container.get(ModelObserver);
        i18n = container.get(I18N);
        i18n.tr = jest.fn();
        updatePerson = new UpdatePerson(ea, messenger, entityService, router,
            validationControllerFactory, referenceDataService, i18n, dialogService, modelObserver);
        updatePerson.person = TEST_PERSON;
    });

    it('check the model with update data', async () => {
        entityService.update.mockReturnValueOnce(GOOD_PROMISE);
        updatePerson.validate = jest.fn();
        updatePerson.validate.mockReturnValueOnce(VALIDATION_PROMISE);
        router.navigateToRoute = jest.fn();
        updatePerson.preSave = jest.fn();
        await updatePerson.update();
        expect(router.navigateToRoute.mock.calls[0][1]).toEqual({ id: TEST_PERSON['legalEntityCode'] });
    });

    it('check prepare update view', () => {
        updatePerson.prepareView(DUMMY_DATA);
        expect(updatePerson.person.details.mediums.length).toBe(2);
    });

    it('check prepare mediums', () => {
        updatePerson.person = DUMMY_DATA;
        const mediums = [
            {
                key: 'Phone',
                value: 'Home Phone'
            },
            {
                key: 'Phone',
                value: 'Work Phone'
            },
            {
                key: 'Email',
                value: 'Work Email'
            }
        ];
        updatePerson.prepareMediums(mediums);
        expect(updatePerson.mediumDropdownOptions.length).toBe(1);
    });

    it('should cleanse data', () => {
        const testObj = {
            alias: 'a   ',
            details: {
                givenName: 'b  ',
                surname: '      c',
                suffix: '     d ',
                jobTitle: '   e '
            }
        }
        updatePerson.cleanseData(testObj);
        const expected = {
            "alias": "a",
            "details": {
                "givenName": "b",
                "jobTitle": "e",
                "suffix": "d",
                "surname": "c",
            }
        }
        expect(testObj).toEqual(expected);
    });
});
