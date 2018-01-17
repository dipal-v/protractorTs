import { EventAggregator } from 'aurelia-event-aggregator';
import { Messenger } from './messenger';

describe('the Messenger service', () => {
    let ea;
    let messenger;
    let messageText;
    let messageType;

    beforeEach(() => {
        ea = new EventAggregator();
        messenger = new Messenger(ea);
    });

    it('info message', () => {
        messageText = 'Info';
        messageType = 'info';
        ea.subscribe('messages', (response) => {
            expect(response).toBe({ text: messageText, type: messageType });
        });
        messenger.info(messageText);
    });

    it('warn message', () => {
        messageText = 'Warn';
        messageType = 'warn';
        ea.subscribe('messages', (response) => {
            expect(response).toBe({ text: messageText, type: messageType });
        });
        messenger.warn(messageText);
    });

    it('sucess message', () => {
        messageText = 'Success';
        messageType = 'success';
        ea.subscribe('messages', (response) => {
            expect(response).toBe({ text: messageText, type: messageType });
        });
        messenger.success(messageText);
    });

    it('error message', () => {
        messageText = 'Error';
        messageType = 'error';
        ea.subscribe('messages', (response) => {
            expect(response).toBe({ text: messageText, type: messageType });
        });
        messenger.error(messageText);
    });
});
