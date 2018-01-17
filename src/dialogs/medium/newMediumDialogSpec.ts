import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { Medium } from '../../models/medium';
import { NewMediumDialog } from './newMediumDialog';

describe('new medium dialog', () => {
    let container;
    let dialog;
    let component;

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        container = new Container().makeGlobal();
        container.get(DialogController);
        dialog = container.get(NewMediumDialog);
    });

    it('should accept email type', () => {
        const mediumType = 'email';
        const medium = 'work email';
        dialog.activate({ mediumType, medium });
        expect(dialog.localMedium.type).toBe(medium);
        expect(dialog.mediumType).toBe(mediumType);
    });

    it('should accept telephone', () => {
        const mediumType = 'telephone';
        const medium = 'work telephone';
        dialog.activate({ mediumType, medium });
        expect(dialog.localMedium.type).toBe(medium);
        expect(dialog.mediumType).toBe(mediumType);
    });

    it('should accept web url', () => {
        const mediumType = 'url';
        const medium = 'web site';
        dialog.activate({ mediumType, medium });
        expect(dialog.localMedium.type).toBe(medium);
        expect(dialog.mediumType).toBe(mediumType);
    });

    it('should do proper detachment', () => {
        dialog.localMedium.type = 'abc';
        dialog.detached();
        expect(dialog.localMedium.type).toBe('');
    });

    it('should do validation', () => {
        const mediumType = 'Phone';
        const medium = 'work telephone';
        dialog.activate({ mediumType, medium });
        dialog.localMedium.value = '1111111111111';
        dialog.controller.ok = jest.fn();
        // fixme later on assertion
        dialog.done();
    });

});
