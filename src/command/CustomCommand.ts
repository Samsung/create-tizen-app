import { CommandType, Command } from './Command';

class CustomCommand extends Command {
    constructor(type: CommandType, logic: Function) {
        super(type);
        this._logics.push(logic);
    }
    private _logics: Function[] = [];

    get logics() {
        return this._logics;
    }

    async execute() {
        await Promise.all(this._logics.map(async logic => logic()));
    }

    merge(order: CustomCommand) {
        this._logics = this._logics.concat(order.logics);
    }
}

export default CustomCommand;
