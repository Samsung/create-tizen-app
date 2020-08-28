import { greenBright } from 'chalk';
import { CommandType, Command } from './Command';
import { spawn } from 'child_process';
import { logger } from '../Logger';
const cmdify = require('cmdify');

export default class CLICommand extends Command {
    constructor(cli: string, option: { cliOptions?: string[]; cwd?: string }) {
        super(CommandType.EXECUTE_CLI);

        this._cli = cli;
        this._cliOptions = option.cliOptions || [];
        this._cwd = option.cwd || '';
    }

    private _cli: string = '';
    private _cliOptions: string[] = [];

    async execute() {
        return new Promise((resolve, reject) => {
            const cmd = spawn(cmdify(this._cli), this._cliOptions, {
                stdio: 'inherit',
                cwd: this._cwd
            });

            cmd.on('data', data => {
                logger.info(data.toString());
            });
            cmd.on('error', err => {
                logger.info(`Error in [${this._cli}] : ${err}`);
                reject();
            });
            cmd.on('close', () => {
                logger.info(`\nFinish the ${greenBright(this._cli)}`);
                resolve();
            });
        });
    }
}
