import { Account } from './account';

describe('account structure', () => {
    it('can start with nothing', () => {
        const account = new Account();
        expect(account.type).toBe(undefined);
        expect(account.statementIndicator).toBeFalsy();
    });
});
