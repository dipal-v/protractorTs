import { Container } from 'aurelia-dependency-injection';
import { Widget } from './widget';

describe('table footer', () => {
    let widget;
    let element;

    beforeEach(() => {
        element = jest.fn()
        widget = new Widget(element);
    });

    it('should do trigger', () => {
        element.dispatchEvent = jest.fn();
        widget.triggerEvent('abc');
        expect(element.dispatchEvent.mock.calls[0][0].type).toBe('abc');
    });
});
