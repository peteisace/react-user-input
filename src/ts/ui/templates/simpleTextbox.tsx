import * as React from 'react';
import { BoundUITemplateProps } from '../boundUiTemplateProps';
import BoundUserControl from '../boundUserControl';
import { HTMLAttributes } from 'react';
import Binding from '../binding';
import CompositionTemplateProps from './compositionTemplateProps';


/* Templates for the BoundUserControl - relationship is COMPOSITION not INHERITANCE*/

// So we need to define the guy that we actually want to create.
export const SimpleTextbox: React.SFC<CompositionTemplateProps> = (parentProps) => {
    // the targetProperty and datacontext are mandatory and obviously won't play well
    // with the input control, so we clean them here, and then ...cleanProps is all the
    // other properties specified - id, className etc. 
    var { targetProperty, datacontext, ...cleanedProps} = parentProps;
    /* He needs to define a template that will tell the BoundControl what to draw */
    const TextboxTemplate: React.SFC<BoundUITemplateProps> = (props) => {     
        
        return (
            <input                 
                onChange={(realEvent) => props.databind(realEvent.target.value)}
                {...props.filteredUiProps} />       // the props contain all the HtmlProperties possible
                                                    // this is why we don't supply ID, or className or anything
                                                    // generally should not set ANY of these props. we will just
                                                    // carry through.
                                                    // we expect the developer to set them in the UI:
                                                    // <SimpleTextbox id="bob" className="bob2" />
                                                    // and are automagically propogated through
        )
    };        
    // and so we instantiate the BoundUserControl, setting the template. Meaning all the functionality of the BUC
    // but we get to control the UI.
    // all we need to know is the target object and the target property.
    // + html attributes.
    return (        
        <BoundUserControl
            binding={new Binding(datacontext, 'value', targetProperty)}
            template={TextboxTemplate}
            {...cleanedProps} />
    );
} 

