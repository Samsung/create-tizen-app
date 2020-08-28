import { InputData, PackageObject } from '../defines';
import { Command, CommandType } from '../command';

enum OrderType {
    none = 'none',
    entry = 'entry',
    commonjs = 'commonjs',
    typescript = 'typescript',
    dotnet = '.net',
    webpack = 'webpack',
    parcel = 'parcel',
    vscode = 'vscode',
    atom = 'atom',
    tizen_studio = 'tizen_studio',
    wits = 'wits'
}

abstract class Order {
    constructor(name: OrderType) {
        this._name = name;
    }
    private readonly _name: OrderType;

    get name() {
        return this._name;
    }

    exportCommand(userInput: InputData): Command[] {
        return [new Command(CommandType.NONE)];
    }

    async diagnose() {}

    writeNpmScript(): PackageObject {
        return {};
    }
}

class EmptyOrder extends Order {
    constructor() {
        super(OrderType.none);
    }
}

export { Order, OrderType, EmptyOrder };
