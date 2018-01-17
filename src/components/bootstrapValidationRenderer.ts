import { RenderInstruction, ValidateResult, ValidationRenderer } from 'aurelia-validation';

/**
 * Bootstap Validation Renderer
 * @export
 * @class BootstrapValidationRenderer
 */
export class BootstrapValidationRenderer {

    /**
     * overide the renderer
     * @private
     * @param {RenderInstruction} instruction
     * @memberof BootstrapValidationRenderer
     */
    private render(instruction: RenderInstruction) {
        for (const { result, elements } of instruction.unrender) {
            for (const element of elements) {
                this.remove(element, result);
            }
        }

        for (const { result, elements } of instruction.render) {
            for (const element of elements) {
                this.add(element, result);
            }
        }
    }

    /**
     * override the add for what ui to add
     * @private
     * @param {Element} element
     * @param {ValidateResult} result
     * @returns
     * @memberof BootstrapValidationRenderer
     */
    private add(element: Element, result: ValidateResult) {
        // for create, update views
        let inputEnclosure = element.closest('.validation-wrapper');
        if (!inputEnclosure) {
            // for dialogs
            inputEnclosure = element.closest('.form-group');
            if (!inputEnclosure) {
                return;
            }
        }

        if (result.valid) {
            if (!inputEnclosure.classList.contains('has-error')) {
                inputEnclosure.classList.add('has-success');
            }
        } else {
            // add the has-error class to the enclosing form-group div
            inputEnclosure.classList.remove('has-success');
            inputEnclosure.classList.add('has-error');

            // add help-block
            const message = document.createElement('span');
            message.className = 'help-block validation-message';
            message.textContent = result.message;
            message.id = `validation-message-${result.id}`;
            inputEnclosure.appendChild(message);
        }
    }

    /**
     * override the remove for what ui to remove
     * @private
     * @param {Element} element
     * @param {ValidateResult} result
     * @returns
     * @memberof BootstrapValidationRenderer
     */
    private remove(element: Element, result: ValidateResult) {
        // for create, update views
        let inputEnclosure = element.closest('.validation-wrapper');
        if (!inputEnclosure) {
            // for dialogs
            inputEnclosure = element.closest('.form-group');
            if (!inputEnclosure) {
                return;
            }
        }

        if (result.valid) {
            if (inputEnclosure.classList.contains('has-success')) {
                inputEnclosure.classList.remove('has-success');
            }
        } else {
            // remove help-block
            const message = inputEnclosure.querySelector(`#validation-message-${result.id}`);
            if (message) {
                inputEnclosure.removeChild(message);

                // remove the has-error class from the enclosing form-group div
                if (inputEnclosure.querySelectorAll('.help-block.validation-message').length === 0) {
                    inputEnclosure.classList.remove('has-error');
                }
            }
        }
    }
}
