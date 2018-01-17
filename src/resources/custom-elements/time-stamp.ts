import { bindable, customElement, useView } from 'aurelia-framework';

/**
 * Time Stamp Class
 */
@customElement('time-stamp')
@useView('./time-stamp.html')
@bindable('date')
export class TimeStamp {
}
