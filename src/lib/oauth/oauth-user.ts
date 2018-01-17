/**
 * User representation
 *
 * Its username and permissions
 */
export class OAuthUser {
    /**
     * AUD
     */
    public aud: string;

    /**
     * user email
     */
    public email: string;

    /**
     * user first name
     */
    public firstname: string;

    /**
     * ISS
     */
    public iss: string;

    /**
     * user last name
     */
    public lastname: string;

    /**
     * Array of User Roles
     */
    public roles: string[];

    /**
     * OAuth user constructor
     * @param firstname
     * @param lastname
     * @param roles
     */
    constructor( firstname: string, lastname: string, roles: string[]) {
        this.aud = 'LegalEntity';
        this.iss = 'IdAM';
        this.firstname = firstname;
        this.lastname = lastname;
        this.roles = roles;
    }
}
