/**
 * The Not Autorized error
 */
export class NotAuthorized {
    /**
     * error title
     */
    public title = 'Error: Not Authorized';
    /**
     * error message
     */
    public message = 'You are not authorized to either view the page you navigated to, ' +
        'or perform the function you attempted. Please return to the previous screen.';
}
