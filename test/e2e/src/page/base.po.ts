import { $, $$, browser, by, By, element, ExpectedConditions, Key } from 'aurelia-protractor-plugin/protractor';
import { expect } from 'chai';

const tillSelectionPopulated = (cssSelector) => {
    return () => {
        const elements = element.all(by.css(cssSelector));
        return elements.count().then((count) => {
            return count > 0;
        });
    };
};

const oneHundredBackSpaces = () => {
    let clearKeys = '';
    for (let i = 0; i < 100; i++) {
        clearKeys += Key.BACK_SPACE;
    }
    return clearKeys;
};

export class BasePage {

    public getURL(text: string) {
        return browser.get(text);
    }

    public getButton(buttonText) {
        const button = this.getElementByButtonText(buttonText);
        browser.actions().mouseMove(button).perform();
        return button;
    }

    public getElementByButtonText(buttonText) {
        const ele = element(by.buttonText(buttonText));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementById(id) {
        const ele = element(by.id(id));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementByClassName(className) {
        const ele = element(by.className(className));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementByCSS(css) {
        const ele = element(by.css(css));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementByLinkText(text) {
        const ele = element(by.linkText(text));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementByXPath(xPath) {
        const ele = element(by.xpath(xPath));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getElementByTagName(tag, isVisible) {
        const ele = element(by.tagName(tag));
        if (isVisible) {
            this.waitForVisibilityOfElement(ele);
        } else {
            this.waitForInvisibilityOfElement(ele);
        }
        return ele;
    }

    public getElementByCSSContainingText(cssSelector, searchText) {
        const ele = element(by.cssContainingText(cssSelector, searchText));
        this.waitForVisibilityOfElement(ele);
        return ele;
    }

    public getPageTitle() {
        return this.getElementById('pageTitle');
    }

    public clickAnchorByLinkText(text: string) {
        return this.getElementByLinkText(text).click();
    }

    public findTextByXPath(text: string) {
        const xpath = '//*[contains(text()," + text + ")]';
        this.getElementByXPath(xpath);
    }

    public getCurrentPageTitle() {
        return browser.getPageTitle();
    }

    public navigateTo(href: string) {
        this.getElementByCSS('a[href="' + href + '"]').click();
        return browser.waitForRouterComplete();
    }

    public clickHiddenButton(buttonID) {
        browser.executeScript('$("#' + buttonID + '")[0].click()');
    }

    public clickHiddenButtonWithClassAndIndex(cssSelector, index) {
        browser.executeScript('$("' + cssSelector + '")[' + index + '].click()');
    }

    public countElementsByClass(className) {
        const list = element.all(by.className(className));
        return list.count();
    }

    public countElementsByXPath(xPath) {
        const list = element.all(by.xpath(xPath));
        return list.count();
    }

    public countNeedToMatch(xPath, i) {
        return () => {
            const elements = element.all(by.xpath(xPath));
            // count the number of elements found
            return elements.count().then((elementCount) => {
                // if not enough elements, return false so browser.wait will keep looping
                return elementCount === i;
            });
        };
    }

    public verifyCountElementsWithXPath(xPath, results, callback) {
        browser.wait(this.countNeedToMatch(xPath, results), 5000);
        this.countElementsByXPath(xPath).then((count) => {
            expect(count).to.equal(results);
            callback();
        });
    }

    public selectDropdownItem(dropdownId, optionIndex) {
        const cssSelector = '#' + dropdownId + ' option';
        element.all(by.css(cssSelector)).then((options) => {
            options[optionIndex].click();
        });
    }

    public waitSelectionPopulated(dropdownId) {
        const cssSelector = '#' + dropdownId + ' option';
        browser.wait(tillSelectionPopulated(cssSelector), 5000);
    }

    public fillInputFieldWith(fieldId, value) {
        const inputField = this.getElementById(fieldId);
        inputField.sendKeys(oneHundredBackSpaces() + value);
    }

    public fillInADate(field, value) {
        const cssSelector = '#' + field + ' input';
        const fieldElement = this.getElementByCSS(cssSelector);
        fieldElement.sendKeys(oneHundredBackSpaces() + value);
    }

    public clickById(id) {
        const ele = this.getElementById(id);
        ele.click();
    }

    public clickButton(buttonID) {
        this.clickById(buttonID);
    }

    public getDialogHeader() {
        return this.getElementById('dialogHeader');
    }

    public checkTextInElement(uiElement, text, callback) {
        this.waitForVisibilityOfElement(uiElement);
        uiElement.getText().then((actualTitle) => {
            expect(actualTitle).to.equal(text);
            callback();
        });
    }

    public checkSelectBoxOptionTextByIndex(ngOptions, index, text, callback) {
        const allOptions = element.all(by.options(ngOptions));
        const firstOption = allOptions.get(index);
        this.waitTextToBePresentInElement(firstOption, text);
        firstOption.getText().then((actualTitle) => {
            expect(actualTitle).to.equal(text);
            callback();
        });
    }

    public waitTextToBePresentInElement(ele, text) {
        const condition = ExpectedConditions.textToBePresentInElement(ele, text);
        browser.wait(condition, 5000);
    }

    public waitForVisibilityOfElement(ele) {
        const tillTitleVisible = ExpectedConditions.visibilityOf(ele);
        browser.wait(tillTitleVisible, 5000);
    }

    public waitForInvisibilityOfElement(ele) {
        const tillTitleInvisible = ExpectedConditions.invisibilityOf(ele);
        browser.wait(tillTitleInvisible, 5000);
    }

    public getValidationElement() {
        return this.getElementByClassName('validation-message');
    }

    public compareValidationMessage(message, callback) {
        const ele = this.getValidationElement();
        this.waitTextToBePresentInElement(ele, message);
        this.checkTextInElement(ele, message, callback);
    }

    public getGridCellByIdAndText(id, text) {
        return element(by.cssContainingText('div[colid="' + id + '"]', text));
    }

    public clickDialogCancelButton() {
        this.getElementById('dialogCancel');
        this.clickHiddenButton('dialogCancel');
    }

}
