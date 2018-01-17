import { bindable, customAttribute, customElement, inject } from 'aurelia-framework';
import 'bootstrap-switch';
import * as $ from 'jquery';
import { Constants } from '../../../src/constants';

/**
 * The switch button
 */
@inject(Element)
@bindable('checked')
@bindable('disable')
@bindable('offText')
@bindable('onText')
@bindable('onColor')
@bindable('offColor')
@bindable('handleWidth')
@bindable('labelWidth')
export class SwitchButton {

    public OFF_TEXT = 'offText';
    public LABEL_WIDTH = 'labelWidth';
    public HANDLE_WIDTH = 'handleWidth';
    public OFF_COLOR = 'offColor';
    public ON_COLOR = 'onColor';
    public ON_TEXT = 'onText';

    /**
     * Constant for params for Switch button string
     * @private
     * @type {{}}
     * @memberof SwitchButton
     */
    private params: {};

    /**
     * Switch Button Constructor
     * @param element
     * @param checked
     * @param disable
     */
    constructor(
        private element: Element,
        private checked: boolean,
        private disable: boolean, private offText: string,
        private onText: string, private onColor: string,
        private offColor: string, private handleWidth: number,
        private labelWidth: number) {
    }

    /**
     * attached method
     */
    public attached() {
        this.params = this.getParams();
        this.params[Constants.STATE] = this.checked;
        this.params[Constants.DISABLED] = this.disable;
        $(this.element).find('.toggleme').bootstrapSwitch(this.params)
            .on('switchChange.bootstrapSwitch', (event, state) => {
                event.preventDefault();
                this.checked = state;
            });
    }

    /**
     * Override the checked changed method
     */
    public checkedChanged() {
        $(this.element).find('.toggleme').bootstrapSwitch(Constants.DISABLED, false);
        $(this.element).find('.toggleme').bootstrapSwitch(Constants.STATE, this.checked);
        $(this.element).find('.toggleme').bootstrapSwitch(Constants.DISABLED, this.disable);
    }

    /**
     * Override disabled changed method
     */
    public disableChanged() {
        $(this.element).find('.toggleme').bootstrapSwitch(Constants.DISABLED, this.disable);
    }

    private getParams() {
        const params = {};

        if (typeof (this.onText) !== Constants.UNDEFINED) {
            params[this.ON_TEXT] = this.onText;
        }
        if (typeof (this.labelWidth) !== Constants.UNDEFINED) {
            params[this.LABEL_WIDTH] = this.labelWidth;
        }
        if (typeof (this.handleWidth) !== Constants.UNDEFINED) {
            params[this.HANDLE_WIDTH] = this.handleWidth;
        }
        if (typeof (this.offColor) !== Constants.UNDEFINED) {
            params[this.OFF_COLOR] = this.offColor;
        }
        if (typeof (this.onColor) !== Constants.UNDEFINED) {
            params[this.ON_COLOR] = this.onColor;
        }
        if (typeof (this.offText) !== Constants.UNDEFINED) {
            params[this.OFF_TEXT] = this.offText;
        }
        return params;
    }

}
