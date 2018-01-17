import {inject, PLATFORM} from 'aurelia-framework';
import {Cookies} from 'aurelia-plugins-cookies';
import {Redirect} from 'aurelia-router';
import {AuthService} from './oauth';

/**
 * Check each navigation step where the user should be authenticated
 */
@inject(AuthService)
export class AuthenticateStep {
    /**
     * local authentication service
     */
    private authService: AuthService;

    /**
     * Authentication Steps constructor
     * @param authService
     */
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * Get the URL hash
     */
    public getHash() {
        return PLATFORM.location.hash;
    }

    /**
     * Read the access tocken from cookie
     */
    public getAccessTokenFromCookie() {
        return Cookies.get('access_token');
    }

    /**
     * This function is called when user navigates through
     * the routes
     */
    public run(routingContext, next) {
        const isLoggedIn = this.authService.authenticated;
        const currentHash = this.getHash();
        const tokenInCookie = this.getAccessTokenFromCookie();
        if (currentHash && currentHash.indexOf('access_token') !== -1) {
            // get access token from redirected url
            this.authService.extractAccessToken(currentHash);
            this.authService.authenticated = true;
            return next.cancel(new Redirect('/'));
        } else if (tokenInCookie && !isLoggedIn) {
            // get access token from cookies
            this.authService.restoreAccessTokenFromCookie(tokenInCookie);
            this.authService.authenticated = true;
        } else if (currentHash && currentHash.indexOf('access_denied') !== -1) {
            return next.cancel(new Redirect('not-authorized'));
        }

        if (routingContext.getAllInstructions().some((route) => route.config.auth === true)) {
            if (!this.authService.authenticated) {
                return next.cancel(new Redirect(this.authService.config.loginRedirect));
            }
        }
        return next();
    }
}
