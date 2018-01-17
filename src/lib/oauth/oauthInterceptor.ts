import { inject } from 'aurelia-framework';
import { HttpResponseMessage, RequestMessage } from 'aurelia-http-client';
import { Messenger } from '../../services/messenger';
import { AuthService } from './oauth';

/**
 * Authentication Request Interceptor
 * @todo implement access token validation
 * @todo re-authentication if access token is invalid
 */
@inject(AuthService, Messenger)
export class AuthInterceptor {
    /**
     * List of Api end points
     * @private
     * @type {string[]}
     * @memberof AuthInterceptor
     */
    private apiList: string[];

    /**
     * AuthInterceptor constructor
     */
    constructor(private authService: AuthService, private messenger: Messenger) {
        this.apiList = new Array<string>();
    }

    /**
     * Please remember to add your protected api to this list
     * Otherwise, access token is not attached to the http request
     */
    public addApi(api: string) {
        if (this.apiList.indexOf(api) === -1) {
            this.apiList.push(api);
        }
    }

    /**
     * intercept the request
     */
    public request(request: RequestMessage) {
        if (this.apiList.indexOf(request.baseUrl) !== -1) {
            request.headers.add('Authorization', 'Bearer ' + this.authService.getToken());
        }
        return request;
    }

    /**
     * intercept the response
     */
    public response(message: HttpResponseMessage): HttpResponseMessage {
        return message;
    }

    /**
     * intercept the error response
     */
    public responseError(error: HttpResponseMessage): HttpResponseMessage {
        const errorMessage = JSON.parse(error.response);
        let loginCondition = (errorMessage.customCode === 'E01' || errorMessage.customCode === 'E02');
        loginCondition = loginCondition && error.statusCode === 401;
        if (loginCondition) {
            this.authService.login();
        }
        throw error;
    }
}
