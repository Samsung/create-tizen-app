import CreateFileCommand from './CreateFileCommand';
import { getCWD } from '../userInputManager';
import { join } from 'path';
import { logger } from '../Logger';

type HTMLFileInfo = {
    headTag?: string[];
    bodyTag?: string[];
};

class HTMLCommand extends CreateFileCommand {
    constructor(fileInfo: HTMLFileInfo) {
        super();
        this._HTMLFileInfo = {
            headTag: fileInfo.headTag ? fileInfo.headTag : [],
            bodyTag: fileInfo.bodyTag ? fileInfo.bodyTag : []
        };
        this.setSortKey('HTMLCommand');
    }
    private _HTMLFileInfo: {
        headTag: string[];
        bodyTag: string[];
    };

    get HTMLInfo() {
        return this._HTMLFileInfo;
    }

    async execute() {
        this.makeFile({
            path: join(getCWD(), 'src'),
            name: 'index.html',
            data: makeHTMLData(
                this._HTMLFileInfo.headTag,
                this._HTMLFileInfo.bodyTag
            )
        });
    }

    merge(order: HTMLCommand) {
        logger.debug('HTMLCommand'); // MyClass
        this._HTMLFileInfo = {
            headTag: this._HTMLFileInfo.headTag.concat(
                ...order.HTMLInfo.headTag
            ),
            bodyTag: this._HTMLFileInfo.bodyTag.concat(
                ...order.HTMLInfo.bodyTag
            )
        };
    }
}

function makeHTMLData(headTag: string[], bodyTag: string[]) {
    return `<!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <meta name="viewport" content="width=1920">
            ${headTag && headTag.join('\n')}
        </head>
        <body>
            ${bodyTag && bodyTag.join('\n')}
        </body>
        </html>`;
}

export default HTMLCommand;
