import { DialogService } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import { SiteDialog } from 'dialogs/site/siteDialog';
import { UpdateSiteDialog } from 'dialogs/site/updateSiteDialog';
import { Site } from 'models/site';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { Confirm } from '../../components/modal/confirm';
import { Constants } from '../../constants';
import { AccountDialog } from '../../dialogs/account/accountDialog';
import { UpdateAccountDialog } from '../../dialogs/account/updateAccountDialog';
import { AddressDialog } from '../../dialogs/address/addressDialog';
import { UpdateAddressDialog } from '../../dialogs/address/updateAddressDialog';
import { ContactDialog } from '../../dialogs/contact/contactDialog';
import { UpdateContactDialog } from '../../dialogs/contact/updateContactDialog';
import { Account } from '../../models/account';
import { Address } from '../../models/address';
import { Contact } from '../../models/contact';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';

@inject(EventAggregator, EntityService, Messenger, Router, DialogService, I18N)
export class ViewBase {
    protected id: string;

    protected entity: Entity;

    protected contactsGrid: AureliaGrid;

    protected accountsGrid: AureliaGrid;

    protected addressesGrid: AureliaGrid;

    protected sitesGrid: AureliaGrid;

    protected routeOptions;

    protected initDataLoaded = false;
    protected viewPage;

    private updateContactSubscriber;
    private updateAccountSubscriber;
    private updateAddressSubscriber;
    private updateSiteSubscriber;

    constructor(
        protected ea: EventAggregator,
        protected entityService: EntityService,
        protected messenger: Messenger,
        protected router: Router, protected dialogService: DialogService, protected i18n: I18N) {
        this.routeOptions = { Organisation: Constants.VIEW_ORGANISATION, Person: Constants.VIEW_PERSON };
        this.contactsGrid = this.createSubEntityGrid();
        this.accountsGrid = this.createSubEntityGrid();
        this.addressesGrid = this.createSubEntityGrid();
        this.sitesGrid = this.createSubEntityGrid();
    }

    public createSubEntityGrid() {
        const grid = new AureliaGrid();
        grid.addCellClickWithoutRouter();
        grid.setPageSize(Constants.DEFAULT_SUB_ENTITY_PAGE_SIZE);
        return grid;
    }

    public activate(params) {
        this.id = params.id;
    }

    public async attached() {
        try {
            const data = await this.entityService.getById(this.id);
            this.entity = new Entity(data);
            this.contactsGrid.setRowData(this.entity.contacts);
            this.accountsGrid.setRowData(this.entity.accounts);
            this.addressesGrid.setRowData(this.entity.addresses);
            this.sitesGrid.setRowData(this.entity.sites);
            this.initDataLoaded = true;
        } catch (error) {
            this.messenger.error(error);
        }
        this.updateContactSubscriber = this.ea.subscribe('updateContact', (data) => {
            this.getContact(data);
        });
        this.updateAccountSubscriber = this.ea.subscribe('updateAccount', (data) => {
            this.getAccount(data);
        });
        this.updateAddressSubscriber = this.ea.subscribe('updateAddress', (data) => {
            this.getAddress(data);
        });
        this.updateSiteSubscriber = this.ea.subscribe('updateSite', (data) => {
            this.getSite(data);
        });
    }

    public detached() {
        this.updateContactSubscriber.dispose();
        this.updateAccountSubscriber.dispose();
        this.updateAddressSubscriber.dispose();
        this.updateSiteSubscriber.dispose();
    }

    public deactivateEntity() {
        this.activateOrDeactivateEntity(moment().utc().format(Constants.UTC_DATE_FORMAT));
    }

    public async update(patchEntity) {
        try {
            const entity = await this.entityService.update(patchEntity);
            if (this.entity) {
                this.router.navigateToRoute(this.viewPage, { id: this.entity.legalEntityCode });
            }
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public activateEntity() {
        this.activateOrDeactivateEntity(null);
    }

    public activateOrDeactivateEntity(date) {
        this.entity.endDate = date;
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            endDate: this.entity.endDate
        };
        this.update(patchEntity);
    }

    public openConfirm() {
        const activateString = (this.entity.endDate !== null ? this.i18n.tr('dialogs.confirm.activate') :
            this.i18n.tr('dialogs.confirm.deactivate'));
        const modal = {
            heading: this.i18n.tr('dialogs.confirm.heading'),
            body: `${this.i18n.tr('dialogs.confirm.yes')} ${activateString}`
        };
        this.dialogService.open({ viewModel: Confirm, model: modal }).whenClosed((response) => {
            if (!response.wasCancelled) {
                if (this.entity.endDate !== null) {
                    this.activateEntity();
                } else {
                    this.deactivateEntity();
                }
            }
        });
    }

    public preSave(obj) {
        obj.startDate = moment(obj.startDate).utc().format(Constants.UTC_DATE_FORMAT);
        if (obj.endDate) {
            obj.endDate = moment(obj.endDate).utc().format(Constants.UTC_DATE_FORMAT);
        } else {
            obj.endDate = null;
        }
    }

    // Site Methods
    public getSite(data) {
        const dialogSite = _.find(this.entity.sites, (c) => {
            return c.id.toString() === data.data;
        });
        const dialogData = {
            contacts: this.entity.contacts,
            addresses: this.entity.addresses,
            site: dialogSite
        };
        this.updateSite(dialogData);
    }

    public addSite() {
        const data = {
            contacts: this.entity.contacts,
            addresses: this.entity.addresses
        };
        this.dialogService.open({
            viewModel: SiteDialog,
            model: data
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.updateSites(response.output);
            }
        });
    }

