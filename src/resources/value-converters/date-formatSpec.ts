import { DateFormatValueConverter } from './date-format';

describe('date format converter', () => {
    let converter;

    beforeEach(() => {
        converter = new DateFormatValueConverter();
    });

    it('should convert a time stamp', () => {
        const value = converter.toView('2006-12-01T09:45:20.103Z', 'd-MMM-YYYY HH:mm:ss UTC');
        expect(value).toEqual('5-Dec-2006 09:45:20 UTC');
    });

    it('should handle null value', () => {
        const value = converter.toView(null, 'd-MMM-YYYY HH:mm:ss UTC');
        expect(value).toEqual('N/A');
    });
});
