export default class BrokenRule {
    private _id: string;
    private _property: string;
    private _description: string;

    constructor(id: string, property: string, description: string) {
        this._id = id;
        this._property = property;
        this._description = description;
    }

    get id() : string {
        return this._id;
    }

    get property() : string {
        return this._property;
    }

    get description() : string {
        return this._description;
    }
}