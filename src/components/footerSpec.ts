import { Footer } from './footer';

describe('footer component', () => {

    it('check the class load', () => {
        let footer = new Footer();
        footer.attached();
        footer.detached();
    });
});
