import { Redirection } from './redirect';

describe('not authorized error', () => {

    it('check the class load', () => {
        const redirect = new Redirection();
        const title = 'Redirection';
        const message = 'You are being redirected for login..';
        expect(redirect.title).toEqual(title);
        expect(redirect.message).toEqual(message);
    });
});
