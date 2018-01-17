import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {Constants} from '../constants';

/**
 * The Messenger Service
 */
@inject(EventAggregator)
export class Messenger {

    /**
     * The event aggregator
     */
    public ea: EventAggregator ;

    /**
     * The massenger service constructor
     */
    constructor(ea: EventAggregator) {
        this.ea = ea;
    }

    /**
     * The info message publisher
     */
    public info(message: string) {

        this.ea.publish('messages', {text: message, type: 'info'});

    }

    /**
     * The warn message publisher
     */
    public warn(message: string) {

        this.ea.publish('messages', {text: message, type: 'warning'});

    }

    /**
     * The success message publisher
     */
    public success(message: string) {

        this.ea.publish('messages', {text: message, type: 'success'});

    }

    /**
     * The error message publisher
     */
    public error(message: any) {
        let msg;
        if (typeof message.message !== Constants.UNDEFINED) {
            msg = message.message;
        } else {
            msg = message;
        }

        this.ea.publish('messages', {text: msg, type: 'error'});

    }
}
