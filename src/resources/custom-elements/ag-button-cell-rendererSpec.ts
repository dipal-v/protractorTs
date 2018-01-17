import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AgButtonCellRenderer } from './ag-button-cell-renderer';

describe('ag button cell renderer', () => {
    let container;
    let element;
    let ea;
    let renderer;

    beforeEach(() => {
        ea = new EventAggregator();
        // Create a global container from the dependency-injection module
        container = new Container().makeGlobal();

        // Register an instance of Element and set it to be a DIV.
        element = container.registerInstance(Element, '<ag-button-cell-renderer>');

        renderer = new AgButtonCellRenderer(element, ea, 'id', 'edit', 'delete');
    });

    it('check edit event', () => {
        ea.subscribe('edit', (data) => {
            expect(data.data).toBe('id');
        });
        renderer.sendEdit(null);
    });

    it('check delete event', () => {
        ea.subscribe('delete', (data) => {
            expect(data.data).toBe('id');
        });
        renderer.sendDelete(null);
    });
});
