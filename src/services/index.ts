import {Container} from 'aurelia-dependency-injection';
import {ServiceConfig} from './serviceConfig';

type ConfigurationCallBack = (config: {} ) => any;

/**
 * Services module configurations
 */
export function configure(frameworkConfig: { container: Container, globalResources: (...resources: string[]) => any },
                          config: {} | ConfigurationCallBack) {
    const serviceConfig = frameworkConfig.container.get(ServiceConfig);

    if (typeof config === 'function') {
        config(serviceConfig);
    } else if (typeof config === 'object') {
        serviceConfig.configure(config);
    }

}
