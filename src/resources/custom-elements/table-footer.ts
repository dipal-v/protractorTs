import { bindable, customAttribute, customElement, inject } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import { Widget } from '../../components/widget';

/**
 * The switch button
 */
@inject(Element)
@customElement('table-footer')
@bindable('totalPages')
@bindable('pageSize')
@bindable('currentPage')
export class TableFooter extends Widget {

    public firstPage(event) {
        this.triggerEvent('first');
    }

    public prevPage(event) {
        this.triggerEvent('prev');
    }

    public nextPage(event) {
        this.triggerEvent('next');
    }

    public lastPage(event) {
        this.triggerEvent('last');
    }

}
