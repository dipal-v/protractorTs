import { Container } from 'aurelia-dependency-injection';
import { DatePicker } from './date-picker';

describe('date picker', () => {
    let container;
    let element;

    it('check the class load', () => {
        // Create a global container from the dependency-injection module
        container = new Container().makeGlobal();

        // Register an instance of Element and set it to be a DIV.
        element = container.registerInstance(Element, '<date-picker>');

        const date = new DatePicker(element, '13-09-2001', '12-09-2001');
        date.attached();
        date.startDateChanged();
    });
});
