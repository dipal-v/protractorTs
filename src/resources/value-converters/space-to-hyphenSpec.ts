import { SpaceToHyphenValueConverter } from './space-to-hyphen';

describe('the space to hyphen value converter component', () => {

    it('check it converts correctly', () => {
        const sth = new SpaceToHyphenValueConverter();
        let str = sth.toView('space to hyphen');
        expect(str).toBe('space-to-hyphen');
        str = sth.toView('spacetohyphen');
        expect(str).toBe('spacetohyphen');
    });
});
