import { OrderType, Order } from './Order';
import { InputData } from '../defines';
import { CommandType, Command } from '../command';

class DotNetOrder extends Order {
    constructor() {
        super(OrderType.dotnet);
    }
    exportCommand(userInput: InputData) {
        return [new Command(CommandType.NONE)];
    }

    async diagnose() {}

    writeNpmScript() {
        return {};
    }
}

export default DotNetOrder;
