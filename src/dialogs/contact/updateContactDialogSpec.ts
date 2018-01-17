import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Medium } from '../../models/medium';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdateContactDialog } from './updateContactDialog';

describe('update contact dialog', () => {
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
        dialog = container.get(UpdateContactDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('check get reference data', () => {
        const good = new Promise((resolve, reject) => {
            resolve({});
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        dialog.activate({
            givenName: 'test',
            surname: 'user',
            endDate: '2017-09-14T10:45:20.103Z'
        });
        expect(dialog.contact.givenName).toBe('test');
    });

    it('check prepare mediums', () => {
        dialog.contact.mediums = [
            {
                allowContact: false,
                type: 'Work Phone',
                value: '555 555 5555'
            }, {
                allowContact: true,
                type: 'Work Email',
                value: 'me@hotmail.com'
            }
        ];
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
        dialog.prepareMediums(mediums);
        expect(dialog.mediumDropdownOptions.length).toBe(1);
    });
});
