import { EventAggregator } from 'aurelia-event-aggregator';
import { Messages } from './messages';

describe('the Messages component', () => {
    let messages;
    const message = 'Test';
    let ea;

    beforeEach(() => {
        ea = new EventAggregator();
        messages = new Messages(ea);
        messages.message = message;
    });

    it('clear message', () => {
        messages.clear();
        expect(messages.message).toBeNull();
    });

    it('attached message', () => {
        messages.attached();
        ea.publish('messages', message);
        expect(messages.message).toBe('Test');
    });

    it('detached message', () => {
        messages.attached();
        ea.publish('messages', message);
        expect(messages.message).toBe('Test');
        messages.clear();
        messages.detached();
        ea.publish('messages', message);
        expect(messages.message).toBeNull();
    });
});
