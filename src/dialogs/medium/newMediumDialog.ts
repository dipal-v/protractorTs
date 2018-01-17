import { DialogController } from 'aurelia-dialog';
import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import * as moment from 'moment';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Constants } from '../../constants';
import { Medium } from '../../models/medium';

/**
 * New Contact Class
 * @export
 * @class NewContactDialog
 */
@inject(DialogController, ValidationControllerFactory, EventAggregator, I18N)
export class NewMediumDialog {
    /**
     * The validation controller
     */
    public validationController = null;

    public mediumType: string;

    public localMedium: Medium;

    constructor(
        private controller, private validationFactory: ValidationControllerFactory,
        private ea: EventAggregator,
        private i18n: I18N
    ) {
        this.localMedium = new Medium();
    }

    public activate(data) {
        this.mediumType = data[Constants.MEDIUM_TYPE];
        this.localMedium.type = data[Constants.MEDIUM];
        if (Constants.EMAIL_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.email'))
                .required()
                .email()
                .on(Medium);
        } else if (Constants.PHONE_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.phoneNumber'))
                .matches(/^[0-9\-\+]{9,15}$/)
                .required()
                .on(Medium);
        } else if (Constants.URL_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.url'))
                .matches(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/)
                .required()
                .on(Medium);
        }
        this.validationController = this.validationFactory.createForCurrentScope();
        this.validationController.validateTrigger = validateTrigger.manual;
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public done() {
        this.validationController.validate().then((verdict) => {
            if (verdict.valid) {
                this.controller.ok(this.localMedium);
            }
        });
    }

    public detached() {
        this.localMedium = new Medium();
    }
}
