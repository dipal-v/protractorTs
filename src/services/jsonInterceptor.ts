import {HttpResponseMessage} from 'aurelia-http-client';

/**
 * JSON Interceptor Class
 * @todo implement access token validation
 * @todo re-authentication if access token is invalid
 */

export class JsonInterceptor {

    /**
     * JSON Interceptor response
     * @param message
     */
    public response(message: HttpResponseMessage): HttpResponseMessage {
        try {
            message.response = JSON.parse(message.response);
        } catch (e) {
            message.response = {};
        }
        return message;
    }
}
