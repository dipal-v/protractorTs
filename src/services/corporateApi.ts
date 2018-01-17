import { inject } from 'aurelia-framework';
import { AuthInterceptor } from '../lib/oauth/oauthInterceptor';
import { ServiceConfig } from '../services/serviceConfig';
import { JsonInterceptor } from './jsonInterceptor';
import { LegalEntityApi } from './legalEntityApi';

/**
 * Corporate API
 * @export
 * @class CorporateApi
 * @extends {Api}
 */
@inject(ServiceConfig, AuthInterceptor, JsonInterceptor)
export class CorporateApi extends LegalEntityApi {
    /**
     * The api constructor
     */
    constructor(
        config: ServiceConfig, authInterceptor: AuthInterceptor,
        jsonInterceptor: JsonInterceptor) {
        super(config, authInterceptor, jsonInterceptor);
        this.http.configure((requestConfig) => {
            requestConfig.withBaseUrl(this.config.corporateApiHost);
        });
        this.authInterceptor.addApi(this.config.corporateApiHost);
    }
}
