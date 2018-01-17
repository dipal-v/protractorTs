import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';

/**
 * Confirm Dialog
 * @export
 * @class Confirm
 */
@inject(DialogController)
export class Confirm {
    /**
     * answer state
     * @memberof Confirm
     */
    public answer;

    /**
     * Message to show in the Dialog
     * @type {string}
     * @memberof Confirm
     */
    public modal: {
        heading: string,
        body: string
    };

   /**
    * Creates an instance of Confirm.
    * @param {any} controller
    * @memberof Confirm
    */
   constructor(private controller) {
      this.answer = null;
   }

   /**
    * Confirm activate override method
    * @param {any} message
    * @memberof Confirm
    */
   public activate(modal) {
      this.modal = modal;
   }
}
