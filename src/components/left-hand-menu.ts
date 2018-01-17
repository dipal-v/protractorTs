import {bindable} from 'aurelia-framework';

/**
 * The Left had menu component
 */
export class LeftHandMenu {
    /**
     * pixels scrolled
     */
    private pixelsScrolled = 0;
    /**
     * On Scroll event
     */
    private OnScroll;

    /**
     * navigate to top
     */
    private navTop;

    /**
     * Left had menu constructor
     */
    constructor() {
        this.OnScroll = this.doScroll;
    }

    /**
     * Scroll to the top of the page
     */
    public ScrollToTop() {
        window.scrollTo(0, 0);
    }

    /**
     * Attach the scroll event
     */
    public attached() {
        document.addEventListener('scroll', this.OnScroll);
    }

    /**
     * Dettach the scroll event
     */
    public detached() {
        document.removeEventListener('scroll', this.OnScroll);
    }

    /**
     * Perfom scroll based on the event and the pixels scrolled
     */
    public doScroll(e) {
        this.pixelsScrolled = window.scrollY;
        if (this.pixelsScrolled > 220 && window.innerWidth > 995) {
            this.navTop = 'position: fixed; top:0;';
        } else {
            this.navTop = '';
        }

    }
}
