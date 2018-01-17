import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import { AureliaConfiguration } from 'aurelia-configuration';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import { Configuration, PermissionStore } from 'aurelia-permission';
import { Cookies } from 'aurelia-plugins-cookies';
import * as Bluebird from 'bluebird';
import 'bootstrap';
import 'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css';
import 'font-awesome/css/font-awesome.css';
import Backend from 'i18next-xhr-backend'; // <-- your previously installed backend plugin
import { BaseConfig } from 'lib/oauth/baseConfig';
import { AuthService } from 'lib/oauth/oauth';
import '../assets/styles/main.scss';
import '../node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin(PLATFORM.moduleName('aurelia-configuration'), (config) => {
            config.setEnvironments({
                mock: ['localhost'],
                local: ['ceres.local'],
                staging: ['35.189.119.42'],
                production: ['35.189.120.202']
            });
        })
        .plugin(PLATFORM.moduleName('lib/oauth'), (baseConfig) => {
            const configInstance = aurelia.container.get(AureliaConfiguration);
            baseConfig.configure({
                baseUrl: configInstance.get('oauthBase'),
                oauthUrl: configInstance.get('oauthUrl'),
                clientId: configInstance.get('oauthClientID'),
                redirectUrl: configInstance.get('oauthRedirectUrl')
            });
        })
        .plugin(PLATFORM.moduleName('aurelia-plugins-cookies'))
        .plugin(PLATFORM.moduleName('aurelia-permission'), (
            permissionStore: PermissionStore,
            configuration: Configuration) => configurePermissions(aurelia, permissionStore, configuration))
        .plugin(PLATFORM.moduleName('aurelia-dialog'), (config) => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 5;
            config.settings.keyboard = true;
        })
        .plugin(PLATFORM.moduleName('aurelia-validation'))
        .plugin(PLATFORM.moduleName('aurelia-bootstrap'))
        .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
            const aliases = ['t', 'i18n'];
            // add aliases for 't' attribute
            TCustomAttribute.configureAliases(aliases);

            // register backend plugin
            instance.i18next.use(Backend);

            // adapt options to your needs (see http://i18next.com/docs/options/)
            // make sure to return the promise of the setup method, in order to guarantee proper loading
            return instance.setup({
                backend: {// <-- configure backend settings
                    loadPath: './locales/{{lng}}/{{ns}}.json' // <-- XHR settings for where to get the files from
                },
                attributes: aliases,
                lng: 'en',
                fallbackLng: 'en',
                debug: false
            });
        });

    const oauth = aurelia.container.get(AuthService);
    if (!Cookies.get('access_token') && PLATFORM.location.href.indexOf('access_token') === -1) {
        // First time without cookie or access_token
        aurelia.start().then(() => {
            aurelia.setRoot(PLATFORM.moduleName('app'));
            if (PLATFORM.location.href.indexOf('error=') === -1) {
                oauth.login(); // -> fetch access token, get a redirect -> back to beginning
            } // else, having errors, let's stop here.
        });
    } else {
        // Second time or first time authenticated
        aurelia.use
            .plugin(PLATFORM.moduleName('aurelia-datatable'))
            .plugin(PLATFORM.moduleName('ag-grid-aurelia'))
            .plugin(PLATFORM.moduleName('aurelia-pager'))
            .plugin(PLATFORM.moduleName('bootstrap-datepicker'))
            .plugin(PLATFORM.moduleName('aurelia-dialog'), (config) => {
                config.useDefaults();
                config.settings.lock = true;
                config.settings.centerHorizontalOnly = false;
                config.settings.startingZIndex = 5;
                config.settings.keyboard = true;
            })
            .plugin(PLATFORM.moduleName('services'), (serviceConfig) => {
                const configInstance = aurelia.container.get(AureliaConfiguration);
                serviceConfig.configure({
                    searchParamsTemplateString: configInstance.get('apiSearchParamsTemplate'),
                    legalEntityEndPoint: configInstance.get('legalEntityEndPoint'),
                    legalEntityContentEndPoint: configInstance.get('legalEntityContentEndPoint'),
                    apiHost: configInstance.get('apiHost'),
                    corporateApiHost: configInstance.get('corporateApiHost'),
                    corporateContentEndPoint: configInstance.get('corporateContentEndPoint')
                });
            });

        aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
    }
}

function configurePermissions(aurelia: Aurelia, permissionStore: PermissionStore, configuration: Configuration) {
    // will work it out later
}
