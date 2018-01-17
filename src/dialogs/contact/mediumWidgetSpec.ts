import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { I18N } from 'aurelia-i18n';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { validateTrigger, ValidationControllerFactory } from 'aurelia-validation';
import { MediumWidget } from './mediumWidget';

describe('medium widget', () => {
    let widget;
    let element;
    let validationControllerFactory;
    let component;
    let i18n;

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        const container = new Container().makeGlobal();
        validationControllerFactory = new ValidationControllerFactory(container);
        element = container.registerInstance(Element, '<medium-widget>');
        element.dispatchEvent = jest.fn();
        i18n = container.get(I18N);
    });

    it('should add contact as email', () => {
        widget = new MediumWidget(element, validationControllerFactory, i18n, 'Work Email', 'Email');
        widget.getCustomEvent = jest.fn();
        widget.attached();
        widget.addMedium();
        expect(widget.mediumType).toBe('Email');
        expect(widget.medium).toBeDefined();
    });

    it('should add contact as web address', () => {
        widget = new MediumWidget(element, validationControllerFactory, i18n, 'Web Address', 'URL');
        widget.getCustomEvent = jest.fn();
        widget.attached();
        widget.addMedium();
        expect(widget.mediumType).toBe('URL');
        expect(widget.medium).toBeDefined();
    });

    it('should hide contact as phone', () => {
        widget = new MediumWidget(element, validationControllerFactory, i18n, 'Work Phone', 'Phone');
        widget.getCustomEvent = jest.fn();
        widget.attached();
        widget.hideMedium();
        expect(widget.mediumType).toBe('Phone');
        expect(widget.medium).toBeDefined();
    });

    it('should detached contact dialog', () => {
        widget = new MediumWidget(element, validationControllerFactory, i18n, 'Work Phone', 'Phone');
        widget.getCustomEvent = jest.fn();
        widget.attached();
        widget.detached();
        expect(widget.medium).toBeNull();
    });

});
