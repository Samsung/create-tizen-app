import { CommandType, Command } from './Command';
import { resolve, dirname } from 'path';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import parserBabel from 'prettier/parser-babel';
import parserHTML from 'prettier/parser-html';
import parserCSS from 'prettier/parser-postcss';
import parserTypescript from 'prettier/parser-typescript';
import { format } from 'prettier/standalone';
import { logger } from '../Logger';

type FileInfo = {
    path: string;
    name: string;
    data: string;
};

type parserType = 'babel' | 'json' | 'html' | 'typescript';

class CreateFileCommand extends Command {
    constructor() {
        super(CommandType.CREATE_FILE);
    }
    makeFile(fileInfo: FileInfo | FileInfo[]) {
        let fileInfos: FileInfo[] = [];
        fileInfos = fileInfos.concat(fileInfo);
        fileInfos.forEach(file => {
            makeRecursiveDir(file.path);
            let formatData = '';
            try {
                formatData = format(file.data, {
                    singleQuote: true,
                    tabWidth: 4,
                    semi: true,
                    printWidth: 80,
                    trailingComma: 'none',
                    parser: getParserType(file.name),
                    plugins: [
                        parserBabel,
                        parserHTML,
                        parserCSS,
                        parserTypescript
                    ]
                });
            } catch (e) {
                formatData = file.data;
            }
            try {
                appendFileSync(
                    resolve(file.path, file.name),
                    formatData,
                    'utf8'
                );
            } catch (e) {
                logger.info(`Failed Make file : ${file.name}, ${e}`);
            }
        });
    }
}

export default CreateFileCommand;

function makeRecursiveDir(dir: string) {
    if (existsSync(dir)) {
        return null;
    }

    let current = resolve(dir),
        parent = dirname(current);

    makeRecursiveDir(parent);
    mkdirSync(current);
}

function getParserType(filename: string): parserType {
    const extension = filename.match(/[^\.]+$/);
    let parser: parserType = 'babel';
    switch (extension && extension[0]) {
        case 'json':
            parser = 'json';
            break;
        case 'html':
            parser = 'html';
            break;
        case 'ts':
            parser = 'typescript';
            break;
        case 'js':
            parser = 'babel';
            break;
    }
    return parser;
}
