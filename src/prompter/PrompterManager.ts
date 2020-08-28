import _ from 'lodash';
import { CommandPrompter } from './Prompter';
import { Command, CommandType } from '../command';
import { InitOptions } from '../defines';
import { setProxy } from '../userInputManager';
import entryPrompter from './EntryPrompter';
import languagePrompter from './LanguagePrompter';
import bundlerPrompter from './BundlerPrompter';
import editorPrompter from './EditorPrompter';
import witsPrompter from './WitsPrompter';
import { logger } from '../Logger';

class PrompterManager {
    constructor(prompters: CommandPrompter[]) {
        this._prompters = prompters;
        this._options = {};
    }

    private _prompters: CommandPrompter[];
    get prompters() {
        return this._prompters;
    }

    _options: InitOptions;

    private async showPrompter() {
        for (const prompter of this._prompters) {
            await prompter.prompt();
        }
    }

    private async executeCommand() {
        const commands: Command[] = [];
        this._prompters.forEach(prompter =>
            commands.push(...prompter.collectCommand())
        );

        logger.debug(commands.map(v => v.type));
        for (
            let type = CommandType.PROJECT_DIR;
            type < CommandType.END;
            type++
        ) {
            const filtered = commands.filter(order => order.type === type);
            logger.debug(`TYPE ${type}, filtred ${JSON.stringify(filtered)}`);
            const commandGroup = _.groupBy(filtered, 'sortKey');
            const keys = _.keys(commandGroup);
            logger.debug(keys);

            if (keys.length === 0) {
                continue;
            }

            const executor = keys.map(key => {
                const entry = commandGroup[key].shift();
                for (const command of commandGroup[key]) {
                    try {
                        entry?.merge(command);
                    } catch (err) {
                        logger.error(err);
                    }
                }
                return entry?.execute(this._options);
            });

            await Promise.all(executor);
        }
    }

    async run(options: InitOptions) {
        this._options = options;
        if (options.proxy) {
            setProxy(options.proxy);
        }

        if (options.projectName) {
            entryPrompter.desc = { default: options.projectName };
        }

        await this.showPrompter();
        await this.executeCommand();
    }
}

const prompterManager = new PrompterManager([
    entryPrompter,
    languagePrompter,
    bundlerPrompter,
    editorPrompter,
    witsPrompter
]);
export { prompterManager, PrompterManager };
