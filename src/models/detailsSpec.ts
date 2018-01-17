import { Details } from './details';

describe('entity model', () => {
    let component;

    it('check the model with organisation data', () => {
        const data = {
            primaryName: 'test',
            legalName: 'test',
            creditRegion: 'APAC',
            type: 'National Account',
            orderingBlock: true,
            deliveryBlock: true,
            postingBlock: true,
            billingBlock: true
        };
        const details = new Details(data);
        expect(details.orderingBlock).toBe(data.orderingBlock);
    });

    it('check the model with person data', () => {
        const data = {
            surname: 'test',
            givenName: 'test',
            prefix: 'Mr',
            suffix: 'Jr',
            jobTitle: 'Web Developer',
            mediums: [
                {
                    allowContact: false,
                    type: 'Work Phone',
                    value: '555 555 5555'
                }, {
                    allowContact: true,
                    type: 'Email',
                    value: 'me@hotmail.com'
                }
            ],
            preferredContactMedium: 'Email'
        };
        const details = new Details(data);
        expect(details.surname).toBe('test');
    });

    it('check the model with data', () => {
        const data = {
            orderingBlock: true
        };
        const details = new Details(data);
        expect(details.orderingBlock).toBe(data.orderingBlock);
    });

    it('check the model with out data', () => {
        const details = new Details();
        expect(details.orderingBlock).toBeFalsy();
        expect(details.mediums.length).toBe(0);
    });

    it('check the model with null data', () => {
        let details = new Details(null);
        expect(details.orderingBlock).toBeFalsy();
        const data = {
            orderingBlock: true
        };
        details = new Details(data);
        expect(details.orderingBlock).toBeTruthy();
    });
});
