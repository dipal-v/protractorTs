import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {PLATFORM} from 'aurelia-pal';
import {Cookies} from 'aurelia-plugins-cookies';
import {decode} from 'jsonwebtoken';
import {BaseConfig} from './baseConfig';
import {OAuthUser} from './oauth-user';

/**
 * Open Authentication 2.0 Client Implimentation
 *
 * It expose the oauth functionality as service
 */
@inject(BaseConfig, EventAggregator)
export class AuthService {
    /**
     * Is authenticated
     */
    public authenticated = false;

    /**
     * The base config
     */
    public config: BaseConfig;

    /**
     * The raw and encoded json web token
     */
    public jwt: string;

    /**
     * The Authenticated User
     */
    private user: OAuthUser;

    /**
     * The time when the token was generated
     * unix time stamp
     */
    private tokenBirth: number;

    /**
     * The time when the token was received at the browser
     */
    private tokenObtained: number;

    /**
     * The time when the token will expire
     */
    private tokenExpires: number;

    /**
     * The event aggregator
     */
    private ea: EventAggregator;

    /**
     * AuthService constructor
     */
    constructor(config: BaseConfig, ea: EventAggregator) {
        this.config = config;
        this.user = new OAuthUser('Guest', 'User', ['No roles']);
        this.ea = ea;
    }

    /**
     * Get oauth user
     * @returns {OAuthUser}
     */
    public getUser() {
        return this.user;
    }

    /**
     * Login the current user via oauth protocol
     * @returns {Promise<OAuthUser>}
     */
    public login() {
        const params = {
            client_id: this.config.clientId,
            response_type: 'token',
            redirect_uri: this.config.redirectUrl
        };
        const path = this.config.baseUrl + this.config.oauthUrl;
        const method = 'post';
        this.post(path, params, method);
    }

    /**
     * Extract the access token from the url hash
     */
    public extractAccessToken(idAMHash) {
        const params = {};
        const ACCESS_TOKEN_STR = 'access_token';
        const EXPIRES_IN_STR = 'expires_in';
        const fragment = idAMHash.substring(1); // get rid of the initial '#'
        fragment.split('&').forEach( (item) => {
            const tokens = item.split('=');
            params[tokens[0]] = tokens[1];
        });
        this.setToken(params[ACCESS_TOKEN_STR]);
        this.tokenExpires = params[EXPIRES_IN_STR] + Date.now();
        Cookies.put('access_token', params[ACCESS_TOKEN_STR], {expires: this.tokenExpires});
    }

    /**
     * Get the access token from cookie
     */
    public restoreAccessTokenFromCookie(cookieToken) {
        this.setToken(cookieToken);
    }

    /**
     * return the JSON web token
     */
    public getToken() {
        return this.jwt;
    }

    /**
     * Does the hidden form post
     */
    private post(path, params, method) {
        method = method || 'post'; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        const form = document.createElement('form');
        form.setAttribute('method', method);
        form.setAttribute('action', path);

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const hiddenField = document.createElement('input');
                hiddenField.setAttribute('type', 'hidden');
                hiddenField.setAttribute('name', key);
                hiddenField.setAttribute('value', params[key]);

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }

    /**
     * Set the tocken
     * @param token
     */
    private setToken(token: string) {
        const FIRSTNAME_STR = 'firstname';
        const LASTNAME_STR = 'lastname';
        const ROLES_STR = 'roles';
        this.jwt = token;
        token = decode(token);
        this.user = new OAuthUser(token[FIRSTNAME_STR], token[LASTNAME_STR], token[ROLES_STR]);
        this.ea.publish('user_known', this.user);
    }

}
