import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {AuthService} from '../lib/oauth/oauth';
import {OAuthUser} from '../lib/oauth/oauth-user';

/**
 * The header component
 *
 */
@inject(EventAggregator, AuthService)
export class Header {
    /**
     * header user to show
     */
    private user: OAuthUser;
    /**
     * header constructor
     */
    constructor(private ea: EventAggregator, private authService: AuthService) {
        this.user = this.authService.getUser();
        this.ea.subscribe('user_known', (user) => {
            this.user = user;
        });
    }

}
