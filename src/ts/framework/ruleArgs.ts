export default class RuleArgs {
    private _property: string;
    private _description: string;

    constructor(property: string, description: string = '') {
        this._property = property;
        this._description = description;
    }

    get property() : string {
        return this._property;
    }

    get description() : string {
        return this._description;
    }
    set description(value: string) {
        if(this._description != value) {
            this._description = value;
        }
    }    
}