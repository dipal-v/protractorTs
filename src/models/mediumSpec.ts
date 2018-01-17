import { Medium } from './medium';

describe('medium model', () => {
    it('should initialize', () => {
        const data = {
            type: 'abc',
            value: 'a',
            allowContact: false
        };
        const medium = new Medium(data);
        expect(medium.type).toBe(data.type);
        expect(medium.value).toBe(data.value);
        expect(medium.allowContact).toBe(false);
    });
});
