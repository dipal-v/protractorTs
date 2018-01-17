export class Medium {
    public type: string;

    public value: string;

    public allowContact: boolean;

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        } else {
            this.type = '';
            this.value = '';
            this.allowContact = false;
        }
    }
}
