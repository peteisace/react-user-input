export default class SafeString {
    private _val: string | null;
    constructor(value: string | null) {
        this._val = value;
    }

    get safeLength() : number {
        return this._val == null ? 0 : this._val.length;
    }

    get safeValue() : string {
        return this._val == null ? '' : this._val!;
    }

    get rawValue() : string | null { 
        return this._val;
    }
}