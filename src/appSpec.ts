import { Container } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { App } from './app';
import { BaseConfig } from './lib/oauth/baseConfig';
import { AuthService } from './lib/oauth/oauth';

class RouterStub {
    private routes;

    public configure(handler) {
        handler(this);
    }

    public map(routes) {
        this.routes = routes;
    }

    public addPipelineStep(stepName, stepClass) {
    }

    public mapUnknownRoutes(instruction) {
    }
}

describe('the App module', () => {
    let sut;
    let mockedRouter;
    let authService;
    let ea;
    let i18n;

    beforeAll(() => {
        const container = new Container().makeGlobal();
        i18n = container.get(I18N);
    });

    beforeEach(() => {
        mockedRouter = new RouterStub();
        ea = new EventAggregator();
        authService = new AuthService(new BaseConfig(), ea);
        sut = new App(authService, i18n);
        sut.configureRouter(mockedRouter, mockedRouter);
    });

    it('contains a router property', () => {
        expect(sut.router).toBeDefined();
    });

    it('should handle a redirect from idAM', () => {
        const instruction = {
            fragment: 'http://blash.bla/#access_token=alalal'
        };
        const route = sut.handleUnknownRoutes(instruction);
        expect(route.name).toBe('organisations');
    });

    it('should handle not found route', () => {
        const instruction = {
            fragment: ''
        };
        const route = sut.handleUnknownRoutes(instruction);
        expect(route.route).toBe('not-found');
    });

});
