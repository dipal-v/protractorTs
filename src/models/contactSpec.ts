import { Contact } from './contact';

describe('contact model', () => {

    it('can start with nothing', () => {
        const contact = new Contact();
        expect(contact.email).toBe(undefined);
        expect(contact.givenName).toBe(undefined);
    });

    it('can have no medium at start', () => {
        const data = {
            givenName: 'world'
        };
        const contact = new Contact(data);
        expect(contact.email).toBe(undefined);
        expect(contact.givenName).toBe('world');
    });

    it('can start with email', () => {
        const data = {
            givenName: 'world',
            mediums: [{
                allowContact: false,
                type: 'Work Phone',
                value: '555 555 5555'
            }, {
                allowContact: true,
                type: 'Email',
                value: 'me@hotmail.com'
            }]
        };
        const contact = new Contact(data);
        expect(contact.email).toBe('me@hotmail.com');
        expect(contact.telephone).toBe('555 555 5555');
        expect(contact.givenName).toBe('world');
    });
});
