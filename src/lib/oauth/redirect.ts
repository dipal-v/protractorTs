import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from './oauth';

/**
 * The Redirection
 */
export class Redirection {
    /**
     * info title
     */
    public title = 'Redirection';

    /**
     * info message
     */
    public message = 'You are being redirected for login..';
}
