import { EventAggregator } from 'aurelia-event-aggregator';
import { BaseConfig } from '../lib/oauth/baseConfig';
import { AuthService } from '../lib/oauth/oauth';
import { AuthInterceptor } from '../lib/oauth/oauthInterceptor';
import { JsonInterceptor } from './jsonInterceptor';
import { LegalEntityApi } from './legalEntityApi';
import { Messenger } from './messenger';
import { ServiceConfig } from './serviceConfig';

const GOOD_DATA = { "Hello": "World" };
const GOOD_PROMISE = new Promise((resolve, reject) => {
    resolve({ response: GOOD_DATA });
});
const ERROR_MESSAGE = 'something went wrong';
const BAD_PROMISE = new Promise((resolve, reject) => {
    reject({ response: `{ "message": "${ERROR_MESSAGE}" }` });
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
        api = new LegalEntityApi(serviceConfig, authInterceptor, jsonInterceptor);
        api.http.get = jest.fn();
        api.http.post = jest.fn();
        api.http.patch = jest.fn();
    });

    it('should get hello world for a get request', async () => {
        api.http.get.mockReturnValueOnce(GOOD_PROMISE);

        const result = await api.get('/entity/legalEntity');
        expect(result).toBe(GOOD_DATA);
    });

    it('should catch errors for a get request', async () => {
        try {
            api.http.get.mockReturnValueOnce(BAD_PROMISE);
            await api.get('/entity/legalEntity');
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        }
    });

    it('should get hello world for a post request', async () => {
        api.http.post.mockReturnValueOnce(GOOD_PROMISE);

        const result = await api.post('/entity/legalEntity', {});
        expect(result).toBe(GOOD_DATA);
    });

    it('should catch errors for a post request', async () => {
        try {
            api.http.post.mockReturnValueOnce(BAD_PROMISE);
            await api.post('/entity/legalEntity', {});
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        };
    });

    it('should get hello world for a patch request', async () => {
        api.http.patch.mockReturnValueOnce(GOOD_PROMISE);
        const result = await api.patch('/entity/legalEntity/1', {})
        expect(result).toBe(GOOD_DATA);
    });

    it('should catch errors for a patch request', async () => {
        try {
            api.http.patch.mockReturnValueOnce(BAD_PROMISE);
            await api.patch('/entity/legalEntity/1', {});
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        };
    });

});
