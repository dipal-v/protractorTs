import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, bindingMode, customElement, inject } from 'aurelia-framework';

/**
 * The Anchor component
 */
@inject(Element, EventAggregator)
@customElement('ag-button-cell-renderer')
@bindable('id')
@bindable('editEvent')
@bindable('deleteEvent')
export class AgButtonCellRenderer {
    /**
     * The Anchor component constructor
     */
    constructor(
        private element: Element,
        private ea: EventAggregator,
        private id: string,
        private editEvent: string,
        private deleteEvent: string) {
        this.element = element;
    }

    /**
     * Send edit event
     */
    public sendEdit(event) {
        this.ea.publish(this.editEvent, { data: this.id });
    }

    /**
     * Send delete event
     */
    public sendDelete(event) {
        this.ea.publish(this.deleteEvent, { data: this.id });
    }

}
