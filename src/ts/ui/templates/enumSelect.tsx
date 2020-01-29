import * as React from 'react'
import CompositionTemplateProps, { EnumCompositionProps } from './compositionTemplateProps';
import { BoundUITemplateProps } from '../boundUiTemplateProps';
import BoundUserControl from '../boundUserControl';
import Binding from '../binding';

export const EnumSelect: React.SFC<EnumCompositionProps> = (parentProps) => {
        var { datacontext, targetProperty, enumeration, ...uiProps } = parentProps;
        // this will form our template.
        const SelectTemplate: React.SFC<BoundUITemplateProps> = (templateProps) => {
            // get the values.
            let enumKeys = Object.keys(enumeration);

            return (                
                <select onChange={(changeEvent) => templateProps.databind(changeEvent.target.value)}>
                    { 
                        enumKeys.map((enumKey) => {
                            let key = enumKey;
                            let val = enumeration[key];
                            
                            return (
                                <option value={key}>{val}</option>
                            )
                        })
                    }
                </select>
            )
        };
        
        // return the databound UI.
        return (
            <BoundUserControl
                binding={new Binding(datacontext, 'value', targetProperty)}
                template={SelectTemplate}
                {...uiProps} />
        )
};

interface BoundEnumProps extends BoundUITemplateProps {
    enumeration: any
};


