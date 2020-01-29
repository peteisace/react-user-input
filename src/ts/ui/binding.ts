import { BindingUpdateMode } from "./bindingUpdateMode";

export default class Binding {
    private _target: any;
    private _sourceProperty: string;
    private _targetProperty: string;
    private _updateMode: BindingUpdateMode;

    constructor(target: any, sourceProperty: string, targetProperty: string, updateMode: BindingUpdateMode = BindingUpdateMode.PropertyChanged) {
        this._target = target;
        this._targetProperty = targetProperty;
        this._sourceProperty = sourceProperty;
        this._updateMode = updateMode;
    }
    
    get target() : any {
        return this._target;
    }

    get sourceProperty() : string {
        return this._sourceProperty;
    }

    get targetProperty() : string {
        return this._targetProperty;
    }

    get updateMode() : BindingUpdateMode {
        return this._updateMode;
    }
}