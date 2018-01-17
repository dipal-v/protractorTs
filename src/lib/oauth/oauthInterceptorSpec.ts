import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpResponseMessage, RequestMessage } from 'aurelia-http-client';
import { Messenger } from '../../services/messenger';
import { BaseConfig } from './baseConfig';
import { AuthService } from './oauth';
import { AuthInterceptor } from './oauthInterceptor';

describe('auth interceptor request', () => {
    let ea;
    let messenger;
    let authService;
    let authInterceptor;

    beforeEach(() => {
        ea = new EventAggregator();
        messenger = new Messenger(ea);
        const baseConfig = new BaseConfig();
        authService = new AuthService(baseConfig, ea);
        authService.login = jest.fn();
        authInterceptor = new AuthInterceptor(authService, messenger);
        authInterceptor.addApi('');
    });

    it('check the request', () => {
        const request = new RequestMessage('GET', 'http://test.com', "");
        const newRequest = authInterceptor.request(request);
        expect(newRequest.headers.headers.authorization.key).toBe('Authorization');
    });

    it('check the wrong baseurl request', () => {
        const request = new RequestMessage('GET', 'http://test.com', '');
        request.baseUrl = 'http://test1.com';
        const newRequest = authInterceptor.request(request);
        expect(newRequest.headers.headers.authorization).toBeUndefined();
    });

    it('check the response', () => {
        const response = jest.fn();
        const newResponse = authInterceptor.response(response);
        expect(newResponse).toBe(response);
    });

    it('check token expired error', () => {
        const errorResponse = jest.fn();
        errorResponse.statusCode = 401;
        const responseJson = '{"customCode": "E01"}';
        errorResponse.response = responseJson;
        try {
            authInterceptor.responseError(errorResponse);
        } catch (errorResponseReturn) {
            expect(errorResponseReturn).toBe(errorResponse);
            expect(authService.login.mock.calls.length).toBe(1);
        }
    });

    it('check invalid token error', () => {
        const errorResponse = jest.fn();
        errorResponse.statusCode = 401;
        const responseJson = '{"customCode": "E02"}';
        errorResponse.response = responseJson;
        try {
            authInterceptor.responseError(errorResponse);
        } catch (errorResponseReturn) {
            expect(errorResponseReturn).toBe(errorResponse);
            expect(authService.login.mock.calls.length).toBe(1);
        }
    });

    it('check for other error responses', () => {
        const errorResponse = jest.fn();
        errorResponse.statusCode = 402;
        errorResponse.response = '{"message": "Token expire"}';
        try {
            authInterceptor.responseError(errorResponse);
        } catch (errorResponseReturn) {
            expect(errorResponseReturn).toBe(errorResponse);
            expect(authService.login.mock.calls.length).toBe(0);
        }
    });

    it('check for status code 401 but other code', () => {
        const errorResponse = jest.fn();
        errorResponse.statusCode = 401;
        errorResponse.response = '{"customCode": "E00"}';
        try {
            authInterceptor.responseError(errorResponse);
        } catch (errorResponseReturn) {
            expect(errorResponseReturn).toBe(errorResponse);
            expect(authService.login.mock.calls.length).toBe(0);
        }
    });
});
