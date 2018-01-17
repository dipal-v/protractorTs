import { Container } from 'aurelia-dependency-injection';
import { bindable, bindingMode, customElement, inject } from 'aurelia-framework';
import { ModelObserver } from './modelObserver';

describe('model observer', () => {
    let mo;
    const testobj = {
        text: 'abc',
        details: {
            property: 'a',
            mediums: [1, 2],
            subdict: {
                telephone: '123'
            }
        },
        calls: [1, 2]
    };

    beforeEach(() => {
        const container = new Container();
        mo = container.get(ModelObserver);
    });

    it('should detect changes', () => {
        mo.observe(testobj, ['text', 'details']);
        testobj.text = 'adfasdfasf';
        testobj.calls.push(3);
        mo.changes(testobj);
        mo.destroy();
        expect(mo.updates).toEqual({});
    });

    it('should show delta changes', () => {
        mo.makeUpdate('details', true);
        const result = mo.changes(testobj);
        expect(result).toEqual({ details: testobj.details });
    });

});
