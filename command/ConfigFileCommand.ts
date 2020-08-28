import CreateFileCommand from './CreateFileCommand';
import { getCWD } from '../userInputManager';
import { logger } from '../Logger';

type ConfigFileInfo = {
    projectName?: string;
    tags?: string[];
};

const REMOVE_INDENT = new RegExp(/^\s{1,8}/, 'gm');

class ConfigFileCommand extends CreateFileCommand {
    constructor(fileInfo: ConfigFileInfo) {
        super();
        this._configInfo = {
            projectName: fileInfo.projectName ? fileInfo.projectName : '',
            tags: fileInfo.tags ? fileInfo.tags : []
        };
        this.setSortKey('ConfigFileCommand');
    }
    private _configInfo: {
        projectName: string;
        tags: string[];
    };

    get configInfo() {
        return this._configInfo;
    }

    async execute() {
        this.makeFile([
            {
                path: getCWD(),
                name: 'config.xml',
                data: getConfigData(
                    this._configInfo.projectName,
                    this._configInfo.tags
                )
            },
            {
                path: getCWD(),
                name: '.project',
                data: getProjectData(this._configInfo.projectName)
            },
            {
                path: getCWD(),
                name: '.tproject',
                data: getTizenProjectData()
            }
        ]);
    }

    merge(order: ConfigFileCommand) {
        logger.debug('ConfigFileCommands'); // MyClass
        this._configInfo = {
            projectName: (() => {
                if (order.configInfo.projectName.length == 0) {
                    return this._configInfo.projectName;
                }
                return order.configInfo.projectName;
            })(),
            tags: this._configInfo.tags.concat(...order.configInfo.tags)
        };
    }
}

function getConfigData(appName: string, tags: string[]) {
    const packageId = makePackageName();
    const LINE_INDENT = '\n    ';
    return `<?xml version="1.0" encoding="UTF-8"?>
        <widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://yourdomain/${appName}" version="0.0.1" viewmodes="maximized">
            <tizen:application id="${packageId}.${appName}" package="${packageId}" required_version="2.3"/>
            <name>${appName}</name>
            <icon src="icon.png"/>
            <content src="dist/index.html"/>
            <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
            <tizen:metadata key="http://samsung.com/tv/metadata/prelaunch.support" value="true"/>
            <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
            <tizen:metadata key="http://samsung.com/tv/metadata/devel.api.version" value="5.5"/>
            ${tags && tags.join(LINE_INDENT)}
            <tizen:profile name="tv-samsung"/>
        </widget>`.replace(REMOVE_INDENT, '');
}

function getProjectData(appName: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <projectDescription>
            <name>${appName}</name>
            <comment></comment>
            <projects>
            </projects>
            <buildSpec>
                <buildCommand>
                    <name>json.validation.builder</name>
                    <arguments>
                    </arguments>
                </buildCommand>
                <buildCommand>
                    <name>org.tizen.web.project.builder.WebBuilder</name>
                    <arguments>
                    </arguments>
                </buildCommand>
            </buildSpec>
            <natures>
                <nature>json.validation.nature</nature>
                <nature>org.eclipse.wst.jsdt.core.jsNature</nature>
                <nature>org.tizen.web.project.builder.WebNature</nature>
            </natures>
        </projectDescription>`.replace(REMOVE_INDENT, '');
}

function getTizenProjectData() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <tproject xmlns="http://www.tizen.org/tproject">
            <platforms>
                <platform>
                    <name>tv-samsung-5.0</name>
                </platform>
            </platforms>
            <package>
                <blacklist/>
                <resFallback autoGen="true"/>
            </package>
        </tproject>`.replace(REMOVE_INDENT, '');
}

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

export default ConfigFileCommand;
