import { bindable, inject } from 'aurelia-framework';
import 'bootstrap-datepicker';
import * as $ from 'jquery';
import * as moment from 'moment';
import { Constants } from '../../../src/constants';

/**
 * Date Picker Class
 */
@inject(Element)
@bindable('value')
@bindable('startDate')
export class DatePicker {
    /**
     * The date format
     */
    private format: string;

    /**
     * Date Picker Constructor
     * @param element
     * @param value
     */
    constructor(private element: Element, private value: string, private startDate: string) {
        this.format = 'dd-M-yyyy';
    }

    /**
     * The attached method
     */
    public attached() {
        let date = new Date();
        if (this.startDate) {
            date = new Date(this.startDate);
        }
        date.setDate(date.getDate());
        $(this.element).find('.datepicker')
            .datepicker({
                format: this.format,
                startDate: date,
                autoclose: true,
                todayBtn: 'linked',
                todayHighlight: true
            })
            .on('changeDate', (e) => {
                this.value = moment(e.date).format(Constants.UI_DATE_FORMAT);
            });
    }

    /**
     * Start Date change method overide
     * @memberof DatePicker
     */
    public startDateChanged() {
        const date = new Date(this.startDate);
        date.setDate(date.getDate());
        $(this.element).find('.datepicker')
            .datepicker('setStartDate', date);
    }
}
