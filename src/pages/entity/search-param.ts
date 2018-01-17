/**
 * Search param
 * A helper class for search form. Internal search termis hidden by this class
 *
 */
export class SearchParam {

    constructor(public field: string, public value: string, public isRegex: boolean) {
    }

}
