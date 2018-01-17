import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { PLATFORM } from 'aurelia-pal';
import { Cookies } from 'aurelia-plugins-cookies';
import { activationStrategy, Router, RouterConfiguration } from 'aurelia-router';
import { AuthenticateStep } from 'lib/oauth/authenticateStep';
import { AuthService } from 'lib/oauth/oauth';

@inject(AuthService, I18N)
export class App {
    public router: Router;

    private welcomeRoute: any;

    private notAuthorizedRoute: any;

    constructor(private authService: AuthService, private i18n: I18N) {
        this.welcomeRoute = {
            route: ['', 'organisations'],
            name: 'organisations',
            moduleId: PLATFORM.moduleName('pages/organisation/list'),
            title: this.i18n.tr('page.organisations.title'),
            auth: true,
            nav: true,
            settings: {
                permission: {
                    only: ['AuthenticatedUser']
                }
            }
        };
        this.notAuthorizedRoute = {
            route: 'not-authorized',
            name: 'not-authorized',
            nav: false,
            moduleId: PLATFORM.moduleName('pages/errors/not-authorized'),
            title: this.i18n.tr('page.notAuthorized.title')
        };

    }

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = this.i18n.tr('page.title');
        config.addPipelineStep('authorize', AuthenticateStep);
        config.map([
            this.notAuthorizedRoute,
            this.welcomeRoute,
            {
                route: ['persons'],
                name: 'persons',
                moduleId: PLATFORM.moduleName('pages/person/list'),
                title: this.i18n.tr('page.persons.title'),
                auth: true,
                nav: true,
                settings: {
                    permission: {
                        only: ['AuthenticatedUser']
                    }
                }
            },
            {
                route: 'viewOrganisation/:id?',
                name: 'viewOrganisation',
                moduleId: PLATFORM.moduleName('pages/organisation/view'),
                title: this.i18n.tr('page.viewOrganisation.title'),
                auth: true,
                nav: false,
                activationStrategy: activationStrategy.replace,
                settings: {
                    permission: {
                        only: ['AuthenticatedUser']
                    }
                }
            },
            {
                route: 'viewPerson/:id?',
                name: 'viewPerson',
                moduleId: PLATFORM.moduleName('pages/person/view'),
                title: this.i18n.tr('page.viewPerson.title'),
                auth: true,
                nav: false,
                settings: {
                    permission: {
                        only: ['AuthenticatedUser']
                    }
                }
            },
            {
                route: 'redirect',
                name: 'Redirect Screen',
                moduleId: PLATFORM.moduleName('lib/oauth/redirect'),
                title: this.i18n.tr('page.redirect.title'),
                auth: false,
                nav: false
            },
            {
                route: 'createOrganisation',
                name: 'createOrganisation',
                moduleId: PLATFORM.moduleName('pages/organisation/create'),
                nav: false,
                title: this.i18n.tr('page.createEntity.title'),
                auth: true
            },
            {
                route: 'updateOrganisation/:id?',
                name: 'updateOrganisation',
                moduleId: PLATFORM.moduleName('pages/organisation/update'),
                title: this.i18n.tr('page.modifyEntity.title'),
                auth: true,
                nav: false,
                settings: {
                    permission: {
                        only: ['AuthenticatedUser']
                    }
                }
            },
            {
                route: 'createPerson',
                name: 'createPerson',
                moduleId: PLATFORM.moduleName('pages/person/create'),
                nav: false,
                title: this.i18n.tr('page.createPerson.title'),
                auth: true
            },
            {
                route: 'updatePerson/:id?',
                name: 'updatePerson',
                moduleId: PLATFORM.moduleName('pages/person/update'),
                nav: false,
                title: this.i18n.tr('page.modifyPerson.title'),
                auth: true
            }
        ]);

        this.router = router;
        config.mapUnknownRoutes((instruction) => {
            return this.handleUnknownRoutes(instruction);
        });
    }

    public handleUnknownRoutes(instruction) {
        // this function send the redriect back into welcome route
        if (instruction.fragment.indexOf('access_token') !== -1) {
            return this.welcomeRoute;
        } else if (instruction.fragment.indexOf('access_denied') !== -1) {
            return this.welcomeRoute;
        } else {
            return { route: 'not-found', moduleId: 'not-found' };
        }
    }

}
