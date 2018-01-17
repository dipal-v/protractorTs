import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, bindingMode, customElement, inject } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';

/**
 * The Anchor component
 */
export class Widget {
    /**
     * The Anchor component constructor
     */
    constructor(private element: Element) { }

    public triggerEvent(eventName, options?) {
        const e = DOM.createCustomEvent(eventName, { detail: options, bubbles: true });
        this.element.dispatchEvent(e);
    }

}
