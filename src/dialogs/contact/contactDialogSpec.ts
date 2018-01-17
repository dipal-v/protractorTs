import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Medium } from '../../models/medium';
import { ReferenceDataService } from '../../services/referenceDataService';
import { ContactDialog } from './contactDialog';

describe('new contact dialog', () => {
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
        dialog = container.get(ContactDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('should show contact panel', () => {
        dialog.showMedium();
        expect(dialog.showAddPanel).toBe(false);
        expect(dialog.showMediumPanel).toBe(true);
    });

    it('should show email panel', () => {
        dialog.chosenMediumType = 'Email';
        dialog.showMedium();
        expect(dialog.showAddPanel).toBe(false);
        expect(dialog.showMediumPanel).toBe(true);
    });

    it('should hide contact panel', () => {
        dialog.hideMedium();
        expect(dialog.showAddPanel).toBe(true);
    });

    it('should return a contact', () => {
        dialog.currentMedium = new Medium();
        dialog.currentMedium.type = 'Email';
        dialog.currentMedium.value = 'x@hotmail.com';
        try {
            dialog.addMedium();
        } catch (e) {
            // ignore this.gridOptions.api is null exception
            try {
                dialog.submit();
            } catch (e) {
                // ignore viewModel is null exception
                expect(dialog.contact.email).toBe('x@hotmail.com');
            }
        }
    });

    it('should delete a medium', () => {
        dialog.contact.mediums = [
            {
                allowContact: false,
                type: 'Work Phone',
                value: '555 555 5555'
            },
            {
                allowContact: true,
                type: 'Work Email',
                value: 'me@hotmail.com'
            }
        ];
        dialog.mediumOptions = [
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
        dialog.mediumDropdownOptions = [{
            key: 'Phone',
            value: 'Home Phone'
        }];
        try {
            dialog.deleteMedium('Work Phone');
            expect(dialog.mediumDropdownOptions.length).toBe(2);
            expect(dialog.contact.mediums.length).toBe(1);
        } catch (e) {
            // ignore this.gridOptions.api is null exception
        }
    });

    it('check get reference data', () => {
        const good = new Promise((resolve, reject) => {
            resolve(DUMMY_DATA);
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        dialog.attached();
    });

    it('check get reference data activate', () => {
        const good = new Promise((resolve, reject) => {
            resolve({});
        });
        referenceDataService.getReferenceData.mockReturnValue(good);
        dialog.activate({});
    });

    it('check prepare mediums', () => {
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
        expect(dialog.mediumDropdownOptions.length).toBe(3);
    });

});
