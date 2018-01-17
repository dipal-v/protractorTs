import * as moment from 'moment';

/**
 * The footer component
 */
export class Footer {
    /**
     * footer date
     */
    private footerDate = moment(new Date()).format('YYYY');

    /**
     * pixels scrolled in the window
     */
    private pixelsScrolled = 0;

    /**
     * on scroll event
     */
    private OnScroll;

    /**
     * constructor
     */
    constructor() {
        this.OnScroll = (_) => {
            this.pixelsScrolled = window.scrollY;

        };
    }

    /**
     * ScrollToTop - scrolls to the top of the page
     */
    public ScrollToTop() {
        window.scrollTo(0, 0);
    }

    /**
     * attached - overrides the element scroll event
     */
    public attached() {
        document.addEventListener('scroll', this.OnScroll);
    }

    /**
     * detached - removed the attached scroll event
     */
    public detached() {
        document.removeEventListener('scroll', this.OnScroll);
    }
}
