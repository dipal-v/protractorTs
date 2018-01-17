import { NotAuthorized } from './not-authorized';

describe('not authorized error', () => {

    it('check the class load', () => {
        const notAuthorized = new NotAuthorized();
        const title = 'Error: Not Authorized';
        const message = 'You are not authorized to either view the page you navigated to, ' +
            'or perform the function you attempted. Please return to the previous screen.';
        expect(notAuthorized.title).toEqual(title);
        expect(notAuthorized.message).toEqual(message);
    });
});
