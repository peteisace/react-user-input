import Binding from "./binding";
import { HTMLAttributes } from "react";

export default interface BindingProps extends HTMLAttributes<HTMLElement>
{
    binding: Binding,
    containerClassName?: string,
    spanContainerClassName: string, // yes u have to send or u will die.
    labelClassName?: string,
    iconClassNameEnabled?: string,
    iconClassNameDisabled?:string        
}