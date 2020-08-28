import { CommandType, Command } from './Command';
import { resolve, dirname } from 'path';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { logger } from '../Logger';
class AppTemplateCommand extends Command {
    constructor(appName: string, workingDir: string) {
        super(CommandType.APP_TEMPLATE);
        this._appName = appName;
        this._packageName = makePackageName();
        this._workingDir = workingDir;
    }
    private _appName: string;
    private _packageName: string;
    private _workingDir: string;

    async run() {
        logger.info('_appName', this._appName);
        logger.info('_packageName', this._packageName);
        logger.info('_workingDir', this._workingDir);
        makeAppTemplate(this._appName, this._packageName, this._workingDir);
    }
}

export default AppTemplateCommand;

function makePackageName() {
    let packageName = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const ID_LENGTH = 10;
    const ONLY_TEXT_LENGTH = 52;
    packageName += possible.charAt(
        Math.floor(Math.random() * ONLY_TEXT_LENGTH)
    );
    for (let i = 0; i < ID_LENGTH - 1; i++) {
        packageName += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }

    return packageName;
}

function makeAppTemplate(appName: string, packageId: string, path: string) {
    makeConfigFile(appName, packageId, path);
    makeHTMLFile(path);
    makeJSFile(path);
    makeCSSFile(path);
}

function makeConfigFile(appName: string, packageId: string, path: string) {
    const fileName = 'config.xml';
    let fileFormat = `
        <?xml version="1.0" encoding="UTF-8"?>
        <widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://yourdomain/${appName}" version="0.0.1" viewmodes="maximized">
            <tizen:application id="${packageId}.${appName}" package="${packageId}" required_version="2.3"/>
            <name>${appName}</name>
            <icon src="icon.png"/>
            <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
            <content src="index.html"/>
            <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
            <tizen:metadata key="http://samsung.com/tv/metadata/prelaunch.support" value="true"/>
            <tizen:profile name="tv-samsung"/>
        </widget>`;
    appendFileSync(resolve(path, fileName), fileFormat, 'utf8');
}

function makeHTMLFile(path: string) {
    const fileName = 'index.html';
    let fileFormat = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>create-tizen-app</title>
            <link rel="stylesheet" type="text/css" href="css/style.css"/>
            <script src="./main.js"></script>
        </head>
        <body>

        </body>
        </html>`;
    appendFileSync(resolve(path, fileName), fileFormat, 'utf8');
}

function makeJSFile(path: string) {
    const fileName = 'main.js';
    let fileFormat = `
        window.onload = function() {
            console.log('onload');
        }
        // add eventListener for keydown
        document.body.addEventListener('keydown', function(e) {
            console.log('keycode', e.keyCode);
        });`;
    appendFileSync(resolve(path, fileName), fileFormat, 'utf8');
}

function makeCSSFile(path: string) {
    const fileName = 'style.css';
    const cssFolder = resolve(path, 'css');
    makeRecursiveDir(cssFolder);
    let fileFormat = `
        body {
            background-color: #ffffff;
        }`;
    appendFileSync(resolve(cssFolder, fileName), fileFormat, 'utf8');
}

function makeRecursiveDir(dir: string) {
    if (existsSync(dir)) {
        return null;
    }

    let current = resolve(dir),
        parent = dirname(current);

    makeRecursiveDir(parent);
    mkdirSync(current);
}
