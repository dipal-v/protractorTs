import { browser } from 'aurelia-protractor-plugin/protractor';
import { defineSupportCode } from 'cucumber';

defineSupportCode(({ BeforeAll, AfterAll }) => {
    BeforeAll((callback) => {
        browser.get('/');
        browser.sleep(8000).then(() => {
            callback();
        });
    });
    AfterAll(() => {
        return browser.quit();
    });
});
