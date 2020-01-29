export default class EventArgs {
    private _sender: any;
    constructor(sender: any) {        
        this._sender = sender;
    }

    get sender() : any {
        return this._sender;
    }
}

export type EventHandler = (sender: any, args: EventArgs) => void;