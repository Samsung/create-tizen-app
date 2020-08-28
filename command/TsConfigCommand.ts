import CreateFileCommand from './CreateFileCommand';
import { getCWD } from '../userInputManager';
import { logger } from '../Logger';

type tsConfigInfo = {
    compilerOptions?: string[];
    files?: string[];
    include?: string[];
    exclude?: string[];
};

class TsConfigCommand extends CreateFileCommand {
    constructor(fileInfo: tsConfigInfo) {
        super();
        this._tsConfigInfo = {
            compilerOptions: fileInfo.compilerOptions
                ? fileInfo.compilerOptions
                : [],
            files: fileInfo.files ? fileInfo.files : [],
            include: fileInfo.include ? fileInfo.include : [],
            exclude: fileInfo.exclude ? fileInfo.exclude : []
        };
        this.setSortKey('TsConfigCommand');
    }

    get tsConfigInfo() {
        return this._tsConfigInfo;
    }

    private _tsConfigInfo: {
        compilerOptions: string[];
        files: string[];
        include: string[];
        exclude: string[];
    };

    async execute() {
        this.makeFile({
            path: getCWD(),
            name: 'tsconfig.json',
            data: getTsConfigData(this._tsConfigInfo)
        });
    }

    merge(order: TsConfigCommand) {
        logger.debug('LanguageFileCommand'); // MyClass
        this._tsConfigInfo = {
            compilerOptions: this._tsConfigInfo.compilerOptions.concat(
                ...order.tsConfigInfo.compilerOptions
            ),
            files: this._tsConfigInfo.files.concat(...order.tsConfigInfo.files),
            include: this._tsConfigInfo.include.concat(
                ...order.tsConfigInfo.include
            ),
            exclude: this._tsConfigInfo.exclude.concat(
                ...order.tsConfigInfo.exclude
            )
        };
    }
}

function getTsConfigData(tsconfig: {
    compilerOptions: string[];
    files: string[];
    include: string[];
    exclude: string[];
}) {
    let compilerOptions = '';
    let files = '';
    let include = '';
    let exclude = '';
    for (let [key, value] of Object.entries(tsconfig)) {
        if (value.length > 0) {
            switch (key) {
                case 'compilerOptions':
                    compilerOptions = `"compilerOptions" : {
                        ${value.join(',\n')}
                    }`;
                    break;
                case 'files':
                    files = `,"files" : [
                        ${value.join(',\n')}
                    ]`;
                    break;
                case 'include':
                    include = `,"include" : [
                        ${value.join(',\n')}
                    ]`;
                    break;
                case 'exclude':
                    exclude = `,"exclude" : [
                        ${value.join(',\n')}
                    ]`;
                    break;
            }
        }
    }
    return `{
                ${compilerOptions}
                ${files}
                ${include}
                ${exclude}
            }`;
}

export default TsConfigCommand;
