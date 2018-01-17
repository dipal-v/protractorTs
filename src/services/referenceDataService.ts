import { inject } from 'aurelia-framework';
import * as _ from 'underscore';
import { Entity } from '../models/entity';
import { CorporateApi } from '../services/corporateApi';
import { LegalEntityApi } from '../services/legalEntityApi';
import { ServiceConfig } from '../services/serviceConfig';

@inject(LegalEntityApi, CorporateApi, ServiceConfig)
export class ReferenceDataService {

    constructor(private legalEntityApi: LegalEntityApi, private corporateApi, private serviceConfig: ServiceConfig) {
    }

    public getLegalEntityTypes() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.legalEntityTypeEndPoint);
    }

    public getCreditRegions() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.creditRegionEndPoint);
    }

    public getOrganizationTypes() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.organizationTypeEndPoint);
    }

    public getCreditStatuses() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.creditStatusEndPoint);
    }

    public getServiceLevelAgreementTypes() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.serviceLevelAgreementEndPoint);
    }

    public getSiteTypes() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.siteTypeEndPoint);
    }

    public getSiteSubTypes() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.siteSubTypeEndPoint);
    }

    public getLanguages() {
        return this.getReferenceData(this.corporateApi, this.serviceConfig.languageEndPoint);
    }

    public getPrefixes() {
        return this.getReferenceData(this.corporateApi, this.serviceConfig.prefixEndPoint);
    }

    public getMediums() {
        return this.getReferenceData(this.corporateApi, this.serviceConfig.mediumEndPoint);
    }

    public getCountries() {
        return this.getReferenceData(this.corporateApi, this.serviceConfig.countryEndPoint);
    }

    public getStates(countryCode: string) {
        return this.getReferenceData(this.corporateApi, `${this.serviceConfig.stateEndPoint}${countryCode}`);
    }

    public getPaymentMethods() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.paymentMethodEndPoint);
    }

    public getInvoiceReportLevels() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.invoiceReportLevelEndPoint);
    }

    public getInvoiceFormats() {
        return this.getReferenceData(this.legalEntityApi, this.serviceConfig.invoiceFormatEndPoint);
    }

    private async getReferenceData(legalEntityApi: LegalEntityApi, endpoint: string) {
        const data = await legalEntityApi.get(endpoint);
        const transformed = [];
        const ignoredKeys = ['type', 'country'];
        data.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (ignoredKeys.indexOf(key) === -1) {
                    transformed.push({
                        key,
                        value: item[key]
                    });
                }
            });
        });
        return transformed;
    }
}
