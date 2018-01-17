import {inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {BaseConfig} from './baseConfig';

/**
 * Storage abstraction
 *
 * Store items in any viable browser storage
 */
@inject(BaseConfig)
export class Storage {
    /**
     * Local config
     */
    public config: BaseConfig;

    /**
     * Constructor
     * @param {BaseConfig} a configuration instance
     */
    constructor(config: BaseConfig) {
        this.config = config;
    }

    /**
     * Get a value
     * @param {key} the dictionary key
     * @returns {string} the corresponding string value
     */
    public get(key: string): string {
        return this.getStorage().getItem(key);
    }

    /**
     * Set a key value pair
     * @param {key} the dictionary key
     * @param {string} the value
     */
    public set(key: string, value: string) {
        this.getStorage().setItem(key, value);
    }

    /**
     * Remove a key value pair
     * @param {key} the dictionary key
     */
    public remove(key: string) {
        this.getStorage().removeItem(key);
    }

    /**
     * Get the handle to the chosen storage
     * @returns {storage}
     */
    public getStorage() {
        return PLATFORM.global[this.config.storage];
    }
}
