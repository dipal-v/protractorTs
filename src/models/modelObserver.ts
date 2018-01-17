import { BindingEngine, inject } from 'aurelia-framework'; // or 'aurelia-binding'

/**
 * This observer do not know new values but know it changed
 * Hence you will need to feed it with the latest instance and
 * it gives the delta
 */
@inject(BindingEngine)
export class ModelObserver {
    private updates: {};
    private subscriptions: any[];

    constructor(private bindingEngine: BindingEngine) {
        this.updates = {};
        this.subscriptions = [];
    }

    /**
     * Observe properties changes.
     *
     * A property changes, this observer knows
     * A sub property of a property B changes, this observer knows the
     * property B changed, but not the sub property.
     *
     * An observable object is:
     *    {
     *      firstLevelProperty: 'yes',
     *      aDictProperty: {},
     *      aListProperty: []
     *    }
     *
     *    const mo = new ModelObserver();
     *    mo.observe(obj, ['firstLevelProperty', 'aDictProperty', 'aListProperty']);
     *
     * And then, to get all changes, you will need to pass it back
     * to the observer again.
     *
     *    const delta = mo.changes(obj);
     *
     * @param instance a javascript object instance
     * @param properties an array of properties.
     */
    public observe(instance: object, properties: string[]) {
        for (const propertyName of properties) {
            if (typeof instance[propertyName] === 'object') {
                if (Array.isArray(instance[propertyName])) {
                    this.observeList(instance, propertyName);
                } else {
                    this.observeDict(instance, propertyName);
                }
            } else {
                const callback = (newValue, oldValue) => {
                    this.makeUpdate(propertyName, true);
                };
                const observer = this.bindingEngine.propertyObserver(instance, propertyName);
                observer.subscribe(callback);
                this.subscriptions.push(observer);
            }
        }
    }

    /**
     * Wipe off its footprints when it is not needed
     *
     */
    public destroy() {
        while (this.subscriptions.length) {
            const sub = this.subscriptions.pop();
            if (sub.dispose) {
                sub.dispose();
            }
        }
        this.updates = {};
    }

    /**
     * Harvest changes from instance
     *
     */
    public changes(instance) {
        const delta = {};
        for (const key in this.updates) {
            if (this.updates[key]) {
                // whether the field is updated or not
                // true -> changed
                // false, undefined -> not changed
                delta[key] = instance[key];
            }
        }
        return delta;
    }

    private observeList(instance, aListProperty) {
        const callback = (changeRecords: any) => {
            this.makeUpdate(aListProperty, true);
        };
        const observer = this.bindingEngine.collectionObserver(instance[aListProperty]);
        observer.subscribe(callback);
        this.subscriptions.push(observer);
    }

    private observeDict(instance, aDictProperty) {
        for (const key in instance[aDictProperty]) {
            if (instance[aDictProperty].hasOwnProperty(key)) {
                const callback = (newValue, oldValue) => {
                    this.makeUpdate(aDictProperty, true);
                };
                const observer = this.bindingEngine.propertyObserver(instance[aDictProperty], key);
                observer.subscribe(callback);
                this.subscriptions.push(observer);
            }
        }
    }

    private makeUpdate(property, value) {
        this.updates[property] = value;
    }

}
