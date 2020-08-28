import CreateFileCommand from './CreateFileCommand';
import { PackageObject } from '../defines';
import _ from 'lodash';
import { getCWD } from '../userInputManager';
import { CommandType } from './Command';
import { logger } from '../Logger';

export default class PackageJsonCommand extends CreateFileCommand {
    constructor({
        dependencies = {},
        devDependencies = {},
        isParcelPluginChangeFile = false
    }) {
        super();
        this._type = CommandType.PACKAGE;
        this._dependencies = dependencies;
        this._devDependencies = devDependencies;
        this._isParcelPluginChangeFile = isParcelPluginChangeFile;
        this.setSortKey('PackageJsonCommand');
    }

    private _name: string = '';
    private _script: PackageObject = {};
    private _devDependencies: PackageObject;
    private _dependencies: PackageObject;
    private _isParcelPluginChangeFile: boolean;

    get devDependencies() {
        return this._devDependencies;
    }

    get dependencies() {
        return this._dependencies;
    }

    set name(name: string) {
        this._name = name;
    }

    set script(script: PackageObject) {
        this._script = _.assignIn(this._script, script);
    }

    async execute() {
        const {
            _name,
            _script,
            _dependencies,
            _devDependencies,
            _isParcelPluginChangeFile,
            makeFile
        } = this;
        if (!_name) {
            throw new Error('The name is not set');
        }
        makeFile({
            path: getCWD(),
            name: 'package.json',
            data: PackageJsonCommand.createPackageJson(
                _name,
                _script,
                _dependencies,
                _devDependencies,
                _isParcelPluginChangeFile
            )
        });
    }

    merge(command: PackageJsonCommand) {
        logger.debug('LanguageFileCommand'); // MyClass
        this._dependencies = _.assignIn(
            this._dependencies,
            command.dependencies
        );
        this._devDependencies = _.assignIn(
            this._devDependencies,
            command.devDependencies
        );
        this._script = _.assignIn(this._script, command.script);
        this._isParcelPluginChangeFile =
            command._isParcelPluginChangeFile || this._isParcelPluginChangeFile;
    }

    static createPackageJson(
        name: string,
        script: PackageObject,
        dependencies: PackageObject,
        devDependencies: PackageObject,
        isParcelOption: boolean
    ) {
        return `{
        "name": "${name}",
        "version": "1.0.0",
        "description": "",
        "main": "",
        "scripts": ${JSON.stringify(script)},
        "author": "",
        "license": "ISC",
        "devDependencies": ${JSON.stringify(devDependencies)},
        "dependencies": ${JSON.stringify(dependencies)}
        ${isParcelOption ? ',"parcel-plugin-change-file": {}' : ''}
      }`;
    }
}
