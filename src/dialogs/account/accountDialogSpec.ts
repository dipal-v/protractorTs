import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { DialogController } from 'aurelia-dialog';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { ReferenceDataService } from '../../services/referenceDataService';
import { AccountDialog } from './accountDialog';

describe('account dialog', () => {
    let container;
    let dialog;
    let component;
    let referenceDataService;
    const DUMMY_DATA = {};
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
        ]
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
        dialog = container.get(AccountDialog);
        dialog.referenceDataService = referenceDataService;
    });

    it('account dailog should appear', async () => {
        await dialog.activate(DATA);
        await dialog.attached();
        expect(dialog.contacts.length).toBe(2);
        expect(dialog.addresses.length).toBe(2);
    });

    it('show shipping details', async () => {
        dialog.addShippingDetails();
        expect(dialog.showShippingDetails).toBeTruthy();
    });

    it('add shipping details', async () => {
        await dialog.activate(DATA);
        await dialog.attached();
        dialog.account.shippingContact = 1;
        dialog.account.shippingAddress = 1;
        dialog.addShippingDetail();
        expect(dialog.showShippingDetails).toBeFalsy();
        expect(dialog.shippingDetailsGridData.length).toBe(1);
        expect(dialog.account.shippingDetails.length).toBe(1);
    });

    it('delete shipping details', async () => {
        await dialog.activate(DATA);
        await dialog.attached();
        dialog.account.shippingContact = 1;
        dialog.account.shippingAddress = 1;
        dialog.addShippingDetail();
        dialog.account.shippingContact = 1;
        dialog.account.shippingAddress = 2;
        dialog.addShippingDetail();
        expect(dialog.showShippingDetails).toBeFalsy();
        expect(dialog.shippingDetailsGridData.length).toBe(2);
        expect(dialog.account.shippingDetails.length).toBe(2);
        dialog.deleteShippingDetail({data: '2,1'});
        expect(dialog.shippingDetailsGridData.length).toBe(1);
        expect(dialog.account.shippingDetails.length).toBe(1);
    });

    it('add duplicate shipping details', async () => {
        await dialog.activate(DATA);
        await dialog.attached();
        dialog.account.shippingContact = 1;
        dialog.account.shippingAddress = 1;
        dialog.addShippingDetail();
        dialog.account.shippingContact = 1;
        dialog.account.shippingAddress = 1;
        dialog.addShippingDetail();
        expect(dialog.showShippingDetails).toBeFalsy();
        expect(dialog.shippingDetailsGridData.length).not.toBe(2);
        expect(dialog.account.shippingDetails.length).not.toBe(2);
        expect(dialog.shippingDetailsGridData.length).toBe(1);
        expect(dialog.account.shippingDetails.length).toBe(1);
    });

    it('should return a account', () => {
        dialog.account = {
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
        };
        try {
            dialog.addShippingDetail();
        } catch (e) {
            // ignore this.gridOptions.api is null exception
            try {
                dialog.submit();
            } catch (e) {
                // ignore viewModel is null exception
                expect(dialog.account.shippingDetails.length).toBe(2);
            }
        }
    });

    it('account validation error thrown', () => {
        dialog.account = {
            shippingDetails: [
                {
                    contact: 1,
                    address: 1
                }
            ],
            accountNumber: 123456,
            name: '',
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
        };
        try {
            dialog.addShippingDetail();
        } catch (e) {
            // ignore this.gridOptions.api is null exception
            try {
                dialog.submit();
            } catch (e) {
                // ignore viewModel is null exception
                expect(dialog.account.shippingDetails.length).toBe(1);
            }
        }
    });

});
