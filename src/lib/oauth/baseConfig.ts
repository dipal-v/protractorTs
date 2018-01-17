import extend from 'extend';

/**
 * Configure oauth component
 *
 * Important fields are:
 *    baseUrl
 *    oauthUrl
 *    redirectUrl
 *    clientId
 */
export class BaseConfig {

    /**
     * base url
     */
    public baseUrl = '';

    /**
     * oauth url
     */
    public oauthUrl = '';

    /**
     * redirection url
     */
    public redirectUrl = '';

    /**
     * is authenticated
     */
    public auth = true;

    /**
     * client id
     */
    public clientId = '';

    /**
     * login redirection url
     */
    public loginRedirect = '#/redirect';

    /**
     * storage
     */
    public storage = 'localStorage';

    /**
     * state
     */
    public state = 'happy';

    /**
     * Merge current settings with incoming settings
     * @param  {Object} incoming Settings object to be merged into the current configuration
     */
    public configure(incoming: {}) {
        for (const key in incoming) {
            if (incoming.hasOwnProperty(key)) {
                const value = incoming[key];

                if (value !== undefined) {
                    if (Array.isArray(value) || typeof value !== 'object' || value === null) {
                        this[key] = value;
                    }
                }
            }
        }
    }
}
