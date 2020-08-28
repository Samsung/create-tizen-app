import { InitOptions } from '../defines';
enum CommandType {
    NONE,
    PROJECT_DIR,
    PACKAGE,
    EXECUTE_CLI,
    ATOM,
    VSCODE,
    FILESYSTEM,
    APP_TEMPLATE,
    CREATE_FILE,
    WITS,
    END
}

class Command {
    constructor(type: CommandType = CommandType.NONE, cwd?: string) {
        this._type = type;
        if (cwd) {
            this._cwd = cwd;
        }
        this.setSortKey();
    }
    protected _type: CommandType;
    protected _cwd: string = '';
    _sortkey: string = '';

    get type() {
        return this._type;
    }

    get cwd() {
        return this._cwd;
    }

    get sortKey() {
        return this._sortkey;
    }

    setSortKey(post: string = '') {
        this._sortkey = `${this.constructor.name}${post}`;
    }

    async execute(options?: InitOptions): Promise<any> {}

    merge(order: Command) {}
}

export { Command, CommandType, InitOptions };
