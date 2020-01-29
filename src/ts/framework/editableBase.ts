import PropertyEventChangedArgs from "./propertyChangedEventArgs";
import INotifyPropertyChanged from './INotifyPropertyChanged';
import { 
    IEvent,
    EventDispatcher
} from "strongly-typed-events";
import ValidationRulesCollection from './validationRulesCollection';
import PropertyChangedEventArgs from "./propertyChangedEventArgs";

export default abstract class EditableBase implements INotifyPropertyChanged {
    private _onPropertyChanged: EventDispatcher<INotifyPropertyChanged, PropertyChangedEventArgs>
         = new EventDispatcher<INotifyPropertyChanged, PropertyChangedEventArgs>();
    private _validationRules: ValidationRulesCollection;
    private _isDirty = false;

    constructor() {
        this._validationRules = new ValidationRulesCollection(this);
        this.addBusinessRules();
    }

    protected abstract addBusinessRules() : void;

    protected get validationRules() : ValidationRulesCollection {
        return this._validationRules;
    }

    get isDirty() : boolean {
        return this._isDirty;
    }

    get isValid() : boolean {
        return this._validationRules.brokenRules.count == 0;
    }
    
    get onPropertyChanged() : IEvent<INotifyPropertyChanged, PropertyChangedEventArgs> {
        return this._onPropertyChanged.asEvent();
    }

    getErrorsForProperty(propertyName: string): string | null {
        const brokenRules = this._validationRules.brokenRules.getRulesForProperty(propertyName);
        if(!brokenRules || brokenRules.length === 0) {            
            return null;
        }
        // grab the first.
        const first = brokenRules[0];        
        return  first.description;
    }              

    protected propertyHasChanged(propertyName: string, suppressEvents: boolean = false) {        
        const initially = this.isValid;        
        // check the rules. 
        this._validationRules.checkRulesForProperty(propertyName);
        // then communicate via dispatching
        if(!suppressEvents) {          
            this.markDirty();  
            this._onPropertyChanged.dispatch(this, new PropertyEventChangedArgs(propertyName, this));
            if(initially != this.isValid) {
                // we must also alert about isValid
                this._onPropertyChanged.dispatch(this, new PropertyEventChangedArgs("isValid", this));
            }
        }
    }

    private markDirty() {
        let original = this._isDirty;
        this._isDirty = true;
        if(this._isDirty != original) {
            this.propertyHasChanged("isDirty", true);
        }
    }
}