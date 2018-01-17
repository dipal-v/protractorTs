import { Address } from './address';

describe('address model', () => {

    it('can start with nothing', () => {
        const address = new Address();
        expect(address.addressLine1).toBe(undefined);
        expect(address.city).toBe(undefined);
    });

    it('can start with data', () => {
        const data = {
            addressLine1: 'Temple Road',
            city: 'Chennai',
            country: 'India'
        };
        const address = new Address(data);
        expect(address.city).toBe(data.city);
        expect(address.country).toBe(data.country);
        expect(address.addressLine1).toBe(data.addressLine1);
    });
});
