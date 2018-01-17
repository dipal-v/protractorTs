import { configure } from './index';
import { ServiceConfig } from './serviceConfig';

describe('service index configure component', () => {
    let frameworkConfig;
    let baseConfig;

    beforeEach(() => {
        frameworkConfig = jest.fn();
        frameworkConfig.container = jest.fn();
        frameworkConfig.container.get = jest.fn();
        baseConfig = new ServiceConfig();
        frameworkConfig.container.get.mockReturnValueOnce(baseConfig);

    });

    it('check the configure object', () => {
        const test = 'testme';
        configure(frameworkConfig, {
            searchParamsTemplateString: test
        }
        );
        expect(baseConfig.searchParamsTemplateString).toBe(test);
    });
});
