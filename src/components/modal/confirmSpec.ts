import { Confirm } from './confirm';

describe('confirm class', () => {
    it('check message set', () => {
        const controller = jest.fn();
        const confirm = new Confirm(controller);
        confirm.activate({
            heading: 'heading',
            body: 'test'
        });
        expect(confirm.modal.body).toBe('test');
        expect(confirm.modal.heading).toBe('heading');
    });
});
