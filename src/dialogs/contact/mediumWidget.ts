import { bindable, customElement } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { validateTrigger, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { BootstrapValidationRenderer } from '../../components/bootstrapValidationRenderer';
import { Widget } from '../../components/widget';
import { Constants } from '../../constants';
import { Medium } from '../../models/medium';

@customElement('medium-widget')
@bindable('label')
@bindable('mediumType')
@inject(Element, ValidationControllerFactory, I18N)
export class MediumWidget extends Widget {
    public validationController = null;

    private medium: Medium;

    constructor(
        element: Element,
        private validationFactory: ValidationControllerFactory,
        private i18n: I18N,
        private label: string,
        private mediumType: string
    ) {
        super(element);
        this.validationController = this.validationFactory.createForCurrentScope();
        this.validationController.addRenderer(new BootstrapValidationRenderer());
    }

    public attached() {
        if (Constants.EMAIL_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.email'))
                .required()
                .email()
                .ensure('allowContact').required()
                .on(Medium);
        } else if (Constants.PHONE_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.phoneNumber'))
                .matches(/^[0-9\-\+]{9,15}$/)
                .required()
                .ensure('allowContact').required()
                .on(Medium);
        } else if (Constants.URL_REGEXP.test(this.mediumType)) {
            ValidationRules
                .ensure('value').displayName(this.i18n.tr('contacts.url'))
                .matches(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/)
                .required()
                .ensure('allowContact').required()
                .on(Medium);
        }
        this.medium = new Medium();
    }

    public detached() {
        this.medium = null;
        this.validationController.reset();
    }

    public addMedium() {
        this.medium.type = this.label;
        this.validationController.validate().then((verdict) => {
            if (verdict.valid) {
                const options = {
                    type: this.label,
                    value: this.medium.value,
                    allowContact: this.medium.allowContact
                };
                this.triggerEvent('add', options);
            }
        });
    }

    public hideMedium() {
        this.validationController.reset();
        this.triggerEvent('cancel');
    }

}
