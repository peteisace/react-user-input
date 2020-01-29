import EditableBase from './editableBase';
import RuleArgs from './ruleArgs';
import { StringLengthRuleArgs, RegexRuleArgs, DateValueRuleArgs } from './commonRuleArgs';
import { reflection } from '../env/reflection';

export module commonRules {
    
    // type needed:
    type CommonRuleHandler<T> = (value: T) => { valid: boolean, description: string };

    // holds details per type of properties.
    let _propertyCache: Map<string, PropertyDescriptor> = new Map<string, PropertyDescriptor>();

    const IS_ENGLISH: string = '^[a-zA-Z0-9$@$!%*?&#^-_. +]+$';

    export function stringRequired(target: EditableBase, args: RuleArgs) : boolean {        
        return execCommonRule<string>(target, args, (value: string) => {            
            return {
                valid: (value != null && value.length > 0),
                description: `${args.property} is a required field`
            };
        });        
    }

    export function stringMaxLength(target: EditableBase, args: RuleArgs) : boolean {        
        return execCommonRule<string>(target, args, (value: string) => {
            const maxLength: StringLengthRuleArgs = args as StringLengthRuleArgs;
            return {
                valid: !value || value.length <= maxLength.length,
                description: `${args.property} has a maximum length of ${maxLength.length}`
            };
        });
    }

    export function stringMinLength(target: EditableBase, args: RuleArgs) : boolean {
        return execCommonRule<string>(target, args, (value: string) => {
            const minLength: StringLengthRuleArgs = args as StringLengthRuleArgs;
            return {
                valid: !value || value.length == 0 || value.length >= minLength.length,
                description: `${args.property} has a minimum length of ${minLength.length}`
            }
        });
    }

    export function stringMatchesPattern(target: EditableBase, args: RuleArgs) : boolean {
        return execCommonRule<string>(target, args, (value: string) => {
            const regexArgs: RegexRuleArgs = args as RegexRuleArgs;
            const regexResult = !value || value.length == 0 ? true : regexArgs.regex.test(value);
            return {
                valid: regexResult,
                description: `${args.property} contains incorrect characters for this field.`
            }
        });
    }

    export function stringIsEnglishOnly(target: EditableBase, args: RuleArgs) : boolean {
        // we will create the regex here.
        const d : string = (!args.description || args.description.length == 0) 
            ? `${args.property} must contain English characters only.` 
            : args.description;
        // create the args.
        const englishArgs: RegexRuleArgs = new RegexRuleArgs(
            IS_ENGLISH, 
            args.property,
            d);
        // call the actual regex - this is just for readability.
        return stringMatchesPattern(target, englishArgs);            
    }

    export function dateMaxValue(target: EditableBase, args: RuleArgs) : boolean {
        return execCommonRule<Date>(target, args, (value: Date) => {
            const dateArgs: DateValueRuleArgs = args as DateValueRuleArgs;
            return {
                valid: value <= dateArgs.minmax,
                description: `${args.property} must be a date less than or equal to ${dateArgs.minmax}`
            }
        });
    }

    export function dateMinValue(target: EditableBase, args: RuleArgs) : boolean {
        return execCommonRule<Date>(target ,args, (value: Date) => {
            const dateArgs: DateValueRuleArgs = args as DateValueRuleArgs;
            return {
                valid: value >= dateArgs.minmax,
                description: `${args.property} must be a date greater than or equal to ${dateArgs.minmax}`
            }
        });
    }

    function execCommonRule<T>(target: EditableBase, args: RuleArgs, workyWork: CommonRuleHandler<T>) : boolean {
        const pDescriptor: PropertyDescriptor = reflection.getPropertyDescriptorFor(target, args.property)!;
        let funcToCall = pDescriptor.get!;
        funcToCall = funcToCall.bind(target);
        // get the value
        const propertyValue: T = funcToCall() as T;
        //console.log(`Tried to get property ${args.property} through method ${pDescriptor.get!.toString()}\nThe value was found to be ${propertyValue}.`);
        // run the check.
        const result = workyWork(propertyValue);
        // set the stuff        
        if(!result.valid && (args.description == null || args.description.length == 0)) {   // if check failed and we don't already have a description
            args.description = result.description;                                   // allows for custom error messages.            
        }
        // send baby back.
        return result.valid;
    }
    
    function getProperty(instance: EditableBase, property: string) : PropertyDescriptor {
        // get the property. future, we could cache for performance.
        const name = instance.constructor.name;
        // using the property as an id...
        const id = name.concat("!", property);
        // do we have it?
        var result = _propertyCache.get(id);
        // if not - create        
        if(!result) {
            let prototype = instance;
            do 
            {                
                // we are sure it works!
                result = Object.getOwnPropertyDescriptor(prototype, property)!;
                if(result && result.get) {             
                    _propertyCache.set(id, result);
                    break; // jump out of here!
                }
            }
            while((prototype = Object.getPrototypeOf(prototype)));
        }        
        // send it back.
        return result;
    }
};