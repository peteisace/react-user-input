export module reflection {
    // cache.
    const _propertyCache: Map<string, PropertyDescriptor> = new Map<string, PropertyDescriptor>();
    const _propDescOptions: GetPropDescriptorOptions = { requireSet: true };
    // types
    interface GetPropDescriptorOptions {
        requireSet: boolean
    }

    export function getPropertyDescriptorFor(this: any, instance: any, propertyName: string, options: GetPropDescriptorOptions = _propDescOptions) : PropertyDescriptor {                
        const id = instance.constructor.name.concat('!', propertyName);
        let result : PropertyDescriptor | undefined;
        if((result = _propertyCache.get(id))) {
            return result!;
        }
        let i = 0;
        // not cached, so we grab it.
        do {                  
            i++;            
            // so who are we dealing with?
            const discoveredProperties: string[] = Object.getOwnPropertyNames(instance);
            // then for each property
            const myProps = discoveredProperties.filter((value: string, index: number) => {
                //console.log(`\tdiscoveredProperties::filter-> comparing value (${value}) to propertyName (${propertyName}).`)
                return value == propertyName;
            });                        
            // now we look for propertyDescriptors.
            for(let validProp of myProps) {                
                const pDesc = Object.getOwnPropertyDescriptor(instance, validProp);                
                // check it baby.                                  
                if(pDesc && pDesc.get && (!options.requireSet || pDesc.set)) {
                    // it has what we want, importantly, actual values for the getter / setter functions.
                    return (pDesc! as PropertyDescriptor);
                }
            }
        }
        while((instance = Object.getPrototypeOf(instance)));

        throw `Invalid parameters supplied, but property ${propertyName} is empty or doesn't exist on ` + 
            `the class ${instance.constructor.name}.`;
    }
}