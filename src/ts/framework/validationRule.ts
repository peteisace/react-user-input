import {RuleHandler} from './ruleHandler';
import RuleArgs from './ruleArgs';
import objectHash from 'object-hash'; // <---- this is a crap solution. need unique identifer for the function. just that... 
                                            // function name is so much nicer className!functionName person!saveToCloud nice and descriptive.

export default class ValidationRule {
    private _handler: RuleHandler;
    private _args: RuleArgs;
    private _id: string;
    
    constructor(ruleHandler: RuleHandler, ruleArgs: RuleArgs) {
        this._handler = ruleHandler;
        this._args = ruleArgs;
        // do need ID here? i guess we do...
        const hash = objectHash(ruleHandler);
        this._id = ruleArgs.property.concat('!', hash);
    }

    get id() : string {
        return this._id;
    }

    get property() : string {
        return this._args.property;
    }

    get handler() : RuleHandler {
        return this._handler;
    }

    get ruleArgs() : RuleArgs {
        return this._args;
    }
}