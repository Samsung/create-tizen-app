import * as inquirer from 'inquirer';
import { yellow } from 'chalk';

import { CommandPrompter, PrompterId } from './Prompter';
import { setUserInput } from '../userInputManager';
import { BasicOrder } from '../order';

class EntryPrompter extends CommandPrompter {
    constructor() {
        super();
        this.orders = new BasicOrder();
        this.promptId = PrompterId.projectName;
        this._desc = {
            type: 'input',
            name: this.promptId,
            message: `What is your ${yellow('project name')}?`,
            validate: function (input: string) {
                const PROJECT_NAME_REG = /(^([a-zA-Z])+([a-zA-Z]|[0-9]){2,})$/;
                const START_ALPHABETIC_REG = /^(?!([a-zA-Z]))/;
                const CHARACTER_NUMBER_REG = /(^\w{1,3}$)|(^\w{50,}$)/;
                const ONLY_ALPHANUMERIC_REG = /^(?!([a-zA-Z]|[0-9]){3,}$)/;

                return PROJECT_NAME_REG.test(input)
                    ? true
                    : input.length === 0
                    ? 'Enter the project name'
                    : START_ALPHABETIC_REG.test(input)
                    ? 'The project name must start with an alphabetic character.'
                    : CHARACTER_NUMBER_REG.test(input)
                    ? 'The project name length must be 3-50 characters.'
                    : ONLY_ALPHANUMERIC_REG.test(input)
                    ? 'Use only alphabetic and numeric characters.'
                    : 'Invalid format of project name which is entered.';
            }
        };
    }

    prompt() {
        return inquirer.prompt(this._desc).then((input: any) => {
            this.input = input;

            setUserInput(input, this.checkOrder().writeNpmScript());
            return Promise.resolve(input);
        });
    }
}

const entryPrompter: EntryPrompter = new EntryPrompter();

export default entryPrompter;
