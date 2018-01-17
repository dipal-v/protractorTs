import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { Account } from 'models/account';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Messenger } from '../../services/messenger';
import { ReferenceDataService } from '../../services/referenceDataService';

@inject(DialogController, ValidationControllerFactory, ReferenceDataService, Messenger, EventAggregator)
export class AccountDialog {

    public validationController = null;

    public isUpdate = false;

    protected shippingDetailsGrid: AureliaGrid;

    protected contacts = [];

    protected addresses = [];

    protected sites = [];

    protected shippingDetailsGridData = [];

    protected paymentMethodOptions;

    protected accountTypeOptions;

    protected invoiceReportLevelOptions;

    protected invoiceFormatOptions;

    protected account: Account;

    protected dialogData;

    private showShippingDetails = false;

    constructor(
        private controller, private validationFactory: ValidationControllerFactory,
        protected referenceDataService: ReferenceDataService, protected messenger: Messenger,
        private ea: EventAggregator) {
            this.shippingDetailsGrid = new AureliaGrid();
            this.shippingDetailsGrid.addCellClickWithoutRouter();
            this.shippingDetailsGrid.gridOptions.pagination = false;
            ValidationRules
                .ensure('postingAccount').required()
                .ensure('type').required()
                .ensure('post').required()
                .ensure('name').required()
                .ensure('invoiceReportLevel').required()
                .ensure('invoiceFormat').required()
                .ensure('statementIndicator').required()
                .ensure('billingAddress').required()
                .ensure('billingContact').required()
                .ensure('invoicePrintPriority').required()
                .ensure('startDate').required()
                .on(Account);
            this.validationController = this.validationFactory.createForCurrentScope();
            this.validationController.validateTrigger = validateTrigger.manual;
            this.validationController.addRenderer(new BootstrapValidationRenderer());
        }

    public async attached() {
        this.account = new Account();
        await this.loadRefereceData();
    }

    public async loadRefereceData() {
        this.setContacts(this.dialogData.contacts);
        this.setAddresses(this.dialogData.addresses);
        this.sites = this.dialogData.sites;
        try {
            this.paymentMethodOptions = await this.referenceDataService.getPaymentMethods();
            this.invoiceReportLevelOptions = await this.referenceDataService.getInvoiceReportLevels();
            this.invoiceFormatOptions = await this.referenceDataService.getInvoiceFormats();
            this.accountTypeOptions = Constants.ACCOUNT_TYPES;
        } catch (err) {
            this.messenger.error(err.message);
        }
    }

    public activate(data) {
        this.dialogData = data;
        this.ea.subscribe('deleteShippingDetail', (shippingDetailId) => {
            this.deleteShippingDetail(shippingDetailId);
        });
    }

    public addShippingDetails() {
        this.showShippingDetails = true;
    }

    public deleteShippingDetail(data) {
        this.account.shippingDetails = _.filter(this.account.shippingDetails, (s) => {
            return `${s.address.toString()},${s.contact.toString()}` !== data.data.toString();
        });
        this.shippingDetailsGridData = _.filter(this.shippingDetailsGridData, (s) => {
            return s.id.toString() !== data.data.toString();
        });
        this.shippingDetailsGrid.setRowData(this.shippingDetailsGridData);
    }

    public addShippingDetail() {
        this.showShippingDetails = false;
        this.addShippingDetailRow();
    }

    public addShippingDetailRow() {
        const contact = _.find(this.contacts, (c) => {
            return c.key.toString() === this.account.shippingContact.toString();
        });
        const address = _.find(this.addresses, (a) => {
            return a.key.toString() === this.account.shippingAddress.toString();
        });
        const list = _.filter(this.account.shippingDetails, (s) => {
            return `${s.address.toString()},${s.contact.toString()}` ===
            `${address.key.toString()},${contact.key.toString()}`;
        });
        if (list.length <= 0) {
            this.shippingDetailsGridData.push({
                contact: contact.value,
                address: address.value,
                id: `${this.account.shippingAddress},${this.account.shippingContact}`
            });
            this.account.shippingDetails.push({
                contact: +(contact.key),
                address: +(address.key)
            });
            this.shippingDetailsGrid.setRowData(this.shippingDetailsGridData);
        }
    }

    public setContacts(contacts) {
        for (const contact of contacts) {
            this.contacts.push({
                key: contact.id,
                value: `${contact.prefix} ${contact.givenName} ${contact.surname}`
            });
        }
    }

    public setAddresses(addresses) {
        for (const address of addresses) {
            this.addresses.push({
                key: address.id,
                value: `${address.addressLine1} ${address.city} ${address.stateProvince}`
            });
        }
    }

    public preSave() {
        this.account.billingAddress = +(this.account.billingAddress);
        this.account.billingContact = +(this.account.billingContact);
        if (this.account.sites && this.account.sites.length > 0) {
            this.account.sites = this.account.sites.map(Number);
        }
    }

    public async submit() {
        const verdict = await this.validationController.validate();
        if (verdict.valid) {
            this.preSave();
            this.controller.ok(this.account);
        }
    }

}
