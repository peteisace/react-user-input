import RuleArgs from "./ruleArgs";

// no default class here.
export class StringLengthRuleArgs extends RuleArgs {
    private _length: number;
    constructor(length: number, property: string, description: string = '') {
        super(property, description);
        this._length = length;
    }

    get length() : number {
        return this._length;
    }
}

export class RegexRuleArgs extends RuleArgs {
    private _regEx: RegExp;
    constructor(pattern: string, property: string, description: string = '') {
        super(property, description);
        // create the regex.
        this._regEx = new RegExp(pattern);
        this._regEx = this._regEx.compile();
    }

    get regex() : RegExp {
        return this._regEx;
    }
}

export class DateValueRuleArgs extends RuleArgs {
    private _minmax: Date;
    constructor(minmax: Date, property: string, description: string = '') {
        super(property, description);
        this._minmax = minmax;
    }

    get minmax() : Date {
        return this._minmax;
    }
}