import { SearchField } from './pages/entity/search-field';
export class Constants {

    public static UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZZ';
    public static UI_DATE_FORMAT = 'DD-MMM-YYYY';
    public static UNDEFINED = 'undefined';
    public static EMAIL = 'Email';
    public static PHONE = 'Phone';
    public static URL = 'URL';
    public static EMAIL_REGEXP = new RegExp('Email', 'i');
    public static PHONE_REGEXP = new RegExp('Phone', 'i');
    public static AIRCRAFT_REGEXP = new RegExp('Aircraft', 'i');
    public static VESSEL_REGEXP = new RegExp('Vessel', 'i');
    public static URL_REGEXP = new RegExp('URL', 'i');
    public static DATA_STR = 'data';
    public static VALUE_STR = 'value';
    public static PAGES_STR = 'pages';
    public static DEFAULT_SEARCH_FIELD = new SearchField('entity.entityCode', 'legalEntityCode');
    public static DEFAULT_SEARCH_FIELDS = [Constants.DEFAULT_SEARCH_FIELD];
    public static ORGANISATION_SEARCH_FIELDS = [
        Constants.DEFAULT_SEARCH_FIELD,
        new SearchField('entity.primaryName', 'details.primaryName'),
        new SearchField('entity.creditRegion', 'details.creditRegion')
    ];
    public static PERSON_SEARCH_FIELDS = [
        Constants.DEFAULT_SEARCH_FIELD,
        new SearchField('person.givenName', 'details.givenName'),
        new SearchField('person.surname', 'details.surname')
    ];
    public static ACCOUNT_TYPES = ['Receivable', 'Payable'];
    public static STATE = 'state';
    public static DISABLED = 'disabled';
    public static PERSON_TYPE = 'Person';
    public static ORGANISATION_TYPE = 'Organisation';
    public static VIEW_ORGANISATION = 'viewOrganisation';
    public static VIEW_PERSON = 'viewPerson';
    public static TYPE = 'type';
    public static DEFAULT_COUNTRY = 'United Kingdom of Great Britain and Northern Ireland';
    public static DEFAULT_ISO_COUNTRY_CODE = 'GB';
    public static MEDIUM_TYPE = 'mediumType';
    public static MEDIUM = 'medium';

    public static LEGAL_ENTITY_CODE = 'legalEntityCode';

    public static DEFAULT_PAGE_SIZE = 25;
    public static DEFAULT_SUB_ENTITY_PAGE_SIZE = 10;

}
