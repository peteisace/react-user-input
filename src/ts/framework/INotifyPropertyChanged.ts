import PropertyChangedEventArgs from "./propertyChangedEventArgs";
import { IEvent } from 'strongly-typed-events';

export default interface INotifyPropertyChanged {
    onPropertyChanged : IEvent<INotifyPropertyChanged, PropertyChangedEventArgs>;
}