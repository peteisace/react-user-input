import { HTMLAttributes } from "react";

export default interface CompositionTemplateProps extends HTMLAttributes<HTMLElement> {
    datacontext: any,
    targetProperty: string
}

export interface TextErrorCompositionProps extends CompositionTemplateProps {
    requiredField?: boolean,
    headingText: string
}

export interface EnumCompositionProps extends CompositionTemplateProps {
    enumeration: any
}