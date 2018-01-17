import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthenticateStep } from './authenticateStep';
import { BaseConfig } from './baseConfig';
import { AuthService } from './oauth';
import { getFakeJWT } from './fakejwt';

class RoutingContextStub {
    public routes: any[];

    constructor(authorized: boolean) {
        this.routes = [{
            config: {
                route: ['', 'welcome'],
                name: 'welcome',
                title: 'Welcome',
                auth: authorized,
                nav: true,
                settings: {
                    permission: {
                        only: ['AuthenticatedUser']
                    }
                }
            },
            fragment: '.test.'
        }];
    }

    public getAllInstructions() {
        return this.routes;
    }
}

describe('the authentication step', () => {
    let sut;
    let authService;
    let ea;

    beforeEach(() => {
        ea = new EventAggregator();
        authService = new AuthService(new BaseConfig(), ea);
        sut = new AuthenticateStep(authService);
    });

    it('should extract token from url', () => {
        getFakeJWT((err, token) => {
            const routingContext = new RoutingContextStub(true);
            const callback = jest.fn();
            const hash = '#access_token=' + token + '&expires_in=7999';
            callback.cancel = jest.fn();
            sut.getHash = jest.fn();
            sut.getHash.mockReturnValueOnce(hash);
            sut.run(routingContext, callback);
            expect(callback.cancel).toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    it('should get token from cookie', () => {
        getFakeJWT((err, token) => {
            authService.authenticated = false;
            const routingContext = new RoutingContextStub(true);
            const callback = jest.fn();
            callback.cancel = jest.fn();
            sut.getAccessTokenFromCookie = jest.fn();
            sut.getAccessTokenFromCookie.mockReturnValueOnce(token);
            sut.run(routingContext, callback);
            expect(callback.cancel).not.toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();
        });
    });

    it('should redirect to not authorized screen', () => {
        authService.authenticated = false;
        const routingContext = new RoutingContextStub(true);
        const callback = jest.fn();
        callback.cancel = jest.fn();
        sut.getHash = jest.fn();
        sut.getHash.mockReturnValueOnce('#error=access_denied');
        sut.run(routingContext, callback);
        expect(callback.cancel).toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
    });

    it('should redirect to redirect screen', () => {
        authService.authenticated = false;
        const routingContext = new RoutingContextStub(true);
        const callback = jest.fn();
        callback.cancel = jest.fn();
        sut.getHash = jest.fn();
        sut.getHash.mockReturnValueOnce('');
        sut.run(routingContext, callback);
        expect(callback.cancel).toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
    });

    it('should run get hash without problems', () => {
        sut.getHash();
    });
});
