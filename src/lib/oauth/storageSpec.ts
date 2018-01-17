import { BaseConfig } from './baseConfig';
import { Storage } from './storage';

class StorageStub {
    public localStore: {};
    constructor() {
        this.localStore = {};
    }
    public getItem(key: string) {
        return this.localStore[key];
    }

    public setItem(key: string, value: string) {
        this.localStore[key] = value;
    }

    public removeItem(key: string) {
        delete this.localStore[key];
    }
}

describe('the storage helper', () => {
    let storage;
    let storageStub;
    const config = new BaseConfig();
    const testKey = 'key';
    const testValue = 'value';

    beforeEach(() => {
        storage = new Storage(config);
        storage.getStorage = jest.fn();
        storageStub = new StorageStub();
        storage.getStorage.mockReturnValueOnce(storageStub);
    });

    it('check get', () => {
        storageStub.setItem(testKey, testValue);
        const result = storage.get(testKey);
        expect(result).toBe(testValue);
    });

    it('check set', () => {
        storage.set(testKey, testValue);
        const result = storageStub.getItem(testKey);
        expect(result).toBe(testValue);
    });

    it('check remove', () => {
        storageStub.setItem(testKey, testValue);
        storage.remove(testKey);
        expect(storageStub).not.toContain(testKey);
    });
});
