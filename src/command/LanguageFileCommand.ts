import CreateFileCommand from './CreateFileCommand';
import { getCWD } from '../userInputManager';
import { join } from 'path';
import { logger } from '../Logger';

type LanguageFileInfo = {
    fileName?: string;
    loadModules?: string[];
    codes?: string[];
};

class LanguageFileCommand extends CreateFileCommand {
    constructor(fileInfo: LanguageFileInfo) {
        super();
        this._languageInfo = {
            fileName: fileInfo.fileName ? fileInfo.fileName : '',
            loadModules: fileInfo.loadModules ? fileInfo.loadModules : [],
            codes: fileInfo.codes ? fileInfo.codes : []
        };
        this.setSortKey('LanguageFileCommand');
    }

    get languageInfo() {
        return this._languageInfo;
    }

    private _languageInfo: {
        fileName: string;
        loadModules: string[];
        codes: string[];
    };

    async execute() {
        this.makeFile({
            path: join(getCWD(), 'src'),
            name: this._languageInfo.fileName,
            data: getLanguageFileData(
                this._languageInfo.loadModules,
                this._languageInfo.codes
            )
        });
    }

    merge(order: LanguageFileCommand) {
        logger.debug('LanguageFileCommand'); // MyClass
        this._languageInfo = {
            fileName: (() => {
                if (order.languageInfo.fileName.length == 0) {
                    return this._languageInfo.fileName;
                }
                return order.languageInfo.fileName;
            })(),
            loadModules: this._languageInfo.loadModules.concat(
                ...order.languageInfo.loadModules
            ),
            codes: this._languageInfo.codes.concat(...order.languageInfo.codes)
        };
    }
}

function getLanguageFileData(modules: string[], codes: string[]) {
    return `${modules.join('\n')}${'\n\n'}${codes.join('\n')}`;
}

export default LanguageFileCommand;
