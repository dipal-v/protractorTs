import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { AuthInterceptor } from '../lib/oauth/oauthInterceptor';
import { ServiceConfig } from '../services/serviceConfig';
import { JsonInterceptor } from './jsonInterceptor';

/**
 * The Abstract API
 */
@inject(ServiceConfig, AuthInterceptor, JsonInterceptor)
export class LegalEntityApi {
    /**
     * public http client
     */
    public http;

    /**
     * The API end point
     */
    private endPoint: string;

    /**
     * The api constructor
     */
    constructor(
        protected config: ServiceConfig, protected authInterceptor: AuthInterceptor,
        private jsonInterceptor: JsonInterceptor) {
        this.http = new HttpClient();
        this.http.configure((requestConfig) => {
            requestConfig.withHeader('content-type', 'application/json')
                .withHeader('accept', 'application/json')
                .withBaseUrl(this.config.apiHost)
                .withInterceptor(this.authInterceptor)
                .withInterceptor(this.jsonInterceptor);
        });
        this.authInterceptor.addApi(this.config.apiHost);
    }

    /**
     * The get request
     */
    public get(apiPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(apiPath)
                .then((data) => {
                    resolve(data.response);
                })
                .catch((error) => {
                    const json = JSON.parse(error.response);
                    reject(json);
                });
        });
    }

    /**
     * The post request
     */
    public post(apiPath: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(apiPath, payload)
                .then((data) => {
                    resolve(data.response);
                })
                .catch((error) => {
                    const json = JSON.parse(error.response);
                    reject(json);
                });
        });
    }

    /**
     * The patch request
     */
    public patch(apiPath: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.patch(apiPath, payload)
                .then((data) => {
                    resolve(data.response);
                })
                .catch((error) => {
                    const json = JSON.parse(error.response);
                    reject(json);
                });
        });
    }
}
