import SafeString from '../env/safeString'
import { HTMLAttributes, ChangeEvent } from 'react';
import Binding from './binding';

export type DatabindingHandler = (this: any, value: any) => void;

export interface BoundUITemplateProps {
    modelValue: any,
    errorDetail: SafeString,
    databind: DatabindingHandler,
    filteredUiProps: any    
}

export interface TemplatedUIProps<P extends BoundUITemplateProps> {
    binding: Binding,
    template: React.SFC<P>    
}