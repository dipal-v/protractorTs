import { EventAggregator } from 'aurelia-event-aggregator';
import { BaseConfig } from '../lib/oauth/baseConfig';
import { AuthService } from '../lib/oauth/oauth';
import { Header } from './header';

describe('header component', () => {

    it('check the class load', () => {
        const ea = new EventAggregator();
        const authService = new AuthService(new BaseConfig(), ea);
        const header = new Header(ea, authService);
    });
});
