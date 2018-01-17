import { Container } from 'aurelia-dependency-injection';
import { TableFooter } from './table-footer';

describe('table footer', () => {
    let footer;
    let element;

    beforeEach(() => {
        element = jest.fn();
        footer = new TableFooter(element);
    });

    it('should trigger first page event', () => {
        footer.triggerEvent = jest.fn();
        footer.firstPage('na');
        expect(footer.triggerEvent.mock.calls[0][0]).toBe('first');
    });

    it('should trigger next page event', () => {
        footer.triggerEvent = jest.fn();
        footer.nextPage('na');
        expect(footer.triggerEvent.mock.calls[0][0]).toBe('next');
    });

    it('should trigger previous page event', () => {
        footer.triggerEvent = jest.fn();
        footer.prevPage('na');
        expect(footer.triggerEvent.mock.calls[0][0]).toBe('prev');
    });

    it('should trigger last page event', () => {
        footer.triggerEvent = jest.fn();
        footer.lastPage('na');
        expect(footer.triggerEvent.mock.calls[0][0]).toBe('last');
    });
});
