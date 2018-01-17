import { EventAggregator } from 'aurelia-event-aggregator';
import { BaseConfig } from './baseConfig';
import { getFakeJWT } from './fakejwt';
import { AuthService } from './oauth';

describe('the login', () => {
    let authService;
    let ea;

    beforeEach(() => {
        ea = new EventAggregator();
        authService = new AuthService(new BaseConfig(), ea);
        authService.post = jest.fn();
    });

    it('check get guest user', () => {
        const user = authService.getUser();
        expect(user.firstname).toBe('Guest');
    });

    it('check not authenticated login', () => {
        const user = authService.login();
    });

    it('get access token from url hash', () => {
        getFakeJWT((err, token) => {
            if (err) {
                throw err;
            }
            const hash = '#access_token=' + token + '&expires_in=7999';
            authService.extractAccessToken(hash);
            expect(authService.jwt).toBe(token);
        });
    });

    it('get access token from cookie', () => {
        getFakeJWT((err, token) => {
            if (err) {
                throw err;
            }
            authService.restoreAccessTokenFromCookie(token);
            const accessToken = authService.getToken();
            const user = authService.getUser();
            expect(user.firstname).toBe('Patch');
            expect(accessToken).toBe(token);
        });
    });

});
