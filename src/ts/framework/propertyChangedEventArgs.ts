import EventArgs from "../env/eventArgs";

export default class PropertyChangedEventArgs extends EventArgs {
    private _property: string;

    constructor(property: string, sender: any) {
        super(sender);
        this._property = property;
    }

    get property() : string {
        return this._property;
    }
}