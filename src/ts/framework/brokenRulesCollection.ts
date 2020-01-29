import BrokenRule from './brokenRule';
import ValidationRulesCollection from './validationRulesCollection';
import ValidationRule from './validationRule';
import RuleArgs from './ruleArgs';

export default class BrokenRulesCollection {
    private _items: Map<string, BrokenRule> = new Map<string, BrokenRule>();
    
    constructor(parent: ValidationRulesCollection) {

    }

    get count() : number {        
        return this._items.size;
    }

    getRulesForProperty(property: string) : BrokenRule[] {        
        let returned: BrokenRule[] = [];
        this._items.forEach((value, key) => {
            if(value.property == property) {
                returned.push(value);
            }
        }, this);      
                
        return returned;
    }

    add(br: BrokenRule) : BrokenRule {                
        // we just need to see if it exists already
        if(!this._items.has(br.id)) {
            try {
                this._items.set(br.id, br);
            }
            catch(e) {}
        }

        return br;
    }   
    
    remove(id: string) {
        console.log('BrokenRulesCollection::remove -> value of this = ' + this.constructor.name);
        if(this._items.has(id)) {
            // possibility for error here... retry?                    
            this._items.delete(id);                        
        }
    }
}