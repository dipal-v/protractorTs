import { HttpResponseMessage } from 'aurelia-http-client';
import { JsonInterceptor } from './jsonInterceptor';

describe('auth interceptor request', () => {

    it('check the response', () => {
        const jsonInterceptor = new JsonInterceptor();
        const response = jest.fn();
        response.response = '{"hello": "world"}';
        const newResponse = jsonInterceptor.response(response);
        expect(newResponse).toBe(response);
    });
});
