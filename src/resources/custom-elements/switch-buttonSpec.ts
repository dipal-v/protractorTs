import { SwitchButton } from './switch-button';

describe('switch button component', () => {
    it('should not throw syntax exceptions', () => {
        const element = jest.fn();

        const button = new SwitchButton(
            element, false, false,
            'Not blocked', 'Blocked',
            'danger', 'default',
            100, 20
        );
        button.attached();
        button.checkedChanged();
        button.disableChanged();
        expect(button.params).toEqual({
            "disabled": false,
            "handleWidth": 100,
            "labelWidth": 20,
            "offColor": "default",
            "offText": "Not blocked",
            "onColor": "danger",
            "onText": "Blocked",
            "state": false,
        });

    });
});
