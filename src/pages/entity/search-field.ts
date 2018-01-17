import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
/**
 * Search field class
 * A helper class for search form. Internal search termis hidden by this class
 *
 */
@inject(I18N)
export class SearchField {
    /**
     * The user input
     */
    public uiTerm: string;

    /**
     * The backend search term
     */
    public searchTerm: string;

    public i18n: I18N;

    /**
     * Search Field Constructor
     * @param userInterfaceTerm
     * @param internalSearchTerm
     */
    constructor(userInterfaceTerm: string, internalSearchTerm: string) {
        this.i18n = new I18N();
        this.uiTerm = this.i18n.tr(userInterfaceTerm);
        this.searchTerm = internalSearchTerm;
    }
}
