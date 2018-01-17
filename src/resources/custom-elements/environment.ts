import { AureliaConfiguration } from 'aurelia-configuration';
import { bindable, customElement, inject } from 'aurelia-framework';

/**
 * The top header component
 *
 */
@customElement('environment')
@inject(AureliaConfiguration)
export class Environment {
    /**
     * environment version
     * @public
     * @type {string}
     * @memberof TopHeader
     */
    public version: string;

    /**
     * environment name
     * @public
     * @type {string}
     * @memberof TopHeader
     */
    public name: string;

    /**
     * API Version
     * @type {string}
     * @memberof Environment
     */
    public api: string;

    /**
     * Database Version
     * @type {string}
     * @memberof Environment
     */
    public database: string;

    /**
     * environment constructor
     */
    constructor(private config: AureliaConfiguration) {
        if (!this.config.is('production')) {
            this.version = this.config.get('version');
            this.name = this.config.get('name');
            this.api = this.config.get('api.version');
            this.database = this.config.get('database');
        }
    }

}
