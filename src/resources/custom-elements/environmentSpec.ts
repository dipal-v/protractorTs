import { AureliaConfiguration } from 'aurelia-configuration';
import { Environment } from './environment';

describe('environment', () => {

    it('dev environment', () => {
        const config = new AureliaConfiguration();
        config.setEnvironment('development');
        config.set('name', 'dev');
        config.set('version', '1.0.0');
        config.set('ux', '2.15');
        const environment = new Environment(config);
        expect(environment.name).toBe('dev');
    });

    it('prod environment', () => {
        const config = new AureliaConfiguration();
        config.setEnvironment('production');
        config.set('name', 'prod');
        config.set('version', '1.0.0');
        config.set('ux', '2.15');
        const environment = new Environment(config);
        expect(environment.name).not.toBe('prod');
    });
});
