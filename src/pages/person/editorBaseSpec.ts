import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { Promise } from 'bluebird';
import { Entity } from '../../models/entity';
import { Medium } from '../../models/medium';
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
    let component;
    let PE;
    let i18n;
    let dialogService;

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
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        dialogService = jest.fn();
        dialogService.open = jest.fn();
        const tmpDialog = jest.fn();
        tmpDialog.whenClosed = jest.fn();
        dialogService.open.mockReturnValueOnce(tmpDialog);
        dialogService.whenClosed = jest.fn();
        PE = new EditorBase(ea, messenger, entityService, router,
            validationControllerFactory, referenceDataService, i18n, dialogService);
        PE.person = new Entity();
    });

    it('should sort medium dropdowns', () => {
        PE.mediumDropdownOptions = [{ value: 'c' }, { value: 'a' }, { value: 'z' }];
        PE.sortMediumDropDownOptions();
        expect(PE.mediumDropdownOptions).toEqual([{ value: 'a' }, { value: 'c' }, { value: 'z' }]);
    });

    it('check get reference data', () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        PE.attached();
        PE.activate({id: 10});
    });

    it('shows medium dialog', () => {
        PE.chosenMediumType = 'work email';
        PE.mediumDropdownOptions.push(
            new Medium({ key: 'email', value: 'work email' })
        );
        PE.mediumDropdownOptions.push(
            new Medium({ key: 'telephone', value: 'work phone' })
        );

        PE.showMediumDialog();
        expect(dialogService.open.mock.calls[0][0].model.medium).toBe(PE.chosenMediumType);
        expect(dialogService.open.mock.calls[0][0].model.mediumType).toBe('email');
    });

    it('updates medium', () => {
        PE.mediumDropdownOptions.push(
            new Medium({ key: 'email', value: 'work email' })
        );
        PE.mediumDropdownOptions.push(
            new Medium({ key: 'telephone', value: 'work phone' })
        );
        PE.mediumsGrid.gridApi = jest.fn();
        PE.mediumsGrid.gridApi.setRowData = jest.fn();

        PE.updateMediums(new Medium({ type: 'work email', value: 'someone@test.com' }));
        expect(PE.mediumDropdownOptions.length).toBe(1);
        expect(PE.mediumDropdownOptions[0].key).toBe('telephone');
    });

    it('deletes a new medium', () => {
        PE.mediumOptions = [
            new Medium({ key: 'email', value: 'work email' }),
            new Medium({ key: 'telephone', value: 'work phone' })
        ];
        PE.mediumDropdownOptions.push(
            new Medium({ key: 'telephone', value: 'work phone' })
        );
        PE.person.details.mediums.push(new Medium({ type: 'work email', value: 'someone@test.com' }));

        // mock data
        PE.mediumsGrid.gridApi = jest.fn();
        PE.mediumsGrid.gridApi.setRowData = jest.fn();

        PE.deleteMedium('work email');
        expect(PE.mediumDropdownOptions.length).toBe(2);
    });

    it('check the model with pre save data', () => {
        PE.person = DUMMY_DATA;
        PE.preSave();
        expect(PE.person.startDate).toBeDefined();
    });
});
