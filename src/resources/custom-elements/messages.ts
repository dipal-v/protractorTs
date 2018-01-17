import {EventAggregator} from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';

@inject(EventAggregator)
export class Messages {
    public subscriber;

    public message;

    constructor(private ea: EventAggregator) {
    }

    public clear() {
        this.message = null;
    }

    public attached() {
        this.subscriber = this.ea.subscribe('messages', (response) => {
            this.message = response;
        });
    }

    public detached() {
        this.subscriber.dispose();
    }

}