    public updateSite(data) {
        this.dialogService.open({
            viewModel: UpdateSiteDialog,
            model: data ? data : null
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.entity.sites = _.filter(this.entity.sites, (c) => {
                    return c.id !== response.output.id;
                });
                this.updateSites(response.output);
            }
        });
    }

    public updateSites(data) {
        this.preSave(data);
        const site = new Site(data);
        if (this.entity.sites) {
            this.entity.sites.push(site);
        } else {
            this.entity.sites = [site];
        }
        this.sitesGrid.setRowData(this.entity.sites);
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            sites: this.entity.sites
        };
        this.update(patchEntity);
    }

    // Contact Methods
    public getContact(data) {
        const contact = _.find(this.entity.contacts, (c) => {
            return c.id.toString() === data.data;
        });
        this.updateContact(contact);
    }

    public addContact() {
        this.dialogService.open({
            viewModel: ContactDialog
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.updateContacts(response.output);
            }
        });
    }

    public updateContact(data) {
        this.dialogService.open({
            viewModel: UpdateContactDialog,
            model: data ? data : null
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.entity.contacts = _.filter(this.entity.contacts, (c) => {
                    return c.id !== response.output.id;
                });
                this.updateContacts(response.output);
            }
        });
    }

    public updateContacts(data) {
        this.preSave(data);
        const contact = new Contact(data);
        if (this.entity.contacts) {
            this.entity.contacts.push(contact);
        } else {
            this.entity.contacts = [contact];
        }
        this.contactsGrid.setRowData(this.entity.contacts);
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            contacts: this.entity.contacts
        };
        this.update(patchEntity);
    }

    // Account Methods
    public getAccount(data) {
        const dialogAccount = _.find(this.entity.accounts, (c) => {
            return c.accountNumber.toString() === data.data;
        });
        const dialogData = {
            contacts: this.entity.contacts,
            addresses: this.entity.addresses,
            sites: this.entity.sites,
            account: dialogAccount
        };
        this.updateAccount(dialogData);
    }

    public addAccount() {
        const data = {
            contacts: this.entity.contacts,
            addresses: this.entity.addresses,
            sites: this.entity.sites
        };
        this.dialogService.open({
            viewModel: AccountDialog,
            model: data
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.updateAccounts(response.output);
            }
        });
    }

    public updateAccount(data) {
        this.dialogService.open({
            viewModel: UpdateAccountDialog,
            model: data ? data : null
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.entity.accounts = _.filter(this.entity.accounts, (c) => {
                    return c.accountNumber !== response.output.accountNumber;
                });
                this.updateAccounts(response.output);
            }
        });
    }

    public updateAccounts(data) {
        this.preSave(data);
        const account = new Account(data);
        if (this.entity.accounts) {
            this.entity.accounts.push(account);
        } else {
            this.entity.accounts = [account];
        }
        this.accountsGrid.setRowData(this.entity.accounts);
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            accounts: this.entity.accounts
        };
        this.update(patchEntity);
    }

    // Address Methods
    public getAddress(data) {
        const address = _.find(this.entity.addresses, (c) => {
            return c.id.toString() === data.data;
        });
        this.updateAddress(address);
    }

    public addAddress() {
        this.dialogService.open({
            viewModel: AddressDialog
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.updateAddresses(response.output);
            }
        });
    }

    public updateAddress(data) {
        this.dialogService.open({
            viewModel: UpdateAddressDialog,
            model: data ? data : null
        }).whenClosed((response) => {
            if (!response.wasCancelled) {
                this.entity.addresses = _.filter(this.entity.addresses, (c) => {
                    return c.id !== response.output.id;
                });
                this.updateAddresses(response.output);
            }
        });
    }

    public updateAddresses(data) {
        this.preSave(data);
        const address = new Address(data);
        if (this.entity.addresses) {
            this.entity.addresses.push(address);
        } else {
            this.entity.addresses = [address];
        }
        this.addressesGrid.setRowData(this.entity.addresses);
        const patchEntity = {
            legalEntityCode: this.entity.legalEntityCode,
            addresses: this.entity.addresses
        };
        this.update(patchEntity);
    }
}
