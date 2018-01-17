import { Entity } from './entity';

describe('entity model', () => {

    it('check the model with data', () => {
        const data = {
            id: 10
        };
        const entity = new Entity(data);
        expect(entity.id).toBe(data.id);
        expect(entity.addresses.length).toBe(0);
        expect(entity.contacts.length).toBe(0);
        expect(entity.accounts.length).toBe(0);
        expect(entity.sites.length).toBe(0);
    });

    it('check the model with out data', () => {
        const entity = new Entity();
        expect(entity.id).toBeUndefined();
    });

    it('check the model with contacts and addresses', () => {
        const data = {
            id: 10,
            contacts: [
                {
                    givenName: 'world 1',
                    surname: 'test 1'
                },
                {
                    givenName: 'world 2',
                    surname: 'test 2'
                }
            ],
            addresses: [
                {
                    addressLine1: 'Temple Road',
                    city: 'Chennai',
                    country: 'India'
                },
                {
                    addressLine1: 'High street',
                    city: 'New York',
                    country: 'USA'
                },
                {
                    addressLine1: 'Westminister Road',
                    city: 'London',
                    country: 'UK'
                }
            ],
            accounts: [
                {
                    post: false,
                    statementIndicator: false,
                    invoicePrintPriority: true,
                    shippingDetails: [
                        {
                            contact: 1,
                            address: 1
                        }
                    ],
                    accountNumber: 123456,
                    name: 'test',
                    postingAccount: 123456,
                    type: 'Payable',
                    paymentMethod: 'Cash',
                    invoiceReportLevel: 'Invoice',
                    invoiceFormat: 'Summary',
                    comments: 'Test comments',
                    billingAddress: 1,
                    billingContact: 1,
                    startDate: '20-Dec-2017',
                    shippingAddress: '1',
                    shippingContact: '2'
                },
                {
                    post: false,
                    statementIndicator: false,
                    invoicePrintPriority: true,
                    shippingDetails: [
                        {
                            contact: 2,
                            address: 2
                        }
                    ],
                    accountNumber: 123456,
                    name: 'test',
                    postingAccount: 123456,
                    type: 'Payable',
                    paymentMethod: 'Cash',
                    invoiceReportLevel: 'Invoice',
                    invoiceFormat: 'Summary',
                    comments: 'Test comments',
                    billingAddress: 1,
                    billingContact: 1,
                    startDate: '20-Dec-2017',
                    shippingAddress: '2',
                    shippingContact: '1'
                }
            ],
            sites: [
                {
                    type: 'Aircraft',
                    country: 'GB',
                    startDate: '2017-12-15T00:00:00+0000',
                    contacts: [
                        'undefined',
                        '1'
                    ],
                    name: 'Test Aircraft',
                    callSign: 'TAC',
                    address: '1',
                    tailNumber: '123568',
                    icaoNumber: '145786',
                    endDate: null,
                    mmsi: '',
                    imoNumber: '',
                    subType: '',
                    id: 1
                }
            ]
        };
        const entity = new Entity(data);
        expect(entity.id).toBe(data.id);
        expect(entity.addresses.length).toBe(3);
        expect(entity.contacts.length).toBe(2);
        expect(entity.accounts.length).toBe(2);
        expect(entity.sites.length).toBe(1);
    });

});
