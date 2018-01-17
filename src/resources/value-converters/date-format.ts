import * as moment from 'moment';

/**
 * Date formatter using moment
 */
export class DateFormatValueConverter {
    /**
     * The Value Converter
     * @param value
     * @param format
     */
    public toView(value, format) {
        if (value) {
            return moment(value).format(format);
        } else {
            return 'N/A';
        }
    }
}
