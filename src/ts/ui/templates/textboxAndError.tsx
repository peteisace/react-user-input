import * as React from "react";
import CompositionTemplateProps, { TextErrorCompositionProps } from "./compositionTemplateProps";
import {
    BoundUITemplateProps 
} from '../boundUiTemplateProps';
import BoundUserControl from "../boundUserControl";
import Binding from "../binding";

export const TextboxAndError: React.SFC<CompositionTemplateProps> = (parentProps) => {
    // clean...
    var { datacontext, targetProperty, ...htmlProps} = parentProps;
    // design the template.
    const FullTemplate: React.SFC<BoundUITemplateProps> = (props) => {
        // calculate the error class.
        const sillyHack = (beginningBit: string, isDirty: boolean) => 
            !isDirty ? beginningBit : beginningBit.concat(" ", beginningBit, props.errorDetail.safeLength > 0 ? '--invalid' : '--valid');
         // hold is dirty.    
        const isDirty = datacontext.isDirty;         
        
        return (            
            <div className="datacapture__datarow">                
                <input type="text" className={sillyHack("dc__textbox", isDirty)}
                    onChange={(changeEvent) => props.databind(changeEvent.target.value)}
                    {...props.filteredUiProps} />                  
                <img className={sillyHack("dc__erroricon", isDirty)} src="/images/erroricon.png" width="24" height="24" title={props.errorDetail.safeValue} />                
            </div>
        )
    }
    // now we delegate to BoundUserControl
    return (
        <BoundUserControl
            binding={new Binding(datacontext, 'value', targetProperty)}
            template={FullTemplate}            
            {...htmlProps} />
    )
}

