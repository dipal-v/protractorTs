import {Container} from 'aurelia-dependency-injection';
import {BaseConfig} from './baseConfig';

type ConfigurationCallBack = (config: {} ) => any;

/**
 * Open Authentication Module
 *
 * It handles the following oauth behaviors:
 * 1. initial login
 * 2. acces token validation
 * 3. re-gain the access token
 *
 */
export function configure(frameworkConfig: { container: Container, globalResources: (...resources: string[]) => any },
                          config: {} | ConfigurationCallBack) {
    const baseConfig = frameworkConfig.container.get(BaseConfig);

    if (typeof config === 'function') {
        config(baseConfig);
    } else if (typeof config === 'object') {
        baseConfig.configure(config);
    }

}
