import { BaseConfig } from './baseConfig';
import { configure } from './index';

describe('index configure component', () => {
    let frameworkConfig;
    let baseConfig;

    beforeEach(() => {
        frameworkConfig = jest.fn();
        frameworkConfig.container = jest.fn();
        frameworkConfig.container.get = jest.fn();
        baseConfig = new BaseConfig();
        frameworkConfig.container.get.mockReturnValueOnce(baseConfig);

    });

    it('check the configure object', () => {
        configure(frameworkConfig, {
            baseUrl: 'http://test.com'
        }
        );
        expect(baseConfig.baseUrl).toBe('http://test.com');
    });

    it('check the configure function', () => {
        configure(frameworkConfig, (baseConfig) => {
            baseConfig.configure({
                baseUrl: 'http://test.com'
            });
        });
        expect(baseConfig.baseUrl).toBe('http://test.com');
    });

    it('check the configure undefined', () => {
        configure(frameworkConfig, undefined);
        expect(baseConfig.baseUrl).not.toBe('http://test.com');
    });

    it('check the configure empty object key value', () => {
        configure(frameworkConfig, {
            baseUrl: {}
        });
        expect(baseConfig.baseUrl).not.toBe('http://test.com');
    });

    it('check the configure null key value', () => {
        configure(frameworkConfig, {
            baseUrl: null
        }
        );
        expect(baseConfig.baseUrl).toBeNull();
    });

    it('check the configure array key value', () => {
        configure(frameworkConfig, {
            baseUrl: [1, 2, 3]
        }
        );
        expect(baseConfig.baseUrl.length).toBe(3);
    });

    it('check the configure undefined key value', () => {
        configure(frameworkConfig, {
            baseUrl: undefined
        });
        expect(baseConfig.baseUrl).not.toBe('http://test.com');
    });
});
