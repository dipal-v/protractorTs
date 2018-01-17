import { LeftHandMenu } from './left-hand-menu';

describe('Left Hand Menu', () => {

    it('check the class load', () => {
        let leftHandMenu = new LeftHandMenu();
        leftHandMenu.attached();
        leftHandMenu.detached();
    });

    it('should do scroll and nav fixed', () => {
        let leftHandMenu = new LeftHandMenu();
        window.scrollY = 230;
        window.innerWidth = 1000;
        leftHandMenu.doScroll({});
    });

    it('should do scroll', () => {
        let leftHandMenu = new LeftHandMenu();
        window.innerWidth = 0;
        window.scrollY = 0;
        leftHandMenu.doScroll({});
    });
});
