import {bindable, bindingMode, customElement} from 'aurelia-framework';

/**
 * The Status component
 */
@customElement('status')
@bindable({ name: 'status', attribute: 'data', defaultBindingMode: bindingMode.oneWay})
export class Status {
}
