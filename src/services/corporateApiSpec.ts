import { EventAggregator } from 'aurelia-event-aggregator';
import { BaseConfig } from '../lib/oauth/baseConfig';
import { AuthService } from '../lib/oauth/oauth';
import { AuthInterceptor } from '../lib/oauth/oauthInterceptor';
import { CorporateApi } from './corporateApi';
import { JsonInterceptor } from './jsonInterceptor';
import { Messenger } from './messenger';
import { ServiceConfig } from './serviceConfig';

const GOOD_DATA = { "Hello": "World" };
const GOOD_PROMISE = new Promise((resolve, reject) => {
    resolve({ response: GOOD_DATA });
});

describe('the api', () => {
    let api;

    beforeEach(() => {
        const ea = new EventAggregator();
        const messenger = new Messenger(ea);
        const serviceConfig = new ServiceConfig();
        const baseConfig = new BaseConfig();
        const authService = new AuthService(baseConfig, ea);
        const authInterceptor = new AuthInterceptor(authService, messenger);
        const jsonInterceptor = new JsonInterceptor();
        api = new CorporateApi(serviceConfig, authInterceptor, jsonInterceptor);
        api.http.get = jest.fn();
        api.http.post = jest.fn();
        api.http.patch = jest.fn();
    });

    it('should get hello world for a get request', async () => {
        api.http.get.mockReturnValueOnce(GOOD_PROMISE);

        const result = await api.get('/entity/legalEntity')
        expect(result).toBe(GOOD_DATA);
    });
});
