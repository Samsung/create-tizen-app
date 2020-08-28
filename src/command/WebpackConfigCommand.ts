import CreateFileCommand from './CreateFileCommand';
import { getCWD } from '../userInputManager';
import { logger } from '../Logger';

type webpackConfigInfo = {
    loadModules?: string[];
    properties?: string[];
};

class WebpackConfigCommand extends CreateFileCommand {
    constructor(fileInfo: webpackConfigInfo) {
        super();
        this._webpackConfigInfo = {
            loadModules: fileInfo.loadModules ? fileInfo.loadModules : [],
            properties: fileInfo.properties ? fileInfo.properties : []
        };
        this.setSortKey('WebpackConfigCommand');
    }

    get webpackConfigInfo() {
        return this._webpackConfigInfo;
    }

    private _webpackConfigInfo: {
        loadModules: string[];
        properties: string[];
    };

    async execute() {
        this.makeFile({
            path: getCWD(),
            name: 'webpack.config.js',
            data: getWebpackConfigData(
                this._webpackConfigInfo.loadModules,
                this._webpackConfigInfo.properties
            )
        });
    }

    merge(order: WebpackConfigCommand) {
        logger.debug('LanguageFileCommand'); // MyClass
        this._webpackConfigInfo = {
            loadModules: this._webpackConfigInfo.loadModules.concat(
                ...order.webpackConfigInfo.loadModules
            ),
            properties: this._webpackConfigInfo.properties.concat(
                ...order.webpackConfigInfo.properties
            )
        };
    }
}

function getWebpackConfigData(modules: string[], properties: string[]) {
    return `${modules.join('\n')}

            module.exports = {
                ${properties.join(',\n')}
            };`;
}

export default WebpackConfigCommand;
