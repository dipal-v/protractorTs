import { Constants } from '../constants';
import { Site } from './site';

describe('site structure', () => {
    it('can start with nothing', () => {
        const site = new Site();
        expect(site.type).toBe('Aircraft');
        expect(site.country).toBe(Constants.DEFAULT_ISO_COUNTRY_CODE);
    });
});
