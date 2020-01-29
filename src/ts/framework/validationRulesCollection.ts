import ValidationRule from './validationRule';
import EditableBase from './editableBase';
import { RuleHandler } from './ruleHandler';
import RuleArgs from './ruleArgs';
import BrokenRulesCollection from './brokenRulesCollection';
import BrokenRule from './brokenRule';

export default class ValidationRulesCollection {
    private _list: Map<string, ValidationRule[]> = new Map<string, ValidationRule[]>();
    private _target: EditableBase;
    private _brokenRules: BrokenRulesCollection;

    constructor(target: EditableBase) {
        this._target = target;
        this._brokenRules = new BrokenRulesCollection(this);
        
    }

    get brokenRules() : BrokenRulesCollection {
        return this._brokenRules;
    }

    addRule(property: string, handler: RuleHandler, args: RuleArgs = new RuleArgs(property, '')) : ValidationRule {
        const rule = new ValidationRule(
            handler,
            args
        );
        // add the damn thing.
        let container = this._list.get(property) || [];
        const findResults = container.find((value: ValidationRule, index: Number) => value.id == rule.id);                
        if(!findResults) {
            // hasn't already been added.            
            container.push(rule);
        }        

        // check that we actually did something valuable.
        if(container.length == 1) {            
            this._list.set(property, container);
        }
       
        // send the created item back.
        return  rule;
    }

    checkRulesForProperty(propertyName: string) {                 
        let target : ValidationRule[] = [];        
        if(propertyName != undefined && propertyName.length > 0) {
            target = this._list.get(propertyName)!;  
            if(target == undefined) {
                // this can happen...
                return;
            }            
        }
        else {
            // we need to build the whole lot
            this._list.forEach((value, key) => {
                target.push(...value);
            });
        }

        for(let rule of target) {                        
            // we need to execute the handler instance.     
            const ruleResult = rule.handler(this._target, rule.ruleArgs);                    
            // first let's create the broken rule.
            const br = new BrokenRule(
                rule.id,
                rule.property,
                rule.ruleArgs.description
            );            
            //console.log(`Executed rule ${rule.id} on property ${rule.property}, the result was ${ruleResult}.\nCurrent BR count is ${this.brokenRules.count}.`);            
            // then depending on if success or not...
            !ruleResult ? this._brokenRules.add(br) : this._brokenRules.remove(rule.id);            
        }
    }
}