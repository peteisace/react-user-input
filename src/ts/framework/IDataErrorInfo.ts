export default interface IDataErrorInfo {
    getErrorsForProperty(prop: string) : string | null;
}