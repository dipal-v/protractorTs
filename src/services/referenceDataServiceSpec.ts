import { ReferenceDataService } from './referenceDataService';

describe('entity model', () => {
    let api;
    let corporateApi;
    let serviceConfig;
    let referenceDataService;
    const DUMMY_DATA = [
        {
            type: 'xyz',
            obc: 'rst'
        }
    ];
    const GOOD_PROMISE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const GOOD_PROMISE_WITH_SINGLE_RESPONSE = new Promise((resolve, reject) => {
        resolve(DUMMY_DATA);
    });
    const ERROR_MESSAGE = 'bad promise';
    const BAD_PROMISE = new Promise((resolve, reject) => {
        reject({ message: ERROR_MESSAGE });
    });

    beforeEach(() => {
        api = jest.fn();
        api.get = jest.fn();
        corporateApi = jest.fn();
        corporateApi.get = jest.fn();
        serviceConfig = jest.fn();
        referenceDataService = new ReferenceDataService(api, corporateApi, serviceConfig);
    });

    it('check get reference data', async () => {
        const expected = [{ "key": "obc", "value": "rst" }]
        const testEndPoint = 'specialEndPoint';
        api.get.mockReturnValue(GOOD_PROMISE);
        const result = await referenceDataService.getReferenceData(api, testEndPoint);
        expect(result).toEqual(expected);
    });

    it('check handle error too', async () => {
        try {
            api.get.mockReturnValue(BAD_PROMISE);
            await referenceDataService.getReferenceData(api, 'blahbla');
        } catch (error) {
            expect(error.message).toBe(ERROR_MESSAGE);
        }
    });

});
