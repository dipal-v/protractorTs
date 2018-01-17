import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { ReferenceDataService } from '../../services/referenceDataService';
import { UpdateAccountDialog } from './updateAccountDialog';

describe('update account dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;
    const DATA = {
        contacts: [
            {
                id: 1,
                prefix: 'Mr.',
                givenName: 'Test 1',
                surname: 'User 1'
            },
            {
                id: 2,
                prefix: 'Mrs.',
                givenName: 'Test 2',
                surname: 'User 2'
            }
        ],
        addresses: [
            {
                id: 1,
                addressLine1: 'temple road',
                city: 'Wimbledon',
                stateProvince: 'London'
            },
            {
                id: 2,
                addressLine1: 'city road',
                city: 'Stratford',
                stateProvince: 'London'
            }
        ],
        account: {
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
            endDate: null,
            sites: []
        }
    };

    beforeAll((done) => {
        component = StageComponent.withResources().inView('<div></div>').boundTo({});
        component.bootstrap((aurelia) => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
        component.create(bootstrap).then(done);
    });

    beforeEach(() => {
        referenceDataService = new ReferenceDataService(jest.fn(), jest.fn(), jest.fn());
        referenceDataService.getReferenceData = jest.fn();
        container = new Container().makeGlobal();
        container.get(DialogController);
        dialog = container.get(UpdateAccountDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('update account dailog should appear with data', async () => {
        await dialog.activate(DATA);
        await dialog.attached();
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
        expect(dialog.shippingDetailsGridData.length).toBe(1);
        expect(dialog.account.endDate).toBeNull();
    });

    it('update account dailog should appear with data', async () => {
        DATA.account.endDate = '20-Dec-2017';
        DATA.account.shippingDetails = [];
        await dialog.activate(DATA);
        await dialog.attached();
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
        expect(dialog.shippingDetailsGridData.length).toBe(0);
        expect(dialog.account.endDate).toBeDefined();
    });
});
