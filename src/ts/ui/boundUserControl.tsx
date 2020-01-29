import BindingProps from "./bindingProps";
import BindingState from "./bindingState";
import * as React from "react";
import { reflection } from './reflection'
import INotifyPropertyChanged from "../framework/INotifyPropertyChanged"
import PropertyChangedEventArgs from "../framework/propertyChangedEventArgs"
import SafeString from "./safeString"
import {
    BoundUITemplateProps,
    TemplatedUIProps
} from './boundUiTemplateProps';
import Binding from "./binding";
import { BindingUpdateMode } from "./bindingUpdateMode";


export default class BoundUserControl extends React.Component<TemplatedUIProps<BoundUITemplateProps>, BindingState> {
    /* members of this component */
    private _targetDescriptor: PropertyDescriptor;
    private _isListening: boolean = false;

    constructor(props: TemplatedUIProps<BoundUITemplateProps>) {
        super(props);
        // set up the target property.
        this._targetDescriptor = reflection.getPropertyDescriptorFor(
            this.props.binding.target,
            this.props.binding.targetProperty
        );                

        this._targetDescriptor.set = this._targetDescriptor.set!.bind(this.props.binding.target);
        this._targetDescriptor.get = this._targetDescriptor.get!.bind(this.props.binding.target);
        // state management.
        this.state = { target: this.props.binding.target};
        // function "this" bindings.
        this.onTargetPropertyChanged = this.onTargetPropertyChanged.bind(this);
        this.onBoundControlChanged = this.onBoundControlChanged.bind(this);
        // event reversal.
        this.state.target.onPropertyChanged.subscribe(this.onTargetPropertyChanged);        
    }

    private onTargetPropertyChanged(target: INotifyPropertyChanged, args: PropertyChangedEventArgs) {
        // check we're allowed and it's us.
        if(this._isListening && args.property == this.props.binding.targetProperty) {
            // update
            this.setState(this.updateState);
        }        
    }

    private onBoundControlChanged(this: any, newValue: any) {              
        // stop listening to propchanged events so we avoid infinite loop.
        this._isListening = false;
        // propagate to state.
        this._targetDescriptor.set!(newValue);                                                                                                                                                                                       
        // and we listen again
        this._isListening = true;        
        // update the state as it's changed.
        this.setState(this.updateState);        
    }

    private updateState(prev: BindingState, props: TemplatedUIProps<BoundUITemplateProps>) : BindingState {
        // we don't need to anything complicated, just rebuild.
        const newState: BindingState = {
            target: props.binding.target
        };
        // here is the state we care about.
        return newState;
    }    
        
    render(): JSX.Element {        
        // grab the value from state.
        const stateValue: any = this._targetDescriptor.get!();        
        const stateError: SafeString = new SafeString(this.state.target.getErrorsForProperty(this.props.binding.targetProperty));        
        // pass these to our children to paint the underlying elements we will use for binding. but FIRST!
        var { children, binding, template, ...filteredProps } = this.props;
        // we now need our special type.
        const sourcePropContainer = { [ binding.sourceProperty]: stateValue };
        filteredProps = { ...filteredProps, ...sourcePropContainer };

        // and NOW we are safe to dig out the template.        
        const TemplatedUI = this.props.template;                
        // and we send it back
        return (
            <TemplatedUI 
                modelValue={stateValue} 
                errorDetail={stateError} 
                databind={(newValue: any) => { console.log('Template::Databind, newValue = ' + newValue.toString()); this.onBoundControlChanged(newValue)}}
                filteredUiProps={filteredProps} />
        );
    }   
}

