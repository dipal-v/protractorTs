import extend from 'extend';

export class ServiceConfig {
    public apiHost = '';

    public corporateApiHost = '';

    public corporateContentEndPoint: string;

    public searchParamsTemplateString = 'field=<%= key %>&value=<%= value %>';

    public legalEntityEndPoint = '';

    public legalEntityContentEndPoint = '';

    public legalEntityTypeEndPoint: string;

    public creditRegionEndPoint: string;

    public invoiceReportLevelEndPoint: string;

    public invoiceFormatEndPoint: string;

    public paymentMethodEndPoint: string;

    public languageEndPoint: string;

    public prefixEndPoint: string;

    public mediumEndPoint: string;

    public organizationTypeEndPoint: string;

    public creditStatusEndPoint: string;

    public serviceLevelAgreementEndPoint: string;

    public countryEndPoint: string;

    public stateEndPoint: string;

    public siteSubTypeEndPoint: string;

    public siteTypeEndPoint: string;

    public configure(incoming: {}) {
        for (const key in incoming) {
            if (incoming.hasOwnProperty(key)) {
                const value = incoming[key];

                if (value !== undefined) {
                    if (Array.isArray(value) || typeof value !== 'object' || value === null) {
                        this[key] = value;
                        if (key === 'legalEntityContentEndPoint') {
                            this.populateContentQuery();
                        }
                        if (key === 'corporateContentEndPoint') {
                            this.populateCorporateContentQuery();
                        }
                    }
                }
            }
        }
    }

    public populateContentQuery() {
        const prefix = this.legalEntityContentEndPoint;
        this.legalEntityTypeEndPoint = prefix + '?type=legalEntityType&concise';
        this.creditRegionEndPoint = prefix + '?type=creditRegion&concise';
        this.organizationTypeEndPoint = prefix + '?type=organisationType&concise';
        this.creditStatusEndPoint = prefix + '?type=creditStatus&concise';
        this.serviceLevelAgreementEndPoint = prefix + '?type=serviceLevelAgreement&concise';
        this.paymentMethodEndPoint = prefix + '?type=paymentMethod&concise';
        this.invoiceFormatEndPoint = prefix + '?type=invoiceFormat&concise';
        this.invoiceReportLevelEndPoint = prefix + '?type=invoiceReportLevel&concise';
        this.siteTypeEndPoint = prefix + '?type=siteType&concise';
        this.siteSubTypeEndPoint = prefix + '?type=vesselSubType&concise';
    }

    public populateCorporateContentQuery() {
        this.languageEndPoint = this.corporateContentEndPoint + '?type=language&concise';
        this.prefixEndPoint = this.corporateContentEndPoint + '?type=prefix&concise';
        this.mediumEndPoint = this.corporateContentEndPoint + '?type=medium&concise';
        this.countryEndPoint = this.corporateContentEndPoint + '?type=country&concise';
        this.stateEndPoint = this.corporateContentEndPoint + '?type=states&concise&country=';
    }

}
